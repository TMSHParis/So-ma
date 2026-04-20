"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Flame,
  Droplets,
  Footprints,
  Dumbbell,
  Target,
  Scale,
  TrendingDown,
  TrendingUp,
  Minus,
  Ruler,
  Loader2,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

type Profile = {
  goalCalories: number | null;
  goalProtein: number | null;
  goalCarbs: number | null;
  goalFat: number | null;
  goalFiber: number | null;
  energyBalance: string | null;
  goalWaterL: number | null;
  goalSteps: number | null;
  sessionsPerWeek: number | null;
  sessionTypes: string[];
  startWeight: number | null;
  goalWeight: number | null;
  weight: number | null;
};

type WeightEntry = { date: string; weight: number };
type MeasurementEntry = {
  id: string;
  date: string;
  waistCm: number | null;
  hipCm: number | null;
  buttCm: number | null;
};

const BALANCE_LABELS: Record<string, { label: string; icon: typeof TrendingDown; color: string }> = {
  DEFICIT: { label: "Déficit", icon: TrendingDown, color: "text-blue-600" },
  MAINTENANCE: { label: "Maintien", icon: Minus, color: "text-secondary" },
  SURPLUS: { label: "Prise de masse", icon: TrendingUp, color: "text-amber-600" },
};

const SESSION_LABELS: Record<string, string> = {
  MUSCULATION: "Musculation",
  CARDIO: "Cardio",
  MARCHE: "Marche",
  COURSE: "Course",
  YOGA: "Yoga",
  NATATION: "Natation",
  VELO: "Vélo",
  AUTRE: "Autre",
};

