"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
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
import { Plus, Trash2, Utensils, Dumbbell, Loader2, Upload, FileText, X, ExternalLink } from "lucide-react";
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
  fileUrl: string | null;
  fileName: string | null;
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

  // File upload
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setUploadedFileUrl("");
    setUploadedFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Fichier trop volumineux (max 10 Mo)");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setUploadedFileUrl(data.url);
        setUploadedFileName(data.fileName);
        toast.success(`${data.fileName} uploadé`);
      } else {
        const err = await res.json();
        toast.error(err.message || "Erreur upload");
      }
    } catch {
      toast.error("Erreur upload");
    } finally {
      setUploading(false);
    }
  }

  function removeFile() {
    setUploadedFileUrl("");
    setUploadedFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleCreate() {
    if (!selectedClient || !title) {
      toast.error("Veuillez remplir cliente et titre");
      return;
    }

    if (!content && !uploadedFileUrl) {
      toast.error("Ajoutez du contenu texte ou un fichier");
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
      let parsedContent: unknown = {};
      if (content) {
        try {
          parsedContent = JSON.parse(content);
        } catch {
          parsedContent = { text: content };
        }
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: selectedClient,
          title,
          description: description || null,
          content: parsedContent,
          fileUrl: uploadedFileUrl || null,
          fileName: uploadedFileName || null,
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

  function renderPlanCard(plan: Plan, type: "meal" | "workout") {
    return (
      <Card key={plan.id} className="border-warm-border">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
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
              {plan.fileUrl && (
                <a
                  href={plan.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-sm text-warm-primary hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  {plan.fileName || "Fichier joint"}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
              <Badge variant={plan.active ? "default" : "secondary"}>
                {plan.active ? "Actif" : "Inactif"}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => deletePlan(type, plan.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
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
              {mealPlans.map((plan) => renderPlanCard(plan, "meal"))}
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
              {workoutPlans.map((plan) => renderPlanCard(plan, "workout"))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create dialog */}
      <Dialog open={!!dialogType} onOpenChange={(open) => { if (!open) { setDialogType(null); resetForm(); } }}>
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

            {/* File upload */}
            <div className="space-y-2">
              <Label>Fichier (PDF, image, etc.)</Label>
              {uploadedFileName ? (
                <div className="flex items-center gap-2 rounded-lg border border-warm-primary/30 bg-warm-primary/5 px-3 py-2.5">
                  <FileText className="h-5 w-5 text-warm-primary shrink-0" />
                  <span className="text-sm font-medium truncate flex-1">{uploadedFileName}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={removeFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-warm-primary/40 transition-colors py-6 px-4 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  )}
                  <p className="text-sm text-muted-foreground">
                    {uploading ? "Upload en cours..." : "Cliquez pour uploader un fichier"}
                  </p>
                  <p className="text-xs text-muted-foreground/60">PDF, image, doc — max 10 Mo</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp"
                onChange={handleFileUpload}
              />
            </div>

            <div className="space-y-2">
              <Label>Contenu texte (optionnel si fichier joint)</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[150px] font-mono text-sm"
                placeholder={
                  dialogType === "meal"
                    ? "Détaillez le programme alimentaire...\n\nPetit-déjeuner :\n- Porridge d'avoine 50g\n- Fruits frais"
                    : "Détaillez le programme sportif...\n\nLundi - Haut du corps :\n- Développé couché 3x10\n- Rowing haltère 3x10"
                }
              />
            </div>
            <Button
              onClick={handleCreate}
              disabled={saving || uploading || !selectedClient || !title || (!content && !uploadedFileUrl)}
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
