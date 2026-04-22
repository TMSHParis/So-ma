"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Copy, Link2, FileText, Loader2, Eye, Calculator, Trash2, MoreVertical } from "lucide-react";
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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

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

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === tokens.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(tokens.map((t) => t.id)));
    }
  }

  async function handleBulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Supprimer ${selected.size} formulaire(s) ?`)) return;
    setDeleting(true);
    try {
      await Promise.all(
        Array.from(selected).map((id) =>
          fetch(`/api/admin/bilan-tokens/${id}`, { method: "DELETE" })
        )
      );
      toast.success(`${selected.size} formulaire(s) supprimé(s)`);
      setSelected(new Set());
      fetchTokens();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Formulaires
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground tabular-nums">
            {tokens.length} lien{tokens.length > 1 ? "s" : ""} de bilan
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

      <div className="rounded-xl border border-warm-border bg-white overflow-hidden">
        {tokens.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-warm-border">
            <label className="flex items-center gap-2 text-sm cursor-pointer text-muted-foreground">
              <input
                type="checkbox"
                checked={selected.size === tokens.length && tokens.length > 0}
                onChange={toggleAll}
                className="rounded border-gray-300 accent-primary h-4 w-4"
              />
              Tout sélectionner
            </label>
            {selected.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                className="h-7 text-xs"
                onClick={handleBulkDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Trash2 className="h-3 w-3 mr-1" />
                )}
                Supprimer ({selected.size})
              </Button>
            )}
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : tokens.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun lien généré pour le moment.</p>
          </div>
        ) : (
          <div className="divide-y divide-warm-border">
            {tokens.map((token) => {
              const expired = new Date(token.expiresAt) < new Date();
              const status = token.used
                ? { label: "Rempli", dot: "bg-emerald-500" }
                : expired
                ? { label: "Expiré", dot: "bg-foreground/40" }
                : { label: "En attente", dot: "bg-amber-500" };
              return (
                <div
                  key={token.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(token.id)}
                    onChange={() => toggleSelect(token.id)}
                    className="rounded border-gray-300 accent-primary h-4 w-4 flex-shrink-0 cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5">
                      <p className="font-medium text-sm truncate text-foreground">
                        {token.name || <span className="text-muted-foreground font-normal">Sans nom</span>}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground shrink-0">
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground/80 truncate mt-0.5 tabular-nums">
                      {token.email || "Pas d'email"} · {new Date(token.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {token.response && (
                      <>
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          onClick={() => setDetailDialog(token)}
                          title="Voir les réponses"
                          aria-label="Voir les réponses"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-white h-8 text-xs"
                          onClick={() => router.push(`/admin/formulaires/${token.id}`)}
                        >
                          <Calculator className="h-3.5 w-3.5 mr-1" />
                          Calculer
                        </Button>
                      </>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        aria-label="Actions"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50 data-[popup-open]:bg-muted"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDelete(token.id)}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
