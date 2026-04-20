import { prisma } from "@/lib/db";
import { BREAKFASTS, LUNCHES, SNACKS, DINNERS, type MealTemplate } from "./meals";

const DEMO_EMAIL = "pixelbfr@gmail.com";

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
};

export async function seedDay(clientId: string, dateIso: string): Promise<SeedSummary> {
  const date = startOfDayUTC(new Date(dateIso));
  const isoDay = date.toISOString().slice(0, 10);
  const rng = seededRng(isoDay + clientId);

  const summary: SeedSummary = {
    date: isoDay,
    meals: { skipped: true, count: 0 },
    march: { skipped: true },
    muscu: { skipped: true, scheduled: isMuscleDay(date) },
    water: { skipped: true },
  };

  // --- FOOD ---
  const existingFood = await prisma.foodEntry.count({ where: { clientId, date } });
  if (existingFood === 0) {
    const pdj = pick(rng, BREAKFASTS);
    const dej = pick(rng, LUNCHES);
    const col = pick(rng, SNACKS);
    const din = pick(rng, DINNERS);

    // Parfois 2ème collation (30% des jours) pour varier
    const hasSecondSnack = rng() < 0.3;
    const col2 = hasSecondSnack ? pick(rng, SNACKS.filter((s) => s.name !== col.name)) : null;

    const meals: { mealType: "PETIT_DEJEUNER" | "DEJEUNER" | "COLLATION" | "DINER"; template: MealTemplate }[] = [
      { mealType: "PETIT_DEJEUNER", template: pdj },
      { mealType: "DEJEUNER", template: dej },
      { mealType: "COLLATION", template: col },
      ...(col2 ? [{ mealType: "COLLATION" as const, template: col2 }] : []),
      { mealType: "DINER", template: din },
    ];

    const totals = { kcal: 0, p: 0, c: 0, f: 0, fib: 0 };
    const rows = meals.flatMap(({ mealType, template }) =>
      template.items.map((item) => {
        // ±3% de variance par item pour réalisme (poids de cuisson, portion réelle)
        const q = Math.round(jitter(rng, item.quantity, 0.03) * 10) / 10;
        const scale = q / item.quantity;
        const calories = Math.round(item.calories * scale);
        const protein = Math.round(item.protein * scale * 10) / 10;
        const carbs = Math.round(item.carbs * scale * 10) / 10;
        const fat = Math.round(item.fat * scale * 10) / 10;
        const fiber = Math.round(item.fiber * scale * 10) / 10;
        totals.kcal += calories;
        totals.p += protein;
        totals.c += carbs;
        totals.f += fat;
        totals.fib += fiber;
        return {
          clientId,
          date,
          mealType,
          foodName: item.foodName,
          quantity: q,
          unit: item.unit,
          calories,
          protein,
          carbs,
          fat,
          fiber,
        };
      })
    );

    await prisma.foodEntry.createMany({ data: rows });
    summary.meals = { skipped: false, count: rows.length, totals: {
      kcal: Math.round(totals.kcal),
      p: Math.round(totals.p),
      c: Math.round(totals.c),
      f: Math.round(totals.f),
      fib: Math.round(totals.fib),
    } };
  }

  // --- SPORT : MARCHE (pas quotidiens) ---
  const existingWalk = await prisma.sportEntry.count({ where: { clientId, date, sportType: "MARCHE" } });
  if (existingWalk === 0) {
    const steps = Math.round(17000 + rng() * 13000); // 17k-30k
    const calories = Math.round(steps * 0.0487);
    const distance = Math.round(steps * 0.000795 * 100) / 100;
    const duration = Math.round(steps * 0.00992);
    await prisma.sportEntry.create({
      data: {
        clientId,
        date,
        sportType: "MARCHE",
        steps,
        calories,
        distance,
        duration,
      },
    });
    summary.march = { skipped: false, steps, kcal: calories };
  }

  // --- SPORT : MUSCULATION (lun/mer/ven, 80 min) ---
  if (isMuscleDay(date)) {
    const existingMuscu = await prisma.sportEntry.count({ where: { clientId, date, sportType: "MUSCULATION" } });
    if (existingMuscu === 0) {
      // 80 min, variance 75-85 min pour réalisme
      const duration = Math.round(jitter(rng, 80, 0.06));
      // MET ~5 pour musculation modérée-vigoureuse, 84kg
      const calories = Math.round(duration * 5.5 * 84 / 60);
      await prisma.sportEntry.create({
        data: {
          clientId,
          date,
          sportType: "MUSCULATION",
          duration,
          calories,
        },
      });
      summary.muscu = { skipped: false, scheduled: true, kcal: calories };
    }
  }

  // --- WATER ---
  const existingWater = await prisma.waterEntry.findUnique({
    where: { clientId_date: { clientId, date } },
  });
  if (!existingWater) {
    // 2L à 2.5L (en-dessous de l'objectif 4.4L, pattern réaliste)
    const liters = Math.round((2 + rng() * 0.5) * 10) / 10;
    await prisma.waterEntry.create({
      data: { clientId, date, liters },
    });
    summary.water = { skipped: false, liters };
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
