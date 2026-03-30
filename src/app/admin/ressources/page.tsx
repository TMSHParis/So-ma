"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Lightbulb, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Resource = {
  id: string;
  title: string;
  category: string;
  content: string | null;
  fileUrl: string | null;
  createdAt: string;
};

export default function AdminRessourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const fetchResources = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/resources");
      if (res.ok) setResources(await res.json());
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  async function handleCreate() {
    if (!title || !category) {
      toast.error("Titre et catégorie requis");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          content: content || null,
          fileUrl: fileUrl || null,
        }),
      });
      if (res.ok) {
        toast.success("Ressource créée !");
        setDialogOpen(false);
        setTitle("");
        setCategory("");
        setContent("");
        setFileUrl("");
        fetchResources();
      }
    } catch {
      toast.error("Erreur");
    } finally {
      setSaving(false);
    }
  }

  async function deleteResource(id: string) {
    try {
      const res = await fetch(`/api/admin/resources?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Ressource supprimée");
        setResources((prev) => prev.filter((r) => r.id !== id));
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
            Ressources
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez les articles, guides et astuces accessibles aux clientes.
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle ressource
        </Button>
      </div>

      {resources.length === 0 ? (
        <Card className="border-warm-border">
          <CardContent className="py-12 text-center">
            <Lightbulb className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucune ressource créée.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {resources.map((r) => (
            <Card key={r.id} className="border-warm-border">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{r.title}</p>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        {r.category}
                      </Badge>
                    </div>
                    {r.content && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {r.content}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0 ml-2"
                    onClick={() => deleteResource(r.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle ressource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Comprendre les macronutriments"
              />
            </div>
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select
                value={category}
                onValueChange={(v) => v !== null && setCategory(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                  <SelectItem value="sport">Sport</SelectItem>
                  <SelectItem value="bienetre">Bien-être</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Contenu</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px]"
                placeholder="Rédigez le contenu de la ressource..."
              />
            </div>
            <div className="space-y-2">
              <Label>Lien vers un fichier (optionnel)</Label>
              <Input
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <Button
              onClick={handleCreate}
              disabled={saving || !title || !category}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              {saving ? "Création..." : "Créer la ressource"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
