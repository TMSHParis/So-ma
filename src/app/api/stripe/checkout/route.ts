import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { email, name, amount, description } = await request.json();

    if (!email || !amount) {
      return NextResponse.json({ message: "Email et montant requis" }, { status: 400 });
    }

    const origin = request.nextUrl.origin;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(amount * 100), // cents
            product_data: {
              name: description || "Accompagnement So-Ma",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        clientEmail: email,
        clientName: name || "",
      },
      success_url: `${origin}/admin/paiements?success=1`,
      cancel_url: `${origin}/admin/paiements?cancelled=1`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ message: "Erreur Stripe" }, { status: 500 });
  }
}
