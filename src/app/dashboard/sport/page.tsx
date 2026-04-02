"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { calendarDateInTimeZone, CLIENT_TIMEZONE } from "@/lib/calendar-day";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Dumbbell,
  Footprints,
  Timer,
  Flame,
  Bike,
  Waves,
} from "lucide-react";

type SportSession = {
  id: string;
  type: string;
  typeLabel: string;
  duration: number;
  calories?: number;
  steps?: number;
  distance?: number;
  exercises?: { name: string; sets: number; reps: number; weight: number }[];
  treadmill?: { speed: number; incline: number };
  walkSpeed?: number;
  notes: string;
};

const sportTypes = [
  { value: "MUSCULATION", label: "Musculation", icon: Dumbbell },
  { value: "CARDIO", label: "Cardio", icon: Flame },
  { value: "MARCHE", label: "Marche", icon: Footprints },
  { value: "COURSE", label: "Course à pied", icon: Footprints },
  { value: "YOGA", label: "Yoga / Pilates", icon: Waves },
  { value: "NATATION", label: "Natation", icon: Waves },
  { value: "VELO", label: "Vélo", icon: Bike },
  { value: "AUTRE", label: "Autre", icon: Timer },
];

/**
 * Estime la durée de marche en minutes à partir du nombre de pas.
 *
 * Longueur de foulée : basée sur la taille (cm) × 0.414 (facteur moyen marche).
 * Si la taille n'est pas connue, on utilise 70 cm par défaut.
 * Vitesse de marche : basée sur la vitesse fournie (km/h) ou estimée selon l'âge.
 *   - < 30 ans : 5.0 km/h
 *   - 30-50 ans : 4.8 km/h
 *   - 50-65 ans : 4.5 km/h
 *   - > 65 ans : 4.0 km/h
 */
/**
 * MET (Metabolic Equivalent of Task) pour la marche selon la vitesse.
 * Source : Compendium of Physical Activities (Ainsworth et al.)
 *   - 3.2 km/h : MET 2.8
 *   - 4.0 km/h : MET 3.0
 *   - 4.8 km/h : MET 3.5
 *   - 5.6 km/h : MET 4.3
 *   - 6.4 km/h : MET 5.0
 */
function walkingMET(speedKmh: number, incline: number = 0): number {
  let met: number;
  if (speedKmh <= 3.2) met = 2.8;
  else if (speedKmh <= 4.0) met = 3.0;
  else if (speedKmh <= 4.8) met = 3.5;
  else if (speedKmh <= 5.6) met = 4.3;
  else met = 5.0;
  // Inclinaison : +0.7 MET par % d'inclinaison (approx tapis)
  if (incline > 0) met += incline * 0.7;
  return met;
}

function estimateWalkingMinutes(
  steps: number,
  heightCm: number | null,
  age: number | null,
  weightKg: number | null,
  speedKmh: number | null,
  incline: number = 0,
): { minutes: number; distanceKm: number; calories: number } {
  // Longueur de foulée en cm
  const strideCm = heightCm && heightCm > 50 ? heightCm * 0.414 : 70;
  const distanceKm = (steps * strideCm) / 100_000;

  // Vitesse de marche
  let speed = speedKmh;
  if (!speed || speed <= 0) {
    if (!age || age < 30) speed = 5.0;
    else if (age < 50) speed = 4.8;
    else if (age < 65) speed = 4.5;
    else speed = 4.0;
  }

  const hours = distanceKm / speed;
  const minutes = Math.round(hours * 60);

  // Calories : MET × poids (kg) × durée (heures)
  const weight = weightKg && weightKg > 0 ? weightKg : 65;
  const met = walkingMET(speed, incline);
  const calories = Math.round(met * weight * hours);

  return { minutes, distanceKm: Math.round(distanceKm * 100) / 100, calories };
}

/** Estime les calories sur tapis avec vitesse, durée et inclinaison */
function estimateTreadmillCalories(
  speedKmh: number,
  durationMin: number,
  incline: number,
  weightKg: number | null,
): number {
  const weight = weightKg && weightKg > 0 ? weightKg : 65;
  const met = walkingMET(speedKmh, incline);
  return Math.round(met * weight * (durationMin / 60));
}

