import "dotenv/config";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { PrismaClient } from "../src/generated/prisma/client";
import { createPrismaPgAdapter } from "../src/lib/prisma-pg-adapter";

const prisma = new PrismaClient({
  adapter: createPrismaPgAdapter(),
});

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  const firstName = process.argv[3] ?? "Super";
  const lastName = process.argv[4] ?? "Admin";

  if (!email || !email.includes("@")) {
    console.error("Usage: tsx scripts/create-admin.ts <email> [firstName] [lastName]");
    process.exit(1);
  }

  const password = crypto.randomBytes(9).toString("base64url");
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    create: { email, passwordHash, firstName, lastName, role: "ADMIN" },
    update: { passwordHash, role: "ADMIN" },
  });

  console.log("\nAdmin prêt :");
  console.log(`  Email    : ${user.email}`);
  console.log(`  Password : ${password}`);
  console.log(`  Role     : ${user.role}\n`);
  console.log("Connecte-toi sur /connexion (ou clique 'Se connecter avec Google' si SUPERADMIN_EMAIL est configuré).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
