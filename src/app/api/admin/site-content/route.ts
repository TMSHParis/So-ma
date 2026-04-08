import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DEFAULT_CONTENT, seedContent } from "@/lib/site-content";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    // Seed si la table est vide
    await seedContent();

    const content = await prisma.siteContent.findMany({
      orderBy: [{ section: "asc" }, { position: "asc" }],
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error("GET /api/admin/site-content error:", error);
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { items } = (await request.json()) as {
      items: { section: string; key: string; value: string }[];
    };

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { message: "Format invalide" },
        { status: 400 }
      );
    }

    // Upsert chaque élément
    await Promise.all(
      items.map((item) => {
        const def = DEFAULT_CONTENT.find(
          (d) => d.section === item.section && d.key === item.key
        );
        return prisma.siteContent.upsert({
          where: {
            section_key: { section: item.section, key: item.key },
          },
          update: { value: item.value },
          create: {
            section: item.section,
            key: item.key,
            value: item.value,
            type: def?.type ?? "text",
            label: def?.label ?? item.key,
            position: def?.position ?? 0,
          },
        });
      })
    );

    return NextResponse.json({ message: "Contenu mis à jour" });
  } catch (error) {
    console.error("PUT /api/admin/site-content error:", error);
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
