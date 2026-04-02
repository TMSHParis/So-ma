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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ clientId: string }> },
) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { clientId } = await params;

  const todayIso = calendarDateInTimeZone(CLIENT_TIMEZONE);
  const todayDate = calendarIsoToPrismaDate(todayIso);

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

  // Aggregate sport
  const sport = {
    duration: 0,
    calories: 0,
    steps: 0,
  };
  for (const e of sportEntries) {
    sport.duration += e.duration ?? 0;
    sport.calories += e.calories ?? 0;
    sport.steps += e.steps ?? 0;
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
    sport,
  });
}
