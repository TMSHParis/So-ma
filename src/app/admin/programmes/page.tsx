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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Utensils, Dumbbell, Loader2 } from "lucide-react";
import { toast } from "sonner";

type ClientOption = {
  id: string;
  firstName: string;
  lastName: string;
  client: { id: string } | null;
};

type Plan = {
  id: string;
  title: string;
  description: string | null;
  content: unknown;
  active: boolean;
  createdAt: string;
  client: { user: { firstName: string; lastName: string } };
};

export default function ProgrammesPage() {
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [mealPlans, setMealPlans] = useState<Plan[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogType, setDialogType] = useState<"meal" | "workout" | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [selectedClient, setSelectedClient] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  const fetchAll = useCallback(async () => {
    try {
      const [clientsRes, mealsRes, workoutsRes] = await Promise.all([
        fetch("/api/admin/clients"),
        fetch("/api/admin/meal-plans"),
        fetch("/api/admin/workout-plans"),
      ]);
      if (clientsRes.ok) setClients(await clientsRes.json());
      if (mealsRes.ok) setMealPlans(await mealsRes.json());
      if (workoutsRes.ok) setWorkoutPlans(await workoutsRes.json());
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  function resetForm() {
    setSelectedClient("");
    setTitle("");
    setDescription("");
    setContent("");
  }

  async function handleCreate() {
    if (!selectedClient || !title || !content) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const clientObj = clients.find((c) => c.client?.id === selectedClient);
    if (!clientObj?.client) return;

    setSaving(true);
    const endpoint =
      dialogType === "meal"
        ? "/api/admin/meal-plans"
        : "/api/admin/workout-plans";

    try {
      let parsedContent: unknown;
      try {
        parsedContent = JSON.parse(content);
      } catch {
        // Si ce n'est pas du JSON, on le wrap en objet texte
        parsedContent = { text: content };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: selectedClient,
          title,
          description: description || null,
          content: parsedContent,
        }),
      });

      if (res.ok) {
        toast.success("Programme créé !");
        setDialogType(null);
        resetForm();
        fetchAll();
      } else {
        const err = await res.json();
        toast.error(err.message || "Erreur");
      }
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setSaving(false);
    }
  }

  async function deletePlan(type: "meal" | "workout", id: string) {
    const endpoint =
      type === "meal"
        ? `/api/admin/meal-plans?id=${id}`
        : `/api/admin/workout-plans?id=${id}`;

    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (res.ok) {
        toast.success("Programme supprimé");
        fetchAll();
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
            Gestion des programmes
          </h1>
          <p className="text-muted-foreground mt-1">
            Créez et gérez les programmes alimentaires et sportifs de vos clientes.
          </p>
        </div>
      </div>

      <Tabs defaultValue="meal">
        <TabsList className="mb-6">
          <TabsTrigger value="meal" className="gap-2">
            <Utensils className="h-4 w-4" />
            Alimentaires
          </TabsTrigger>
          <TabsTrigger value="workout" className="gap-2">
            <Dumbbell className="h-4 w-4" />
            Sportifs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="meal">
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => setDialogType("meal")}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau programme alimentaire
            </Button>
          </div>
          {mealPlans.length === 0 ? (
            <Card className="border-warm-border">
              <CardContent className="py-12 text-center">
                <Utensils className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Aucun programme alimentaire créé.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {mealPlans.map((plan) => (
                <Card key={plan.id} className="border-warm-border">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{plan.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {plan.client.user.firstName} {plan.client.user.lastName}{" "}
                          &middot;{" "}
                          {new Date(plan.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                        {plan.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {plan.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={plan.active ? "default" : "secondary"}>
                          {plan.active ? "Actif" : "Inactif"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => deletePlan("meal", plan.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="workout">
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => setDialogType("workout")}
              className="bg-secondary hover:bg-secondary/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau programme sportif
            </Button>
          </div>
          {workoutPlans.length === 0 ? (
            <Card className="border-warm-border">
              <CardContent className="py-12 text-center">
                <Dumbbell className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Aucun programme sportif créé.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {workoutPlans.map((plan) => (
                <Card key={plan.id} className="border-warm-border">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{plan.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {plan.client.user.firstName} {plan.client.user.lastName}{" "}
                          &middot;{" "}
                          {new Date(plan.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                        {plan.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {plan.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={plan.active ? "default" : "secondary"}>
                          {plan.active ? "Actif" : "Inactif"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => deletePlan("workout", plan.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create dialog */}
      <Dialog open={!!dialogType} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {dialogType === "meal"
                ? "Nouveau programme alimentaire"
                : "Nouveau programme sportif"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select
                value={selectedClient}
                onValueChange={(v) => v !== null && setSelectedClient(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients
                    .filter((c) => c.client)
                    .map((c) => (
                      <SelectItem key={c.client!.id} value={c.client!.id}>
                        {c.firstName} {c.lastName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Programme semaine 1-4"
              />
            </div>
            <div className="space-y-2">
              <Label>Description (optionnel)</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brève description du programme"
              />
            </div>
            <div className="space-y-2">
              <Label>Contenu</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
                placeholder={
                  dialogType === "meal"
                    ? "Détaillez le programme alimentaire...\n\nPetit-déjeuner :\n- Porridge d'avoine 50g\n- Fruits frais\n\nDéjeuner :\n- Poulet grillé 150g\n- Riz complet 80g"
                    : "Détaillez le programme sportif...\n\nLundi - Haut du corps :\n- Développé couché 3x10\n- Rowing haltère 3x10\n\nMercredi - Bas du corps :\n- Squat 3x12\n- Hip thrust 3x12"
                }
              />
              <p className="text-xs text-muted-foreground">
                Saisissez le programme en texte libre ou en JSON.
              </p>
            </div>
            <Button
              onClick={handleCreate}
              disabled={saving || !selectedClient || !title || !content}
              className={`w-full text-white ${
                dialogType === "meal"
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-secondary hover:bg-secondary/90"
              }`}
            >
              {saving ? "Création..." : "Créer le programme"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
