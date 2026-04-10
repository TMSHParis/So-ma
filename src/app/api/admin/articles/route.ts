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

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(articles);
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { title, slug, excerpt, category, date, imageUrl, content, published } =
      await request.json();

    if (!title || !slug || !excerpt || !category || !date || !content) {
      return NextResponse.json(
        { message: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }

    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { message: "Un article avec ce slug existe déjà" },
        { status: 409 }
      );
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        category,
        date,
        imageUrl: imageUrl || null,
        content,
        published: published ?? true,
      },
    });

    return NextResponse.json(article);
  } catch (err) {
    console.error("[POST /api/admin/articles] error:", err);
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id, ...fields } = await request.json();
    if (!id) return NextResponse.json({ message: "id requis" }, { status: 400 });

    const data: Record<string, unknown> = {};
    for (const key of ["title", "slug", "excerpt", "category", "date", "imageUrl", "content", "published"]) {
      if (fields[key] !== undefined) {
        data[key] = fields[key];
      }
    }

    if (data.slug) {
      const existing = await prisma.article.findFirst({
        where: { slug: data.slug as string, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json(
          { message: "Un article avec ce slug existe déjà" },
          { status: 409 }
        );
      }
    }

    const article = await prisma.article.update({
      where: { id },
      data,
    });

    return NextResponse.json(article);
  } catch (err) {
    console.error("[PATCH /api/admin/articles] error:", err);
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "id requis" }, { status: 400 });

  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
