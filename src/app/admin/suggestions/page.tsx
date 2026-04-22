"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Check, Loader2, MessageSquare, Eye } from "lucide-react";
import { toast } from "sonner";

type Suggestion = {
  id: string;
  text: string;
  createdAt: string;
  client: {
    user: { firstName: string; lastName: string; email: string };
  };
};

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Suggestion | null>(null);

  const fetchSuggestions = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/suggestions");
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      }
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  async function markDone(id: string) {
    try {
      const res = await fetch(`/api/admin/suggestions?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSuggestions((prev) => prev.filter((s) => s.id !== id));
        setSelected(null);
        toast.success("Pris en compte !");
      }
    } catch {
      toast.error("Erreur");
    }
  }

  async function deleteSuggestion(id: string) {
    try {
      const res = await fetch(`/api/admin/suggestions?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSuggestions((prev) => prev.filter((s) => s.id !== id));
        setSelected(null);
        toast.success("Suggestion supprimée");
      }
    } catch {
      toast.error("Erreur");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Suggestions
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground tabular-nums">
            {suggestions.length} suggestion{suggestions.length !== 1 ? "s" : ""} d&apos;aliments
          </p>
        </div>
      </div>

      {suggestions.length === 0 ? (
        <Card className="border-warm-border">
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucune suggestion pour l&apos;instant</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border border-warm-border overflow-hidden divide-y divide-warm-border bg-white">
          {suggestions.map((s) => (
            <div
              key={s.id}
              className="flex items-start gap-4 px-5 py-4 hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => setSelected(s)}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{s.text}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
                    {s.client.user.firstName} {s.client.user.lastName}
                  </span>
                  <span className="text-[11px] text-muted-foreground/70 tabular-nums">
                    {new Date(s.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(s);
                }}
                title="Voir le détail"
                aria-label="Voir le détail"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Suggestion d'aliment</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {selected.text}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {selected.client.user.firstName} {selected.client.user.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selected.client.user.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(selected.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => markDone(selected.id)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Pris en compte
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => deleteSuggestion(selected.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
