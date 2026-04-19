import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireClientProfile } from "@/lib/client-session";
import {
  calendarDateInTimeZone,
  calendarIsoToPrismaDate,
  CLIENT_TIMEZONE,
} from "@/lib/calendar-day";

export const dynamic = "force-dynamic";

/**
 * Retourne 7 jours d'entrées alimentaires (jour J et 6 jours précédents),
 * regroupées par date avec totaux quotidiens.
 */
export async function GET(request: NextRequest) {
  const ctx = await requireClientProfile();
  if ("error" in ctx) return ctx.error;

  const endDateParam = request.nextUrl.searchParams.get("endDate");
  const endIso =
    endDateParam && /^\d{4}-\d{2}-\d{2}$/.test(endDateParam)
      ? endDateParam
      : calendarDateInTimeZone(CLIENT_TIMEZONE);

  // Liste des 7 derniers jours (inclus endIso), du plus récent au plus ancien
  const dates: string[] = [];
  const end = new Date(endIso + "T00:00:00");
  for (let i = 0; i < 7; i++) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }

  const startIso = dates[dates.length - 1];
  const entries = await prisma.foodEntry.findMany({
    where: {
      clientId: ctx.client.id,
      date: {
        gte: calendarIsoToPrismaDate(startIso),
        lte: calendarIsoToPrismaDate(endIso),
      },
    },
    orderBy: [{ date: "desc" }, { createdAt: "asc" }],
  });

  // Groupe par date ISO
  const byDate = new Map<string, typeof entries>();
  for (const e of entries) {
    const iso = e.date.toISOString().slice(0, 10);
    if (!byDate.has(iso)) byDate.set(iso, []);
    byDate.get(iso)!.push(e);
  }

  const days = dates.map((iso) => {
    const dayEntries = byDate.get(iso) ?? [];
    const totals = dayEntries.reduce(
      (acc, e) => ({
        calories: acc.calories + e.calories,
        protein: acc.protein + e.protein,
        carbs: acc.carbs + e.carbs,
        fat: acc.fat + e.fat,
        fiber: acc.fiber + e.fiber,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    );
    return {
      date: iso,
      entries: dayEntries.map((e) => ({
        id: e.id,
        mealType: e.mealType,
        foodName: e.foodName,
        quantity: e.quantity,
        unit: e.unit,
        calories: e.calories,
        protein: e.protein,
        carbs: e.carbs,
        fat: e.fat,
        fiber: e.fiber,
      })),
      totals: {
        calories: Math.round(totals.calories),
        protein: Math.round(totals.protein * 10) / 10,
        carbs: Math.round(totals.carbs * 10) / 10,
        fat: Math.round(totals.fat * 10) / 10,
        fiber: Math.round(totals.fiber * 10) / 10,
      },
    };
  });

  return NextResponse.json({ days });
}
