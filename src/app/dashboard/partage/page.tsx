"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, CheckCircle2, Lock, Sparkles } from "lucide-react";

export default function PartagePage() {
  const [firstName, setFirstName] = useState<string>("");

  useEffect(() => {
    fetch("/api/client/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.firstName) setFirstName(data.firstName);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold tracking-tight">
          Parler de So-ma
        </h1>
        <p className="text-sm text-muted-foreground">
          Quelques repères si tu veux partager ton expérience.
        </p>
      </div>

      <Card className="border-warm-border">
        <CardContent className="p-6 space-y-5 text-sm leading-relaxed">
          <p>
            Hey {firstName || "toi"},
          </p>
          <p>
            Super que tu veuilles parler de ton expérience sur So-ma — ça
            compte vraiment. Avant que tu postes, je voulais juste te donner
            un cadre clair, parce que la plateforme contient du contenu
            exclusif que je protège.
          </p>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50/40">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <h2 className="font-semibold text-green-800">Ce que tu peux partager</h2>
          </div>
          <ul className="space-y-3 text-sm text-foreground/90">
            <li>
              <strong>Ton expérience personnelle</strong> : ce que tu ressens,
              ce qui a changé pour toi, comment tu vis l&apos;accompagnement.
              C&apos;est ta transformation, elle t&apos;appartient entièrement.
            </li>
            <li>
              Le fait d&apos;être suivie par une{" "}
              <strong>conseillère en nutrition certifiée</strong>, spécialisée
              en femmes neurodivergentes. Ça, c&apos;est public.
            </li>
            <li>
              <strong>L&apos;ambiance et la posture de So-ma</strong> :
              rigoureux, sans bullshit, incarné, pensé pour les cerveaux
              atypiques. Tu peux citer ces mots.
            </li>
            <li>
              Un <strong>screenshot flouté ou recadré</strong> de ton espace
              membre, juste pour montrer que ça existe et que c&apos;est
              sérieux — sans qu&apos;on puisse lire le contenu.
            </li>
            <li>
              Pourquoi tu as choisi So-ma plutôt qu&apos;un coaching classique.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-rose-200 bg-rose-50/40">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-rose-600" />
            <h2 className="font-semibold text-rose-800">Ce que tu gardes pour toi</h2>
          </div>
          <ul className="space-y-3 text-sm text-foreground/90">
            <li>
              Le contenu des <strong>modules, guides, PDF, protocoles</strong>{" "}
              — même un extrait.
            </li>
            <li>
              La <strong>structure de la plateforme</strong> (ce qui est inclus,
              comment c&apos;est organisé, combien de ressources).
            </li>
            <li>
              Les noms de mes <strong>méthodes et outils de suivi</strong>{" "}
              spécifiques.
            </li>
            <li>
              Tout ce qui permettrait à quelqu&apos;un de reconstituer ce que
              je fais sans passer par moi.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-warm-border bg-muted/30">
        <CardContent className="p-6 space-y-3 text-sm leading-relaxed">
          <p>
            En gros :{" "}
            <strong>parle de toi et de ton vécu, pas de ce que tu as entre les mains</strong>.
            C&apos;est ce qui te protège toi aussi — ta transformation reste la
            tienne, pas un contenu gratuit sur internet.
          </p>
          <p className="flex items-center gap-2 text-foreground/80">
            Merci pour ton respect de ça.
            <Heart className="h-4 w-4 text-rose-400 fill-rose-400" />
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
