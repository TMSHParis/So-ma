"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Check, Loader2, MessageSquare } from "lucide-react";
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

  async function deleteSuggestion(id: string) {
    try {
      const res = await fetch(`/api/admin/suggestions?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSuggestions((prev) => prev.filter((s) => s.id !== id));
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
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          Suggestions d&apos;aliments
        </h1>
        <p className="text-muted-foreground mt-1">
          Suggestions envoyées par les clientes depuis le suivi alimentaire.
        </p>
      </div>

      {suggestions.length === 0 ? (
        <Card className="border-warm-border">
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              Aucune suggestion pour l&apos;instant
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {suggestions.map((s) => (
            <Card key={s.id} className="border-warm-border">
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
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => {
                        deleteSuggestion(s.id);
                        toast.success("Pris en compte !");
                      }}
                      title="Pris en compte"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteSuggestion(s.id)}
                      title="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
