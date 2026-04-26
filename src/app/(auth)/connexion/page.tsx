"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
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
          "Le serveur n'arrive pas à joindre la base de données."
        );
      } else {
        setError("Email ou mot de passe incorrect");
      }
      return;
    }

    router.push(redirect || "/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#FBFAF8] px-4 py-8 safe-top safe-bottom">
      <div className="w-full max-w-[340px]">
        <div className="text-center mb-10">
          <Link href="/">
            <img src="/logo-soma.png" alt="So-ma" className="h-10 w-auto mx-auto mix-blend-multiply" />
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

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-black/[0.08]" />
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground/70">ou</span>
          <div className="flex-1 h-px bg-black/[0.08]" />
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: redirect || "/admin" })}
          className="w-full h-12 bg-white border border-black/[0.08] text-[15px] text-foreground rounded-xl hover:bg-foreground/[0.03] transition-colors inline-flex items-center justify-center gap-2.5"
        >
          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.28 1.43-1.1 2.65-2.35 3.47v2.88h3.79c2.22-2.05 3.61-5.08 3.61-8.59z"/>
            <path fill="#34A853" d="M12 24c3.17 0 5.82-1.05 7.76-2.85l-3.79-2.88c-1.05.7-2.38 1.12-3.97 1.12-3.06 0-5.65-2.07-6.57-4.85H1.49v3.04C3.43 21.3 7.39 24 12 24z"/>
            <path fill="#FBBC05" d="M5.43 14.54a7.21 7.21 0 0 1 0-4.62V6.88H1.49a12 12 0 0 0 0 10.7l3.94-3.04z"/>
            <path fill="#EA4335" d="M12 4.8c1.72 0 3.27.59 4.49 1.75l3.36-3.36C17.8 1.19 15.16 0 12 0 7.39 0 3.43 2.7 1.49 6.62l3.94 3.04C6.35 6.87 8.94 4.8 12 4.8z"/>
          </svg>
          Se connecter avec Google
        </button>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link href="/mot-de-passe-oublie" className="text-primary hover:text-primary/80 transition-colors">
            Mot de passe oublié ?
          </Link>
        </p>

        <p className="text-center text-xs text-muted-foreground mt-3">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="text-primary hover:text-primary/80 transition-colors">
            Créer un compte
          </Link>
        </p>

        <p className="text-center text-xs text-muted-foreground mt-3">
          <Link href="/" className="hover:text-foreground transition-colors">
            Retour à l&apos;accueil
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#FBFAF8]">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    }>
      <ConnexionForm />
    </Suspense>
  );
}
