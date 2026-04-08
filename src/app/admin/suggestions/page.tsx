"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Suggestions d'aliments
          </h1>
          <p className="text-muted-foreground mt-1">
            Suggestions envoyées par les clientes depuis le suivi alimentaire.
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {suggestions.length} suggestion{suggestions.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {suggestions.length === 0 ? (
        <Card className="border-warm-border">
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              Aucune suggestion pour l'instant
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {suggestions.map((s) => (
            <Card
              key={s.id}
              className="border-warm-border cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelected(s)}
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {s.text}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {s.client.user.firstName} {s.client.user.lastName}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(s.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(s);
                    }}
                    title="Voir le détail"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
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
