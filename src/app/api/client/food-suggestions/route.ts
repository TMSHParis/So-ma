import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireClientProfile } from "@/lib/client-session";

export async function POST(request: NextRequest) {
  const ctx = await requireClientProfile();
  if ("error" in ctx) return ctx.error;

  const { text } = await request.json();

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json(
      { message: "Texte requis" },
      { status: 400 }
    );
  }

  const suggestion = await prisma.foodSuggestion.create({
    data: {
      clientId: ctx.client.id,
      text: text.trim(),
    },
  });

  return NextResponse.json(suggestion);
}
