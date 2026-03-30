import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Client } from "@/generated/prisma/client";

export type ClientSessionError = NextResponse;

export async function requireClientProfile(): Promise<
  { client: Client; userId: string } | { error: ClientSessionError }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: NextResponse.json({ message: "Non autorisé" }, { status: 401 }) };
  }
  const role = (session.user as { role: string }).role;
  if (role !== "CLIENT") {
    return {
      error: NextResponse.json(
        { message: "Réservé à l'espace cliente" },
        { status: 403 }
      ),
    };
  }

  const client = await prisma.client.findUnique({
    where: { userId: session.user.id },
  });

  if (!client) {
    return {
      error: NextResponse.json(
        { message: "Profil cliente introuvable" },
        { status: 404 }
      ),
    };
  }

  return { client, userId: session.user.id };
}
