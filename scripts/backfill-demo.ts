import "dotenv/config";
import { prisma } from "../src/lib/db";
import { getDemoClient, seedDay } from "../src/lib/demo-seed/seed";

function parisDateIso(now = new Date()): string {
  return new Intl.DateTimeFormat("fr-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

async function main() {
  const from = process.argv[2];
  const to = process.argv[3] ?? parisDateIso();
  if (!from) {
    console.error("Usage: tsx scripts/backfill-demo.ts YYYY-MM-DD [YYYY-MM-DD]");
    process.exit(1);
  }

  const client = await getDemoClient();
  console.log(`Client: ${client.id} (${client.userId})`);
  console.log(`Backfill ${from} → ${to}`);

  const start = new Date(from + "T00:00:00Z");
  const end = new Date(to + "T00:00:00Z");
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    const res = await seedDay(client.id, iso);
    const parts: string[] = [iso];
    parts.push(res.meals.totals ? `food=${res.meals.totals.kcal}kcal (${res.meals.totals.p}P/${res.meals.totals.c}C/${res.meals.totals.f}F/${res.meals.totals.fib}fib)` : "food=skip");
    parts.push(`march=${res.march.steps ?? 0} pas`);
    parts.push(res.muscu.added ? `muscu=${res.muscu.kcal}kcal` : "muscu=—");
    parts.push(res.water.set ? `water=${res.water.liters}L` : "water=—");
    console.log(parts.join(" | "));
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
