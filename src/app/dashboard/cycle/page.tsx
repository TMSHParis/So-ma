"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Calendar, Plus, Trash2, Droplets, Moon, Sun, Flower2, Loader2 } from "lucide-react";
import { toast } from "sonner";

type CycleEntry = {
  id: string;
  date: string;
  phase: string;
  flowIntensity: string | null;
  symptoms: string[];
  notes: string | null;
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
    label: "Phase lutéale",
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
  "Acné",
  "Insomnie",
  "Anxiété",
  "Nausées",
  "Douleurs lombaires",
];

function todayISO() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export default function CyclePage() {
  const [entries, setEntries] = useState<CycleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [phase, setPhase] = useState("");
  const [flowIntensity, setFlowIntensity] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/client/cycle-entries?range=month");
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      }
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  function toggleSymptom(symptom: string) {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  }

  async function addEntry() {
    if (!phase) return;
    setSaving(true);
    try {
      const res = await fetch("/api/client/cycle-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: todayISO(),
          phase,
          flowIntensity: phase === "MENSTRUATION" ? flowIntensity || null : null,
          symptoms,
          notes: notes || null,
        }),
      });
      if (res.ok) {
        toast.success("Enregistré !");
        setShowForm(false);
        setPhase("");
        setFlowIntensity("");
        setSymptoms([]);
        setNotes("");
        fetchEntries();
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

  async function deleteEntry(id: string) {
    try {
      const res = await fetch(`/api/client/cycle-entries?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Supprimé");
        setEntries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch {
      toast.error("Erreur");
    }
  }

  const latestEntry = entries[0];
  const currentPhase = latestEntry
    ? phases.find((p) => p.value === latestEntry.phase)
    : null;

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
        <Card className="border-warm-border mb-8 overflow-hidden">
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

      {/* Phase cards */}
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
              <Select
                value={phase}
                onValueChange={(v) => v !== null && setPhase(v)}
              >
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
                <Select
                  value={flowIntensity}
                  onValueChange={(v) => v !== null && setFlowIntensity(v)}
                >
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
              disabled={saving || !phase}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
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
                        {phaseInfo?.label}
                      </Badge>
                      {entry.flowIntensity && (
                        <Badge variant="outline" className="text-xs">
                          Flux {entry.flowIntensity.toLowerCase()}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString("fr-FR")}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteEntry(entry.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  {entry.symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {entry.symptoms.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">
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
