"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { EnergyBalance } from "@/generated/prisma/client";
import { Flame, Target, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

type Profile = {
  goalCalories: number | null;
  goalProtein: number | null;
  goalCarbs: number | null;
  goalFat: number | null;
  goalFiber: number | null;
  maintenanceCalories: number | null;
  energyBalance: EnergyBalance | null;
  caloricDeltaKcal: number;
  weight: number | null;
  height: number | null;
  waistCm: number | null;
  hipCm: number | null;
  thighCm: number | null;
};

const MODES: {
  value: EnergyBalance;
  label: string;
  hint: string;
}[] = [
  {
    value: "MAINTENANCE",
    label: "Maintien",
    hint: "Stabiliser votre poids avec un apport proche du métabolisme.",
  },
  {
    value: "DEFICIT",
    label: "Déficit calorique",
    hint: "Moins de calories que le maintien pour une perte de masse graduelle.",
  },
  {
    value: "SURPLUS",
    label: "Surplus",
    hint: "Plus de calories que le maintien pour gagner en masse ou en force.",
  },
];

export default function ObjectifsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [maintenance, setMaintenance] = useState("");
  const [mode, setMode] = useState<EnergyBalance>("MAINTENANCE");
  const [deficitKcal, setDeficitKcal] = useState("300");
  const [surplusKcal, setSurplusKcal] = useState("250");

  const [goalProtein, setGoalProtein] = useState("120");
  const [goalCarbs, setGoalCarbs] = useState("200");
  const [goalFat, setGoalFat] = useState("60");
  const [goalFiber, setGoalFiber] = useState("25");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [waistCm, setWaistCm] = useState("");
  const [hipCm, setHipCm] = useState("");
  const [thighCm, setThighCm] = useState("");
  /** Si vous ne renseignez pas le maintien, cette cible en kcal est enregistrée. */
  const [targetCaloriesFallback, setTargetCaloriesFallback] = useState("1800");

  const previewGoal = useMemo(() => {
    const m = parseInt(maintenance, 10);
    if (Number.isNaN(m)) return null;
    if (mode === "MAINTENANCE") return m;
    if (mode === "DEFICIT") {
      const d = parseInt(deficitKcal, 10) || 0;
      return m - d;
    }
    const s = parseInt(surplusKcal, 10) || 0;
    return m + s;
  }, [maintenance, mode, deficitKcal, surplusKcal]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/client/profile");
        if (!res.ok) throw new Error();
        const data = (await res.json()) as Profile;
        if (cancelled) return;
        if (data.maintenanceCalories != null) {
          setMaintenance(String(data.maintenanceCalories));
        } else {
          setMaintenance("");
        }
        if (data.goalCalories != null) {
          setTargetCaloriesFallback(String(data.goalCalories));
        }
        setMode(data.energyBalance ?? "MAINTENANCE");
        if (data.energyBalance === "DEFICIT") {
          setDeficitKcal(
            data.caloricDeltaKcal < 0
              ? String(Math.abs(data.caloricDeltaKcal))
              : "300"
          );
        }
        if (data.energyBalance === "SURPLUS" && data.caloricDeltaKcal > 0) {
          setSurplusKcal(String(data.caloricDeltaKcal));
        }
        if (data.goalProtein != null) setGoalProtein(String(data.goalProtein));
        if (data.goalCarbs != null) setGoalCarbs(String(data.goalCarbs));
        if (data.goalFat != null) setGoalFat(String(data.goalFat));
        if (data.goalFiber != null) setGoalFiber(String(data.goalFiber));
        if (data.weight != null) setWeight(String(data.weight));
        if (data.height != null) setHeight(String(data.height));
        if (data.waistCm != null) setWaistCm(String(data.waistCm));
        if (data.hipCm != null) setHipCm(String(data.hipCm));
        if (data.thighCm != null) setThighCm(String(data.thighCm));
      } catch {
        toast.error("Impossible de charger vos objectifs");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const maintRaw = maintenance.trim();
      const maint =
        maintRaw === "" ? null : parseInt(maintRaw, 10);
      let delta = 0;
      if (mode === "DEFICIT")
        delta = -(parseInt(deficitKcal, 10) || 0);
      else if (mode === "SURPLUS") delta = parseInt(surplusKcal, 10) || 0;

      const body: Record<string, unknown> = {
        energyBalance: mode,
        caloricDeltaKcal: delta,
        goalProtein: parseInt(goalProtein, 10) || 0,
        goalCarbs: parseInt(goalCarbs, 10) || 0,
        goalFat: parseInt(goalFat, 10) || 0,
        goalFiber: parseInt(goalFiber, 10) || 0,
      };

      if (maint != null && !Number.isNaN(maint)) {
        body.maintenanceCalories = maint;
      } else {
        body.maintenanceCalories = null;
        body.goalCalories =
          parseInt(targetCaloriesFallback, 10) || 1800;
      }

      const parseOpt = (s: string) => {
        const v = Number.parseFloat(s.trim());
        return s.trim() === "" || !Number.isFinite(v) ? null : v;
      };

      const res = await fetch("/api/client/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          weight: parseOpt(weight),
          height: parseOpt(height),
          waistCm: parseOpt(waistCm),
          hipCm: parseOpt(hipCm),
          thighCm: parseOpt(thighCm),
        }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      toast.success("Objectifs enregistrés");
      if (updated.goalCalories != null) {
        setTargetCaloriesFallback(String(updated.goalCalories));
      }
      if (updated.maintenanceCalories != null) {
        setMaintenance(String(updated.maintenanceCalories));
      }
    } catch {
      toast.error("Enregistrement impossible");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-1/3" />
        <div className="h-48 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-foreground">
          Mes objectifs
        </h1>
        <p className="text-muted-foreground mt-1">
          Équilibre énergétique et macros quotidiens — alignés avec votre
          accompagnement.
        </p>
      </div>

      <div className="space-y-8">
        <Card className="border-warm-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Équilibre énergétique</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MODES.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMode(m.value)}
                  className={cn(
                    "text-left rounded-xl border p-4 transition-colors",
                    mode === m.value
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-warm-border hover:bg-muted/50"
                  )}
                >
                  <p className="font-medium text-sm">{m.label}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">
                    {m.hint}
                  </p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="target-fallback">
                  Cible calories (kcal / jour) — si vous laissez le maintien vide
                </Label>
                <Input
                  id="target-fallback"
                  type="number"
                  min={0}
                  value={targetCaloriesFallback}
                  onChange={(e) => setTargetCaloriesFallback(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenance">
                  Apport calorique de maintien (kcal)
                </Label>
                <Input
                  id="maintenance"
                  type="number"
                  min={0}
                  placeholder="Ex. 2 000"
                  value={maintenance}
                  onChange={(e) => setMaintenance(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Souvent votre TDEE ou la valeur fixée avec votre coach. Si vous
                  ne le connaissez pas, vous pouvez ne renseigner qu’une cible en
                  kcal ci-dessous : utilisez alors « Maintien » et la même valeur.
                </p>
              </div>

              {mode === "DEFICIT" && (
                <div className="space-y-2">
                  <Label htmlFor="deficit">Réduction vis-à-vis du maintien (kcal / jour)</Label>
                  <Input
                    id="deficit"
                    type="number"
                    min={0}
                    value={deficitKcal}
                    onChange={(e) => setDeficitKcal(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Ex. 300 kcal de moins par jour que le maintien.
                  </p>
                </div>
              )}

              {mode === "SURPLUS" && (
                <div className="space-y-2">
                  <Label htmlFor="surplus">Surplus vis-à-vis du maintien (kcal / jour)</Label>
                  <Input
                    id="surplus"
                    type="number"
                    min={0}
                    value={surplusKcal}
                    onChange={(e) => setSurplusKcal(e.target.value)}
                  />
                </div>
              )}
            </div>

            {previewGoal != null && (
              <p className="text-sm rounded-lg bg-muted/60 px-3 py-2">
                <span className="font-medium">Objectif calorique calculé :</span>{" "}
                {previewGoal} kcal / jour
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-warm-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-secondary-foreground" />
              <CardTitle className="text-base">Macronutriments & fibres</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Protéines (g)</Label>
                <Input
                  type="number"
                  min={0}
                  value={goalProtein}
                  onChange={(e) => setGoalProtein(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Glucides (g)</Label>
                <Input
                  type="number"
                  min={0}
                  value={goalCarbs}
                  onChange={(e) => setGoalCarbs(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Lipides (g)</Label>
                <Input
                  type="number"
                  min={0}
                  value={goalFat}
                  onChange={(e) => setGoalFat(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Fibres (g)</Label>
                <Input
                  type="number"
                  min={0}
                  value={goalFiber}
                  onChange={(e) => setGoalFiber(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-warm-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-accent-foreground" />
              <CardTitle className="text-base">Référentiel (optionnel)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Poids (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="—"
                />
              </div>
              <div className="space-y-2">
                <Label>Taille (cm)</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="—"
                />
              </div>
            </div>
            <div className="border-t border-warm-border pt-4">
              <p className="text-sm font-medium text-foreground mb-3">Mensurations</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tour de taille (cm)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={waistCm}
                    onChange={(e) => setWaistCm(e.target.value)}
                    placeholder="—"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tour de hanches (cm)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={hipCm}
                    onChange={(e) => setHipCm(e.target.value)}
                    placeholder="—"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tour de cuisse (cm)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={thighCm}
                    onChange={(e) => setThighCm(e.target.value)}
                    placeholder="—"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          className="bg-primary hover:bg-primary/90 text-white"
          disabled={saving}
          onClick={handleSave}
        >
          {saving ? "Enregistrement…" : "Enregistrer mes objectifs"}
        </Button>
      </div>
    </div>
  );
}
