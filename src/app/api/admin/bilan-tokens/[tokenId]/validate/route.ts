import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendClientCredentials } from "@/lib/email";
import bcrypt from "bcryptjs";
import crypto from "crypto";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
    return null;
  }
  return session;
}

/**
 * POST /api/admin/bilan-tokens/[tokenId]/validate
 *
 * Crée (ou met à jour) le compte cliente à partir des données du bilan
 * et des valeurs nutritionnelles calculées / ajustées par l'admin.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> },
) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { tokenId } = await params;

  const token = await prisma.bilanToken.findUnique({
    where: { id: tokenId },
    include: { response: true },
  });

  if (!token || !token.response) {
    return NextResponse.json(
      { error: "Bilan introuvable ou non rempli" },
      { status: 404 },
    );
  }

  const body = await req.json();
  const {
    goalCalories,
    maintenanceCalories,
    energyBalance,
    caloricDeltaKcal,
    goalProtein,
    goalCarbs,
    goalFat,
    goalFiber,
    goalWaterL,
  } = body;

  const bilanData = token.response.data as Record<string, string>;
  const email = bilanData.email;
  const firstName = bilanData.prenom || token.name || "Cliente";
  const lastName = bilanData.nom || "";

  if (!email) {
    return NextResponse.json(
      { error: "Pas d'email dans le bilan" },
      { status: 400 },
    );
  }

  // Parse bilan data for profile fields
  const weight = Number(bilanData.poids) || null;
  const height = Number(bilanData.taille) || null;
  const sex = bilanData.sexe || "F";
  const age = Number(bilanData.age) || null;
  const birthDate = age
    ? new Date(Date.now() - age * 365.25 * 24 * 3600 * 1000)
    : null;
  const goalWeight = Number(bilanData.poids_souhaite) || null;

  const clientData = {
    phone: bilanData.telephone || null,
    sex,
    weight,
    height,
    birthDate,
    startWeight: weight,
    goalWeight,
    goalCalories: Math.round(Number(goalCalories)),
    maintenanceCalories: Math.round(Number(maintenanceCalories)),
    energyBalance: energyBalance || "MAINTENANCE",
    caloricDeltaKcal: Math.round(Number(caloricDeltaKcal) || 0),
    goalProtein: Math.round(Number(goalProtein)),
    goalCarbs: Math.round(Number(goalCarbs)),
    goalFat: Math.round(Number(goalFat)),
    goalFiber: Math.round(Number(goalFiber)),
    goalWaterL: Math.round(Number(goalWaterL) * 10) / 10,
  };

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });

  let temporaryPassword: string | null = null;

  if (existingUser) {
    // Update existing client profile
    const client = await prisma.client.findUnique({
      where: { userId: existingUser.id },
    });
    if (!client) {
      return NextResponse.json(
        { error: "Utilisateur trouvé mais pas de profil cliente" },
        { status: 400 },
      );
    }
    await prisma.client.update({
      where: { id: client.id },
      data: clientData,
    });

    // Link bilan response to client + mark token as used
    await Promise.all([
      prisma.bilanResponse.update({
        where: { id: token.response.id },
        data: { clientId: client.id },
      }),
      prisma.bilanToken.update({
        where: { id: tokenId },
        data: { used: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      created: false,
      email,
      clientId: client.id,
    });
  } else {
    // Create new user + client
    temporaryPassword = crypto.randomBytes(8).toString("hex");
    const passwordHash = await bcrypt.hash(temporaryPassword, 12);

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash,
        role: "CLIENT",
        client: {
          create: clientData,
        },
      },
      include: { client: true },
    });

    // Link bilan response to client + mark token as used
    const updates: Promise<unknown>[] = [
      prisma.bilanToken.update({
        where: { id: tokenId },
        data: { used: true },
      }),
    ];
    if (user.client) {
      updates.push(
        prisma.bilanResponse.update({
          where: { id: token.response.id },
          data: { clientId: user.client.id },
        }),
      );
    }
    await Promise.all(updates);

    // Auto-send credentials email
    let credentialsSent = false;
    try {
      await sendClientCredentials({
        to: email,
        firstName,
        email,
        password: temporaryPassword,
      });
      credentialsSent = true;
    } catch (err) {
      console.error("Failed to send credentials email:", err);
    }

    return NextResponse.json({
      success: true,
      created: true,
      email,
      clientId: user.client?.id,
      temporaryPassword,
      credentialsSent,
    });
  }
}
