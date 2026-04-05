import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/post-payment/test?email=test@example.com&name=Test
 *
 * Simule un paiement réussi : crée un Payment + BilanToken et redirige
 * vers le formulaire bilan. À supprimer en production.
 */
export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL || req.nextUrl.origin;
  const email = req.nextUrl.searchParams.get("email") || "test@test.com";
  const name = req.nextUrl.searchParams.get("name") || "Test Cliente";

  try {
    // Créer un paiement fictif
    await prisma.payment.create({
      data: {
        email,
        name,
        amount: 129,
        currency: "EUR",
        provider: "STRIPE",
        providerId: `test_${Date.now()}`,
        status: "COMPLETED",
      },
    });

    // Créer le bilan token
    const bilanToken = await prisma.bilanToken.create({
      data: {
        email,
        name,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.redirect(`${baseUrl}/bilan/${bilanToken.token}`, 303);
  } catch (error) {
    console.error("Test payment error:", error);
    return NextResponse.redirect(`${baseUrl}/suivi-nutritionnel?error=1`, 303);
  }
}
