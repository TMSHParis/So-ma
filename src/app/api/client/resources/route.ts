import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireClientProfile } from "@/lib/client-session";

export async function GET() {
  const ctx = await requireClientProfile();
  if ("error" in ctx) return ctx.error;

  // Ne retourner que les ressources assignées à cette cliente
  const resources = await prisma.resource.findMany({
    where: {
      assignments: { some: { clientId: ctx.client.id } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(resources);
}
