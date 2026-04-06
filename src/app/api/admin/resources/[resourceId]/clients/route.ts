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

// GET: list assigned client IDs for a resource
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { resourceId } = await params;

  const assignments = await prisma.clientResource.findMany({
    where: { resourceId },
    select: { clientId: true },
  });

  return NextResponse.json(assignments.map((a) => a.clientId));
}

// PUT: replace all assignments for a resource
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { resourceId } = await params;
  const { clientIds } = (await request.json()) as { clientIds: string[] };

  if (!Array.isArray(clientIds)) {
    return NextResponse.json({ message: "clientIds requis" }, { status: 400 });
  }

  // Delete existing, then create new assignments
  await prisma.$transaction([
    prisma.clientResource.deleteMany({ where: { resourceId } }),
    ...clientIds.map((clientId) =>
      prisma.clientResource.create({
        data: { clientId, resourceId },
      })
    ),
  ]);

  return NextResponse.json({ ok: true });
}
