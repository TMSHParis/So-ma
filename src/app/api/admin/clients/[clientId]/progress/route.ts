import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  calendarDateInTimeZone,
  calendarIsoToPrismaDate,
  CLIENT_TIMEZONE,
} from "@/lib/calendar-day";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role: string }).role !== "ADMIN")
    return null;
  return session;
}

/** Estimation MET marche pour rétrocompatibilité (sessions sans calories) */
function walkingMET(speedKmh: number): number {
  if (speedKmh <= 3.2) return 2.8;
  if (speedKmh <= 4.0) return 3.0;
  if (speedKmh <= 4.8) return 3.5;
  if (speedKmh <= 5.6) return 4.3;
  return 5.0;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ clientId: string }> },
) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { clientId } = await params;

  const dateParam = req.nextUrl.searchParams.get("date");
  const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
  const todayIso =
    dateParam && isoRegex.test(dateParam)
      ? dateParam
      : calendarDateInTimeZone(CLIENT_TIMEZONE);
  let todayDate: Date;
  try {
    todayDate = calendarIsoToPrismaDate(todayIso);
  } catch {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }

  const [client, foodEntries, sportEntries] = await Promise.all([
    prisma.client.findUnique({
      where: { id: clientId },
      select: {
        goalCalories: true,
        goalProtein: true,
        goalCarbs: true,
        goalFat: true,
        goalFiber: true,
        goalWaterL: true,
        goalSteps: true,
        weight: true,
        height: true,
      },
    }),
    prisma.foodEntry.findMany({
      where: { clientId, date: todayDate },
    }),
    prisma.sportEntry.findMany({
      where: { clientId, date: todayDate },
    }),
  ]);

  if (!client)
    return NextResponse.json({ error: "Cliente introuvable" }, { status: 404 });

  // Aggregate food
  const food = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  };
  for (const e of foodEntries) {
    food.calories += e.calories;
    food.protein += e.protein;
    food.carbs += e.carbs;
    food.fat += e.fat;
    food.fiber += e.fiber;
  }

  // Aggregate sport — total + par type
  const sport = {
    duration: 0,
    calories: 0,
    steps: 0,
  };

  const sportByType: Record<string, { duration: number; calories: number; steps: number; sessions: number }> = {};

  const weight = client.weight ?? 65;

  for (const e of sportEntries) {
    const dur = e.duration ?? 0;
    let cal = e.calories ?? 0;

    // Rétrocompatibilité : estimer calories marche si absentes
    if (!cal && e.sportType === "MARCHE" && e.steps && e.steps > 0) {
      const heightCm = client.height && client.height > 3 ? client.height : (client.height && client.height <= 3 ? client.height * 100 : 165);
      const strideCm = heightCm * 0.414;
      const distKm = (e.steps * strideCm) / 100_000;
      const speed = 4.8; // vitesse moyenne par défaut
      const hours = distKm / speed;
      cal = Math.round(walkingMET(speed) * weight * hours);
    }

    sport.duration += dur;
    sport.calories += cal;
    sport.steps += e.steps ?? 0;

    const type = e.sportType;
    if (!sportByType[type]) {
      sportByType[type] = { duration: 0, calories: 0, steps: 0, sessions: 0 };
    }
    sportByType[type].duration += dur;
    sportByType[type].calories += cal;
    sportByType[type].steps += e.steps ?? 0;
    sportByType[type].sessions += 1;
  }

  return NextResponse.json({
    date: todayIso,
    goals: client,
    food: {
      calories: Math.round(food.calories),
      protein: Math.round(food.protein),
      carbs: Math.round(food.carbs),
      fat: Math.round(food.fat),
      fiber: Math.round(food.fiber),
    },
    sport: {
      duration: sport.duration,
      calories: Math.round(sport.calories),
      steps: sport.steps,
    },
    sportByType: Object.fromEntries(
      Object.entries(sportByType).map(([k, v]) => [k, { ...v, calories: Math.round(v.calories) }])
    ),
  });
}
