import { PrismaPg } from "@prisma/adapter-pg";
import type { PoolConfig } from "pg";

function useRelaxedTls(): boolean {
  if (process.env.POSTGRES_PRISMA_SSL_ACCEPT_SELF_SIGNED === "1") return true;
  const url = process.env.DATABASE_URL ?? "";
  // Pooler Supabase : certains réseaux / proxies provoquent « self-signed in chain » avec sslmode=require seul.
  return url.includes("pooler.supabase.com") && process.env.NODE_ENV !== "production";
}

/**
 * Prisma Postgres via @prisma/adapter-pg.
 * POSTGRES_PRISMA_SSL_ACCEPT_SELF_SIGNED=1 : désactive la vérif stricte du certificat (dev uniquement).
 */
export function createPrismaPgAdapter(): PrismaPg {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL est requis");
  }

  let url = connectionString;
  const poolConfig: PoolConfig = {};

  if (useRelaxedTls()) {
    // sslmode=require dans l’URL peut forcer verify-full côté pg ; on le retire et on passe ssl ici.
    url = url.replace(/([?&])sslmode=[^&]*/g, "$1").replace(/\?&/, "?").replace(/[?&]$/, "");
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  poolConfig.connectionString = url;

  return new PrismaPg(poolConfig);
}
