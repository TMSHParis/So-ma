import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireClientProfile } from "@/lib/client-session";

export async function GET() {
  const ctx = await requireClientProfile();
  if ("error" in ctx) return ctx.error;

  // Only return resources assigned to this client
  const assignments = await prisma.clientResource.findMany({
    where: { clientId: ctx.client.id },
    include: { resource: true },
    orderBy: { resource: { createdAt: "desc" } },
  });

  return NextResponse.json(assignments.map((a) => a.resource));
}
