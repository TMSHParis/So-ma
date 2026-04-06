"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const categoryConfig: Record<string, { label: string; icon: typeof Lightbulb }> = {
  nutrition: { label: "Nutrition", icon: Lightbulb },
  sport: { label: "Sport", icon: FileText },
  bienetre: { label: "Bien-être", icon: Heart },
};

export default function RessourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewerFile, setViewerFile] = useState<{ url: string; name: string } | null>(null);

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
                      className="border-warm-border hover:shadow-md transition-shadow"
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
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {resource.content}
                          </p>
                        )}
                        {resource.fileUrl && (
                          <button
                            onClick={() =>
                              setViewerFile({
                                url: resource.fileUrl!,
                                name: resource.fileName || resource.title,
                              })
                            }
                            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-2"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Ouvrir le document
                          </button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

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
