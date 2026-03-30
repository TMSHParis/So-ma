import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireClientProfile } from "@/lib/client-session";
import type { EnergyBalance } from "@/generated/prisma/client";

function syncGoalCaloriesFromMaintenance(
  maintenance: number | null,
  balance: EnergyBalance | null,
  delta: number
): number | null {
  if (maintenance == null) return null;
  if (balance === "MAINTENANCE" || balance == null) return maintenance;
  return maintenance + delta;
}

export async function GET() {
  const ctx = await requireClientProfile();
  if ("error" in ctx) return ctx.error;

  const user = await prisma.user.findUnique({
    where: { id: ctx.userId },
    select: { email: true, firstName: true, lastName: true },
  });

  const c = ctx.client;
  return NextResponse.json({
    email: user?.email,
    firstName: user?.firstName,
    lastName: user?.lastName,
    goalCalories: c.goalCalories,
    goalProtein: c.goalProtein,
    goalCarbs: c.goalCarbs,
    goalFat: c.goalFat,
    goalFiber: c.goalFiber,
    maintenanceCalories: c.maintenanceCalories,
    energyBalance: c.energyBalance,
    caloricDeltaKcal: c.caloricDeltaKcal,
    weight: c.weight,
    height: c.height,
    birthDate: c.birthDate?.toISOString() ?? null,
  });
}

export async function PATCH(request: NextRequest) {
  const ctx = await requireClientProfile();
  if ("error" in ctx) return ctx.error;

  const body = await request.json().catch(() => ({}));
  const {
    goalCalories,
    goalProtein,
    goalCarbs,
    goalFat,
    goalFiber,
    maintenanceCalories,
    energyBalance,
    caloricDeltaKcal,
    weight,
    height,
  } = body as Record<string, unknown>;

  const nextMaintenance =
    maintenanceCalories === undefined
      ? ctx.client.maintenanceCalories
      : maintenanceCalories === null
        ? null
        : Number(maintenanceCalories);

  const nextBalance =
    energyBalance === undefined
      ? ctx.client.energyBalance
      : (energyBalance as EnergyBalance | null);

  const nextDelta =
    caloricDeltaKcal === undefined
      ? ctx.client.caloricDeltaKcal
      : Number(caloricDeltaKcal);

  const data: Parameters<typeof prisma.client.update>[0]["data"] = {};

  const touchedEnergy =
    maintenanceCalories !== undefined ||
    energyBalance !== undefined ||
    caloricDeltaKcal !== undefined;

  if (goalProtein !== undefined) data.goalProtein = goalProtein == null ? null : Number(goalProtein);
  if (goalCarbs !== undefined) data.goalCarbs = goalCarbs == null ? null : Number(goalCarbs);
  if (goalFat !== undefined) data.goalFat = goalFat == null ? null : Number(goalFat);
  if (goalFiber !== undefined) data.goalFiber = goalFiber == null ? null : Number(goalFiber);
  if (maintenanceCalories !== undefined) data.maintenanceCalories = nextMaintenance;
  if (energyBalance !== undefined) data.energyBalance = nextBalance;
  if (caloricDeltaKcal !== undefined) data.caloricDeltaKcal = nextDelta;
  if (weight !== undefined) {
    const w = Number(weight);
    data.weight =
      weight === null || weight === "" || !Number.isFinite(w) ? null : w;
  }
  if (height !== undefined) {
    const h = Number(height);
    data.height =
      height === null || height === "" || !Number.isFinite(h) ? null : h;
  }

  if (touchedEnergy && nextMaintenance != null) {
    const computedGoal = syncGoalCaloriesFromMaintenance(
      nextMaintenance,
      nextBalance,
      nextDelta
    );
    if (computedGoal != null) data.goalCalories = computedGoal;
  } else if (goalCalories !== undefined) {
    data.goalCalories =
      goalCalories == null ? null : Number(goalCalories);
  }

  const updated = await prisma.client.update({
    where: { id: ctx.client.id },
    data,
  });

  return NextResponse.json({
    goalCalories: updated.goalCalories,
    goalProtein: updated.goalProtein,
    goalCarbs: updated.goalCarbs,
    goalFat: updated.goalFat,
    goalFiber: updated.goalFiber,
    maintenanceCalories: updated.maintenanceCalories,
    energyBalance: updated.energyBalance,
    caloricDeltaKcal: updated.caloricDeltaKcal,
    weight: updated.weight,
    height: updated.height,
  });
}
