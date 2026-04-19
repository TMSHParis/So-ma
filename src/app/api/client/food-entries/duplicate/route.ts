import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireClientProfile } from "@/lib/client-session";
import { calendarIsoToPrismaDate } from "@/lib/calendar-day";

/**
 * Duplique toutes les entrées alimentaires d'un jour source vers un jour cible.
 * Body : { sourceDate: "YYYY-MM-DD", targetDate: "YYYY-MM-DD", mode?: "append" | "replace" }
 *  - append (défaut) : ajoute les entrées copiées sans toucher à celles existantes
 *  - replace : supprime d'abord les entrées du jour cible puis copie
 */
export async function POST(request: NextRequest) {
  const ctx = await requireClientProfile();
  if ("error" in ctx) return ctx.error;

  const body = await request.json();
  const { sourceDate, targetDate, mode = "append" } = body as {
    sourceDate?: string;
    targetDate?: string;
    mode?: "append" | "replace";
  };

  if (!sourceDate || !targetDate || !/^\d{4}-\d{2}-\d{2}$/.test(sourceDate) || !/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
    return NextResponse.json(
      { message: "sourceDate et targetDate (YYYY-MM-DD) requis" },
      { status: 400 },
    );
  }
  if (sourceDate === targetDate) {
    return NextResponse.json(
      { message: "Les dates source et cible doivent être différentes" },
      { status: 400 },
    );
  }

  const sourceDay = calendarIsoToPrismaDate(sourceDate);
  const targetDay = calendarIsoToPrismaDate(targetDate);

  const sourceEntries = await prisma.foodEntry.findMany({
    where: { clientId: ctx.client.id, date: sourceDay },
    orderBy: { createdAt: "asc" },
  });

  if (sourceEntries.length === 0) {
    return NextResponse.json(
      { message: "Aucune entrée à dupliquer pour cette date" },
      { status: 400 },
    );
  }

  if (mode === "replace") {
    await prisma.foodEntry.deleteMany({
      where: { clientId: ctx.client.id, date: targetDay },
    });
  }

  await prisma.foodEntry.createMany({
    data: sourceEntries.map((e) => ({
      clientId: ctx.client.id,
      date: targetDay,
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
  });

  return NextResponse.json({ ok: true, copied: sourceEntries.length });
}
