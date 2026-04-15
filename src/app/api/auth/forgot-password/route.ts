import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1h

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: NextRequest) {
  let body: { email?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  // Réponse identique quoi qu'il arrive (éviter l'énumération de comptes).
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: expiresAt,
      },
    });

    const baseUrl =
      process.env.NEXTAUTH_URL ?? request.nextUrl.origin;
    const resetUrl = `${baseUrl}/reinitialiser-mot-de-passe/${token}`;

    try {
      await sendPasswordResetEmail({
        to: user.email,
        firstName: user.firstName,
        resetUrl,
      });
    } catch (err) {
      console.error("[forgot-password] échec envoi email :", err);
    }
  }

  return NextResponse.json({ ok: true });
}
