import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendClientProfileUpdated } from "@/lib/email";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ clientId: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { clientId } = await params;

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      user: { select: { email: true, firstName: true, lastName: true } },
      bilanResponses: {
        orderBy: { submittedAt: "desc" },
        take: 1,
        select: { id: true, data: true, submittedAt: true },
      },
    },
  });
  if (!client) return NextResponse.json({ error: "Cliente introuvable" }, { status: 404 });

  return NextResponse.json(client);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ clientId: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { clientId } = await params;
  const body = await req.json();

  const data: Record<string, unknown> = {};

  const numFields = [
    "weight", "height", "goalCalories", "goalProtein", "goalCarbs", "goalFat",
    "goalFiber", "maintenanceCalories", "caloricDeltaKcal", "goalWaterL",
    "goalSteps", "sessionsPerWeek", "startWeight", "goalWeight",
    "waistCm", "hipCm", "thighCm", "buttCm",
    "stressFactor",
  ];

  for (const field of numFields) {
    if (body[field] !== undefined) {
      const v = Number(body[field]);
      data[field] = body[field] === null || body[field] === "" || !Number.isFinite(v) ? null : v;
    }
  }

  if (body.energyBalance !== undefined) data.energyBalance = body.energyBalance;
  if (body.sex !== undefined) data.sex = body.sex;
  if (body.sessionTypes !== undefined) data.sessionTypes = body.sessionTypes;
  if (body.birthDate !== undefined) {
    data.birthDate = body.birthDate ? new Date(body.birthDate) : null;
  }
  if (body.age !== undefined) {
    data.age = body.age === null ? null : Number(body.age);
  }
  if (body.napActivities !== undefined) data.napActivities = body.napActivities;

  // Auto-compute goalCalories from maintenance + delta
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) return NextResponse.json({ error: "Cliente introuvable" }, { status: 404 });

  const maintenance = (data.maintenanceCalories ?? client.maintenanceCalories) as number | null;
  const balance = (data.energyBalance ?? client.energyBalance) as string | null;
  const delta = (data.caloricDeltaKcal ?? client.caloricDeltaKcal) as number;

  if (maintenance != null) {
    if (balance === "MAINTENANCE" || !balance) data.goalCalories = maintenance;
    else data.goalCalories = maintenance + delta;
  }

  const updated = await prisma.client.update({ where: { id: clientId }, data });

  // Notify client by email
  const user = await prisma.user.findUnique({
    where: { id: client.userId },
    select: { email: true, firstName: true },
  });
  if (user?.email) {
    sendClientProfileUpdated({
      to: user.email,
      firstName: user.firstName || "Cliente",
    }).catch(() => {});
  }

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ clientId: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { clientId } = await params;

  const client = await prisma.client.findUnique({ where: { id: clientId }, select: { userId: true } });
  if (!client) return NextResponse.json({ error: "Cliente introuvable" }, { status: 404 });

  // Delete user (cascades to client + all related entries)
  await prisma.user.delete({ where: { id: client.userId } });

  return NextResponse.json({ ok: true });
}
