"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ReinitialiserPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const token = params.token;

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Une erreur est survenue");
        setLoading(false);
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/connexion"), 2500);
    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#FBFAF8] px-4 py-8 safe-top safe-bottom">
      <div className="w-full max-w-[340px]">
        <div className="text-center mb-10">
          <Link href="/">
            <img
              src="/logo-soma.png"
              alt="So-ma"
              className="h-10 w-auto mx-auto mix-blend-multiply"
            />
          </Link>
        </div>

        <h1 className="text-center text-lg font-medium text-foreground mb-6">
          Nouveau mot de passe
        </h1>

        {done ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ton mot de passe a bien été mis à jour. Redirection vers la
              connexion...
            </p>
          </div>
        ) : (
          <>
            <p className="text-center text-sm text-muted-foreground mb-6">
              Choisis un nouveau mot de passe (8 caractères minimum).
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="password"
                type="password"
                placeholder="Nouveau mot de passe"
                required
                autoFocus
                minLength={8}
                className="w-full h-12 px-4 bg-white border border-black/[0.08] rounded-xl text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
              />
              <input
                name="confirm"
                type="password"
                placeholder="Confirmer le mot de passe"
                required
                minLength={8}
                className="w-full h-12 px-4 bg-white border border-black/[0.08] rounded-xl text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
              />

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary text-white text-[15px] font-normal rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Mise à jour..." : "Mettre à jour"}
              </button>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-6">
              <Link
                href="/connexion"
                className="hover:text-foreground transition-colors"
              >
                Retour à la connexion
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
