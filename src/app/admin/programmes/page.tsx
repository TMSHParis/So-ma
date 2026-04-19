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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Utensils, Dumbbell, Loader2, Upload, FileText, X, ExternalLink, Users, Send } from "lucide-react";
import { toast } from "sonner";
import { upload } from "@vercel/blob/client";

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
  client: { id: string; user: { firstName: string; lastName: string } };
};

type PlanGroup = {
  key: string;
  representative: Plan;
  plans: Plan[];
  clientIds: string[];
};

function groupPlans(plans: Plan[]): PlanGroup[] {
  const map = new Map<string, PlanGroup>();
  for (const plan of plans) {
    const key = plan.fileUrl
      ? `file:${plan.fileUrl}`
      : `doc:${plan.title}|${plan.description ?? ""}|${JSON.stringify(plan.content ?? {})}`;
    const existing = map.get(key);
    if (existing) {
      existing.plans.push(plan);
      if (plan.client?.id) existing.clientIds.push(plan.client.id);
      if (new Date(plan.createdAt) > new Date(existing.representative.createdAt)) {
        existing.representative = plan;
      }
    } else {
      map.set(key, {
        key,
        representative: plan,
        plans: [plan],
        clientIds: plan.client?.id ? [plan.client.id] : [],
      });
    }
  }
  return Array.from(map.values()).sort(
    (a, b) =>
      new Date(b.representative.createdAt).getTime() -
      new Date(a.representative.createdAt).getTime()
  );
}