export default function SportPage() {
  const todayIso = useMemo(
    () => calendarDateInTimeZone(CLIENT_TIMEZONE),
    []
  );

  const [sessions, setSessions] = useState<SportSession[]>([]);
  const [ready, setReady] = useState(false);
  const [quickSteps, setQuickSteps] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sportType, setSportType] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [steps, setSteps] = useState("");
  const [distance, setDistance] = useState("");
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState([
    { name: "", sets: 0, reps: 0, weight: 0 },
  ]);

  // Walking specific
  const [walkMode, setWalkMode] = useState<"outdoor" | "treadmill">("outdoor");
  const [walkSpeed, setWalkSpeed] = useState("");
  const [treadmillSpeed, setTreadmillSpeed] = useState("");
  const [treadmillDuration, setTreadmillDuration] = useState("");
  const [treadmillIncline, setTreadmillIncline] = useState("");

  // Client profile for walk estimation
  const [clientHeight, setClientHeight] = useState<number | null>(null);
  const [clientAge, setClientAge] = useState<number | null>(null);
  const [clientWeight, setClientWeight] = useState<number | null>(null);

  // Fetch client profile for height/age/weight
  useEffect(() => {
    fetch("/api/client/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.height) {
          let h = Number(data.height);
          if (h < 3) h = Math.round(h * 100);
          setClientHeight(h);
        }
        if (data.weight) setClientWeight(Number(data.weight));
        if (data.birthDate) {
          const birth = new Date(data.birthDate);
          const ageDiff = Date.now() - birth.getTime();
          setClientAge(Math.floor(ageDiff / (365.25 * 24 * 60 * 60 * 1000)));
        }
      })
      .catch(() => {});
  }, []);

  const mapApiToSession = useCallback(
    (e: {
      id: string;
      sportType: string;
      duration: number | null;
      calories: number | null;
      steps: number | null;
      distance: number | null;
      details: unknown;
      notes: string | null;
    }): SportSession => {
      const info = sportTypes.find((s) => s.value === e.sportType);
      const d = e.details as {
        exercises?: {
          name: string;
          sets: number;
          reps: number;
          weight: number;
        }[];
        treadmill?: { speed: number; incline: number };
        walkSpeed?: number;
      } | null;
      return {
        id: e.id,
        type: e.sportType,
        typeLabel: info?.label ?? e.sportType,
        duration: e.duration ?? 0,
        calories: e.calories ?? undefined,
        steps: e.steps ?? undefined,
        distance: e.distance ?? undefined,
        exercises: d?.exercises,
        treadmill: d?.treadmill,
        walkSpeed: d?.walkSpeed,
        notes: e.notes ?? "",
      };
    },
    []
  );

  const refreshSessions = useCallback(async () => {
    try {
      const res = await fetch(`/api/client/sport-entries?date=${todayIso}`);
      if (!res.ok) {
        if (res.status === 401) toast.error("Session expirée");
        return;
      }
      const { entries } = await res.json();
      setSessions(
        (entries as Parameters<typeof mapApiToSession>[0][]).map(mapApiToSession)
      );
    } catch {
      toast.error("Impossible de charger le suivi sportif");
    } finally {
      setReady(true);
    }
  }, [todayIso, mapApiToSession]);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  function addExercise() {
    setExercises((prev) => [...prev, { name: "", sets: 0, reps: 0, weight: 0 }]);
  }

  function updateExercise(
    index: number,
    field: string,
    value: string | number
  ) {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex))
    );
  }

  function removeExercise(index: number) {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  }

  async function addSession() {
    const typeInfo = sportTypes.find((s) => s.value === sportType);
    if (!typeInfo) return;

    let dur = parseInt(duration, 10) || 0;
    let sessionSteps: number | null = steps ? parseInt(steps, 10) : null;
    let sessionDistance: number | null = distance ? parseFloat(distance) : null;
    let details: Record<string, unknown> | null = null;

    let estimatedCalories: number | null = null;

    if (sportType === "MARCHE") {
      if (walkMode === "treadmill") {
        // Tapis : durée et vitesse fournies par l'utilisateur
        const speed = parseFloat(treadmillSpeed) || 5;
        dur = parseInt(treadmillDuration, 10) || dur;
        const incline = parseFloat(treadmillIncline) || 0;
        sessionDistance = Math.round((speed * dur / 60) * 100) / 100;

        // Estimation pas sur tapis
        const strideCm = clientHeight && clientHeight > 50 ? clientHeight * 0.414 : 70;
        const strideKm = strideCm / 100_000;
        sessionSteps = Math.round(sessionDistance / strideKm);

        estimatedCalories = estimateTreadmillCalories(speed, dur, incline, clientWeight);
        details = { treadmill: { speed, incline } };
      } else {
        // Marche en ville : estimer durée à partir des pas
        const speedVal = parseFloat(walkSpeed) || 0;
        if (sessionSteps && sessionSteps > 0) {
          const est = estimateWalkingMinutes(sessionSteps, clientHeight, clientAge, clientWeight, speedVal || null);
          if (!dur || dur === 0) dur = est.minutes;
          if (!sessionDistance) sessionDistance = est.distanceKm;
          estimatedCalories = est.calories;
        }
        if (speedVal > 0) {
          details = { walkSpeed: speedVal };
        }
      }
    }

    if (sportType === "MUSCULATION") {
      const ex = exercises.filter((e) => e.name.trim());
      if (ex.length > 0) details = { ...details, exercises: ex };
    }

    if (!dur && sportType !== "MARCHE") return;

    try {
      const res = await fetch("/api/client/sport-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: todayIso,
          sportType,
          duration: dur,
          calories: calories ? parseInt(calories, 10) : estimatedCalories,
          steps: sessionSteps,
          distance: sessionDistance,
          details,
          notes: notes || null,
        }),
      });
      if (!res.ok) throw new Error();
      const row = await res.json();
      setSessions((prev) => [...prev, mapApiToSession(row)]);
      setDialogOpen(false);
      resetForm();
    } catch {
      toast.error("Enregistrement impossible");
    }
  }

  async function addStepsOnly() {
    const n = parseInt(quickSteps, 10);
    if (Number.isNaN(n) || n <= 0) {
      toast.error("Indiquez un nombre de pas");
      return;
    }

    const est = estimateWalkingMinutes(n, clientHeight, clientAge, clientWeight, null);

    try {
      const res = await fetch("/api/client/sport-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: todayIso,
          sportType: "MARCHE",
          duration: est.minutes,
          calories: est.calories,
          steps: n,
          distance: est.distanceKm,
          details: null,
          notes: "Pas du jour",
        }),
      });
      if (!res.ok) throw new Error();
      const row = await res.json();
      setSessions((prev) => [
        ...prev,
        mapApiToSession(row),
      ]);
      setQuickSteps("");
      toast.success(`${n.toLocaleString()} pas ≈ ${est.minutes} min · ${est.distanceKm} km · ${est.calories} kcal`);
    } catch {
      toast.error("Enregistrement impossible");
    }
  }

  function resetForm() {
    setSportType("");
    setDuration("");
    setCalories("");
    setSteps("");
    setDistance("");
    setNotes("");
    setExercises([{ name: "", sets: 0, reps: 0, weight: 0 }]);
    setWalkMode("outdoor");
    setWalkSpeed("");
    setTreadmillSpeed("");
    setTreadmillDuration("");
    setTreadmillIncline("");
  }

  async function removeSession(id: string) {
    try {
      const res = await fetch(
        `/api/client/sport-entries?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      toast.error("Suppression impossible");
    }
  }

  const totalDuration = sessions.reduce((a, s) => a + s.duration, 0);
  const totalCalories = sessions.reduce((a, s) => a + (s.calories || 0), 0);
  const totalSteps = sessions.reduce((a, s) => a + (s.steps || 0), 0);

  // Live preview for quick steps
  const quickStepsPreview = useMemo(() => {
    const n = parseInt(quickSteps, 10);
    if (!n || n <= 0) return null;
    return estimateWalkingMinutes(n, clientHeight, clientAge, clientWeight, null);
  }, [quickSteps, clientHeight, clientAge]);

  // Live preview for walk session form
  const walkPreview = useMemo(() => {
    if (sportType !== "MARCHE" || walkMode !== "outdoor") return null;
    const n = parseInt(steps, 10);
    if (!n || n <= 0) return null;
    const speedVal = parseFloat(walkSpeed) || null;
    return estimateWalkingMinutes(n, clientHeight, clientAge, clientWeight, speedVal);
  }, [sportType, walkMode, steps, walkSpeed, clientHeight, clientAge]);

  if (!ready) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-muted rounded w-1/2" />
        <div className="h-24 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-foreground">
            Suivi sportif
          </h1>
          <p className="text-muted-foreground mt-1">
            Enregistrez vos séances et suivez vos progrès.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-secondary hover:bg-secondary/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une séance
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouvelle séance</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Type de sport</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {sportTypes.map((s) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setSportType(s.value)}
                        className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-[11px] transition-all ${
                          sportType === s.value
                            ? "border-warm-primary bg-warm-primary/5 ring-1 ring-warm-primary text-warm-primary"
                            : "border-warm-border text-muted-foreground hover:border-warm-primary/40"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="font-medium leading-tight text-center">{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Walking mode selector */}
              {sportType === "MARCHE" && (
                <div className="space-y-3">
                  <Label>Mode</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWalkMode("outdoor")}
                      className={`rounded-lg border px-3 py-2.5 text-sm text-center transition-all ${
                        walkMode === "outdoor"
                          ? "border-warm-primary bg-warm-primary/5 ring-1 ring-warm-primary"
                          : "border-warm-border hover:border-warm-primary/40"
                      }`}
                    >
                      <span className="text-lg block">🚶</span>
                      <span className="font-medium">Marche en ville</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWalkMode("treadmill")}
                      className={`rounded-lg border px-3 py-2.5 text-sm text-center transition-all ${
                        walkMode === "treadmill"
                          ? "border-warm-primary bg-warm-primary/5 ring-1 ring-warm-primary"
                          : "border-warm-border hover:border-warm-primary/40"
                      }`}
                    >
                      <span className="text-lg block">🏃</span>
                      <span className="font-medium">Tapis de marche</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Outdoor walk fields */}
              {sportType === "MARCHE" && walkMode === "outdoor" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre de pas</Label>
                      <Input
                        type="number"
                        placeholder="ex : 12 000"
                        value={steps}
                        onChange={(e) => setSteps(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Vitesse moy. (km/h)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Auto selon âge"
                        value={walkSpeed}
                        onChange={(e) => setWalkSpeed(e.target.value)}
                      />
                    </div>
                  </div>
                  {walkPreview && (
                    <div className="rounded-lg bg-warm-primary/5 border border-warm-primary/20 px-3 py-2 text-sm">
                      <span className="font-medium">Estimation :</span>{" "}
                      {walkPreview.minutes} min · {walkPreview.distanceKm} km · {walkPreview.calories} kcal
                      {clientHeight && (
                        <span className="text-xs text-muted-foreground ml-1">
                          (foulée {Math.round(clientHeight * 0.414)} cm)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Treadmill fields */}
              {sportType === "MARCHE" && walkMode === "treadmill" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Vitesse (km/h)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="5.0"
                        value={treadmillSpeed}
                        onChange={(e) => setTreadmillSpeed(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Durée (min)</Label>
                      <Input
                        type="number"
                        placeholder="30"
                        value={treadmillDuration}
                        onChange={(e) => setTreadmillDuration(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Inclinaison (%)</Label>
                      <Input
                        type="number"
                        step="0.5"
                        placeholder="0"
                        value={treadmillIncline}
                        onChange={(e) => setTreadmillIncline(e.target.value)}
                      />
                    </div>
                  </div>
                  {treadmillSpeed && treadmillDuration && (
                    <div className="rounded-lg bg-warm-primary/5 border border-warm-primary/20 px-3 py-2 text-sm">
                      <span className="font-medium">Estimation :</span>{" "}
                      {(parseFloat(treadmillSpeed) * parseInt(treadmillDuration) / 60).toFixed(2)} km
                      {" · "}
                      {estimateTreadmillCalories(
                        parseFloat(treadmillSpeed),
                        parseInt(treadmillDuration),
                        parseFloat(treadmillIncline) || 0,
                        clientWeight,
                      )} kcal
                      {treadmillIncline && parseFloat(treadmillIncline) > 0 && (
                        <span className="ml-1">· pente {treadmillIncline}%</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Duration & calories — not for MARCHE outdoor (auto-calculated) */}
              {sportType !== "MARCHE" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Durée (min)</Label>
                    <Input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Calories brûlées</Label>
                    <Input
                      type="number"
                      value={calories}
                      onChange={(e) => setCalories(e.target.value)}
                      placeholder="Optionnel"
                    />
                  </div>
                </div>
              )}

              {/* Calories for MARCHE */}
              {sportType === "MARCHE" && (
                <div className="space-y-2">
                  <Label>Calories brûlées (optionnel)</Label>
                  <Input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="Optionnel"
                  />
                </div>
              )}

              {/* Steps & distance for COURSE / VELO */}
              {(sportType === "COURSE" || sportType === "VELO") && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre de pas</Label>
                    <Input
                      type="number"
                      value={steps}
                      onChange={(e) => setSteps(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Distance (km)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {sportType === "MUSCULATION" && (
                <div className="space-y-3">
                  <Label>Exercices</Label>
                  {exercises.map((ex, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 items-end"
                    >
                      <Input
                        placeholder="Exercice"
                        value={ex.name}
                        onChange={(e) =>
                          updateExercise(i, "name", e.target.value)
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Séries"
                        className="w-16"
                        value={ex.sets || ""}
                        onChange={(e) =>
                          updateExercise(i, "sets", parseInt(e.target.value) || 0)
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Reps"
                        className="w-16"
                        value={ex.reps || ""}
                        onChange={(e) =>
                          updateExercise(i, "reps", parseInt(e.target.value) || 0)
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Kg"
                        className="w-16"
                        value={ex.weight || ""}
                        onChange={(e) =>
                          updateExercise(
                            i,
                            "weight",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => removeExercise(i)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addExercise}
                    className="border-warm-border"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Ajouter un exercice
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ressenti, fatigue, performance..."
                  className="border-warm-border"
                />
              </div>

              <Button
                onClick={addSession}
                className="w-full bg-secondary hover:bg-secondary/90 text-white"
              >
                Enregistrer la séance
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl bg-gradient-to-br from-warm-primary/10 to-warm-primary/5 border border-warm-primary/20 p-4 text-center">
          <Timer className="h-5 w-5 text-warm-primary mx-auto mb-1.5" />
          <p className="text-2xl font-bold text-warm-primary">{totalDuration}</p>
          <p className="text-[11px] text-muted-foreground">minutes</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 border border-orange-200 p-4 text-center">
          <Flame className="h-5 w-5 text-orange-500 mx-auto mb-1.5" />
          <p className="text-2xl font-bold text-orange-600">{totalCalories}</p>
          <p className="text-[11px] text-muted-foreground">kcal brûlées</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200 p-4 text-center">
          <Footprints className="h-5 w-5 text-emerald-600 mx-auto mb-1.5" />
          <p className="text-2xl font-bold text-emerald-600">{totalSteps.toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground">pas</p>
        </div>
      </div>

      {/* Quick steps */}
      <Card className="border-warm-border mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Footprints className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium">Pas du jour</span>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              min={0}
              placeholder="Ex. 8 000"
              value={quickSteps}
              onChange={(e) => setQuickSteps(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={addStepsOnly}
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
          {quickStepsPreview && (
            <div className="mt-2.5 flex items-center gap-4 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
              <span><Timer className="h-3 w-3 inline mr-1" />{quickStepsPreview.minutes} min</span>
              <span><Footprints className="h-3 w-3 inline mr-1" />{quickStepsPreview.distanceKm} km</span>
              <span><Flame className="h-3 w-3 inline mr-1" />{quickStepsPreview.calories} kcal</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sessions */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-muted-foreground">Séances du jour</h2>
        <span className="text-xs text-muted-foreground">{sessions.length} séance{sessions.length > 1 ? "s" : ""}</span>
      </div>

      {sessions.length === 0 ? (
        <Card className="border-warm-border border-dashed">
          <CardContent className="py-10 text-center">
            <Dumbbell className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Aucune séance aujourd&apos;hui
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {sessions.map((session) => {
            const Icon = sportTypes.find((s) => s.value === session.type)?.icon || Timer;
            return (
              <div key={session.id} className="group rounded-xl border border-warm-border hover:border-warm-primary/30 bg-background p-3.5 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-warm-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-warm-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{session.typeLabel}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {session.duration > 0 && (
                            <span className="flex items-center gap-0.5">
                              <Timer className="h-3 w-3" />{session.duration} min
                            </span>
                          )}
                          {session.calories ? (
                            <span className="flex items-center gap-0.5">
                              <Flame className="h-3 w-3 text-orange-500" />{Math.round(session.calories)} kcal
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {session.steps ? (
                        <p className="text-xs text-muted-foreground mt-1">
                          {session.steps.toLocaleString()} pas
                          {session.distance ? ` · ${session.distance} km` : ""}
                        </p>
                      ) : null}

                      {session.treadmill && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Tapis {session.treadmill.speed} km/h
                          {session.treadmill.incline > 0 && ` · pente ${session.treadmill.incline}%`}
                        </p>
                      )}

                      {session.exercises && session.exercises.length > 0 && (
                        <div className="mt-1.5 space-y-0.5">
                          {session.exercises.map((ex, i) => (
                            <p key={i} className="text-xs text-muted-foreground">
                              {ex.name} — {ex.sets}×{ex.reps} @ {ex.weight}kg
                            </p>
                          ))}
                        </div>
                      )}

                      {session.notes && (
                        <p className="text-xs text-muted-foreground/70 mt-1.5 italic">
                          {session.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity shrink-0"
                    onClick={() => removeSession(session.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
