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
  // "all" = depuis le début, sinon 7-90
  const isAll = daysParam === "all";
  const days = isAll ? 0 : Math.min(Math.max(Number(daysParam) || 30, 7), 90);

  const since = isAll ? new Date(0) : new Date();
  if (!isAll) {
    since.setDate(since.getDate() - days);
    since.setUTCHours(0, 0, 0, 0);
  }

  const [client, foodEntries, sportEntries, weightEntries, measurementEntries, waterEntries] =
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
          createdAt: true,
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
      prisma.waterEntry.findMany({
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

  // --- Aggregate water by day ---
  const waterByDay: Record<string, number> = {};
  for (const e of waterEntries) {
    const d = e.date.toISOString().slice(0, 10);
    waterByDay[d] = (waterByDay[d] ?? 0) + e.liters;
  }

  // --- Build daily timeline ---
  const allDays = new Set<string>();
  for (const d of Object.keys(foodByDay)) allDays.add(d);
  for (const d of Object.keys(sportByDay)) allDays.add(d);
  for (const d of Object.keys(waterByDay)) allDays.add(d);

  const sortedDays = [...allDays].sort();

  const dailyData = sortedDays.map((d) => {
    const f = foodByDay[d];
    const s = sportByDay[d];
    const cal = Math.round(f?.calories ?? 0);
    const prot = Math.round(f?.protein ?? 0);
    const carb = Math.round(f?.carbs ?? 0);
    const fat = Math.round(f?.fat ?? 0);
    const fib = Math.round(f?.fiber ?? 0);
    const water = Math.round((waterByDay[d] ?? 0) * 10) / 10;

    return {
      date: d,
      calories: cal,
      protein: prot,
      carbs: carb,
      fat: fat,
      fiber: fib,
      water,
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
      waterGoalPct: client.goalWaterL && water > 0
        ? Math.round((water / client.goalWaterL) * 100)
        : null,
      sportDuration: s?.duration ?? 0,
      sportCalories: Math.round(s?.calories ?? 0),
      sportSteps: s?.steps ?? 0,
      sportSessions: s?.sessions ?? 0,
      logged: !!(f && f.calories > 0),
    };
  });

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

  // --- Water timeline ---
  const waterData = waterEntries.map((w) => ({
    date: w.date.toISOString().slice(0, 10),
    liters: w.liters,
  }));

  // --- Effort / compliance scores ---
  // Count totalDays only from first data entry, not from the period start
  const firstDataDate = sortedDays.length > 0 ? sortedDays[0] : null;
  const today = new Date().toISOString().slice(0, 10);

  let totalDays: number;
  if (firstDataDate) {
    const diffMs = new Date(today).getTime() - new Date(firstDataDate).getTime();
    totalDays = Math.max(Math.floor(diffMs / 86_400_000) + 1, 1);
  } else {
    totalDays = isAll ? 1 : days;
  }

  const daysLogged = dailyData.filter((d) => d.logged).length;
  const loggingRate = Math.round((daysLogged / totalDays) * 100);

  // Nutrition compliance: days within 80-120% of calorie goal
  const daysOnTarget = dailyData.filter(
    (d) => d.calorieGoalPct !== null && d.calorieGoalPct >= 80 && d.calorieGoalPct <= 120
  ).length;
  const nutritionCompliance = daysLogged > 0
    ? Math.round((daysOnTarget / daysLogged) * 100)
    : 0;

  // Sport compliance: sessions per week vs goal (based on actual weeks)
  const totalSportSessions = dailyData.reduce((sum, d) => sum + d.sportSessions, 0);
  const weeksInRange = Math.max(totalDays / 7, 1);
  const avgSessionsPerWeek = totalSportSessions / weeksInRange;
  const sportCompliance = client.sessionsPerWeek
    ? Math.round((avgSessionsPerWeek / client.sessionsPerWeek) * 100)
    : null;

  // Water compliance
  const daysWithWater = dailyData.filter((d) => d.water > 0).length;
  const waterCompliance = client.goalWaterL && daysWithWater > 0
    ? Math.round(
        (dailyData.filter(
          (d) => d.waterGoalPct !== null && d.waterGoalPct >= 80
        ).length /
          daysWithWater) *
          100
      )
    : null;

  // Overall effort score (weighted average)
  const w = { logging: 25, nutrition: 35, sport: 25, water: 15 };
  let effortScore = (loggingRate * w.logging) / 100;
  effortScore += (nutritionCompliance * w.nutrition) / 100;

  if (sportCompliance !== null) {
    effortScore += (Math.min(sportCompliance, 100) * w.sport) / 100;
  }
  if (waterCompliance !== null) {
    effortScore += (Math.min(waterCompliance, 100) * w.water) / 100;
  }

  // Redistribute unused weights proportionally
  let usedWeight = w.logging + w.nutrition;
  if (sportCompliance !== null) usedWeight += w.sport;
  if (waterCompliance !== null) usedWeight += w.water;
  if (usedWeight < 100 && usedWeight > 0) {
    effortScore = Math.round((effortScore / usedWeight) * 100);
  } else {
    effortScore = Math.round(effortScore);
  }

  return NextResponse.json({
    client: {
      name: `${client.user.firstName} ${client.user.lastName}`,
      goals: {
        goalCalories: client.goalCalories,
        goalProtein: client.goalProtein,
        goalCarbs: client.goalCarbs,
        goalFat: client.goalFat,
        goalFiber: client.goalFiber,
        goalWaterL: client.goalWaterL,
        goalSteps: client.goalSteps,
        sessionsPerWeek: client.sessionsPerWeek,
        startWeight: client.startWeight,
        goalWeight: client.goalWeight,
      },
    },
    days: isAll ? totalDays : days,
    totalDays,
    firstDataDate,
    dailyData,
    weightData,
    measurementData,
    waterData,
    scores: {
      effortScore,
      loggingRate,
      nutritionCompliance,
      sportCompliance,
      waterCompliance,
      daysLogged,
      totalDays,
      daysOnTarget,
      avgSessionsPerWeek: Math.round(avgSessionsPerWeek * 10) / 10,
    },
  });
}
