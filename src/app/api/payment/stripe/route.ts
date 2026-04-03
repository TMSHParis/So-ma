import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Bilan + Suivi personnalisé",
              description:
                "Accompagnement nutritionnel complet : bilan, programmes alimentaire et sportif, fiches pratiques et ebook de recettes.",
            },
            unit_amount: 12900, // 129.00 EUR in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/paiement-confirme?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/suivi-nutritionnel#offre`,
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Impossible de créer la session de paiement." },
      { status: 500 },
    );
  }
}
