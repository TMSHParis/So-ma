import { prisma } from "@/lib/db";
import { BREAKFASTS, LUNCHES, SNACKS, DINNERS, POST_WORKOUT, type MealTemplate } from "./meals";

const DEMO_EMAIL = "pixelbfr@gmail.com";

// Anchor pour la progression de pesée hebdo (vendredi de départ).
const WEIGH_IN_ANCHOR_DATE = "2026-04-10";
const WEIGH_IN_ANCHOR_WEIGHT = 84;
const WEEKLY_LOSS_KG = 0.5;

// RNG déterministe basé sur la date (yyyy-mm-dd) — même date = mêmes choix.
function seededRng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function jitter(rng: () => number, value: number, pct: number): number {
  const delta = value * pct * (rng() * 2 - 1);
  return Math.max(0, value + delta);
}

// Jours de muscu : lundi (1), mercredi (3), vendredi (5) — 3 séances/sem.
function isMuscleDay(date: Date): boolean {
  const d = date.getUTCDay();
  return d === 1 || d === 3 || d === 5;
}

function isFriday(date: Date): boolean {
  return date.getUTCDay() === 5;
}

function startOfDayUTC(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export async function getDemoClient() {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    include: { client: true },
  });
  if (!user?.client) throw new Error(`Client démo introuvable (${DEMO_EMAIL})`);
  return user.client;
}

type SeedSummary = {
  date: string;
  meals: { skipped: boolean; count: number; totals?: { kcal: number; p: number; c: number; f: number; fib: number } };
  march: { skipped: boolean; steps?: number; kcal?: number };
  muscu: { skipped: boolean; kcal?: number; scheduled: boolean };
  water: { skipped: boolean; liters?: number };
  weight: { skipped: boolean; kg?: number; scheduled: boolean };
};

// Scale les items d'un template et les rend prêts à insérer.
function scaleMeal(
  rng: () => number,
  template: MealTemplate,
  scale: number,
  clientId: string,
  date: Date,
  mealType: "PETIT_DEJEUNER" | "DEJEUNER" | "COLLATION" | "DINER"
) {
  return template.items.map((item) => {
    // ±3% de variance par item + scale global
    const factor = scale * (1 + (rng() * 0.06 - 0.03));
    const q = Math.round(item.quantity * factor * 10) / 10;
    const actualScale = q / item.quantity;
    return {
      clientId,
      date,
      mealType,
      foodName: item.foodName,
      quantity: q,
      unit: item.unit,
      calories: Math.round(item.calories * actualScale),
      protein: Math.round(item.protein * actualScale * 10) / 10,
      carbs: Math.round(item.carbs * actualScale * 10) / 10,
      fat: Math.round(item.fat * actualScale * 10) / 10,
      fiber: Math.round(item.fiber * actualScale * 10) / 10,
    };
  });
}

