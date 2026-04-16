import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role: string }).role !== "ADMIN")
    return null;
  return session;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ clientId: string }> },
) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { clientId } = await params;

  const daysParam = req.nextUrl.searchParams.get("days");
  const days = Math.min(Math.max(Number(daysParam) || 30, 7), 90);

  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setUTCHours(0, 0, 0, 0);

  const [client, foodEntries, sportEntries, weightEntries, measurementEntries] =
    await Promise.all([
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
          sessionsPerWeek: true,
          startWeight: true,
          goalWeight: true,
          weight: true,
          user: { select: { firstName: true, lastName: true } },
        },
      }),
      prisma.foodEntry.findMany({
        where: { clientId, date: { gte: since } },
        orderBy: { date: "asc" },
      }),
      prisma.sportEntry.findMany({
        where: { clientId, date: { gte: since } },
        orderBy: { date: "asc" },
      }),
      prisma.weightEntry.findMany({
        where: { clientId, date: { gte: since } },
        orderBy: { date: "asc" },
      }),
      prisma.measurementEntry.findMany({
        where: { clientId, date: { gte: since } },
        orderBy: { date: "asc" },
      }),
    ]);

  if (!client)
    return NextResponse.json({ error: "Cliente introuvable" }, { status: 404 });

  // --- Aggregate food by day ---
  const foodByDay: Record<
    string,
    { calories: number; protein: number; carbs: number; fat: number; fiber: number }
  > = {};
  for (const e of foodEntries) {
    const d = e.date.toISOString().slice(0, 10);
    if (!foodByDay[d])
      foodByDay[d] = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    foodByDay[d].calories += e.calories;
    foodByDay[d].protein += e.protein;
    foodByDay[d].carbs += e.carbs;
    foodByDay[d].fat += e.fat;
    foodByDay[d].fiber += e.fiber;
  }

  // --- Aggregate sport by day ---
  const sportByDay: Record<
    string,
    { duration: number; calories: number; steps: number; sessions: number }
  > = {};
  for (const e of sportEntries) {
    const d = e.date.toISOString().slice(0, 10);
    if (!sportByDay[d])
      sportByDay[d] = { duration: 0, calories: 0, steps: 0, sessions: 0 };
    sportByDay[d].duration += e.duration ?? 0;
    sportByDay[d].calories += e.calories ?? 0;
    sportByDay[d].steps += e.steps ?? 0;
    sportByDay[d].sessions += 1;
  }

  // --- Build daily timeline ---
  const dailyData: Array<{
    date: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    calorieGoalPct: number | null;
    proteinGoalPct: number | null;
    carbsGoalPct: number | null;
    fatGoalPct: number | null;
    sportDuration: number;
    sportCalories: number;
    sportSteps: number;
    sportSessions: number;
    logged: boolean;
  }> = [];

  const allDays = new Set<string>();
  for (const d of Object.keys(foodByDay)) allDays.add(d);
  for (const d of Object.keys(sportByDay)) allDays.add(d);

  const sortedDays = [...allDays].sort();
  for (const d of sortedDays) {
    const f = foodByDay[d];
    const s = sportByDay[d];
    const cal = Math.round(f?.calories ?? 0);
    const prot = Math.round(f?.protein ?? 0);
    const carb = Math.round(f?.carbs ?? 0);
    const fat = Math.round(f?.fat ?? 0);
    const fib = Math.round(f?.fiber ?? 0);

    dailyData.push({
      date: d,
      calories: cal,
      protein: prot,
      carbs: carb,
      fat: fat,
      fiber: fib,
      calorieGoalPct: client.goalCalories
        ? Math.round((cal / client.goalCalories) * 100)
        : null,
      proteinGoalPct: client.goalProtein
        ? Math.round((prot / client.goalProtein) * 100)
        : null,
      carbsGoalPct: client.goalCarbs
        ? Math.round((carb / client.goalCarbs) * 100)
        : null,
      fatGoalPct: client.goalFat
        ? Math.round((fat / client.goalFat) * 100)
        : null,
      sportDuration: s?.duration ?? 0,
      sportCalories: Math.round(s?.calories ?? 0),
      sportSteps: s?.steps ?? 0,
      sportSessions: s?.sessions ?? 0,
      logged: !!(f && f.calories > 0),
    });
  }

  // --- Weight timeline ---
  const weightData = weightEntries.map((w) => ({
    date: w.date.toISOString().slice(0, 10),
    weight: w.weight,
  }));

  // --- Measurements timeline ---
  const measurementData = measurementEntries.map((m) => ({
    date: m.date.toISOString().slice(0, 10),
    waistCm: m.waistCm,
    hipCm: m.hipCm,
    buttCm: m.buttCm,
  }));

  // --- Effort / compliance scores ---
  const daysLogged = dailyData.filter((d) => d.logged).length;
  const totalDays = days;
  const loggingRate = Math.round((daysLogged / totalDays) * 100);

  // Nutrition compliance: days within 90-110% of calorie goal
  const daysOnTarget = dailyData.filter(
    (d) => d.calorieGoalPct !== null && d.calorieGoalPct >= 80 && d.calorieGoalPct <= 120
  ).length;
  const nutritionCompliance = daysLogged > 0
    ? Math.round((daysOnTarget / daysLogged) * 100)
    : 0;

  // Sport compliance: sessions per week vs goal
  const totalSportSessions = dailyData.reduce((sum, d) => sum + d.sportSessions, 0);
  const weeksInRange = Math.max(days / 7, 1);
  const avgSessionsPerWeek = totalSportSessions / weeksInRange;
  const sportCompliance = client.sessionsPerWeek
    ? Math.round((avgSessionsPerWeek / client.sessionsPerWeek) * 100)
    : null;

  // Overall effort score (weighted average)
  const weights = { logging: 30, nutrition: 40, sport: 30 };
  let effortScore = (loggingRate * weights.logging) / 100;
  effortScore += (nutritionCompliance * weights.nutrition) / 100;
  if (sportCompliance !== null) {
    effortScore += (Math.min(sportCompliance, 100) * weights.sport) / 100;
  } else {
    // redistribute sport weight to others
    effortScore =
      (loggingRate * 50) / 100 + (nutritionCompliance * 50) / 100;
  }
  effortScore = Math.round(effortScore);

  return NextResponse.json({
    client: {
      name: `${client.user.firstName} ${client.user.lastName}`,
      goals: {
        goalCalories: client.goalCalories,
        goalProtein: client.goalProtein,
        goalCarbs: client.goalCarbs,
        goalFat: client.goalFat,
        goalFiber: client.goalFiber,
        goalSteps: client.goalSteps,
        sessionsPerWeek: client.sessionsPerWeek,
        startWeight: client.startWeight,
        goalWeight: client.goalWeight,
      },
    },
    days,
    dailyData,
    weightData,
    measurementData,
    scores: {
      effortScore,
      loggingRate,
      nutritionCompliance,
      sportCompliance,
      daysLogged,
      totalDays,
      daysOnTarget,
      avgSessionsPerWeek: Math.round(avgSessionsPerWeek * 10) / 10,
    },
  });
}
