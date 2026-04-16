import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireClientProfile } from "@/lib/client-session";
import {
  calendarDateInTimeZone,
  calendarIsoToPrismaDate,
  CLIENT_TIMEZONE,
} from "@/lib/calendar-day";

/** GET — eau du jour en litres */
export async function GET(request: NextRequest) {
  const ctx = await requireClientProfile();
  if ("error" in ctx) return ctx.error;

  const dateParam = request.nextUrl.searchParams.get("date");
  const iso =
    dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)
      ? dateParam
      : calendarDateInTimeZone(CLIENT_TIMEZONE);

  const day = calendarIsoToPrismaDate(iso);

  const entry = await prisma.waterEntry.findUnique({
    where: {
      clientId_date: { clientId: ctx.client.id, date: day },
    },
  });

  return NextResponse.json({
    date: iso,
    totalMl: entry ? Math.round(entry.liters * 1000) : 0,
  });
}

/** POST — ajouter ou retirer des mL (delta positif ou négatif) */
export async function POST(request: NextRequest) {
  const ctx = await requireClientProfile();
  if ("error" in ctx) return ctx.error;

  const body = await request.json();
  const { date: dateStr, amountMl } = body;

  if (!dateStr || typeof amountMl !== "number" || amountMl === 0) {
    return NextResponse.json(
      { message: "date et amountMl requis (non nul)" },
      { status: 400 }
    );
  }

  const day = calendarIsoToPrismaDate(dateStr);
  const deltaL = amountMl / 1000;

  // Lire l'existant
  const existing = await prisma.waterEntry.findUnique({
    where: { clientId_date: { clientId: ctx.client.id, date: day } },
  });

  const currentL = existing?.liters ?? 0;
  const newL = Math.max(0, Math.round((currentL + deltaL) * 100) / 100);

  if (newL === 0 && existing) {
    await prisma.waterEntry.delete({ where: { id: existing.id } });
    return NextResponse.json({ totalMl: 0 });
  }

  if (existing) {
    await prisma.waterEntry.update({
      where: { id: existing.id },
      data: { liters: newL },
    });
  } else if (newL > 0) {
    await prisma.waterEntry.create({
      data: { clientId: ctx.client.id, date: day, liters: newL },
    });
  }

  return NextResponse.json({ totalMl: Math.round(newL * 1000) });
}
