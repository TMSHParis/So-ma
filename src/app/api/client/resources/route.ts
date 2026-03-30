import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireClientProfile } from "@/lib/client-session";

export async function GET() {
  const ctx = await requireClientProfile();
  if ("error" in ctx) return ctx.error;

  const resources = await prisma.resource.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(resources);
}
