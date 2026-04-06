"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils, Loader2, FileText, Download } from "lucide-react";

type MealPlan = {
  id: string;
  title: string;
  description: string | null;
  content: { text?: string } | string;
  fileUrl: string | null;
  fileName: string | null;
  createdAt: string;
};

export default function ProgrammeAlimentairePage() {
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/client/meal-plans")
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
          Programme alimentaire
        </h1>
        <p className="text-muted-foreground mt-1">
          Votre plan de repas personnalisé.
        </p>
      </div>

      {plans.length === 0 ? (
        <Card className="border-warm-border">
          <CardContent className="py-12 text-center">
            <Utensils className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              Votre programme alimentaire n&apos;a pas encore été créé.
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Il sera disponible après votre consultation avec So-ma.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {plans.map((plan) => {
            const text =
              typeof plan.content === "string"
                ? plan.content
                : typeof plan.content === "object" && plan.content !== null && "text" in plan.content
                  ? (plan.content as { text: string }).text
                  : JSON.stringify(plan.content, null, 2);

            return (
              <Card key={plan.id} className="border-warm-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Utensils className="h-5 w-5 text-primary" />
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
                    <a
                      href={plan.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 hover:bg-primary/10 transition-colors"
                    >
                      <FileText className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-sm font-medium flex-1 truncate">
                        {plan.fileName || "Programme joint"}
                      </span>
                      <Download className="h-4 w-4 text-primary shrink-0" />
                    </a>
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

          <Card className="border-warm-border bg-primary/5">
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground text-center">
                Ce programme est indicatif et doit être adapté selon vos envies et
                disponibilités. L&apos;important est de respecter les grandes lignes
                tout en gardant du plaisir.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
