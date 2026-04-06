import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
    return null;
  }
  return session.user;
}

// GET — liste des assignations pour une ressource
export async function GET(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const resourceId = request.nextUrl.searchParams.get("resourceId");
  if (!resourceId) return NextResponse.json({ message: "resourceId requis" }, { status: 400 });

  const assignments = await prisma.resourceAssignment.findMany({
    where: { resourceId },
    include: { client: { include: { user: { select: { firstName: true, lastName: true, email: true } } } } },
  });

  return NextResponse.json(assignments);
}

// POST — assigner une ressource à des clientes
export async function POST(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { resourceId, clientIds } = await request.json() as { resourceId: string; clientIds: string[] };

  if (!resourceId || !clientIds?.length) {
    return NextResponse.json({ message: "resourceId et clientIds requis" }, { status: 400 });
  }

  // Upsert : on ignore les doublons
  await prisma.resourceAssignment.createMany({
    data: clientIds.map((clientId) => ({ resourceId, clientId })),
    skipDuplicates: true,
  });

  return NextResponse.json({ ok: true });
}

// DELETE — retirer l'assignation
export async function DELETE(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const resourceId = request.nextUrl.searchParams.get("resourceId");
  const clientId = request.nextUrl.searchParams.get("clientId");

  if (!resourceId || !clientId) {
    return NextResponse.json({ message: "resourceId et clientId requis" }, { status: 400 });
  }

  await prisma.resourceAssignment.deleteMany({
    where: { resourceId, clientId },
  });

  return NextResponse.json({ ok: true });
}
