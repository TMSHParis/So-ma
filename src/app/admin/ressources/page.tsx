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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Trash2,
  Lightbulb,
  Loader2,
  Upload,
  FileText,
  X,
  ExternalLink,
  Users,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

type Resource = {
  id: string;
  title: string;
  category: string;
  content: string | null;
  fileUrl: string | null;
  fileName: string | null;
  createdAt: string;
};

type ClientUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  client: { id: string } | null;
};

export default function AdminRessourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  // File upload
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detail / assign dialog
  const [detailResource, setDetailResource] = useState<Resource | null>(null);
  const [allClients, setAllClients] = useState<ClientUser[]>([]);
  const [assignedClientIds, setAssignedClientIds] = useState<string[]>([]);
  const [loadingAssign, setLoadingAssign] = useState(false);
  const [savingAssign, setSavingAssign] = useState(false);

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

  async function openDetail(resource: Resource) {
    setDetailResource(resource);
    setLoadingAssign(true);
    try {
      const [clientsRes, assignedRes] = await Promise.all([
        fetch("/api/admin/clients"),
        fetch(`/api/admin/resources/${resource.id}/clients`),
      ]);
      if (clientsRes.ok) setAllClients(await clientsRes.json());
      if (assignedRes.ok) setAssignedClientIds(await assignedRes.json());
    } catch {
      toast.error("Erreur chargement");
    } finally {
      setLoadingAssign(false);
    }
  }

  function toggleClient(clientId: string) {
    setAssignedClientIds((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  }

  function selectAll() {
    const allIds = allClients
      .map((c) => c.client?.id)
      .filter((id): id is string => !!id);
    setAssignedClientIds(allIds);
  }

  function deselectAll() {
    setAssignedClientIds([]);
  }

  async function saveAssignments() {
    if (!detailResource) return;
    setSavingAssign(true);
    try {
      const res = await fetch(
        `/api/admin/resources/${detailResource.id}/clients`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientIds: assignedClientIds }),
        }
      );
      if (res.ok) {
        toast.success("Assignations mises à jour");
        setDetailResource(null);
      } else {
        toast.error("Erreur lors de la sauvegarde");
      }
    } catch {
      toast.error("Erreur");
    } finally {
      setSavingAssign(false);
    }
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
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
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

  function resetForm() {
    setTitle("");
    setCategory("");
    setContent("");
    setUploadedFileUrl("");
    setUploadedFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

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
          fileUrl: uploadedFileUrl || null,
          fileName: uploadedFileName || null,
        }),
      });
      if (res.ok) {
        toast.success("Ressource créée !");
        setDialogOpen(false);
        resetForm();
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
      const res = await fetch(`/api/admin/resources?id=${id}`, {
        method: "DELETE",
      });
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
            Gérez les articles, guides et fichiers accessibles aux clientes.
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
                  <div
                    className="min-w-0 flex-1 cursor-pointer"
                    onClick={() => openDetail(r)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{r.title}</p>
                      <Badge
                        variant="secondary"
                        className="text-xs flex-shrink-0"
                      >
                        {r.category}
                      </Badge>
                    </div>
                    {r.content && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {r.content}
                      </p>
                    )}
                    {r.fileUrl && (
                      <span className="inline-flex items-center gap-1.5 mt-2 text-sm text-warm-primary">
                        <FileText className="h-4 w-4" />
                        {r.fileName || "Fichier joint"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => openDetail(r)}
                      title="Voir & assigner"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteResource(r.id)}
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

      {/* Create dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDialogOpen(false);
            resetForm();
          }
        }}
      >
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

            {/* File upload */}
            <div className="space-y-2">
              <Label>Fichier (PDF, image, etc.)</Label>
              {uploadedFileName ? (
                <div className="flex items-center gap-2 rounded-lg border border-warm-primary/30 bg-warm-primary/5 px-3 py-2.5">
                  <FileText className="h-5 w-5 text-warm-primary shrink-0" />
                  <span className="text-sm font-medium truncate flex-1">
                    {uploadedFileName}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={removeFile}
                  >
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
                    {uploading
                      ? "Upload en cours..."
                      : "Cliquez pour uploader un fichier"}
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    PDF, image, doc — max 10 Mo
                  </p>
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
              <Label>Contenu texte (optionnel)</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px]"
                placeholder="Rédigez le contenu de la ressource..."
              />
            </div>
            <Button
              onClick={handleCreate}
              disabled={saving || uploading || !title || !category}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              {saving ? "Création..." : "Créer la ressource"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail / assign dialog */}
      <Dialog
        open={!!detailResource}
        onOpenChange={(open) => {
          if (!open) setDetailResource(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {detailResource?.title}
              {detailResource && (
                <Badge variant="secondary" className="text-xs">
                  {detailResource.category}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {detailResource && (
            <div className="space-y-4">
              {/* Resource content preview */}
              {detailResource.content && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {detailResource.content}
                  </p>
                </div>
              )}
              {detailResource.fileUrl && (
                <a
                  href={detailResource.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-warm-primary hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  {detailResource.fileName || "Fichier joint"}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}

              {/* Client assignment */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-sm font-medium">
                      Assigner aux clientes
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={selectAll}
                      disabled={loadingAssign}
                    >
                      Toutes
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={deselectAll}
                      disabled={loadingAssign}
                    >
                      Aucune
                    </Button>
                  </div>
                </div>

                {loadingAssign ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : allClients.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucune cliente enregistrée.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                    {allClients
                      .filter((c) => c.client)
                      .map((c) => (
                        <label
                          key={c.client!.id}
                          className="flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            checked={assignedClientIds.includes(c.client!.id)}
                            onCheckedChange={() => toggleClient(c.client!.id)}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">
                              {c.firstName} {c.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {c.email}
                            </p>
                          </div>
                        </label>
                      ))}
                  </div>
                )}
              </div>

              <Button
                onClick={saveAssignments}
                disabled={savingAssign || loadingAssign}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                {savingAssign ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sauvegarde...
                  </>
                ) : (
                  `Enregistrer (${assignedClientIds.length} cliente${assignedClientIds.length !== 1 ? "s" : ""})`
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
