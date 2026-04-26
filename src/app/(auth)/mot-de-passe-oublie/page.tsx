"use client";

import { useState } from "react";
import Link from "next/link";

export default function MotDePasseOubliePage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Une erreur est survenue");
        setLoading(false);
        return;
      }
      setSent(true);
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
          Mot de passe oublié
        </h1>

        {sent ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Si un compte existe pour cet e-mail, un lien de réinitialisation
              vient de t&apos;être envoyé. Vérifie ta boîte mail (et tes spams).
            </p>
            <Link
              href="/connexion"
              className="inline-block text-sm text-primary hover:text-primary/80"
            >
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            <p className="text-center text-sm text-muted-foreground mb-6">
              Entre ton e-mail et nous t&apos;enverrons un lien pour créer un
              nouveau mot de passe.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                autoFocus
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
                {loading ? "Envoi..." : "Envoyer le lien"}
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
