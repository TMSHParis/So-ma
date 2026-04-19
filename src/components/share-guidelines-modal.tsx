"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, CheckCircle2, Lock, Sparkles } from "lucide-react";

const ACK_KEY = "soma_share_guidelines_ack_v1";

export function ShareGuidelinesModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const acked = localStorage.getItem(ACK_KEY);
    if (!acked) {
      const t = setTimeout(() => setOpen(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  function handleAck() {
    localStorage.setItem(ACK_KEY, new Date().toISOString());
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleAck()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <DialogTitle>Avant de partager ton expérience</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4 text-sm leading-relaxed">
          <p className="text-muted-foreground">
            Un petit cadre clair avant que tu postes : la plateforme contient
            du contenu exclusif que je protège.
          </p>

          <div className="rounded-lg border border-green-200 bg-green-50/50 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <p className="font-semibold text-green-800 text-sm">
                Ce que tu peux partager
              </p>
            </div>
            <ul className="text-xs space-y-1.5 text-foreground/80 list-disc pl-5">
              <li>Ton expérience, ce qui a changé pour toi</li>
              <li>Le fait d&apos;être suivie par une conseillère certifiée</li>
              <li>L&apos;ambiance et la posture So-ma</li>
              <li>Un screenshot flouté de ton espace</li>
              <li>Pourquoi tu as choisi So-ma</li>
            </ul>
          </div>

          <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-rose-600" />
              <p className="font-semibold text-rose-800 text-sm">
                Ce que tu gardes pour toi
              </p>
            </div>
            <ul className="text-xs space-y-1.5 text-foreground/80 list-disc pl-5">
              <li>Le contenu des modules, guides, PDF, protocoles</li>
              <li>La structure de la plateforme</li>
              <li>Les noms de mes méthodes et outils</li>
              <li>
                Tout ce qui permettrait à quelqu&apos;un de reconstituer ce que
                je fais sans passer par moi
              </li>
            </ul>
          </div>

          <p className="text-xs text-muted-foreground">
            En gros : parle de toi et de ton vécu, pas de ce que tu as entre
            les mains. Merci{" "}
            <Heart className="inline h-3 w-3 text-rose-400 fill-rose-400" />
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <Link href="/dashboard/partage" className="flex-1" onClick={handleAck}>
            <Button variant="outline" className="w-full">
              Lire la version complète
            </Button>
          </Link>
          <Button
            onClick={handleAck}
            className="flex-1 bg-primary hover:bg-primary/90 text-white"
          >
            J&apos;ai compris
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
