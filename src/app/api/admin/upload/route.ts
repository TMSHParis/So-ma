import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
    return null;
  }
  return session.user;
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ message: "Aucun fichier fourni" }, { status: 400 });
  }

  // Limit 25MB
  if (file.size > 25 * 1024 * 1024) {
    return NextResponse.json({ message: "Fichier trop volumineux (max 25 Mo)" }, { status: 400 });
  }

  const blob = await put(`soma/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return NextResponse.json({
    url: blob.url,
    fileName: file.name,
  });
}
