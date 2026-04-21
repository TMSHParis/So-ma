import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireClientProfile } from "@/lib/client-session";
import {
  calendarDateInTimeZone,
  calendarIsoToPrismaDate,
  CLIENT_TIMEZONE,
} from "@/lib/calendar-day";
import type { CyclePhase, FlowIntensity, BloodColor } from "@/generated/prisma/client";

const CYCLE_PHASES: CyclePhase[] = [
  "MENSTRUATION",
  "FOLLICULAIRE",
  "OVULATION",
  "LUTEALE",
];

const FLOW_INTENSITIES: FlowIntensity[] = ["LEGER", "MOYEN", "ABONDANT"];

const BLOOD_COLORS: BloodColor[] = [
  "ROUGE_VIF",
  "POURPRE",
  "MARRON_CLAIR",
  "MARRON_FONCE",
  "NOIR",
];

export async function GET(request: NextRequest) {
  const ctx = await requireClientProfile();
  if ("error" in ctx) return ctx.error;

  const dateParam = request.nextUrl.searchParams.get("date");
  const rangeParam = request.nextUrl.searchParams.get("range");

  // Si range=month, retourne les 60 derniers jours pour afficher le calendrier
  if (rangeParam === "month") {
    const now = new Date();
    const sixtyDaysAgo = new Date(now);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const entries = await prisma.cycleEntry.findMany({
      where: {
        clientId: ctx.client.id,
        date: { gte: sixtyDaysAgo },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ entries });
  }

  // Sinon retourne l'entrée du jour demandé
  const iso =
    dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)
      ? dateParam
      : calendarDateInTimeZone(CLIENT_TIMEZONE);

  const day = calendarIsoToPrismaDate(iso);

  const entry = await prisma.cycleEntry.findFirst({
    where: { clientId: ctx.client.id, date: day },
  });

  return NextResponse.json({ date: iso, entry });
}

export async function POST(request: NextRequest) {
  const ctx = await requireClientProfile();
  if ("error" in ctx) return ctx.error;

  const body = await request.json();
  const { date: dateStr, phase, flowIntensity, bloodColor, symptoms, notes } = body;

  if (!dateStr || !CYCLE_PHASES.includes(phase)) {
    return NextResponse.json(
      { message: "date et phase requis" },
      { status: 400 }
    );
  }

  if (flowIntensity && !FLOW_INTENSITIES.includes(flowIntensity)) {
    return NextResponse.json(
      { message: "Intensité de flux invalide" },
      { status: 400 }
    );
  }

  if (bloodColor && !BLOOD_COLORS.includes(bloodColor)) {
    return NextResponse.json(
      { message: "Couleur du sang invalide" },
      { status: 400 }
    );
  }

  const day = calendarIsoToPrismaDate(dateStr);

  // Flux et couleur du sang n'ont de sens qu'en phase menstruelle.
  const menstrualOnly = phase === "MENSTRUATION";
  const nextFlow = menstrualOnly ? flowIntensity || null : null;
  const nextColor = menstrualOnly ? bloodColor || null : null;

  // Upsert : un seul enregistrement par jour
  const existing = await prisma.cycleEntry.findFirst({
    where: { clientId: ctx.client.id, date: day },
  });

  if (existing) {
    const updated = await prisma.cycleEntry.update({
      where: { id: existing.id },
      data: {
        phase,
        flowIntensity: nextFlow,
        bloodColor: nextColor,
        symptoms: Array.isArray(symptoms) ? symptoms : [],
        notes: typeof notes === "string" ? notes : null,
      },
    });
    return NextResponse.json(updated);
  }

  const row = await prisma.cycleEntry.create({
    data: {
      clientId: ctx.client.id,
      date: day,
      phase,
      flowIntensity: nextFlow,
      bloodColor: nextColor,
      symptoms: Array.isArray(symptoms) ? symptoms : [],
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

  const existing = await prisma.cycleEntry.findFirst({
    where: { id, clientId: ctx.client.id },
  });
  if (!existing) {
    return NextResponse.json({ message: "Entrée introuvable" }, { status: 404 });
  }

  await prisma.cycleEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
