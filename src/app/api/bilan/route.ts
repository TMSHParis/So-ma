import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { token, data } = await request.json();

    if (!token || !data) {
      return NextResponse.json(
        { message: "Token et données requis" },
        { status: 400 }
      );
    }

    // Verify token exists and is valid
    const bilanToken = await prisma.bilanToken.findUnique({
      where: { token },
    });

    if (!bilanToken) {
      return NextResponse.json(
        { message: "Lien invalide" },
        { status: 404 }
      );
    }

    if (bilanToken.used) {
      return NextResponse.json(
        { message: "Ce formulaire a déjà été rempli" },
        { status: 400 }
      );
    }

    if (new Date() > bilanToken.expiresAt) {
      return NextResponse.json(
        { message: "Ce lien a expiré" },
        { status: 400 }
      );
    }

    // Save response and mark token as used
    await prisma.$transaction([
      prisma.bilanResponse.create({
        data: {
          tokenId: bilanToken.id,
          data,
        },
      }),
      prisma.bilanToken.update({
        where: { id: bilanToken.id },
        data: { used: true },
      }),
    ]);

    // TODO: Send email notification to admin with Resend

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting bilan:", error);
    return NextResponse.json(
      { message: "Erreur interne" },
      { status: 500 }
    );
  }
}
