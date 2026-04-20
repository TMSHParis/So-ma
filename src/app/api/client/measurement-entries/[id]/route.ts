import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function getClient() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.client.findUnique({ where: { userId: session.user.id } });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const client = await getClient();
  if (!client) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;

  const existing = await prisma.measurementEntry.findUnique({ where: { id } });
  if (!existing || existing.clientId !== client.id) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  const { date, waistCm, hipCm, buttCm } = await req.json();
  const entry = await prisma.measurementEntry.update({
    where: { id },
    data: {
      ...(date !== undefined && { date: new Date(date) }),
      ...(waistCm !== undefined && { waistCm: waistCm === null ? null : Number(waistCm) }),
      ...(hipCm !== undefined && { hipCm: hipCm === null ? null : Number(hipCm) }),
      ...(buttCm !== undefined && { buttCm: buttCm === null ? null : Number(buttCm) }),
    },
  });
  return NextResponse.json(entry);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const client = await getClient();
  if (!client) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;

  const existing = await prisma.measurementEntry.findUnique({ where: { id } });
  if (!existing || existing.clientId !== client.id) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  await prisma.measurementEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
