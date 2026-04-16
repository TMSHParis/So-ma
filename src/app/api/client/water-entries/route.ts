import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  calendarDateInTimeZone,
  calendarIsoToPrismaDate,
  CLIENT_TIMEZONE,
} from "@/lib/calendar-day";

async function getClient() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.client.findUnique({ where: { userId: session.user.id } });
}

export async function GET(req: NextRequest) {
  const client = await getClient();
  if (!client) return NextResponse.json([], { status: 401 });

  const dateParam = req.nextUrl.searchParams.get("date");
  const isoRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (dateParam && isoRegex.test(dateParam)) {
    const entry = await prisma.waterEntry.findUnique({
      where: {
        clientId_date: {
          clientId: client.id,
          date: calendarIsoToPrismaDate(dateParam),
        },
      },
    });
    return NextResponse.json(entry ?? { liters: 0 });
  }

  const entries = await prisma.waterEntry.findMany({
    where: { clientId: client.id },
    orderBy: { date: "asc" },
  });
  return NextResponse.json(entries);
}

export async function POST(req: Request) {
  const client = await getClient();
  if (!client)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { date, liters } = await req.json();
  const dateStr =
    date && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? date
      : calendarDateInTimeZone(CLIENT_TIMEZONE);
  const d = calendarIsoToPrismaDate(dateStr);
  const l = Math.max(0, Number(liters) || 0);

  if (l === 0) {
    await prisma.waterEntry.deleteMany({
      where: { clientId: client.id, date: d },
    });
    return NextResponse.json({ liters: 0 });
  }

  const entry = await prisma.waterEntry.upsert({
    where: { clientId_date: { clientId: client.id, date: d } },
    update: { liters: l },
    create: { clientId: client.id, date: d, liters: l },
  });
  return NextResponse.json(entry);
}
