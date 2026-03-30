import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import { createPrismaPgAdapter } from "../src/lib/prisma-pg-adapter";

const prisma = new PrismaClient({
  adapter: createPrismaPgAdapter(),
});

/**
 * Comptes de développement uniquement — à ne pas utiliser en production.
 *
 * Cliente : cliente@so-ma.local / Client123!
 * Admin   : admin@so-ma.local / Admin123!
 */
async function main() {
  const adminHash = await bcrypt.hash("Admin123!", 12);

  await prisma.user.upsert({
    where: { email: "admin@so-ma.local" },
    create: {
      email: "admin@so-ma.local",
      passwordHash: adminHash,
      firstName: "Admin",
      lastName: "So Ma",
      role: "ADMIN",
    },
    update: { passwordHash: adminHash },
  });

  const clientHash = await bcrypt.hash("Client123!", 12);

  await prisma.user.upsert({
    where: { email: "cliente@so-ma.local" },
    create: {
      email: "cliente@so-ma.local",
      passwordHash: clientHash,
      firstName: "Test",
      lastName: "Cliente",
      role: "CLIENT",
      client: { create: {} },
    },
    update: { passwordHash: clientHash },
  });

  const clienteUser = await prisma.user.findUnique({
    where: { email: "cliente@so-ma.local" },
  });
  if (clienteUser) {
    const existing = await prisma.client.findUnique({
      where: { userId: clienteUser.id },
    });
    if (!existing) {
      await prisma.client.create({ data: { userId: clienteUser.id } });
    }
  }

  console.log("Seed OK — comptes locaux :");
  console.log("  Espace cliente : cliente@so-ma.local / Client123!");
  console.log("  Admin          : admin@so-ma.local / Admin123!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
