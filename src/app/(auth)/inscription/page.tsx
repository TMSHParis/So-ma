"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function InscriptionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bilanToken = searchParams.get("bilan");
  const prefillEmail = searchParams.get("email") || "";
  const prefillName = searchParams.get("name") || "";

  // Split prefilled name into first/last
  const nameParts = prefillName.split(" ");
  const prefillFirstName = nameParts[0] || "";
  const prefillLastName = nameParts.slice(1).join(" ") || "";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const firstName = (formData.get("firstName") as string).trim();
    const lastName = (formData.get("lastName") as string).trim();
    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Erreur lors de l'inscription");
        setLoading(false);
        return;
      }

      // Auto-login after registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Compte créé mais erreur de connexion. Essaie de te connecter.");
        setLoading(false);
        return;
      }

      // If bilan token present, redirect to bilan form
      if (bilanToken) {
        router.push(`/bilan/${bilanToken}`);
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch {
      setError("Erreur de connexion au serveur");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#FBFAF8] px-4 py-8 safe-top safe-bottom">
      <div className="w-full max-w-[340px]">
        <div className="text-center mb-10">
          <Link href="/">
            <img src="/logo-soma.png" alt="So-ma" className="h-10 w-auto mx-auto mix-blend-multiply" />
          </Link>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground mt-6">
            Créer mon compte
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {bilanToken
              ? "Crée ton compte pour accéder à ton bilan et à ton espace"
              : "Accède à ton espace personnalisé"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              name="firstName"
              type="text"
              placeholder="Prénom"
              defaultValue={prefillFirstName}
              required
              className="w-full h-12 px-4 bg-white border border-black/[0.08] rounded-xl text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
            />
            <input
              name="lastName"
              type="text"
              placeholder="Nom"
              defaultValue={prefillLastName}
              required
              className="w-full h-12 px-4 bg-white border border-black/[0.08] rounded-xl text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            defaultValue={prefillEmail}
            required
            className="w-full h-12 px-4 bg-white border border-black/[0.08] rounded-xl text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
          />
          <input
            name="password"
            type="password"
            placeholder="Mot de passe (min. 8 caractères)"
            required
            minLength={8}
            className="w-full h-12 px-4 bg-white border border-black/[0.08] rounded-xl text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirmer le mot de passe"
            required
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
            {loading
              ? "Création en cours..."
              : bilanToken
                ? "Créer mon compte et remplir le bilan"
                : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Déjà un compte ?{" "}
          <Link
            href={bilanToken ? `/connexion?redirect=/bilan/${bilanToken}` : "/connexion"}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Se connecter
          </Link>
        </p>

        <p className="text-center text-xs text-muted-foreground mt-3">
          <Link href="/" className="hover:text-foreground transition-colors">
            Retour à l'accueil
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function InscriptionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#FBFAF8]">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    }>
      <InscriptionForm />
    </Suspense>
  );
}
