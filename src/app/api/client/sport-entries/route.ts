import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireClientProfile } from "@/lib/client-session";
import {
  calendarDateInTimeZone,
  calendarIsoToPrismaDate,
  CLIENT_TIMEZONE,
} from "@/lib/calendar-day";
import type { Prisma, SportType } from "@/generated/prisma/client";

const SPORT_TYPES: SportType[] = [
  "MUSCULATION",
  "CARDIO",
  "MARCHE",
  "COURSE",
  "YOGA",
  "NATATION",
  "VELO",
  "MOBILITE",
  "RENFORCEMENT",
  "AUTRE",
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

  const entries = await prisma.sportEntry.findMany({
    where: { clientId: ctx.client.id, date: day },
    orderBy: { createdAt: "asc" },
  });

  let totalDuration = 0;
  let totalCalories = 0;
  let totalSteps = 0;
  for (const e of entries) {
    totalDuration += e.duration ?? 0;
    totalCalories += e.calories ?? 0;
    totalSteps += e.steps ?? 0;
  }

  return NextResponse.json({
    date: iso,
    entries,
    totals: { totalDuration, totalCalories, totalSteps },
  });
}

export async function POST(request: NextRequest) {
  const ctx = await requireClientProfile();
  if ("error" in ctx) return ctx.error;

  const body = await request.json();
  const {
    date: dateStr,
    sportType,
    duration,
    calories,
    steps,
    distance,
    details,
    notes,
  } = body;

  if (!dateStr || !SPORT_TYPES.includes(sportType)) {
    return NextResponse.json(
      { message: "date et sportType requis" },
      { status: 400 }
    );
  }

  const day = calendarIsoToPrismaDate(dateStr);

  let detailsJson: Prisma.InputJsonValue | undefined;
  if (details !== undefined && details !== null) {
    detailsJson = details as Prisma.InputJsonValue;
  }

  const row = await prisma.sportEntry.create({
    data: {
      clientId: ctx.client.id,
      date: day,
      sportType,
      duration:
        duration === undefined || duration === null
          ? null
          : Number(duration),
      calories:
        calories === undefined || calories === null
          ? null
          : Number(calories),
      steps: steps === undefined || steps === null ? null : Number(steps),
      distance:
        distance === undefined || distance === null
          ? null
          : Number(distance),
      details: detailsJson,
      notes: typeof notes === "string" ? notes : null,
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

  const existing = await prisma.sportEntry.findFirst({
    where: { id, clientId: ctx.client.id },
  });
  if (!existing) {
    return NextResponse.json({ message: "Entrée introuvable" }, { status: 404 });
  }

  await prisma.sportEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
