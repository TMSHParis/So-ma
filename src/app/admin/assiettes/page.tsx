import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/super-admin";
import { prisma } from "@/lib/db";
import {
  calendarDateInTimeZone,
  calendarIsoToPrismaDate,
  CLIENT_TIMEZONE,
} from "@/lib/calendar-day";
import { AssiettesDatePicker } from "./AssiettesDatePicker";
import { Droplets, Flame, UtensilsCrossed } from "lucide-react";

const ISO_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const MEAL_ORDER = ["PETIT_DEJEUNER", "DEJEUNER", "COLLATION", "DINER"] as const;
const MEAL_LABELS: Record<(typeof MEAL_ORDER)[number], string> = {
  PETIT_DEJEUNER: "Petit-déjeuner",
  DEJEUNER: "Déjeuner",
  COLLATION: "Collation",
  DINER: "Dîner",
};

const BALANCE_LABELS: Record<string, string> = {
  DEFICIT: "Déficit",
  SURPLUS: "Surplus",
  MAINTIEN: "Maintien",
};

function formatNumber(n: number, digits = 0): string {
  return n.toLocaleString("fr-FR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export default async function AssiettesPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const session = await requireSuperAdmin();
  if (!session) redirect("/admin");

  const sp = await searchParams;
  const dateIso =
    sp.date && ISO_REGEX.test(sp.date)
      ? sp.date
      : calendarDateInTimeZone(CLIENT_TIMEZONE);
  const prismaDate = calendarIsoToPrismaDate(dateIso);

  const [clients, foodEntries, waterEntries] = await Promise.all([
    prisma.client.findMany({
      select: {
        id: true,
        goalCalories: true,
        goalWaterL: true,
        energyBalance: true,
        user: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { user: { firstName: "asc" } },
    }),
    prisma.foodEntry.findMany({
      where: { date: prismaDate },
      orderBy: { createdAt: "asc" },
    }),
    prisma.waterEntry.findMany({
      where: { date: prismaDate },
    }),
  ]);

  const foodByClient = new Map<string, typeof foodEntries>();
  for (const f of foodEntries) {
    const list = foodByClient.get(f.clientId) ?? [];
    list.push(f);
    foodByClient.set(f.clientId, list);
  }

  const waterByClient = new Map<string, number>();
  for (const w of waterEntries) waterByClient.set(w.clientId, w.liters);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Assiettes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ce que chaque cliente a mangé et bu ce jour-là.
          </p>
        </div>
        <AssiettesDatePicker value={dateIso} />
      </div>

      {clients.length === 0 ? (
        <EmptyState message="Aucune cliente à afficher." />
      ) : (
        <div className="space-y-4">
          {clients.map((c) => {
            const entries = foodByClient.get(c.id) ?? [];
            const water = waterByClient.get(c.id) ?? 0;
            return (
              <ClientAssietteCard
                key={c.id}
                name={`${c.user.firstName} ${c.user.lastName}`.trim()}
                email={c.user.email}
                balance={c.energyBalance}
                goalCalories={c.goalCalories}
                goalWaterL={c.goalWaterL}
                entries={entries}
                waterLiters={water}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl bg-white border border-warm-border p-12 text-center">
      <UtensilsCrossed className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

type FoodEntry = {
  id: string;
  mealType: string;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

function ClientAssietteCard({
  name,
  email,
  balance,
  goalCalories,
  goalWaterL,
  entries,
  waterLiters,
}: {
  name: string;
  email: string;
  balance: string | null;
  goalCalories: number | null;
  goalWaterL: number | null;
  entries: FoodEntry[];
  waterLiters: number;
}) {
  const totals = entries.reduce(
    (acc, e) => ({
      kcal: acc.kcal + e.calories,
      p: acc.p + e.protein,
      c: acc.c + e.carbs,
      f: acc.f + e.fat,
      fib: acc.fib + e.fiber,
    }),
    { kcal: 0, p: 0, c: 0, f: 0, fib: 0 }
  );

  const entriesByMeal = new Map<string, FoodEntry[]>();
  for (const e of entries) {
    const list = entriesByMeal.get(e.mealType) ?? [];
    list.push(e);
    entriesByMeal.set(e.mealType, list);
  }

  const hasEaten = entries.length > 0;

  return (
    <div className="rounded-xl bg-white border border-warm-border overflow-hidden">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 border-b border-warm-border">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-[15px] truncate">{name || email}</h3>
            {balance && (
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                {BALANCE_LABELS[balance] ?? balance}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{email}</p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            <span className="font-medium">{formatNumber(totals.kcal)}</span>
            <span className="text-muted-foreground">
              {goalCalories ? `/ ${formatNumber(goalCalories)} kcal` : "kcal"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Droplets className="h-3.5 w-3.5 text-sky-500" />
            <span className="font-medium">{formatNumber(waterLiters, 1)}</span>
            <span className="text-muted-foreground">
              {goalWaterL ? `/ ${formatNumber(goalWaterL, 1)} L` : "L"}
            </span>
          </div>
        </div>
      </div>

      {hasEaten ? (
        <div className="divide-y divide-warm-border">
          {MEAL_ORDER.map((meal) => {
            const mealEntries = entriesByMeal.get(meal) ?? [];
            if (mealEntries.length === 0) return null;
            const mealKcal = mealEntries.reduce((s, e) => s + e.calories, 0);
            return (
              <div key={meal} className="px-5 py-3.5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                    {MEAL_LABELS[meal]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatNumber(mealKcal)} kcal
                  </p>
                </div>
                <ul className="space-y-1">
                  {mealEntries.map((e) => (
                    <li
                      key={e.id}
                      className="flex items-baseline justify-between gap-3 text-sm"
                    >
                      <span className="truncate">
                        {e.foodName}
                        <span className="text-muted-foreground ml-2 text-xs">
                          {formatNumber(e.quantity, e.quantity % 1 ? 1 : 0)} {e.unit}
                        </span>
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatNumber(e.calories)} kcal · {formatNumber(e.protein, 1)}P /
                        {formatNumber(e.carbs, 1)}C / {formatNumber(e.fat, 1)}F
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <div className="px-5 py-3 bg-foreground/[0.02] text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
            <span>
              <span className="font-medium text-foreground">{formatNumber(totals.p, 1)}g</span>{" "}
              protéines
            </span>
            <span>
              <span className="font-medium text-foreground">{formatNumber(totals.c, 1)}g</span>{" "}
              glucides
            </span>
            <span>
              <span className="font-medium text-foreground">{formatNumber(totals.f, 1)}g</span>{" "}
              lipides
            </span>
            <span>
              <span className="font-medium text-foreground">{formatNumber(totals.fib, 1)}g</span>{" "}
              fibres
            </span>
          </div>
        </div>
      ) : (
        <div className="px-5 py-6 text-xs text-muted-foreground italic">
          Rien de loggé ce jour.
        </div>
      )}
    </div>
  );
}
