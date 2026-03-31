"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function ConnexionPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      if (result.code === "service_unavailable") {
        setError(
          "Le serveur n'arrive pas à joindre la base de données. Vérifiez que PostgreSQL tourne, que DATABASE_URL dans .env est correct, puis relancez « npm run dev ». Ensuite exécutez « npm run db:seed » si vous n'avez pas encore créé le compte test."
        );
      } else {
        setError("Email ou mot de passe incorrect");
      }
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFAF8] px-4">
      <div className="w-full max-w-[340px]">
        <div className="text-center mb-10">
          <Link href="/">
            <Image
              src="/logo-soma.webp"
              alt="So-ma"
              width={145}
              height={46}
              className="h-10 w-auto mx-auto"
            />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full h-12 px-4 bg-white border border-black/[0.08] rounded-xl text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Mot de passe"
              required
              className="w-full h-12 px-4 bg-white border border-black/[0.08] rounded-xl text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary text-white text-[15px] font-normal rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Retour à l&apos;accueil
          </Link>
        </p>
      </div>
    </div>
  );
}
