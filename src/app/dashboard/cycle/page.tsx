"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, Plus, Droplets, Moon, Sun, Flower2 } from "lucide-react";

type CycleDay = {
  id: string;
  date: string;
  phase: string;
  phaseLabel: string;
  flowIntensity?: string;
  symptoms: string[];
  notes: string;
};

const phases = [
  {
    value: "MENSTRUATION",
    label: "Menstruation",
    icon: Droplets,
    color: "bg-red-100 text-red-700",
    desc: "Phase de règles. Repos et douceur recommandés.",
  },
  {
    value: "FOLLICULAIRE",
    label: "Phase folliculaire",
    icon: Flower2,
    color: "bg-green-100 text-green-700",
    desc: "Énergie montante. Bon moment pour de nouveaux défis.",
  },
  {
    value: "OVULATION",
    label: "Ovulation",
    icon: Sun,
    color: "bg-amber-100 text-amber-700",
    desc: "Pic d'énergie. Idéal pour les séances intenses.",
  },
  {
    value: "LUTEALE",
    label: "Phase luteale",
    icon: Moon,
    color: "bg-purple-100 text-purple-700",
    desc: "Énergie descendante. Privilégiez le repos et le confort.",
  },
];

const symptomsList = [
  "Crampes",
  "Fatigue",
  "Ballonnements",
  "Maux de tête",
  "Irritabilité",
  "Fringales",
  "Douleurs mammaires",
  "Acne",
  "Insomnie",
  "Anxiété",
  "Nausées",
  "Douleurs lombaires",
];

export default function CyclePage() {
  const [entries, setEntries] = useState<CycleDay[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [phase, setPhase] = useState("");
  const [flowIntensity, setFlowIntensity] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  function toggleSymptom(symptom: string) {
    setSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  }

  function addEntry() {
    if (!phase) return;
    const phaseInfo = phases.find((p) => p.value === phase);
    const entry: CycleDay = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      phase,
      phaseLabel: phaseInfo?.label || "",
      flowIntensity: phase === "MENSTRUATION" ? flowIntensity : undefined,
      symptoms,
      notes,
    };
    setEntries((prev) => [entry, ...prev]);
    setShowForm(false);
    setPhase("");
    setFlowIntensity("");
    setSymptoms([]);
    setNotes("");
  }

  const currentPhase = entries[0]
    ? phases.find((p) => p.value === entries[0].phase)
    : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-foreground">
            Suivi du cycle menstruel
          </h1>
          <p className="text-muted-foreground mt-1">
            Suivez vos phases et symptômes pour adapter votre routine.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Enregistrer aujourd&apos;hui
        </Button>
      </div>

      {/* Current phase info */}
      {currentPhase && (
        <Card className={`border-warm-border mb-8 overflow-hidden`}>
          <div className={`${currentPhase.color} px-6 py-4`}>
            <div className="flex items-center gap-3">
              <currentPhase.icon className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">{currentPhase.label}</h3>
                <p className="text-sm opacity-80">{currentPhase.desc}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Phase cards info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {phases.map((p) => (
          <Card key={p.value} className="border-warm-border">
            <CardContent className="pt-4 pb-4 text-center">
              <div
                className={`w-10 h-10 ${p.color} rounded-full flex items-center justify-center mx-auto mb-2`}
              >
                <p.icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-medium">{p.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add entry form */}
      {showForm && (
        <Card className="border-warm-border mb-8">
          <CardHeader>
            <CardTitle className="text-base">
              Enregistrement du{" "}
              {new Date().toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Phase actuelle</Label>
              <Select value={phase} onValueChange={(v) => v !== null && setPhase(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez la phase" />
                </SelectTrigger>
                <SelectContent>
                  {phases.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {phase === "MENSTRUATION" && (
              <div className="space-y-2">
                <Label>Intensité du flux</Label>
                <Select value={flowIntensity} onValueChange={(v) => v !== null && setFlowIntensity(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LEGER">Léger</SelectItem>
                    <SelectItem value="MOYEN">Moyen</SelectItem>
                    <SelectItem value="ABONDANT">Abondant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Symptômes</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {symptomsList.map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <Checkbox
                      checked={symptoms.includes(s)}
                      onCheckedChange={() => toggleSymptom(s)}
                    />
                    <span className="text-sm">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Humeur, énergie, alimentation..."
                className="border-warm-border"
              />
            </div>

            <Button
              onClick={addEntry}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Enregistrer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* History */}
      <h2 className="font-semibold text-foreground mb-4">Historique</h2>
      {entries.length === 0 ? (
        <Card className="border-warm-border">
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              Aucun enregistrement pour l&apos;instant
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => {
            const phaseInfo = phases.find((p) => p.value === entry.phase);
            return (
              <Card key={entry.id} className="border-warm-border">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={phaseInfo?.color}>
                        {entry.phaseLabel}
                      </Badge>
                      {entry.flowIntensity && (
                        <Badge variant="outline" className="text-xs">
                          Flux {entry.flowIntensity.toLowerCase()}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  {entry.symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {entry.symptoms.map((s) => (
                        <Badge
                          key={s}
                          variant="secondary"
                          className="text-xs"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {entry.notes && (
                    <p className="text-sm text-muted-foreground italic">
                      {entry.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
