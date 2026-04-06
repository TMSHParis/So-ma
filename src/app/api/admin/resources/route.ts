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

  const resources = await prisma.resource.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      clients: {
        include: {
          client: {
            include: { user: { select: { firstName: true, lastName: true, email: true } } },
          },
        },
      },
    },
  });

  return NextResponse.json(resources);
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { title, category, content, fileUrl, fileName } = await request.json();

  if (!title || !category) {
    return NextResponse.json({ message: "title et category requis" }, { status: 400 });
  }

  const resource = await prisma.resource.create({
    data: {
      title,
      category,
      content: content || null,
      fileUrl: fileUrl || null,
      fileName: fileName || null,
      createdBy: user.id!,
    },
  });

  return NextResponse.json(resource);
}

export async function DELETE(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "id requis" }, { status: 400 });

  await prisma.resource.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