export default function ProgrammesPage() {
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [mealPlans, setMealPlans] = useState<Plan[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogType, setDialogType] = useState<"meal" | "workout" | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  // Resend state
  const [resendState, setResendState] = useState<{
    group: PlanGroup;
    type: "meal" | "workout";
  } | null>(null);
  const [resendClientIds, setResendClientIds] = useState<string[]>([]);
  const [resendSearch, setResendSearch] = useState("");
  const [resending, setResending] = useState(false);

  // File upload
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
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
    setSelectedClientIds([]);
    setClientSearch("");
    setTitle("");
    setDescription("");
    setContent("");
    setUploadedFileUrl("");
    setUploadedFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const clientsWithProfile = clients.filter((c) => c.client);
  const filteredClients = clientsWithProfile.filter((c) => {
    if (!clientSearch.trim()) return true;
    const q = clientSearch.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q)
    );
  });

  function toggleClient(clientId: string) {
    setSelectedClientIds((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  }

  function selectAllClients() {
    setSelectedClientIds(
      clientsWithProfile.map((c) => c.client!.id)
    );
  }

  function deselectAllClients() {
    setSelectedClientIds([]);
  }

  async function handleFileProcess(file: File) {
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Fichier trop volumineux (max 50 Mo)");
      return;
    }
    setUploading(true);
    try {
      const blob = await upload(`soma/${Date.now()}-${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        multipart: true,
      });
      setUploadedFileUrl(blob.url);
      setUploadedFileName(file.name);
      toast.success(`${file.name} uploadé`);
    } catch {
      toast.error("Erreur upload");
    } finally {
      setUploading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileProcess(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function removeFile() {
    setUploadedFileUrl("");
    setUploadedFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleCreate() {
    if (selectedClientIds.length === 0 || !title) {
      toast.error("Sélectionnez au moins une cliente et renseignez un titre");
      return;
    }

    if (!content && !uploadedFileUrl) {
      toast.error("Ajoutez du contenu texte ou un fichier");
      return;
    }

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
          clientIds: selectedClientIds,
          title,
          description: description || null,
          content: parsedContent,
          fileUrl: uploadedFileUrl || null,
          fileName: uploadedFileName || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const n = data.count ?? selectedClientIds.length;
        toast.success(
          n > 1 ? `Programme envoyé à ${n} clientes !` : "Programme créé !"
        );
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

  function openResend(group: PlanGroup, type: "meal" | "workout") {
    setResendState({ group, type });
    setResendClientIds([]);
    setResendSearch("");
  }

  function toggleResendClient(clientId: string) {
    setResendClientIds((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  }

  async function handleResend() {
    if (!resendState || resendClientIds.length === 0) return;
    const { group, type } = resendState;
    const plan = group.representative;
    const endpoint =
      type === "meal" ? "/api/admin/meal-plans" : "/api/admin/workout-plans";
    setResending(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientIds: resendClientIds,
          title: plan.title,
          description: plan.description,
          content: plan.content ?? {},
          fileUrl: plan.fileUrl,
          fileName: plan.fileName,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const n = data.count ?? resendClientIds.length;
        toast.success(
          n > 1 ? `Programme envoyé à ${n} clientes !` : "Programme envoyé !"
        );
        setResendState(null);
        setResendClientIds([]);
        fetchAll();
      } else {
        const err = await res.json();
        toast.error(err.message || "Erreur");
      }
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setResending(false);
    }
  }

  async function deleteGroup(type: "meal" | "workout", group: PlanGroup) {
    const base =
      type === "meal" ? "/api/admin/meal-plans" : "/api/admin/workout-plans";
    const label =
      group.plans.length > 1
        ? `Supprimer ce programme pour les ${group.plans.length} clientes ?`
        : "Supprimer ce programme ?";
    if (!confirm(label)) return;

    try {
      const results = await Promise.all(
        group.plans.map((p) =>
          fetch(`${base}?id=${p.id}`, { method: "DELETE" })
        )
      );
      if (results.every((r) => r.ok)) {
        toast.success(
          group.plans.length > 1
            ? `Programme supprimé pour ${group.plans.length} clientes`
            : "Programme supprimé"
        );
      } else {
        toast.error("Certaines suppressions ont échoué");
      }
      fetchAll();
    } catch {
      toast.error("Erreur");
    }
  }

  function renderPlanGroup(group: PlanGroup, type: "meal" | "workout") {
    const plan = group.representative;
    const clients = group.plans
      .map((p) => p.client)
      .filter((c): c is Plan["client"] => !!c);
    const anyActive = group.plans.some((p) => p.active);

    return (
      <Card key={group.key} className="border-warm-border">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => openResend(group, type)}
                className="font-medium text-left hover:text-warm-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
                title="Renvoyer à d'autres clientes"
              >
                {plan.title}
              </button>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(plan.createdAt).toLocaleDateString("fr-FR")} &middot;{" "}
                {clients.length} cliente{clients.length > 1 ? "s" : ""}
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
              {clients.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {clients.map((c, i) => (
                    <Badge
                      key={`${group.key}-${c.id}-${i}`}
                      variant="outline"
                      className="font-normal"
                    >
                      {c.user.firstName} {c.user.lastName}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant={anyActive ? "default" : "secondary"}>
                {anyActive ? "Actif" : "Inactif"}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-warm-primary"
                onClick={() => openResend(group, type)}
                title="Renvoyer à d'autres clientes"
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => deleteGroup(type, group)}
                title={
                  group.plans.length > 1
                    ? "Supprimer pour toutes les clientes"
                    : "Supprimer"
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const mealGroups = groupPlans(mealPlans);
  const workoutGroups = groupPlans(workoutPlans);

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
          {mealGroups.length === 0 ? (
            <Card className="border-warm-border">
              <CardContent className="py-12 text-center">
                <Utensils className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Aucun programme alimentaire créé.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {mealGroups.map((group) => renderPlanGroup(group, "meal"))}
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
          {workoutGroups.length === 0 ? (
            <Card className="border-warm-border">
              <CardContent className="py-12 text-center">
                <Dumbbell className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Aucun programme sportif créé.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {workoutGroups.map((group) => renderPlanGroup(group, "workout"))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create dialog */}
      <Dialog open={!!dialogType} onOpenChange={(open) => { if (!open) { setDialogType(null); resetForm(); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogType === "meal"
                ? "Nouveau programme alimentaire"
                : "Nouveau programme sportif"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Clientes destinataires
                  <span className="text-xs text-muted-foreground font-normal">
                    ({selectedClientIds.length}/{clientsWithProfile.length})
                  </span>
                </Label>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={selectAllClients}
                  >
                    Toutes
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={deselectAllClients}
                  >
                    Aucune
                  </Button>
                </div>
              </div>
              <Input
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="Rechercher une cliente..."
                className="h-9"
              />
              {clientsWithProfile.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune cliente enregistrée.
                </p>
              ) : (
                <div className="max-h-[220px] overflow-y-auto rounded-lg border border-warm-border divide-y divide-warm-border">
                  {filteredClients.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucune cliente trouvée.
                    </p>
                  ) : (
                    filteredClients.map((c) => {
                      const clientId = c.client!.id;
                      const checked = selectedClientIds.includes(clientId);
                      return (
                        <label
                          key={clientId}
                          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => toggleClient(clientId)}
                          />
                          <span className="text-sm flex-1 truncate">
                            {c.firstName} {c.lastName}
                          </span>
                        </label>
                      );
                    })
                  )}
                </div>
              )}
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
                  className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors py-6 px-4 cursor-pointer ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-warm-primary/40"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  {uploading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  )}
                  <p className="text-sm text-muted-foreground">
                    {uploading ? "Upload en cours..." : dragActive ? "Déposez le fichier ici" : "Glissez-déposez un fichier ou cliquez"}
                  </p>
                  <p className="text-xs text-muted-foreground/60">PDF, image, doc — max 50 Mo</p>
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
              disabled={
                saving ||
                uploading ||
                selectedClientIds.length === 0 ||
                !title ||
                (!content && !uploadedFileUrl)
              }
              className={`w-full text-white ${
                dialogType === "meal"
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-secondary hover:bg-secondary/90"
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Envoi en cours...
                </>
              ) : selectedClientIds.length > 1 ? (
                `Envoyer à ${selectedClientIds.length} clientes`
              ) : (
                "Créer le programme"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resend dialog */}
      <Dialog
        open={!!resendState}
        onOpenChange={(open) => { if (!open) setResendState(null); }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Renvoyer à d&apos;autres clientes</DialogTitle>
          </DialogHeader>
          {resendState && (
            <div className="space-y-4">
              <div className="rounded-lg border border-warm-border bg-muted/30 px-3 py-2.5">
                <p className="text-sm font-medium truncate">{resendState.group.representative.title}</p>
                {resendState.group.representative.fileName && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5 inline-flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {resendState.group.representative.fileName}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  Déjà envoyé à {resendState.group.plans.length} cliente{resendState.group.plans.length > 1 ? "s" : ""}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Destinataires
                    <span className="text-xs text-muted-foreground font-normal">
                      ({resendClientIds.length}/{clientsWithProfile.length})
                    </span>
                  </Label>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() =>
                        setResendClientIds(
                          clientsWithProfile
                            .map((c) => c.client!.id)
                            .filter((id) => !resendState.group.clientIds.includes(id))
                        )
                      }
                    >
                      Toutes
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setResendClientIds([])}
                    >
                      Aucune
                    </Button>
                  </div>
                </div>
                <Input
                  value={resendSearch}
                  onChange={(e) => setResendSearch(e.target.value)}
                  placeholder="Rechercher une cliente..."
                  className="h-9"
                />
                <div className="max-h-[260px] overflow-y-auto rounded-lg border border-warm-border divide-y divide-warm-border">
                  {clientsWithProfile
                    .filter((c) => {
                      if (!resendSearch.trim()) return true;
                      const q = resendSearch.toLowerCase();
                      return (
                        c.firstName.toLowerCase().includes(q) ||
                        c.lastName.toLowerCase().includes(q)
                      );
                    })
                    .map((c) => {
                      const clientId = c.client!.id;
                      const alreadySent = resendState.group.clientIds.includes(clientId);
                      const checked = resendClientIds.includes(clientId);
                      return (
                        <label
                          key={clientId}
                          className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${
                            alreadySent
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer hover:bg-muted/50"
                          }`}
                        >
                          <Checkbox
                            checked={checked}
                            disabled={alreadySent}
                            onCheckedChange={() => !alreadySent && toggleResendClient(clientId)}
                          />
                          <span className="text-sm flex-1 truncate">
                            {c.firstName} {c.lastName}
                          </span>
                          {alreadySent && (
                            <span className="text-xs text-muted-foreground">
                              déjà envoyé
                            </span>
                          )}
                        </label>
                      );
                    })}
                </div>
              </div>

              <Button
                onClick={handleResend}
                disabled={resending || resendClientIds.length === 0}
                className={`w-full text-white ${
                  resendState.type === "meal"
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-secondary hover:bg-secondary/90"
                }`}
              >
                {resending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {resendClientIds.length > 1
                      ? `Envoyer à ${resendClientIds.length} clientes`
                      : "Envoyer"}
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
