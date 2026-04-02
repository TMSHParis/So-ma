import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    await prisma.payment.create({
      data: {
        email: session.customer_email || session.metadata?.clientEmail || "",
        name: session.metadata?.clientName || null,
        amount: (session.amount_total || 0) / 100,
        currency: (session.currency || "eur").toUpperCase(),
        provider: "STRIPE",
        providerId: session.id,
        status: "COMPLETED",
      },
    });
  }

  return NextResponse.json({ received: true });
}
