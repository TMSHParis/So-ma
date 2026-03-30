import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireClientProfile } from "@/lib/client-session";

export async function GET() {
  const ctx = await requireClientProfile();
  if ("error" in ctx) return ctx.error;

  const plans = await prisma.mealPlan.findMany({
    where: { clientId: ctx.client.id, active: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(plans);
}
