import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: NextRequest) {
  let body: { token?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const token = String(body.token ?? "");
  const password = String(body.password ?? "");

  if (!token || token.length < 32) {
    return NextResponse.json({ error: "Lien invalide" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins 8 caractères" },
      { status: 400 },
    );
  }

  const tokenHash = hashToken(token);
  const user = await prisma.user.findUnique({
    where: { passwordResetTokenHash: tokenHash },
  });

  if (
    !user ||
    !user.passwordResetExpiresAt ||
    user.passwordResetExpiresAt.getTime() < Date.now()
  ) {
    return NextResponse.json(
      { error: "Lien invalide ou expiré" },
      { status: 400 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,
    },
  });

  return NextResponse.json({ ok: true });
}
