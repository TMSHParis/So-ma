import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> },
) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { tokenId } = await params;

  const token = await prisma.bilanToken.findUnique({
    where: { id: tokenId },
    include: { response: true },
  });

  if (!token) {
    return NextResponse.json({ error: "Token introuvable" }, { status: 404 });
  }

  return NextResponse.json(token);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> },
) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { tokenId } = await params;

  // Supprime la réponse associée d'abord (FK), puis le token
  await prisma.bilanResponse.deleteMany({ where: { tokenId } });
  await prisma.bilanToken.delete({ where: { id: tokenId } });

  return NextResponse.json({ success: true });
}
