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
  Eye,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { FileViewer } from "@/components/file-viewer";

type ClientUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  client: { id: string } | null;
};

type Assignment = {
  id: string;
  clientId: string;
  client: {
    id: string;
    user: { firstName: string; lastName: string; email: string };
  };
};

type Resource = {
  id: string;
  title: string;
  category: string;
  content: string | null;
  fileUrl: string | null;
  fileName: string | null;
  createdAt: string;
  assignments: Assignment[];
};

export default function AdminRessourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [clients, setClients] = useState<ClientUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Create form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  // File upload
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File viewer
  const [viewerFile, setViewerFile] = useState<{ url: string; name: string } | null>(null);

  // Assign dialog
  const [assignResource, setAssignResource] = useState<Resource | null>(null);
  const [assignSaving, setAssignSaving] = useState(false);

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

  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/clients");
      if (res.ok) setClients(await res.json());
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    fetchResources();
    fetchClients();
  }, [fetchResources, fetchClients]);

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
      const res = await fetch(`/api/admin/resources?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Ressource supprimée");
        setResources((prev) => prev.filter((r) => r.id !== id));
      }
    } catch {
      toast.error("Erreur");
    }
  }

  async function toggleAssignment(resourceId: string, clientId: string, isAssigned: boolean) {
    setAssignSaving(true);
    try {
      if (isAssigned) {
        await fetch(`/api/admin/resources/assignments?resourceId=${resourceId}&clientId=${clientId}`, {
          method: "DELETE",
        });
      } else {
        await fetch("/api/admin/resources/assignments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resourceId, clientIds: [clientId] }),
        });
      }
      await fetchResources();
    } catch {
      toast.error("Erreur");
    } finally {
      setAssignSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const assignedClientIds = assignResource
    ? new Set(assignResource.assignments.map((a) => a.clientId))
    : new Set<string>();

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
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                    {r.fileUrl && (
                      <button
                        onClick={() => setViewerFile({ url: r.fileUrl!, name: r.fileName || "Fichier" })}
                        className="inline-flex items-center gap-1.5 mt-2 text-sm text-warm-primary hover:underline"
                      >
                        <Eye className="h-4 w-4" />
                        {r.fileName || "Fichier joint"}
                      </button>
                    )}
                    {/* Assignations */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {r.assignments.length > 0 ? (
                        r.assignments.map((a) => (
                          <Badge key={a.id} variant="outline" className="text-xs">
                            {a.client.user.firstName} {a.client.user.lastName}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground/60">Non assignée</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => setAssignResource(r)}
                      title="Assigner aux clientes"
                    >
                      <Users className="h-4 w-4" />
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

      {/* Dialog création */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) { setDialogOpen(false); resetForm(); } }}>
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

      {/* Dialog assignation */}
      <Dialog open={!!assignResource} onOpenChange={(open) => { if (!open) setAssignResource(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Assigner « {assignResource?.title} »
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-2">
            Cochez les clientes qui doivent avoir accès à cette ressource.
          </p>
          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
            {clients
              .filter((c) => c.client)
              .map((c) => {
                const isAssigned = assignedClientIds.has(c.client!.id);
                return (
                  <label
                    key={c.id}
                    className="flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      checked={isAssigned}
                      disabled={assignSaving}
                      onCheckedChange={() =>
                        assignResource && toggleAssignment(assignResource.id, c.client!.id, isAssigned)
                      }
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {c.firstName} {c.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                    </div>
                  </label>
                );
              })}
            {clients.filter((c) => c.client).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune cliente enregistrée.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* File viewer */}
      {viewerFile && (
        <FileViewer
          open
          onClose={() => setViewerFile(null)}
          fileUrl={viewerFile.url}
          fileName={viewerFile.name}
        />
      )}
    </div>
  );
}
