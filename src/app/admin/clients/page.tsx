"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Mail,
  Users,
  Loader2,
  Calculator,
  Settings2,
  ChevronRight,
  Footprints,
  Flame,
  X,
} from "lucide-react";
import { toast } from "sonner";

type ClientRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  client: {
    id: string;
    phone: string | null;
    goalCalories: number | null;
    energyBalance: string | null;
  } | null;
};

type SportByType = Record<string, { duration: number; calories: number; steps: number; sessions: number }>;

type ProgressData = {
  date: string;
  goals: {
    goalCalories: number | null;
    goalProtein: number | null;
    goalCarbs: number | null;
    goalFat: number | null;
    goalFiber: number | null;
    goalWaterL: number | null;
    goalSteps: number | null;
  };
  food: { calories: number; protein: number; carbs: number; fat: number; fiber: number };
  sport: { duration: number; calories: number; steps: number };
  sportByType?: SportByType;
};

const SPORT_LABELS: Record<string, string> = {
  MUSCULATION: "Muscu",
  CARDIO: "Cardio",
  MARCHE: "Marche",
  COURSE: "Course",
  YOGA: "Yoga",
  NATATION: "Natation",
  VELO: "Vélo",
  AUTRE: "Autre",
};

const SPORT_TYPES = [
  { value: "MUSCULATION", label: "Musculation" },
  { value: "CARDIO", label: "Cardio" },
  { value: "MARCHE", label: "Marche" },
  { value: "COURSE", label: "Course" },
  { value: "YOGA", label: "Yoga" },
  { value: "NATATION", label: "Natation" },
  { value: "VELO", label: "Vélo" },
  { value: "AUTRE", label: "Autre" },
];

const NAP_OPTIONS = [
  { value: 1.2, label: "Sédentaire", desc: "Peu ou pas d'exercice" },
  { value: 1.375, label: "Légèrement actif", desc: "1-2×/sem" },
  { value: 1.55, label: "Modérément actif", desc: "3-4×/sem" },
  { value: 1.725, label: "Très actif", desc: "5+×/sem" },
  { value: 1.9, label: "Extrêmement actif", desc: "Athlète" },
];

function computeBMR(sex: string, weightKg: number, heightM: number, ageYears: number): number {
  const coeff = sex === "F" ? 0.963 : 1.083;
  const bmrMJ = coeff * Math.pow(weightKg, 0.48) * Math.pow(heightM, 0.50) * Math.pow(ageYears, -0.13);
  return Math.round(bmrMJ * 239.006);
}

