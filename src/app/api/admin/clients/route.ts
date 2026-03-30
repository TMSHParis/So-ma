import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { email, firstName, lastName, phone } = await request.json();

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { message: "E-mail, prénom et nom requis" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "Un compte avec cet e-mail existe déjà" },
        { status: 400 }
      );
    }

    // Generate random password
    const password = crypto.randomBytes(8).toString("hex");
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user and client profile
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash,
        role: "CLIENT",
        client: {
          create: {
            phone: phone || null,
          },
        },
      },
    });

    // TODO: Send email with credentials via Resend
    // For now, log the password (remove in production!)
    console.log(`Client created: ${email} / ${password}`);

    return NextResponse.json({
      success: true,
      userId: user.id,
      temporaryPassword: password, // Remove in production - send via email instead
    });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { message: "Erreur interne" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const clients = await prisma.user.findMany({
      where: { role: "CLIENT" },
      include: { client: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { message: "Erreur interne" },
      { status: 500 }
    );
  }
}
