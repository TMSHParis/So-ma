import "dotenv/config";
import { prisma } from "../src/lib/db";
import { getDemoClient, seedDay, wipeRange, type Phase } from "../src/lib/demo-seed/seed";

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
  const phaseArg = (process.argv[4] ?? "full") as Phase;
  const phase: Phase = phaseArg === "morning" || phaseArg === "evening" ? phaseArg : "full";
  if (!from) {
    console.error("Usage: tsx scripts/wipe-reseed-demo.ts YYYY-MM-DD [YYYY-MM-DD] [morning|evening|full]");
    process.exit(1);
  }

  const client = await getDemoClient();
  console.log(`Client: ${client.id}`);
  console.log(`Wipe + reseed (${phase}): ${from} → ${to}\n`);

  const wipe = await wipeRange(client.id, from, to);
  console.log(`Wipe: food=${wipe.foodDeleted} sport=${wipe.sportDeleted} water=${wipe.waterDeleted} weight=${wipe.weightDeleted}\n`);

  const start = new Date(from + "T00:00:00Z");
  const end = new Date(to + "T00:00:00Z");
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    const r = await seedDay(client.id, iso, phase);
    const dayName = new Date(iso + "T00:00:00Z").toLocaleDateString("en", { weekday: "short", timeZone: "UTC" });
    const parts: string[] = [`${iso} ${dayName}`];
    if (r.meals.totals) parts.push(`food=${r.meals.totals.kcal}kcal ${r.meals.totals.p}P/${r.meals.totals.c}C/${r.meals.totals.f}F/${r.meals.totals.fib}fib`);
    else parts.push("food=skip");
    parts.push(`pas=${r.march.steps ?? 0}`);
    parts.push(r.muscu.added ? `muscu=${r.muscu.kcal}kcal` : "muscu=—");
    parts.push(r.water.set ? `eau=${r.water.liters}L` : "eau=—");
    if (r.weight.added) parts.push(`pesée=${r.weight.kg}kg`);
    console.log(parts.join(" | "));
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
