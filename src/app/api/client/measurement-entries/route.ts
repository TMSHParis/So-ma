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

  const entries = await prisma.measurementEntry.findMany({
    where: { clientId: client.id },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(entries);
}

export async function POST(req: Request) {
  const client = await getClient();
  if (!client) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { date, waistCm, hipCm, buttCm } = await req.json();

  const entry = await prisma.measurementEntry.create({
    data: {
      clientId: client.id,
      date: new Date(date),
      waistCm: waistCm != null ? Number(waistCm) : null,
      hipCm: hipCm != null ? Number(hipCm) : null,
      buttCm: buttCm != null ? Number(buttCm) : null,
    },
  });
  return NextResponse.json(entry);
}
