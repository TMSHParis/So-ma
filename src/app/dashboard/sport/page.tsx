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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    if (!typeInfo || !duration) return;

    const dur = parseInt(duration, 10) || 0;
    const ex =
      sportType === "MUSCULATION"
        ? exercises.filter((e) => e.name.trim())
        : undefined;

    try {
      const res = await fetch("/api/client/sport-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: todayIso,
          sportType,
          duration: dur,
          calories: calories ? parseInt(calories, 10) : null,
          steps: steps ? parseInt(steps, 10) : null,
          distance: distance ? parseFloat(distance) : null,
          details: ex && ex.length > 0 ? { exercises: ex } : null,
          notes: notes || null,
        }),
      });
      if (!res.ok) throw new Error();
      const row = await res.json();
      const session: SportSession = {
        id: row.id,
        type: sportType,
        typeLabel: typeInfo.label,
        duration: dur,
        calories: calories ? parseInt(calories, 10) : undefined,
        steps: steps ? parseInt(steps, 10) : undefined,
        distance: distance ? parseFloat(distance) : undefined,
        exercises: ex && ex.length > 0 ? ex : undefined,
        notes,
      };
      setSessions((prev) => [...prev, session]);
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
    try {
      const res = await fetch("/api/client/sport-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: todayIso,
          sportType: "MARCHE",
          duration: 0,
          calories: null,
          steps: n,
          distance: null,
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
      toast.success("Pas enregistrés");
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
                <Select value={sportType} onValueChange={(v) => v !== null && setSportType(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    {sportTypes.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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

              {(sportType === "MARCHE" ||
                sportType === "COURSE" ||
                sportType === "VELO") && (
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

      <Card className="border-warm-border mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Footprints className="h-4 w-4" />
            Pas du jour
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="space-y-2 flex-1 w-full">
            <Label htmlFor="quick-steps">Nombre de pas (aperçu ou complément)</Label>
            <Input
              id="quick-steps"
              type="number"
              min={0}
              placeholder="Ex. 8 000"
              value={quickSteps}
              onChange={(e) => setQuickSteps(e.target.value)}
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            className="shrink-0 text-white bg-secondary hover:bg-secondary/90"
            onClick={addStepsOnly}
          >
            Enregistrer les pas
          </Button>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="border-warm-border">
          <CardContent className="pt-4 pb-4 text-center">
            <Timer className="h-5 w-5 text-secondary-foreground mx-auto mb-1" />
            <p className="text-xl font-bold">{totalDuration} min</p>
            <p className="text-xs text-muted-foreground">Durée totale</p>
          </CardContent>
        </Card>
        <Card className="border-warm-border">
          <CardContent className="pt-4 pb-4 text-center">
            <Flame className="h-5 w-5 text-orange-500 mx-auto mb-1" />
            <p className="text-xl font-bold">{totalCalories} kcal</p>
            <p className="text-xs text-muted-foreground">Calories brûlées</p>
          </CardContent>
        </Card>
        <Card className="border-warm-border">
          <CardContent className="pt-4 pb-4 text-center">
            <Footprints className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-xl font-bold">{totalSteps.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Pas</p>
          </CardContent>
        </Card>
      </div>

      {/* Sessions */}
      {sessions.length === 0 ? (
        <Card className="border-warm-border">
          <CardContent className="py-12 text-center">
            <Dumbbell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              Aucune séance enregistrée aujourd&apos;hui
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Cliquez sur &quot;Ajouter une séance&quot; pour commencer
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session.id} className="border-warm-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{session.typeLabel}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {session.duration} min
                    </span>
                    {session.calories && (
                      <span className="text-sm text-muted-foreground">
                        {session.calories} kcal
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeSession(session.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {session.steps && (
                  <p className="text-sm text-muted-foreground">
                    {session.steps.toLocaleString()} pas
                    {session.distance && ` - ${session.distance} km`}
                  </p>
                )}
                {session.exercises && session.exercises.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {session.exercises.map((ex, i) => (
                      <p key={i} className="text-sm text-muted-foreground">
                        {ex.name}: {ex.sets}x{ex.reps} @ {ex.weight}kg
                      </p>
                    ))}
                  </div>
                )}
                {session.notes && (
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    {session.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
