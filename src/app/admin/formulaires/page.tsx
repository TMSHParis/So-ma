"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Copy, Link2, FileText } from "lucide-react";
import { toast } from "sonner";

export default function FormulairesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") || undefined,
      name: formData.get("name") || undefined,
    };

    try {
      const res = await fetch("/api/admin/bilan-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const { url } = await res.json();
        setGeneratedLink(url);
        toast.success("Lien généré avec succès !");
      }
    } catch {
      toast.error("Erreur lors de la génération");
    } finally {
      setLoading(false);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(generatedLink);
    toast.success("Lien copié !");
  }

  // TODO: Fetch real tokens and responses from DB
  const tokens: {
    id: string;
    name: string;
    email: string;
    used: boolean;
    createdAt: string;
  }[] = [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-foreground">
            Formulaires de bilan
          </h1>
          <p className="text-muted-foreground mt-1">
            Générez des liens uniques pour vos formulaires de bilan.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary hover:bg-primary/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Générer un lien
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Générer un lien de formulaire</DialogTitle>
            </DialogHeader>
            {generatedLink ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Lien du formulaire
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={generatedLink}
                      readOnly
                      className="text-xs"
                    />
                    <Button variant="outline" size="icon" onClick={copyLink}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ce lien est unique et expire dans 30 jours. Envoyez-le à votre
                  cliente par Instagram, e-mail ou SMS.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedLink("");
                    setDialogOpen(false);
                  }}
                  className="w-full"
                >
                  Fermer
                </Button>
              </div>
            ) : (
              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la personne (optionnel)</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Pour identifier le formulaire"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (optionnel)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Pour associer au formulaire"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  disabled={loading}
                >
                  <Link2 className="h-4 w-4 mr-2" />
                  {loading ? "Génération…" : "Générer le lien"}
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Tokens list */}
      <Card className="border-warm-border">
        <CardHeader>
          <CardTitle className="text-base">Liens générés</CardTitle>
        </CardHeader>
        <CardContent>
          {tokens.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">
                Aucun lien généré pour le moment.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tokens.map((token) => (
                <div
                  key={token.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {token.name || "Sans nom"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {token.email || "Pas d'email"} - {token.createdAt}
                    </p>
                  </div>
                  <Badge variant={token.used ? "secondary" : "default"}>
                    {token.used ? "Rempli" : "En attente"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
