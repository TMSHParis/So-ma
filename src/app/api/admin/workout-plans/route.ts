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

export async function GET(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const clientId = request.nextUrl.searchParams.get("clientId");

  const plans = await prisma.workoutPlan.findMany({
    where: clientId ? { clientId } : undefined,
    include: { client: { include: { user: { select: { firstName: true, lastName: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(plans);
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { clientIds, title, description, content, fileUrl, fileName } = await request.json();

  const ids: string[] = Array.isArray(clientIds) ? clientIds.filter(Boolean) : [];

  if (ids.length === 0 || !title) {
    return NextResponse.json({ message: "clientIds (au moins 1) et title requis" }, { status: 400 });
  }

  const plans = await prisma.$transaction(
    ids.map((clientId) =>
      prisma.workoutPlan.create({
        data: {
          clientId,
          title,
          description: description || null,
          content: content || {},
          fileUrl: fileUrl || null,
          fileName: fileName || null,
          createdById: user.id!,
        },
      })
    )
  );

  return NextResponse.json({ count: plans.length, plans });
}

export async function DELETE(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "id requis" }, { status: 400 });

  await prisma.workoutPlan.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
