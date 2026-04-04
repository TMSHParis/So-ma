import { NextResponse } from "next/server";

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
  if (!data.access_token) {
    console.error("PayPal auth failed:", JSON.stringify(data));
    throw new Error(`PayPal auth failed: ${data.error_description || data.error || "unknown"}`);
  }
  return data.access_token as string;
}

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
    const accessToken = await getAccessToken();

    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "EUR",
              value: "129.00",
            },
            description: "Bilan + Suivi personnalisé",
          },
        ],
        application_context: {
          brand_name: "So Ma",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
          return_url: `${baseUrl}/api/payment/paypal/capture`,
          cancel_url: `${baseUrl}/suivi-nutritionnel#offre`,
        },
      }),
    });

    const order = await res.json();
    const approveLink = order.links?.find(
      (l: { rel: string; href: string }) => l.rel === "approve",
    );

    if (!approveLink) {
      console.error("PayPal order error:", JSON.stringify(order));
      return NextResponse.json(
        { error: "Impossible de créer la commande PayPal.", details: order },
        { status: 500 },
      );
    }

    return NextResponse.redirect(approveLink.href, 303);
  } catch (err) {
    console.error("PayPal checkout error:", err);
    return NextResponse.json(
      { error: "Impossible de créer la session de paiement." },
      { status: 500 },
    );
  }
}
