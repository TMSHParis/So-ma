"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

const phaseDetails = [
  {
    phase: "PHASE 1",
    label: "Menstruelle",
    days: "Jours 1–5",
    color: "text-red-500",
    labelColor: "text-red-700",
    sections: [
      {
        title: "HORMONES",
        text: "Œstrogènes et progestérone au plus bas. Le corps \"repart de zéro\".",
      },
      {
        title: "HUMEUR",
        text: "Fatigue, besoin de retrait, hyper-sensibilité possible.",
      },
      {
        title: "POIDS",
        text: "Rétention d'eau qui commence à partir → léger dégonflement en fin de phase.",
      },
      {
        title: "ÉNERGIE & SPORT",
        text: "Faible. Privilégier marche, yoga doux, étirements. Pas le moment de se pousser.",
      },
    ],
    metabolism: { label: "Bas", value: "-100 à -150 kcal/j", color: "text-red-500" },
  },
  {
    phase: "PHASE 2",
    label: "Folliculaire",
    days: "Jours 6–13",
    color: "text-blue-500",
    labelColor: "text-blue-700",
    sections: [
      {
        title: "HORMONES",
        text: "Les œstrogènes montent progressivement. Le follicule se développe.",
      },
      {
        title: "HUMEUR",
        text: "Retour de l'énergie, optimisme, envie de socialiser. La \"meilleure version\".",
      },
      {
        title: "POIDS",
        text: "Plus stable, moins de rétention. Le ventre dégonfle.",
      },
      {
        title: "ÉNERGIE & SPORT",
        text: "En hausse. Bonne phase pour reprendre l'intensité : cardio, musculation, HIIT léger.",
      },
    ],
    metabolism: { label: "Neutre", value: "Base", color: "text-blue-500" },
  },
  {
    phase: "PHASE 3",
    label: "Ovulatoire",
    days: "Jours 14–16",
    color: "text-amber-500",
    labelColor: "text-amber-700",
    sections: [
      {
        title: "HORMONES",
        text: "Pic d'œstrogènes + surge de LH → ovulation. Testostérone aussi au pic.",
      },
      {
        title: "HUMEUR",
        text: "Confiance, élan, sociabilité maximale. Pic de libido souvent.",
      },
      {
        title: "POIDS",
        text: "Légère rétention possible liée au pic hormonal, souvent invisible.",
      },
      {
        title: "ÉNERGIE & SPORT",
        text: "Maximale. Phase idéale pour les PR, séances HIIT, efforts intenses. Le corps récupère vite.",
      },
    ],
    metabolism: { label: "Légèrement élevé", value: "+50 à +100 kcal/j", color: "text-amber-500" },
  },
  {
    phase: "PHASE 4",
    label: "Lutéale",
    days: "Jours 17–28",
    color: "text-purple-500",
    labelColor: "text-purple-700",
    sections: [
      {
        title: "HORMONES",
        text: "La progestérone domine et monte la température corporelle. Les œstrogènes redescendent vers la fin.",
      },
      {
        title: "HUMEUR",
        text: "Irritabilité, anxiété, besoin de calme possible. SPM en fin de phase.",
      },
      {
        title: "POIDS",
        text: "Rétention d'eau visible (1 à 2 kg parfois), ventre gonflé. C'est hormonal, pas du gras.",
      },
      {
        title: "ÉNERGIE & SPORT",
        text: "Variable selon la moitié de la phase. Début : encore correct. Fin : préférer pilates, natation, marche.",
      },
    ],
    metabolism: { label: "Le plus élevé", value: "+100 à +300 kcal/j", color: "text-purple-500" },
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
  "Rétention d'eau",
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
  const formRef = useRef<HTMLDivElement>(null);

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
    if (!phase) {
      toast.error("Sélectionne d'abord ta phase du cycle");
      return;
    }
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
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 100);
            }
          }}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Enregistrer aujourd'hui
        </Button>
      </div>

      {/* Journal form - appears right after header */}
      {showForm && (
        <div ref={formRef}>
          <Card className="border-warm-border mb-8">
            <CardHeader>
              <CardTitle className="text-base">
                Mon journal du{" "}
                {new Date().toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Dans quelle phase de ton cycle es-tu ?</Label>
                <Select
                  value={phase || undefined}
                  onValueChange={(v) => { if (v) setPhase(v); }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionne ta phase" />
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
                    value={flowIntensity || undefined}
                    onValueChange={(v) => { if (v) setFlowIntensity(v); }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionne" />
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
                <Label>Comment te sens-tu aujourd'hui ?</Label>
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
                <Label>Ton ressenti du jour (journal)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Comment te sens-tu ? Énergie, humeur, alimentation, sommeil..."
                  className="border-warm-border min-h-[100px]"
                />
              </div>

              <Button
                onClick={addEntry}
                disabled={saving}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

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

      {/* Phase detail cards */}
      <div className="mb-8">
        <h2 className="font-semibold text-foreground mb-2">Comprendre ton cycle</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Plus tu avances dans le cycle, plus ton corps brûle — pic en phase lutéale (+100 à +300 kcal/j grâce à la progestérone), plancher en phase menstruelle. La rétention d'eau de la phase lutéale n'a rien à voir avec ta balance réelle.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phaseDetails.map((p) => (
            <Card key={p.phase} className="border-warm-border">
              <CardContent className="pt-5 pb-5 space-y-3">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wide ${p.color}`}>
                    {p.phase}
                  </p>
                  <h3 className={`text-lg font-bold ${p.labelColor}`}>{p.label}</h3>
                  <p className={`text-sm ${p.color}`}>{p.days}</p>
                </div>
                {p.sections.map((s) => (
                  <div key={s.title}>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                      {s.title}
                    </p>
                    <p className="text-sm text-foreground">{s.text}</p>
                  </div>
                ))}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                    MÉTABOLISME
                  </p>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${p.metabolism.color}`}>
                      {p.metabolism.label}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {p.metabolism.value}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* History */}
      <h2 className="font-semibold text-foreground mb-4">Historique</h2>
      {entries.length === 0 ? (
        <Card className="border-warm-border">
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              Aucun enregistrement pour l'instant
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
