import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL || req.nextUrl.origin;
  const provider = req.nextUrl.searchParams.get("provider");

  let email: string | null = null;
  let name: string | null = null;

  try {
    if (provider === "stripe") {
      const sessionId = req.nextUrl.searchParams.get("session_id");
      if (!sessionId) {
        return NextResponse.redirect(`${baseUrl}/suivi-nutritionnel?error=1`, 303);
      }

      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== "paid") {
        return NextResponse.redirect(`${baseUrl}/suivi-nutritionnel?error=1`, 303);
      }

      email = session.customer_details?.email ?? session.customer_email ?? null;
      name = session.customer_details?.name ?? null;

      // Record the payment
      await prisma.payment.create({
        data: {
          email: email ?? "",
          name,
          amount: (session.amount_total ?? 12900) / 100,
          currency: (session.currency ?? "eur").toLowerCase(),
          provider: "STRIPE",
          providerId: sessionId,
          status: "COMPLETED",
        },
      });
    } else if (provider === "paypal") {
      email = req.nextUrl.searchParams.get("email");
      name = req.nextUrl.searchParams.get("name") || null;
    } else {
      return NextResponse.redirect(`${baseUrl}/suivi-nutritionnel?error=1`, 303);
    }

    // Create a BilanToken with 30-day expiry
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const bilanToken = await prisma.bilanToken.create({
      data: {
        email,
        name,
        expiresAt,
      },
    });

    return NextResponse.redirect(`${baseUrl}/bilan/${bilanToken.token}`, 303);
  } catch (err) {
    console.error("Post-payment redirect error:", err);
    return NextResponse.redirect(`${baseUrl}/suivi-nutritionnel?error=1`, 303);
  }
}
