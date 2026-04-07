import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendAdminBilanNotification } from "@/lib/email";
import { auth } from "@/lib/auth";

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

    // Link to client if logged in
    let clientId: string | null = null;
    try {
      const session = await auth();
      if (session?.user) {
        const client = await prisma.client.findUnique({
          where: { userId: (session.user as { id: string }).id },
        });
        if (client) clientId = client.id;
      }
    } catch {}

    // Save response and mark token as used
    await prisma.$transaction([
      prisma.bilanResponse.create({
        data: {
          tokenId: bilanToken.id,
          clientId,
          data,
        },
      }),
      prisma.bilanToken.update({
        where: { id: bilanToken.id },
        data: { used: true },
      }),
    ]);

    // Send email notification to admin (non-blocking — don't fail the request)
    try {
      const name = [data.prenom, data.nom].filter(Boolean).join(" ") || "Inconnu";
      await sendAdminBilanNotification({
        name,
        email: data.email || "non renseigné",
        submittedAt: new Date(),
      });
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting bilan:", error);
    return NextResponse.json(
      { message: "Erreur interne" },
      { status: 500 }
    );
  }
}
