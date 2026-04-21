import { prisma } from "@/lib/db";
import { BREAKFASTS, LUNCHES, SNACKS, DINNERS, POST_WORKOUT, type MealTemplate } from "./meals";

export const DEMO_EMAIL = "pixelbfr@gmail.com";

const WEIGH_IN_ANCHOR_DATE = "2026-04-10";
const WEIGH_IN_ANCHOR_WEIGHT = 84;
const WEEKLY_LOSS_KG = 0.5;

export type Phase = "morning" | "evening" | "full";

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
  phase: Phase;
  meals: { added: number; totals?: { kcal: number; p: number; c: number; f: number; fib: number } };
  march: { added: number; steps?: number };
  muscu: { added: boolean; kcal?: number };
  water: { set: boolean; liters?: number };
  weight: { added: boolean; kg?: number };
};

function scaleMeal(
  rng: () => number,
  template: MealTemplate,
  scale: number,
  clientId: string,
  date: Date,
  mealType: "PETIT_DEJEUNER" | "DEJEUNER" | "COLLATION" | "DINER"
) {
  return template.items.map((item) => {
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

export async function seedDay(clientId: string, dateIso: string, phase: Phase = "full"): Promise<SeedSummary> {
  const date = startOfDayUTC(new Date(dateIso));
  const isoDay = date.toISOString().slice(0, 10);
  const rng = seededRng(isoDay + clientId);
  const muscleDay = isMuscleDay(date);
  const doMorning = phase === "morning" || phase === "full";
  const doEvening = phase === "evening" || phase === "full";

  const summary: SeedSummary = {
    date: isoDay,
    phase,
    meals: { added: 0 },
    march: { added: 0 },
    muscu: { added: false },
    water: { set: false },
    weight: { added: false },
  };

  // Tous les picks sont consommés dans le même ordre → déterminisme entre phases.
  const pdj = pick(rng, BREAKFASTS);
  const dej = pick(rng, LUNCHES);
  const col = pick(rng, SNACKS);
  const din = pick(rng, DINNERS);
  const pwo = muscleDay ? pick(rng, POST_WORKOUT) : null;
  const scale = muscleDay ? 0.86 : 0.83;

  // Pré-génère tous les items pour totaux cohérents (même si on n'insère que morning).
  const pdjRows = scaleMeal(rng, pdj, scale, clientId, date, "PETIT_DEJEUNER");
  const dejRows = scaleMeal(rng, dej, scale, clientId, date, "DEJEUNER");
  const colRows = scaleMeal(rng, col, scale, clientId, date, "COLLATION");
  const pwoRows = pwo ? scaleMeal(rng, pwo, 1.0, clientId, date, "COLLATION") : [];
  const dinRows = scaleMeal(rng, din, scale, clientId, date, "DINER");

  // --- MORNING PHASE ---
  if (doMorning) {
    // Petit-déjeuner
    const hasPdj = await prisma.foodEntry.count({ where: { clientId, date, mealType: "PETIT_DEJEUNER" } });
    if (hasPdj === 0) {
      await prisma.foodEntry.createMany({ data: pdjRows });
      summary.meals.added += pdjRows.length;
    }

    // Marche matinale : 5000-8000 pas
    const existingWalks = await prisma.sportEntry.count({ where: { clientId, date, sportType: "MARCHE" } });
    if (existingWalks === 0) {
      const steps = Math.round(5000 + rng() * 3000);
      await prisma.sportEntry.create({
        data: {
          clientId, date, sportType: "MARCHE",
          steps,
          calories: Math.round(steps * 0.0487),
          distance: Math.round(steps * 0.000795 * 100) / 100,
          duration: Math.round(steps * 0.00992),
        },
      });
      summary.march.added = 1;
      summary.march.steps = steps;
    }

    // Eau matin : 1L
    const existingWater = await prisma.waterEntry.findUnique({ where: { clientId_date: { clientId, date } } });
    if (!existingWater) {
      await prisma.waterEntry.create({ data: { clientId, date, liters: 1 } });
      summary.water = { set: true, liters: 1 };
    }
  }

  // --- EVENING PHASE ---
  if (doEvening) {
    // Déjeuner
    const hasDej = await prisma.foodEntry.count({ where: { clientId, date, mealType: "DEJEUNER" } });
    if (hasDej === 0) {
      await prisma.foodEntry.createMany({ data: dejRows });
      summary.meals.added += dejRows.length;
    }

    // Collation(s) : COLLATION + éventuel post-workout
    const hasCol = await prisma.foodEntry.count({ where: { clientId, date, mealType: "COLLATION" } });
    if (hasCol === 0) {
      await prisma.foodEntry.createMany({ data: [...colRows, ...pwoRows] });
      summary.meals.added += colRows.length + pwoRows.length;
    }

    // Dîner
    const hasDin = await prisma.foodEntry.count({ where: { clientId, date, mealType: "DINER" } });
    if (hasDin === 0) {
      await prisma.foodEntry.createMany({ data: dinRows });
      summary.meals.added += dinRows.length;
    }

    // Compléter la marche jusqu'à 17k-30k (ajoute une entrée soirée).
    const existingSteps = await prisma.sportEntry.aggregate({
      _sum: { steps: true },
      where: { clientId, date, sportType: "MARCHE" },
    });
    const currentSteps = existingSteps._sum.steps ?? 0;
    const targetSteps = Math.round(17000 + rng() * 13000);
    if (currentSteps < targetSteps) {
      const remaining = targetSteps - currentSteps;
      await prisma.sportEntry.create({
        data: {
          clientId, date, sportType: "MARCHE",
          steps: remaining,
          calories: Math.round(remaining * 0.0487),
          distance: Math.round(remaining * 0.000795 * 100) / 100,
          duration: Math.round(remaining * 0.00992),
        },
      });
      summary.march.added += 1;
      summary.march.steps = (summary.march.steps ?? currentSteps) + remaining;
    }

    // Muscu (lun/mer/ven)
    if (muscleDay) {
      const existingMuscu = await prisma.sportEntry.count({ where: { clientId, date, sportType: "MUSCULATION" } });
      if (existingMuscu === 0) {
        const duration = Math.round(jitter(rng, 80, 0.06));
        const calories = Math.round(duration * 5.5 * 84 / 60);
        await prisma.sportEntry.create({
          data: { clientId, date, sportType: "MUSCULATION", duration, calories },
        });
        summary.muscu = { added: true, kcal: calories };
      }
    }

    // Eau : upsert à 2-2.5L final
    const targetLiters = Math.round((2 + rng() * 0.5) * 10) / 10;
    await prisma.waterEntry.upsert({
      where: { clientId_date: { clientId, date } },
      update: { liters: targetLiters },
      create: { clientId, date, liters: targetLiters },
    });
    summary.water = { set: true, liters: targetLiters };

    // Pesée vendredi
    if (isFriday(date)) {
      const existingWeight = await prisma.weightEntry.findUnique({ where: { clientId_date: { clientId, date } } });
      if (!existingWeight) {
        const anchor = startOfDayUTC(new Date(WEIGH_IN_ANCHOR_DATE));
        const weeks = (date.getTime() - anchor.getTime()) / (7 * 24 * 3600 * 1000);
        const weight = WEIGH_IN_ANCHOR_WEIGHT - weeks * WEEKLY_LOSS_KG + (rng() * 0.2 - 0.1);
        const kg = Math.round(weight * 10) / 10;
        await prisma.weightEntry.create({ data: { clientId, date, weight: kg } });
        summary.weight = { added: true, kg };
      }
    }
  }

  // Totaux food si inséré
  if (summary.meals.added > 0) {
    const agg = await prisma.foodEntry.aggregate({
      _sum: { calories: true, protein: true, carbs: true, fat: true, fiber: true },
      where: { clientId, date },
    });
    summary.meals.totals = {
      kcal: Math.round(agg._sum.calories ?? 0),
      p: Math.round((agg._sum.protein ?? 0) * 10) / 10,
      c: Math.round((agg._sum.carbs ?? 0) * 10) / 10,
      f: Math.round((agg._sum.fat ?? 0) * 10) / 10,
      fib: Math.round((agg._sum.fiber ?? 0) * 10) / 10,
    };
  }

  return summary;
}

export async function seedRange(clientId: string, fromIso: string, toIso: string, phase: Phase = "full"): Promise<SeedSummary[]> {
  const from = startOfDayUTC(new Date(fromIso));
  const to = startOfDayUTC(new Date(toIso));
  const out: SeedSummary[] = [];
  for (let d = new Date(from); d <= to; d.setUTCDate(d.getUTCDate() + 1)) {
    out.push(await seedDay(clientId, d.toISOString().slice(0, 10), phase));
  }
  return out;
}

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
