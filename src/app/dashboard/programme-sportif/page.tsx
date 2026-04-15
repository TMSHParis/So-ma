"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Loader2, FileText, Eye } from "lucide-react";
import { FileViewer } from "@/components/file-viewer";

type WorkoutPlan = {
  id: string;
  title: string;
  description: string | null;
  content: { text?: string } | string;
  fileUrl: string | null;
  fileName: string | null;
  createdAt: string;
};

export default function ProgrammeSportifPage() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewerFile, setViewerFile] = useState<{ url: string; name: string } | null>(null);

  useEffect(() => {
    fetch("/api/client/workout-plans")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setPlans(data))
      .finally(() => setLoading(false));
  }, []);

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
          Programme sportif
        </h1>
        <p className="text-muted-foreground mt-1">
          Votre planning d'entraînement personnalisé.
        </p>
      </div>

      {plans.length === 0 ? (
        <Card className="border-warm-border">
          <CardContent className="py-12 text-center">
            <Dumbbell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              Votre programme sportif n'a pas encore été créé.
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Il sera disponible après votre consultation avec So-ma.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {plans.map((plan) => {
            let text = "";
            if (typeof plan.content === "string") {
              text = plan.content;
            } else if (
              plan.content &&
              typeof plan.content === "object" &&
              "text" in plan.content &&
              typeof (plan.content as { text?: unknown }).text === "string"
            ) {
              text = (plan.content as { text: string }).text;
            }
            text = text.trim();
            const fileExt = plan.fileName?.split(".").pop()?.toUpperCase() ?? "";
            const isPdf = fileExt === "PDF";

            return (
              <Card key={plan.id} className="border-warm-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
                        <Dumbbell className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{plan.title}</CardTitle>
                        {plan.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {plan.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {new Date(plan.createdAt).toLocaleDateString("fr-FR")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {plan.fileUrl && (
                    <button
                      onClick={() =>
                        setViewerFile({
                          url: plan.fileUrl!,
                          name: plan.fileName || plan.title,
                        })
                      }
                      className="flex items-center gap-3 rounded-xl border border-secondary/20 bg-secondary/5 px-4 py-3.5 hover:bg-secondary/10 hover:border-secondary/40 transition-all w-full text-left group"
                    >
                      <div className="h-10 w-10 rounded-lg bg-secondary/15 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {isPdf ? "Ouvrir le programme (PDF)" : "Ouvrir le document"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Cliquez pour consulter
                        </p>
                      </div>
                      {fileExt && (
                        <Badge variant="secondary" className="text-[10px] font-bold uppercase shrink-0">
                          {fileExt}
                        </Badge>
                      )}
                      <Eye className="h-4 w-4 text-muted-foreground group-hover:text-secondary-foreground shrink-0 transition-colors" />
                    </button>
                  )}
                  {text && (
                    <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed bg-muted/30 rounded-lg p-4">
                      {text}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          <Card className="border-warm-border bg-secondary/5">
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground text-center">
                Adaptez les charges à votre niveau. En complément, visez 7 000 à
                10 000 pas par jour. Échauffez-vous toujours 5-10 minutes avant
                chaque séance.
              </p>
            </CardContent>
          </Card>
        </div>
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
