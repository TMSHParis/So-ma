import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function getClient() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.client.findUnique({ where: { userId: session.user.id } });
}

export async function GET() {
  const client = await getClient();
  if (!client) return NextResponse.json([], { status: 401 });

  const entries = await prisma.weightEntry.findMany({
    where: { clientId: client.id },
    orderBy: { date: "asc" },
  });
  return NextResponse.json(entries);
}

export async function POST(req: Request) {
  const client = await getClient();
  if (!client) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { date, weight } = await req.json();
  const d = new Date(date);

  const entry = await prisma.weightEntry.upsert({
    where: { clientId_date: { clientId: client.id, date: d } },
    update: { weight: Number(weight) },
    create: { clientId: client.id, date: d, weight: Number(weight) },
  });
  return NextResponse.json(entry);
}
