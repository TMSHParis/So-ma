"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, FileText, Heart, Loader2, Eye } from "lucide-react";
import { FileViewer } from "@/components/file-viewer";

type Resource = {
  id: string;
  title: string;
  category: string;
  content: string | null;
  fileUrl: string | null;
  fileName: string | null;
  createdAt: string;
};

const categoryConfig: Record<
  string,
  { label: string; icon: typeof Lightbulb }
> = {
  nutrition: { label: "Nutrition", icon: Lightbulb },
  sport: { label: "Sport", icon: FileText },
  bienetre: { label: "Bien-être", icon: Heart },
};

export default function RessourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Resource | null>(null);
  const [viewerFile, setViewerFile] = useState<{
    url: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/client/resources")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setResources(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const categories = [...new Set(resources.map((r) => r.category))];
  const defaultTab = categories[0] || "nutrition";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          Ressources & Astuces
        </h1>
        <p className="text-muted-foreground mt-1">
          Articles, guides et astuces pour vous accompagner au quotidien.
        </p>
      </div>

      {resources.length === 0 ? (
        <Card className="border-warm-border">
          <CardContent className="py-12 text-center">
            <Lightbulb className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              Aucune ressource disponible pour le moment.
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Les ressources seront ajoutées par So-ma au fur et à mesure.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={defaultTab}>
          {categories.length > 1 && (
            <TabsList className="mb-6">
              {categories.map((cat) => {
                const cfg = categoryConfig[cat] || {
                  label: cat,
                  icon: Lightbulb,
                };
                return (
                  <TabsTrigger key={cat} value={cat} className="gap-2">
                    <cfg.icon className="h-4 w-4" />
                    {cfg.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          )}

          {categories.map((cat) => (
            <TabsContent key={cat} value={cat}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources
                  .filter((r) => r.category === cat)
                  .map((resource) => (
                    <Card
                      key={resource.id}
                      className="border-warm-border hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelected(resource)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            {resource.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {resource.content && (
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {resource.content}
                          </p>
                        )}
                        {resource.fileUrl && (
                          <span className="inline-flex items-center gap-1.5 text-sm text-primary mt-2">
                            <Eye className="h-3.5 w-3.5" />
                            Voir le document
                          </span>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Detail dialog */}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selected?.title}
              {selected && (
                <Badge variant="secondary" className="text-xs">
                  {categoryConfig[selected.category]?.label ||
                    selected.category}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-4">
              {/* Text content */}
              {selected.content && (
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.content}
                  </p>
                </div>
              )}

              {/* File */}
              {selected.fileUrl && (
                <button
                  onClick={() =>
                    setViewerFile({
                      url: selected.fileUrl!,
                      name: selected.fileName || selected.title,
                    })
                  }
                  className="w-full flex items-center gap-3 rounded-lg border border-warm-primary/30 bg-warm-primary/5 px-4 py-3 hover:bg-warm-primary/10 transition-colors text-left"
                >
                  <Eye className="h-5 w-5 text-warm-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {selected.fileName || "Document joint"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Cliquer pour ouvrir le document
                    </p>
                  </div>
                </button>
              )}

              {!selected.content && !selected.fileUrl && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun contenu disponible.
                </p>
              )}
            </div>
          )}
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
