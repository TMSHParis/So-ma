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

  const plans = await prisma.mealPlan.findMany({
    where: clientId ? { clientId } : undefined,
    include: { client: { include: { user: { select: { firstName: true, lastName: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(plans);
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { clientId, title, description, content } = await request.json();

  if (!clientId || !title || !content) {
    return NextResponse.json({ message: "clientId, title et content requis" }, { status: 400 });
  }

  const plan = await prisma.mealPlan.create({
    data: {
      clientId,
      title,
      description: description || null,
      content,
      createdById: user.id!,
    },
  });

  return NextResponse.json(plan);
}

export async function PATCH(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { id, title, description, content, active } = await request.json();
  if (!id) return NextResponse.json({ message: "id requis" }, { status: 400 });

  const plan = await prisma.mealPlan.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(content !== undefined && { content }),
      ...(active !== undefined && { active }),
    },
  });

  return NextResponse.json(plan);
}

export async function DELETE(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "id requis" }, { status: 400 });

  await prisma.mealPlan.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