/** Progress ring */
function MiniProgress({ current, goal, label, color }: { current: number; goal: number | null; label: string; color: string }) {
  if (!goal) return null;
  const pct = Math.min(Math.round((current / goal) * 100), 100);
  const isOver = current > goal;
  return (
    <div className="flex flex-col items-center gap-1 min-w-[4.5rem]">
      <div className="relative h-11 w-11 shrink-0">
        <svg viewBox="0 0 36 36" className="h-11 w-11 -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-muted/30" />
          <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="2.5"
            className={color}
            strokeDasharray={`${pct * 0.942} 100`}
            strokeLinecap="round"
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${isOver ? "text-red-500" : ""}`}>{pct}%</span>
      </div>
      <div className="text-center leading-tight">
        <p className={`text-sm font-semibold ${isOver ? "text-red-500" : ""}`}>{current}<span className="text-xs font-normal text-muted-foreground">/{goal}</span></p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Progress data per client
  const [progressMap, setProgressMap] = useState<Record<string, ProgressData>>({});
  const [progressLoading, setProgressLoading] = useState<Record<string, boolean>>({});

  // Edit panel
  const [editClientId, setEditClientId] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editData, setEditData] = useState<Record<string, string>>({});

  // BMR calculator
  const [calcSex, setCalcSex] = useState("F");
  const [calcWeight, setCalcWeight] = useState("");
  const [calcHeight, setCalcHeight] = useState("");
  const [calcAge, setCalcAge] = useState("");
  const [calcNAP, setCalcNAP] = useState("1.55");
  const [calcResult, setCalcResult] = useState<{ bmr: number; tdee: number } | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/clients");
      if (res.ok) {
        const data: ClientRow[] = await res.json();
        setClients(data);
        // Fetch progress for all clients that have a client profile
        for (const c of data) {
          if (c.client?.id) fetchProgress(c.client.id);
        }
      }
    } catch {
      toast.error("Erreur lors du chargement des clientes");
    } finally {
      setLoading(false);
    }
  }, []);

  async function fetchProgress(clientId: string) {
    setProgressLoading((prev) => ({ ...prev, [clientId]: true }));
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/progress`);
      if (res.ok) {
        const data = await res.json();
        setProgressMap((prev) => ({ ...prev, [clientId]: data }));
      }
    } catch { /* silent */ }
    finally {
      setProgressLoading((prev) => ({ ...prev, [clientId]: false }));
    }
  }

  useEffect(() => { fetchClients(); }, [fetchClients]);

  async function handleCreateClient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          phone: formData.get("phone"),
        }),
      });
      if (res.ok) {
        const result = await res.json();
        toast.success(`Compte créé ! Mot de passe : ${result.temporaryPassword}`, { duration: 15000 });
        setDialogOpen(false);
        fetchClients();
      } else {
        const error = await res.json();
        toast.error(error.message || "Erreur lors de la création");
      }
    } catch { toast.error("Erreur de connexion"); }
    finally { setSaving(false); }
  }

  async function openEditPanel(clientId: string) {
    setEditClientId(clientId);
    setEditLoading(true);
    setCalcResult(null);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEditData({
        sex: data.sex || "F",
        weight: data.weight?.toString() || "",
        height: data.height?.toString() || "",
        birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
        goalCalories: data.goalCalories?.toString() || "",
        maintenanceCalories: data.maintenanceCalories?.toString() || "",
        energyBalance: data.energyBalance || "MAINTENANCE",
        caloricDeltaKcal: data.caloricDeltaKcal?.toString() || "0",
        goalProtein: data.goalProtein?.toString() || "",
        goalCarbs: data.goalCarbs?.toString() || "",
        goalFat: data.goalFat?.toString() || "",
        goalFiber: data.goalFiber?.toString() || "",
        goalWaterL: data.goalWaterL?.toString() || "",
        goalSteps: data.goalSteps?.toString() || "",
        sessionsPerWeek: data.sessionsPerWeek?.toString() || "",
        sessionTypes: (data.sessionTypes || []).join(","),
        startWeight: data.startWeight?.toString() || "",
        goalWeight: data.goalWeight?.toString() || "",
      });
      setCalcSex(data.sex || "F");
      if (data.weight) setCalcWeight(data.weight.toString());
      if (data.height) {
        let h = Number(data.height);
        if (h > 3) h = h / 100;
        setCalcHeight(h.toFixed(2));
      }
      if (data.birthDate) {
        const age = Math.floor((Date.now() - new Date(data.birthDate).getTime()) / 31557600000);
        setCalcAge(age.toString());
      }
    } catch { toast.error("Erreur chargement cliente"); }
    finally { setEditLoading(false); }
  }

  function handleCalcBMR() {
    const w = Number(calcWeight);
    const h = Number(calcHeight);
    const a = Number(calcAge);
    const nap = Number(calcNAP);
    if (!w || !h || !a) { toast.error("Remplis poids, taille et âge"); return; }
    const bmr = computeBMR(calcSex, w, h, a);
    const tdee = Math.round(bmr * nap);
    setCalcResult({ bmr, tdee });
    setEditData((prev) => ({ ...prev, maintenanceCalories: tdee.toString() }));
  }

  function applyTDEE() {
    if (!calcResult) return;
    const balance = editData.energyBalance || "MAINTENANCE";
    const absDelta = Math.abs(parseInt(editData.caloricDeltaKcal || "0", 10));
    let goal = calcResult.tdee;
    if (balance === "DEFICIT") goal = calcResult.tdee - absDelta;
    if (balance === "SURPLUS") goal = calcResult.tdee + absDelta;
    setEditData((prev) => ({
      ...prev,
      maintenanceCalories: calcResult.tdee.toString(),
      goalCalories: goal.toString(),
    }));
    toast.success("TDEE appliqué aux objectifs");
  }

  async function handleSaveEdit() {
    if (!editClientId) return;
    setEditSaving(true);
    try {
      const body: Record<string, unknown> = {};
      const numFields = [
        "weight", "height", "goalCalories", "goalProtein", "goalCarbs", "goalFat",
        "goalFiber", "maintenanceCalories", "caloricDeltaKcal", "goalWaterL",
        "goalSteps", "sessionsPerWeek", "startWeight", "goalWeight",
      ];
      for (const f of numFields) {
        if (editData[f] !== undefined) {
          body[f] = editData[f] === "" ? null : Number(editData[f]);
        }
      }
      body.sex = editData.sex || null;
      body.energyBalance = editData.energyBalance || null;
      body.sessionTypes = editData.sessionTypes ? editData.sessionTypes.split(",").filter(Boolean) : [];
      body.birthDate = editData.birthDate || null;

      const res = await fetch(`/api/admin/clients/${editClientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      toast.success("Objectifs enregistrés");
      fetchClients();
    } catch { toast.error("Erreur enregistrement"); }
    finally { setEditSaving(false); }
  }

  const updateEdit = (field: string, value: string) => setEditData((prev) => ({ ...prev, [field]: value }));

  function getBalanceLabel(b: string | null | undefined) {
    if (b === "DEFICIT") return { label: "Déficit", color: "bg-orange-100 text-orange-700" };
    if (b === "SURPLUS") return { label: "Prise de masse", color: "bg-blue-100 text-blue-700" };
    return { label: "Maintien", color: "bg-green-100 text-green-700" };
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Clientes
          </h1>
          <p className="text-muted-foreground mt-1">{clients.length} compte{clients.length > 1 ? "s" : ""}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <Button onClick={() => setDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="h-4 w-4 mr-2" />Nouvelle cliente
          </Button>
          <DialogContent>
            <DialogHeader><DialogTitle>Créer un compte cliente</DialogTitle></DialogHeader>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="firstName">Prénom</Label><Input id="firstName" name="firstName" required /></div>
                <div className="space-y-2"><Label htmlFor="lastName">Nom</Label><Input id="lastName" name="lastName" required /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
              <div className="space-y-2"><Label htmlFor="phone">Téléphone (optionnel)</Label><Input id="phone" name="phone" type="tel" /></div>
              <p className="text-xs text-muted-foreground">Un mot de passe temporaire sera affiché après la création.</p>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={saving}>
                <Mail className="h-4 w-4 mr-2" />{saving ? "Création..." : "Créer le compte"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : clients.length === 0 ? (
        <Card className="border-warm-border">
          <CardContent className="py-12 text-center">
            <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucune cliente.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border border-warm-border overflow-hidden divide-y divide-warm-border">
          {clients.map((c) => {
            const clientId = c.client?.id;
            const progress = clientId ? progressMap[clientId] : undefined;
            const pLoading = clientId ? progressLoading[clientId] : false;
            const balance = getBalanceLabel(c.client?.energyBalance);

            return (
              <div key={c.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                {/* Avatar */}
                <div className="h-10 w-10 shrink-0 rounded-full bg-warm-primary/10 flex items-center justify-center text-sm font-bold text-warm-primary">
                  {c.firstName?.[0]}{c.lastName?.[0]}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{c.firstName} {c.lastName}</p>
                    <Badge className={`text-[10px] font-medium px-2 py-0 leading-5 ${balance.color} border-0`}>
                      {balance.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                </div>

                {/* Compact stats */}
                <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                  {pLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : progress && (progress.food.calories > 0 || progress.sport.calories > 0) ? (
                    <>
                      {progress.food.calories > 0 && progress.goals.goalCalories && (
                        <span className="flex items-center gap-1">
                          <span className="font-semibold text-foreground">{progress.food.calories}</span>
                          <span>/ {progress.goals.goalCalories} kcal</span>
                        </span>
                      )}
                      {progress.sport.calories > 0 && (
                        <span className="flex items-center gap-1">
                          <Flame className="h-3.5 w-3.5 text-orange-500" />
                          <span className="font-semibold text-foreground">{progress.sport.calories}</span>
                        </span>
                      )}
                    </>
                  ) : null}
                </div>

                {/* Action */}
                {clientId && (
                  <Button variant="ghost" size="sm" onClick={() => openEditPanel(clientId)} className="h-8 w-8 p-0 shrink-0">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit panel - slide in */}
      {editClientId && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setEditClientId(null)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-background shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-background z-10 border-b border-warm-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Objectifs cliente</h2>
              <Button variant="ghost" size="icon" onClick={() => setEditClientId(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {editLoading ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
              ) : (
                <>
                  {/* BMR Calculator */}
                  <Card className="border-warm-primary/20 bg-warm-primary/[0.02]">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-warm-primary" />
                        <CardTitle className="text-sm">Calculateur BMR — Black et al.</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-5 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[10px]">Sexe</Label>
                          <Select value={calcSex} onValueChange={(v) => { if (v) setCalcSex(v); }}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="F">F</SelectItem>
                              <SelectItem value="M">M</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px]">Poids (kg)</Label>
                          <Input className="h-8 text-xs" type="number" step="0.1" value={calcWeight} onChange={(e) => setCalcWeight(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px]">Taille (m)</Label>
                          <Input className="h-8 text-xs" type="number" step="0.01" placeholder="1.65" value={calcHeight} onChange={(e) => setCalcHeight(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px]">Âge</Label>
                          <Input className="h-8 text-xs" type="number" value={calcAge} onChange={(e) => setCalcAge(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px]">NAP</Label>
                          <Select value={calcNAP} onValueChange={(v) => { if (v) setCalcNAP(v); }}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {NAP_OPTIONS.map((o) => (
                                <SelectItem key={o.value} value={o.value.toString()}>
                                  {o.value} — {o.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button onClick={handleCalcBMR} className="bg-warm-primary hover:bg-warm-primary/90 text-white h-8 text-xs" size="sm">
                          <Calculator className="h-3 w-3 mr-1" />Calculer
                        </Button>
                        {calcResult && (
                          <>
                            <span className="text-xs">
                              BMR <strong>{calcResult.bmr}</strong> · TDEE <strong>{calcResult.tdee}</strong>
                            </span>
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={applyTDEE}>
                              Appliquer
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Profil */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Profil</h3>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[10px]">Sexe</Label>
                        <Select value={editData.sex || "F"} onValueChange={(v) => { if (v) updateEdit("sex", v); }}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="F">Femme</SelectItem>
                            <SelectItem value="M">Homme</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px]">Naissance</Label>
                        <Input className="h-8 text-xs" type="date" value={editData.birthDate} onChange={(e) => updateEdit("birthDate", e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px]">Poids (kg)</Label>
                        <Input className="h-8 text-xs" type="number" step="0.1" value={editData.weight} onChange={(e) => updateEdit("weight", e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px]">Taille (cm)</Label>
                        <Input className="h-8 text-xs" type="number" value={editData.height} onChange={(e) => updateEdit("height", e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* Objectifs énergétiques */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Objectifs énergétiques</h3>
                    <div className="grid grid-cols-3 gap-1.5 mb-2">
                      {([
                        { value: "DEFICIT", label: "Déficit", icon: "↓" },
                        { value: "MAINTENANCE", label: "Maintien", icon: "=" },
                        { value: "SURPLUS", label: "Prise de masse", icon: "↑" },
                      ] as const).map((o) => (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => updateEdit("energyBalance", o.value)}
                          className={`flex flex-col items-center rounded-lg border px-2 py-2 text-xs transition-all ${
                            editData.energyBalance === o.value
                              ? "border-warm-primary bg-warm-primary/5 ring-1 ring-warm-primary"
                              : "border-warm-border hover:border-warm-primary/40"
                          }`}
                        >
                          <span className="text-base">{o.icon}</span>
                          <span className="font-medium">{o.label}</span>
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[10px]">Maintien (kcal)</Label>
                        <Input className="h-8 text-xs" type="number" value={editData.maintenanceCalories} onChange={(e) => updateEdit("maintenanceCalories", e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px]">Delta kcal/jour</Label>
                        <Input className="h-8 text-xs" type="number" placeholder="300" value={editData.caloricDeltaKcal} onChange={(e) => updateEdit("caloricDeltaKcal", e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px]">Objectif kcal</Label>
                        <Input className="h-8 text-xs" type="number" value={editData.goalCalories} onChange={(e) => updateEdit("goalCalories", e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* Macros */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Macros & Fibres (g/jour)</h3>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="space-y-1"><Label className="text-[10px]">Protéines</Label><Input className="h-8 text-xs" type="number" value={editData.goalProtein} onChange={(e) => updateEdit("goalProtein", e.target.value)} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Glucides</Label><Input className="h-8 text-xs" type="number" value={editData.goalCarbs} onChange={(e) => updateEdit("goalCarbs", e.target.value)} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Lipides</Label><Input className="h-8 text-xs" type="number" value={editData.goalFat} onChange={(e) => updateEdit("goalFat", e.target.value)} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Fibres</Label><Input className="h-8 text-xs" type="number" value={editData.goalFiber} onChange={(e) => updateEdit("goalFiber", e.target.value)} /></div>
                    </div>
                  </div>

                  {/* Mode de vie */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Mode de vie & Sport</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1"><Label className="text-[10px]">Eau (L/jour)</Label><Input className="h-8 text-xs" type="number" step="0.1" value={editData.goalWaterL} onChange={(e) => updateEdit("goalWaterL", e.target.value)} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Pas/jour</Label><Input className="h-8 text-xs" type="number" value={editData.goalSteps} onChange={(e) => updateEdit("goalSteps", e.target.value)} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Séances/sem</Label><Input className="h-8 text-xs" type="number" value={editData.sessionsPerWeek} onChange={(e) => updateEdit("sessionsPerWeek", e.target.value)} /></div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px]">Types de séances</Label>
                      <div className="flex flex-wrap gap-1">
                        {SPORT_TYPES.map((s) => {
                          const selected = (editData.sessionTypes || "").split(",").includes(s.value);
                          return (
                            <button
                              key={s.value}
                              type="button"
                              onClick={() => {
                                const current = (editData.sessionTypes || "").split(",").filter(Boolean);
                                const next = selected ? current.filter((v) => v !== s.value) : [...current, s.value];
                                updateEdit("sessionTypes", next.join(","));
                              }}
                              className={`px-2 py-0.5 text-[10px] rounded-full border transition-colors ${selected ? "bg-warm-primary text-white border-warm-primary" : "border-border text-muted-foreground hover:border-warm-primary/40"}`}
                            >
                              {s.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Poids objectif */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Objectif pondéral</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1"><Label className="text-[10px]">Poids départ (kg)</Label><Input className="h-8 text-xs" type="number" step="0.1" value={editData.startWeight} onChange={(e) => updateEdit("startWeight", e.target.value)} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Poids objectif (kg)</Label><Input className="h-8 text-xs" type="number" step="0.1" value={editData.goalWeight} onChange={(e) => updateEdit("goalWeight", e.target.value)} /></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2 border-t border-warm-border">
                    <Button onClick={handleSaveEdit} disabled={editSaving} className="flex-1 bg-warm-primary hover:bg-warm-primary/90 text-white">
                      {editSaving ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                    <Button variant="outline" onClick={() => setEditClientId(null)}>Fermer</Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
