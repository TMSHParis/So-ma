import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { createPrismaPgAdapter } from "../src/lib/prisma-pg-adapter";

const prisma = new PrismaClient({
  adapter: createPrismaPgAdapter(),
});

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    console.error("Usage: tsx scripts/promote-admin.ts <email>");
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    console.error(`Aucun user trouvé pour ${email}`);
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });

  console.log(`\nOK — ${user.email} est maintenant ${user.role}`);
  console.log("Password inchangé. Row Client conservé (ignoré par le filtre role=CLIENT).\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
