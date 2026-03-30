import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorise" }, { status: 401 });
    }

    const { email, name } = await request.json();

    // Token expires in 30 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const bilanToken = await prisma.bilanToken.create({
      data: {
        email: email || null,
        name: name || null,
        expiresAt,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const url = `${baseUrl}/bilan/${bilanToken.token}`;

    return NextResponse.json({ url, token: bilanToken.token });
  } catch (error) {
    console.error("Error generating bilan token:", error);
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
      return NextResponse.json({ message: "Non autorise" }, { status: 401 });
    }

    const tokens = await prisma.bilanToken.findMany({
      include: { response: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tokens);
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return NextResponse.json(
      { message: "Erreur interne" },
      { status: 500 }
    );
  }
}
