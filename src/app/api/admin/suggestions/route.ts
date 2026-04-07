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

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const suggestions = await prisma.foodSuggestion.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      client: {
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
        },
      },
    },
  });

  return NextResponse.json({ suggestions });
}

export async function DELETE(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "id requis" }, { status: 400 });

  await prisma.foodSuggestion.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
