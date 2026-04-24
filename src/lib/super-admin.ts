import { auth } from "./auth";

export function isSuperAdminEmail(email: string | null | undefined): boolean {
  const configured = process.env.SUPERADMIN_EMAIL?.trim().toLowerCase();
  if (!configured) return false;
  return typeof email === "string" && email.trim().toLowerCase() === configured;
}

export async function requireSuperAdmin() {
  const session = await auth();
  if (!isSuperAdminEmail(session?.user?.email)) return null;
  return session;
}
