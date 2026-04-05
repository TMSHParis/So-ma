import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendClientCredentials } from "@/lib/email";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role: string }).role !== "ADMIN") return null;
  return session;
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { email, firstName, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
  }

  try {
    await sendClientCredentials({ to: email, firstName: firstName || "Cliente", email, password });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending credentials:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
  }
}
