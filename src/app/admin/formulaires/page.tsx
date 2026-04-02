"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Copy, Link2, FileText, Loader2, Eye, Calculator, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type TokenRow = {
  id: string;
  token: string;
  name: string | null;
  email: string | null;
  used: boolean;
  expiresAt: string;
  createdAt: string;
  response: {
    id: string;
    data: Record<string, unknown>;
    submittedAt: string;
  } | null;
};

export default function FormulairesPage() {
  const router = useRouter();
  const [tokens, setTokens] = useState<TokenRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialog, setDetailDialog] = useState<TokenRow | null>(null);
  const [generatedLink, setGeneratedLink] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchTokens = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/bilan-tokens");
      if (res.ok) {
        const data = await res.json();
        setTokens(data);
      }
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  async function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

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
        fetchTokens();
      }
    } catch {
      toast.error("Erreur lors de la génération");
    } finally {
      setSaving(false);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(generatedLink);
    toast.success("Lien copié !");
  }

  async function handleDelete(tokenId: string) {
    if (!confirm("Supprimer ce lien de bilan ?")) return;
    try {
      const res = await fetch(`/api/admin/bilan-tokens/${tokenId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Lien supprimé");
        fetchTokens();
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch {
      toast.error("Erreur de connexion");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Formulaires de bilan
          </h1>
          <p className="text-muted-foreground mt-1">
            Générez des liens uniques pour vos formulaires de bilan.
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setGeneratedLink("");
          }}
        >
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Générer un lien
          </Button>
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
                  cliente par Instagram, email ou SMS.
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
                  disabled={saving}
                >
                  <Link2 className="h-4 w-4 mr-2" />
                  {saving ? "Génération..." : "Générer le lien"}
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : tokens.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">
                Aucun lien généré pour le moment.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tokens.map((token) => {
                const expired = new Date(token.expiresAt) < new Date();
                return (
                  <div
                    key={token.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {token.name || "Sans nom"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {token.email || "Pas d'email"} &middot;{" "}
                        {new Date(token.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {token.used ? (
                        <Badge className="bg-green-100 text-green-700">
                          Rempli
                        </Badge>
                      ) : expired ? (
                        <Badge variant="outline" className="text-muted-foreground">
                          Expiré
                        </Badge>
                      ) : (
                        <Badge variant="secondary">En attente</Badge>
                      )}
                      {token.response && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setDetailDialog(token)}
                            title="Voir les réponses"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-white h-8 text-xs"
                            onClick={() => router.push(`/admin/formulaires/${token.id}`)}
                            title="Calculer & valider"
                          >
                            <Calculator className="h-3.5 w-3.5 mr-1" />
                            Calculer
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-600"
                        onClick={() => handleDelete(token.id)}
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail dialog for viewing bilan responses */}
      <Dialog
        open={!!detailDialog}
        onOpenChange={(open) => !open && setDetailDialog(null)}
      >
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Réponse de {detailDialog?.name || detailDialog?.email || "Anonyme"}
            </DialogTitle>
          </DialogHeader>
          {detailDialog?.response && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Soumis le{" "}
                {new Date(detailDialog.response.submittedAt).toLocaleDateString(
                  "fr-FR",
                  { day: "numeric", month: "long", year: "numeric" }
                )}
              </p>
              <div className="space-y-2">
                {Object.entries(
                  detailDialog.response.data as Record<string, unknown>
                ).map(([key, value]) => (
                  <div
                    key={key}
                    className="py-2 border-b border-black/[0.04] last:border-0"
                  >
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {key.replace(/_/g, " ")}
                    </p>
                    <p className="text-sm text-foreground mt-0.5">
                      {Array.isArray(value)
                        ? value.join(", ")
                        : String(value || "—")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