export async function seedDay(clientId: string, dateIso: string): Promise<SeedSummary> {
  const date = startOfDayUTC(new Date(dateIso));
  const isoDay = date.toISOString().slice(0, 10);
  const rng = seededRng(isoDay + clientId);
  const muscleDay = isMuscleDay(date);

  const summary: SeedSummary = {
    date: isoDay,
    meals: { skipped: true, count: 0 },
    march: { skipped: true },
    muscu: { skipped: true, scheduled: muscleDay },
    water: { skipped: true },
    weight: { skipped: true, scheduled: isFriday(date) },
  };

  // --- FOOD ---
  const existingFood = await prisma.foodEntry.count({ where: { clientId, date } });
  if (existingFood === 0) {
    // Scale des portions : 0.83 base (~2550 kcal), 0.86 jour muscu (~2650 + 250 post-workout = ~2900)
    const scale = muscleDay ? 0.86 : 0.83;

    const pdj = pick(rng, BREAKFASTS);
    const dej = pick(rng, LUNCHES);
    const col = pick(rng, SNACKS);
    const din = pick(rng, DINNERS);
    const pwo = muscleDay ? pick(rng, POST_WORKOUT) : null;

    const rows = [
      ...scaleMeal(rng, pdj, scale, clientId, date, "PETIT_DEJEUNER"),
      ...scaleMeal(rng, dej, scale, clientId, date, "DEJEUNER"),
      ...scaleMeal(rng, col, scale, clientId, date, "COLLATION"),
      ...(pwo ? scaleMeal(rng, pwo, 1.0, clientId, date, "COLLATION") : []),
      ...scaleMeal(rng, din, scale, clientId, date, "DINER"),
    ];

    const totals = rows.reduce(
      (acc, r) => ({
        kcal: acc.kcal + r.calories,
        p: acc.p + r.protein,
        c: acc.c + r.carbs,
        f: acc.f + r.fat,
        fib: acc.fib + r.fiber,
      }),
      { kcal: 0, p: 0, c: 0, f: 0, fib: 0 }
    );

    await prisma.foodEntry.createMany({ data: rows });
    summary.meals = {
      skipped: false,
      count: rows.length,
      totals: {
        kcal: Math.round(totals.kcal),
        p: Math.round(totals.p),
        c: Math.round(totals.c),
        f: Math.round(totals.f),
        fib: Math.round(totals.fib),
      },
    };
  }

  // --- SPORT : MARCHE (pas quotidiens) ---
  const existingWalk = await prisma.sportEntry.count({ where: { clientId, date, sportType: "MARCHE" } });
  if (existingWalk === 0) {
    const steps = Math.round(17000 + rng() * 13000); // 17k-30k
    const calories = Math.round(steps * 0.0487);
    const distance = Math.round(steps * 0.000795 * 100) / 100;
    const duration = Math.round(steps * 0.00992);
    await prisma.sportEntry.create({
      data: { clientId, date, sportType: "MARCHE", steps, calories, distance, duration },
    });
    summary.march = { skipped: false, steps, kcal: calories };
  }

  // --- SPORT : MUSCULATION (lun/mer/ven, 80 min) ---
  if (muscleDay) {
    const existingMuscu = await prisma.sportEntry.count({ where: { clientId, date, sportType: "MUSCULATION" } });
    if (existingMuscu === 0) {
      const duration = Math.round(jitter(rng, 80, 0.06));
      const calories = Math.round(duration * 5.5 * 84 / 60);
      await prisma.sportEntry.create({
        data: { clientId, date, sportType: "MUSCULATION", duration, calories },
      });
      summary.muscu = { skipped: false, scheduled: true, kcal: calories };
    }
  }

  // --- WATER ---
  const existingWater = await prisma.waterEntry.findUnique({
    where: { clientId_date: { clientId, date } },
  });
  if (!existingWater) {
    const liters = Math.round((2 + rng() * 0.5) * 10) / 10;
    await prisma.waterEntry.create({ data: { clientId, date, liters } });
    summary.water = { skipped: false, liters };
  }

  // --- WEIGHT (pesée hebdo vendredi) ---
  if (isFriday(date)) {
    const existingWeight = await prisma.weightEntry.findUnique({
      where: { clientId_date: { clientId, date } },
    });
    if (!existingWeight) {
      const anchor = startOfDayUTC(new Date(WEIGH_IN_ANCHOR_DATE));
      const weeks = (date.getTime() - anchor.getTime()) / (7 * 24 * 3600 * 1000);
      const weight = WEIGH_IN_ANCHOR_WEIGHT - weeks * WEEKLY_LOSS_KG + (rng() * 0.2 - 0.1);
      const kg = Math.round(weight * 10) / 10;
      await prisma.weightEntry.create({ data: { clientId, date, weight: kg } });
      summary.weight = { skipped: false, scheduled: true, kg };
    }
  }

  return summary;
}

export async function seedRange(clientId: string, fromIso: string, toIso: string): Promise<SeedSummary[]> {
  const from = startOfDayUTC(new Date(fromIso));
  const to = startOfDayUTC(new Date(toIso));
  const out: SeedSummary[] = [];
  for (let d = new Date(from); d <= to; d.setUTCDate(d.getUTCDate() + 1)) {
    out.push(await seedDay(clientId, d.toISOString().slice(0, 10)));
  }
  return out;
}

// Wipe complet d'une plage avant re-seed propre.
export async function wipeRange(clientId: string, fromIso: string, toIso: string) {
  const from = startOfDayUTC(new Date(fromIso));
  const to = startOfDayUTC(new Date(toIso));
  const where = { clientId, date: { gte: from, lte: to } };
  const [food, sport, water, weight] = await Promise.all([
    prisma.foodEntry.deleteMany({ where }),
    prisma.sportEntry.deleteMany({ where }),
    prisma.waterEntry.deleteMany({ where }),
    prisma.weightEntry.deleteMany({ where }),
  ]);
  return {
    foodDeleted: food.count,
    sportDeleted: sport.count,
    waterDeleted: water.count,
    weightDeleted: weight.count,
  };
}
