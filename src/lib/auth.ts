import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

/** Erreur technique côté serveur / BDD — code lu par la page de connexion. */
class AuthServiceError extends CredentialsSignin {
  code = "service_unavailable";
}

function normalizeEmail(raw: unknown): string {
  return String(raw ?? "")
    .trim()
    .toLowerCase();
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = normalizeEmail(credentials.email);
        const password = String(credentials.password);

        let user;
        try {
          user = await prisma.user.findUnique({
            where: { email },
          });
        } catch (err) {
          console.error("[auth] Erreur base de données à la connexion :", err);
          throw new AuthServiceError();
        }

        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/connexion",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
