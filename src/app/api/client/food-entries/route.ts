import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireClientProfile } from "@/lib/client-session";
import {
  calendarDateInTimeZone,
  calendarIsoToPrismaDate,
  CLIENT_TIMEZONE,
} from "@/lib/calendar-day";
import type { MealType } from "@/generated/prisma/client";

const MEAL_TYPES: MealType[] = [
  "PETIT_DEJEUNER",
  "DEJEUNER",
  "DINER",
  "COLLATION",
];

export async function GET(request: NextRequest) {
  const ctx = await requireClientProfile();
  if ("error" in ctx) return ctx.error;

  const dateParam = request.nextUrl.searchParams.get("date");
  const iso =
    dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)
      ? dateParam
      : calendarDateInTimeZone(CLIENT_TIMEZONE);

  const day = calendarIsoToPrismaDate(iso);

  const entries = await prisma.foodEntry.findMany({
    where: { clientId: ctx.client.id, date: day },
    orderBy: { createdAt: "asc" },
  });

  const totals = entries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs,
      fat: acc.fat + e.fat,
      fiber: acc.fiber + e.fiber,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  return NextResponse.json({ date: iso, entries, totals });
}

export async function POST(request: NextRequest) {
  const ctx = await requireClientProfile();
  if ("error" in ctx) return ctx.error;

  const body = await request.json();
  const {
    date: dateStr,
    mealType,
    foodName,
    quantity,
    unit,
    calories,
    protein,
    carbs,
    fat,
    fiber,
  } = body;

  if (
    !dateStr ||
    typeof foodName !== "string" ||
    !MEAL_TYPES.includes(mealType)
  ) {
    return NextResponse.json(
      { message: "date, mealType et foodName requis" },
      { status: 400 }
    );
  }

  const day = calendarIsoToPrismaDate(dateStr);

  const row = await prisma.foodEntry.create({
    data: {
      clientId: ctx.client.id,
      date: day,
      mealType,
      foodName,
      quantity: Number(quantity) || 0,
      unit: typeof unit === "string" ? unit : "g",
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      fiber: Number(fiber) || 0,
    },
  });

  return NextResponse.json(row);
}

export async function DELETE(request: NextRequest) {
  const ctx = await requireClientProfile();
  if ("error" in ctx) return ctx.error;

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "id requis" }, { status: 400 });
  }

  const existing = await prisma.foodEntry.findFirst({
    where: { id, clientId: ctx.client.id },
  });
  if (!existing) {
    return NextResponse.json({ message: "Entrée introuvable" }, { status: 404 });
  }

  await prisma.foodEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
