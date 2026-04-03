import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const PAYPAL_API = process.env.NODE_ENV === "production"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return data.access_token as string;
}

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${baseUrl}/suivi-nutritionnel#offre`, 303);
  }

  try {
    const accessToken = await getAccessToken();

    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const capture = await res.json();

    if (capture.status === "COMPLETED") {
      const payer = capture.payer;
      const amount = capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount;

      await prisma.payment.create({
        data: {
          email: payer?.email_address ?? "",
          name: payer?.name ? `${payer.name.given_name} ${payer.name.surname}` : null,
          amount: parseFloat(amount?.value ?? "129"),
          currency: (amount?.currency_code ?? "EUR").toLowerCase(),
          provider: "PAYPAL",
          providerId: token,
          status: "COMPLETED",
        },
      });

      return NextResponse.redirect(`${baseUrl}/paiement-confirme`, 303);
    }

    console.error("PayPal capture failed:", capture);
    return NextResponse.redirect(`${baseUrl}/suivi-nutritionnel#offre`, 303);
  } catch (err) {
    console.error("PayPal capture error:", err);
    return NextResponse.redirect(`${baseUrl}/suivi-nutritionnel#offre`, 303);
  }
}
