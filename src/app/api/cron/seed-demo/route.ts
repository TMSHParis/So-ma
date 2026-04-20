import { NextRequest, NextResponse } from "next/server";
import { getDemoClient, seedDay, seedRange, type Phase } from "@/lib/demo-seed/seed";

// Europe/Paris : offset +2h en DST, +1h hors DST. On vise la date LOCALE Paris au moment du run.
function parisDateIso(now = new Date()): string {
  // Intl en "fr-CA" → format yyyy-mm-dd
  return new Intl.DateTimeFormat("fr-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

async function handle(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const client = await getDemoClient();
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");
  const phaseParam = (searchParams.get("phase") ?? "full") as Phase;
  const phase: Phase = phaseParam === "morning" || phaseParam === "evening" ? phaseParam : "full";

  if (from && to) {
    const results = await seedRange(client.id, from, to, phase);
    return NextResponse.json({ mode: "range", from, to, phase, count: results.length, results });
  }

  const target = date ?? parisDateIso();
  const result = await seedDay(client.id, target, phase);
  return NextResponse.json({ mode: "day", phase, result });
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}