export default function ObjectifsPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [measurements, setMeasurements] = useState<MeasurementEntry[]>([]);
  const [weeklyAvg, setWeeklyAvg] = useState({ calories: 0, burned: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

  // Pesée form
  const [newWeight, setNewWeight] = useState("");
  const [savingWeight, setSavingWeight] = useState(false);

  // Mensuration form
  const [mDate, setMDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [mWaist, setMWaist] = useState("");
  const [mHip, setMHip] = useState("");
  const [mButt, setMButt] = useState("");
  const [savingMeasurement, setSavingMeasurement] = useState(false);
  const [editingMeasurementId, setEditingMeasurementId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/client/profile").then((r) => r.ok ? r.json() : null),
      fetch("/api/client/weight-entries").then((r) => r.ok ? r.json() : []),
      fetch("/api/client/measurement-entries").then((r) => r.ok ? r.json() : []),
      fetch("/api/client/food-entries").then((r) => r.ok ? r.json() : { entries: [] }),
      fetch("/api/client/sport-entries").then((r) => r.ok ? r.json() : { entries: [] }),
    ]).then(([prof, weights, measures, food, sport]) => {
      setProfile(prof);
      setWeightEntries(weights);
      setMeasurements(measures);

      // Calcul moyennes semaine (7 derniers jours)
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const foodEntries = (food.entries || food || []).filter(
        (e: { date: string }) => new Date(e.date) >= weekAgo
      );
      const sportEntries = (sport.entries || sport || []).filter(
        (e: { date: string }) => new Date(e.date) >= weekAgo
      );

      const days = 7;
      const totalCal = foodEntries.reduce((a: number, e: { calories: number }) => a + (e.calories || 0), 0);
      const totalP = foodEntries.reduce((a: number, e: { protein: number }) => a + (e.protein || 0), 0);
      const totalC = foodEntries.reduce((a: number, e: { carbs: number }) => a + (e.carbs || 0), 0);
      const totalF = foodEntries.reduce((a: number, e: { fat: number }) => a + (e.fat || 0), 0);
      const totalFi = foodEntries.reduce((a: number, e: { fiber: number }) => a + (e.fiber || 0), 0);
      const totalBurned = sportEntries.reduce((a: number, e: { calories: number }) => a + (e.calories || 0), 0);

      setWeeklyAvg({
        calories: Math.round(totalCal / days),
        burned: Math.round(totalBurned / days),
        protein: Math.round(totalP / days),
        carbs: Math.round(totalC / days),
        fat: Math.round(totalF / days),
        fiber: Math.round(totalFi / days),
      });

      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleWeighIn() {
    if (!newWeight.trim()) return;
    setSavingWeight(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch("/api/client/weight-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today, weight: Number(newWeight) }),
      });
      if (!res.ok) throw new Error();
      const entry = await res.json();
      setWeightEntries((prev) => {
        const filtered = prev.filter((e) => e.date !== entry.date);
        return [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date));
      });
      setNewWeight("");
      toast.success("Pesée enregistrée");
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSavingWeight(false);
    }
  }

  async function handleMeasurement() {
    if (!mWaist && !mHip && !mButt) return;
    setSavingMeasurement(true);
    try {
      const res = await fetch("/api/client/measurement-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: mDate,
          waistCm: mWaist ? Number(mWaist) : null,
          hipCm: mHip ? Number(mHip) : null,
          buttCm: mButt ? Number(mButt) : null,
        }),
      });
      if (!res.ok) throw new Error();
      const entry = await res.json();
      setMeasurements((prev) =>
        [entry, ...prev].sort((a, b) => b.date.localeCompare(a.date))
      );
      setMWaist("");
      setMHip("");
      setMButt("");
      setMDate(new Date().toISOString().split("T")[0]);
      toast.success("Mensurations enregistrées");
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSavingMeasurement(false);
    }
  }

  async function handleUpdateMeasurementDate(id: string) {
    if (!editDate) return;
    try {
      const res = await fetch(`/api/client/measurement-entries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: editDate }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setMeasurements((prev) =>
        prev
          .map((m) => (m.id === id ? updated : m))
          .sort((a, b) => b.date.localeCompare(a.date))
      );
      setEditingMeasurementId(null);
      toast.success("Date modifiée");
    } catch {
      toast.error("Erreur lors de la modification");
    }
  }

  async function handleDeleteMeasurement(id: string) {
    if (!confirm("Supprimer cette mensuration ?")) return;
    try {
      const res = await fetch(`/api/client/measurement-entries/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setMeasurements((prev) => prev.filter((m) => m.id !== id));
      toast.success("Mensuration supprimée");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) return null;

  const balance = profile.energyBalance ?? "MAINTENANCE";
  const balanceInfo = BALANCE_LABELS[balance] ?? BALANCE_LABELS.MAINTENANCE;
  const BalanceIcon = balanceInfo.icon;

  const waterGlasses = profile.goalWaterL ? Math.round(profile.goalWaterL * 4) : null;

  const chartData = weightEntries.map((e) => ({
    date: new Date(e.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
    poids: e.weight,
  }));

  return (
    <div>
      {/* Titre avec objectif */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <BalanceIcon className={`h-7 w-7 ${balanceInfo.color}`} />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {balanceInfo.label}
          </h1>
        </div>
        {profile.startWeight && profile.goalWeight && (
          <p className="text-muted-foreground mt-1">
            Objectif : {profile.startWeight} kg → {profile.goalWeight} kg
            ({balance === "DEFICIT" ? "-" : "+"}{Math.abs(profile.goalWeight - profile.startWeight).toFixed(1)} kg)
          </p>
        )}
      </div>

      <div className="space-y-6">
        {/* Objectif calorique */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-warm-border">
            <CardContent className="pt-4 pb-4 text-center">
              <Flame className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{profile.goalCalories ?? "—"}</p>
              <p className="text-xs text-muted-foreground">kcal / jour</p>
            </CardContent>
          </Card>
          <Card className="border-warm-border">
            <CardContent className="pt-4 pb-4 text-center">
              <Droplets className="h-5 w-5 text-blue-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">
                {profile.goalWaterL ? `${profile.goalWaterL}L` : "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                {waterGlasses ? `${waterGlasses} verres` : "eau / jour"}
              </p>
            </CardContent>
          </Card>
          <Card className="border-warm-border">
            <CardContent className="pt-4 pb-4 text-center">
              <Footprints className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">
                {profile.goalSteps ? profile.goalSteps.toLocaleString("fr-FR") : "—"}
              </p>
              <p className="text-xs text-muted-foreground">pas / jour</p>
            </CardContent>
          </Card>
          <Card className="border-warm-border">
            <CardContent className="pt-4 pb-4 text-center">
              <Dumbbell className="h-5 w-5 text-purple-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">
                {profile.sessionsPerWeek ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground">séances / sem.</p>
            </CardContent>
          </Card>
        </div>

        {/* Types de séances */}
        {profile.sessionTypes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {profile.sessionTypes.map((t) => (
              <span key={t} className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                {SESSION_LABELS[t] ?? t}
              </span>
            ))}
          </div>
        )}

        {/* Macros & Fibres */}
        <Card className="border-warm-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Macros & fibres (objectif / jour)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Protéines", value: profile.goalProtein, color: "text-red-500" },
                { label: "Glucides", value: profile.goalCarbs, color: "text-amber-500" },
                { label: "Lipides", value: profile.goalFat, color: "text-blue-500" },
                { label: "Fibres", value: profile.goalFiber, color: "text-green-600" },
              ].map((m) => (
                <div key={m.label} className="text-center py-3 rounded-xl bg-muted/40">
                  <p className="text-2xl font-bold text-foreground">{m.value ?? "—"}<span className="text-sm font-normal text-muted-foreground">g</span></p>
                  <p className={`text-xs font-medium ${m.color}`}>{m.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Courbe de poids */}
        <Card className="border-warm-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Évolution du poids</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {chartData.length >= 2 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 11 }} unit=" kg" />
                  <Tooltip formatter={(v) => [`${v} kg`, "Poids"]} />
                  {profile.goalWeight && (
                    <ReferenceLine y={profile.goalWeight} stroke="#8FA586" strokeDasharray="5 5" label={{ value: "Objectif", fontSize: 11, fill: "#8FA586" }} />
                  )}
                  <Line type="monotone" dataKey="poids" stroke="#26474E" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Pas assez de données. Pèse-toi chaque semaine pour voir ta courbe.
              </p>
            )}

            {/* Pesée hebdo */}
            <div className="mt-4 pt-4 border-t border-warm-border">
              <p className="text-sm font-medium text-foreground mb-2">Pesée hebdomadaire</p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 65.2"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="max-w-[140px]"
                />
                <Button
                  onClick={handleWeighIn}
                  disabled={savingWeight || !newWeight.trim()}
                  className="bg-primary hover:bg-primary/90 text-white"
                  size="sm"
                >
                  {savingWeight ? "..." : "Enregistrer"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mensurations mensuelles */}
        <Card className="border-warm-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Ruler className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Mensurations mensuelles</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1 max-w-[200px]">
              <Label className="text-xs">Date</Label>
              <Input
                type="date"
                value={mDate}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setMDate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Taille (cm)</Label>
                <Input type="number" step="0.5" placeholder="—" value={mWaist} onChange={(e) => setMWaist(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Hanches (cm)</Label>
                <Input type="number" step="0.5" placeholder="—" value={mHip} onChange={(e) => setMHip(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Fesses (cm)</Label>
                <Input type="number" step="0.5" placeholder="—" value={mButt} onChange={(e) => setMButt(e.target.value)} />
              </div>
            </div>
            <Button
              onClick={handleMeasurement}
              disabled={savingMeasurement || (!mWaist && !mHip && !mButt)}
              className="bg-primary hover:bg-primary/90 text-white"
              size="sm"
            >
              {savingMeasurement ? "..." : "Enregistrer les mensurations"}
            </Button>

            {measurements.length > 0 && (
              <div className="mt-4 pt-4 border-t border-warm-border">
                <p className="text-sm font-medium text-foreground mb-2">Historique</p>
                <div className="space-y-2">
                  {measurements.slice(0, 6).map((m) => (
                    <div key={m.id} className="flex items-center justify-between gap-2 text-sm py-1.5 border-b border-black/[0.04] last:border-0">
                      {editingMeasurementId === m.id ? (
                        <>
                          <Input
                            type="date"
                            value={editDate}
                            max={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="h-8 max-w-[160px]"
                          />
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleUpdateMeasurementDate(m.id)}
                              className="p-1 text-primary hover:bg-primary/10 rounded"
                              aria-label="Valider"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingMeasurementId(null)}
                              className="p-1 text-muted-foreground hover:bg-muted rounded"
                              aria-label="Annuler"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-muted-foreground">
                            {new Date(m.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                          </span>
                          <div className="flex items-center gap-3">
                            <div className="flex gap-4 text-foreground">
                              {m.waistCm && <span>Taille: {m.waistCm}cm</span>}
                              {m.hipCm && <span>Hanches: {m.hipCm}cm</span>}
                              {m.buttCm && <span>Fesses: {m.buttCm}cm</span>}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingMeasurementId(m.id);
                                  setEditDate(m.date.slice(0, 10));
                                }}
                                className="p-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded"
                                aria-label="Modifier la date"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteMeasurement(m.id)}
                                className="p-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded"
                                aria-label="Supprimer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Moyennes hebdomadaires */}
        <Card className="border-warm-border">
          <CardHeader>
            <CardTitle className="text-base">Moyennes sur 7 jours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center py-3 rounded-xl bg-muted/40">
                <p className="text-xl font-bold text-foreground">{weeklyAvg.calories}</p>
                <p className="text-xs text-muted-foreground">kcal consommées / jour</p>
              </div>
              <div className="text-center py-3 rounded-xl bg-muted/40">
                <p className="text-xl font-bold text-foreground">{weeklyAvg.burned}</p>
                <p className="text-xs text-muted-foreground">kcal dépensées / jour</p>
              </div>
              <div className="text-center py-3 rounded-xl bg-muted/40">
                <p className="text-xl font-bold text-foreground">{weeklyAvg.protein}g</p>
                <p className="text-xs text-red-500">Protéines</p>
              </div>
              <div className="text-center py-3 rounded-xl bg-muted/40">
                <p className="text-xl font-bold text-foreground">{weeklyAvg.carbs}g</p>
                <p className="text-xs text-amber-500">Glucides</p>
              </div>
              <div className="text-center py-3 rounded-xl bg-muted/40">
                <p className="text-xl font-bold text-foreground">{weeklyAvg.fat}g</p>
                <p className="text-xs text-blue-500">Lipides</p>
              </div>
              <div className="text-center py-3 rounded-xl bg-muted/40">
                <p className="text-xl font-bold text-foreground">{weeklyAvg.fiber}g</p>
                <p className="text-xs text-green-600">Fibres</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
