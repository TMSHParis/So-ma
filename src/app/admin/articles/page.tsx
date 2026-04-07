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
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Loader2,
  Upload,
  Pencil,
  Eye,
  EyeOff,
  FileText,
  X,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { upload } from "@vercel/blob/client";

type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl: string | null;
  content: string;
  published: boolean;
  createdAt: string;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Form
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);

  // Image upload
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/articles");
      if (res.ok) setArticles(await res.json());
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  function resetForm() {
    setTitle("");
    setSlug("");
    setSlugManual(false);
    setExcerpt("");
    setCategory("");
    setDate("");
    setImageUrl("");
    setContent("");
    setPublished(true);
    setEditingArticle(null);
  }

  function openCreate() {
    resetForm();
    const today = new Date();
    const months = [
      "janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre",
    ];
    setDate(`${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`);
    setDialogOpen(true);
  }

  function openEdit(article: Article) {
    setEditingArticle(article);
    setTitle(article.title);
    setSlug(article.slug);
    setSlugManual(true);
    setExcerpt(article.excerpt);
    setCategory(article.category);
    setDate(article.date);
    setImageUrl(article.imageUrl || "");
    setContent(article.content);
    setPublished(article.published);
    setDialogOpen(true);
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugManual) {
      setSlug(slugify(value));
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
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
      setImageUrl(blob.url);
      toast.success("Image uploadée");
    } catch {
      toast.error("Erreur upload");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!title || !slug || !excerpt || !category || !date || !content) {
      toast.error("Tous les champs sont requis");
      return;
    }
    setSaving(true);
    try {
      const body = {
        ...(editingArticle && { id: editingArticle.id }),
        title,
        slug,
        excerpt,
        category,
        date,
        imageUrl: imageUrl || null,
        content,
        published,
      };
      const res = await fetch("/api/admin/articles", {
        method: editingArticle ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success(editingArticle ? "Article mis à jour" : "Article créé !");
        setDialogOpen(false);
        resetForm();
        fetchArticles();
      } else {
        const err = await res.json();
        toast.error(err.message || "Erreur");
      }
    } catch {
      toast.error("Erreur");
    } finally {
      setSaving(false);
    }
  }

  async function deleteArticle(id: string) {
    if (!confirm("Supprimer cet article ?")) return;
    try {
      const res = await fetch(`/api/admin/articles?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Article supprimé");
        setArticles((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      toast.error("Erreur");
    }
  }

  async function togglePublished(article: Article) {
    try {
      const res = await fetch("/api/admin/articles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: article.id, published: !article.published }),
      });
      if (res.ok) {
        setArticles((prev) =>
          prev.map((a) =>
            a.id === article.id ? { ...a, published: !a.published } : a
          )
        );
        toast.success(article.published ? "Article masqué" : "Article publié");
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
            Articles du blog
          </h1>
          <p className="text-muted-foreground mt-1">
            Créez, modifiez et publiez vos articles.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel article
        </Button>
      </div>

      {articles.length === 0 ? (
        <Card className="border-warm-border">
          <CardContent className="py-12 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun article.</p>
            <Button onClick={openCreate} variant="outline" className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Créer le premier article
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="border-warm-border hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-4">
                  {article.imageUrl && (
                    <div className="hidden sm:block w-20 h-14 rounded-lg overflow-hidden bg-[#f5f5f7] flex-shrink-0">
                      <img
                        src={article.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{article.title}</p>
                      <Badge
                        variant="secondary"
                        className="text-xs flex-shrink-0"
                      >
                        {article.category}
                      </Badge>
                      {!article.published && (
                        <Badge
                          variant="outline"
                          className="text-xs flex-shrink-0 text-muted-foreground"
                        >
                          Brouillon
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {article.excerpt}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {article.date} &middot; /blog/{article.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => togglePublished(article)}
                      title={article.published ? "Masquer" : "Publier"}
                    >
                      {article.published ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => openEdit(article)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <a
                      href={`/blog/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteArticle(article.id)}
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

      {/* Create / Edit dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDialogOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingArticle ? "Modifier l'article" : "Nouvel article"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Titre *</Label>
                <Input
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Le titre de l'article"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug (URL) *</Label>
                <Input
                  value={slug}
                  onChange={(e) => {
                    setSlugManual(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="le-titre-de-larticle"
                />
                <p className="text-[11px] text-muted-foreground">
                  /blog/{slug || "..."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Catégorie *</Label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ex : Nutrition, Neuroatypie, Réflexion..."
                />
              </div>
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Ex : 29 mars 2026"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Extrait / résumé *</Label>
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="min-h-[60px]"
                placeholder="Un court résumé qui apparaît sur la page blog..."
              />
            </div>

            {/* Image */}
            <div className="space-y-2">
              <Label>Image de couverture</Label>
              {imageUrl ? (
                <div className="relative rounded-xl overflow-hidden bg-[#f5f5f7]">
                  <img
                    src={imageUrl}
                    alt="Couverture"
                    className="w-full h-[180px] object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 text-xs bg-white/80 backdrop-blur-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Remplacer
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-7 w-7 bg-white/80 backdrop-blur-sm"
                      onClick={() => setImageUrl("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/40 transition-colors py-8 px-4 cursor-pointer"
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
                      : "Cliquez pour uploader une image"}
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".png,.jpg,.jpeg,.gif,.webp,.svg"
                onChange={handleImageUpload}
              />
              <p className="text-[11px] text-muted-foreground">
                Ou collez une URL directement :
              </p>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="text-xs"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label>Contenu de l&apos;article *</Label>
              <p className="text-[11px] text-muted-foreground">
                Utilisez le formatage Markdown : **gras**, *italique*, ## Titre, - liste, &gt; citation
              </p>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
                placeholder={"## Introduction\n\nVotre texte ici...\n\n**Texte en gras**\n\n- Point 1\n- Point 2\n\n> Citation"}
              />
            </div>

            {/* Published toggle */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary accent-primary"
              />
              <span className="text-sm text-foreground">
                Publier l&apos;article (visible sur le blog)
              </span>
            </label>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || uploading}
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {editingArticle ? "Sauvegarde..." : "Création..."}
                  </>
                ) : editingArticle ? (
                  "Enregistrer"
                ) : (
                  "Créer l'article"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
