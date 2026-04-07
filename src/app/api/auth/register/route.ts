import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const { email, firstName, lastName, password } = await request.json();

  if (!email || !firstName || !lastName || !password) {
    return NextResponse.json(
      { message: "Tous les champs sont requis" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { message: "Le mot de passe doit contenir au moins 8 caractères" },
      { status: 400 }
    );
  }

  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { message: "Un compte existe déjà avec cet email" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // Create User + Client profile in transaction
  const user = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      passwordHash,
      role: "CLIENT",
      client: {
        create: {},
      },
    },
  });

  return NextResponse.json({ success: true, userId: user.id });
}
