import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireClientProfile } from "@/lib/client-session";

export async function GET() {
  const ctx = await requireClientProfile();
  if ("error" in ctx) return ctx.error;

  const recipes = await prisma.recipe.findMany({
    where: { clientId: ctx.client.id },
    include: { items: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ recipes });
}

export async function POST(request: NextRequest) {
  const ctx = await requireClientProfile();
  if ("error" in ctx) return ctx.error;

  const body = await request.json();
  const { name, items } = body as {
    name: string;
    items: {
      foodName: string;
      quantity: number;
      unit?: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    }[];
  };

  if (!name?.trim() || !items?.length) {
    return NextResponse.json(
      { message: "name et items requis" },
      { status: 400 }
    );
  }

  const recipe = await prisma.recipe.create({
    data: {
      clientId: ctx.client.id,
      name: name.trim(),
      items: {
        create: items.map((it) => ({
          foodName: it.foodName,
          quantity: Number(it.quantity) || 0,
          unit: it.unit || "g",
          calories: Number(it.calories) || 0,
          protein: Number(it.protein) || 0,
          carbs: Number(it.carbs) || 0,
          fat: Number(it.fat) || 0,
          fiber: Number(it.fiber) || 0,
        })),
      },
    },
    include: { items: true },
  });

  return NextResponse.json(recipe);
}

export async function DELETE(request: NextRequest) {
  const ctx = await requireClientProfile();
  if ("error" in ctx) return ctx.error;

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "id requis" }, { status: 400 });
  }

  const existing = await prisma.recipe.findFirst({
    where: { id, clientId: ctx.client.id },
  });
  if (!existing) {
    return NextResponse.json({ message: "Recette introuvable" }, { status: 404 });
  }

  await prisma.recipe.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
