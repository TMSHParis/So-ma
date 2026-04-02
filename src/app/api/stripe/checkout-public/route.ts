import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: 12900, // 129€
            product_data: {
              name: "Bilan + Suivi personnalisé So-Ma",
              description: "Bilan complet, programmes alimentaire et sportif, fiches pratiques, ebook recettes saines",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/suivi-nutritionnel?success=1`,
      cancel_url: `${origin}/suivi-nutritionnel?cancelled=1`,
    });

    if (!checkoutSession.url) {
      return NextResponse.json({ error: "Erreur Stripe" }, { status: 500 });
    }

    return NextResponse.redirect(checkoutSession.url);
  } catch (error) {
    console.error("Stripe public checkout error:", error);
    return NextResponse.redirect(new URL("/suivi-nutritionnel?error=1", request.url));
  }
}
