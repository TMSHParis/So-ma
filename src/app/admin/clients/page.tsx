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
  Trash2,
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
    maintenanceCalories: number | null;
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

/** Activities for NAP calculation with their coefficients */
const NAP_ACTIVITIES = [
  { key: "sommeil", label: "Sommeil", coeff: 1, default: 8 },
  { key: "toilettes", label: "Toilettes", coeff: 2, default: 0.5 },
  { key: "repas", label: "Repas (PDJ, déj, dîner)", coeff: 1.6, default: 1.5 },
  { key: "travailAssis", label: "Travail assis", coeff: 1.6, default: 8 },
  { key: "deplacements", label: "Déplacements divers", coeff: 1.5, default: 1 },
  { key: "marche", label: "Marche", coeff: 3, default: 1 },
  { key: "sport", label: "Sport", coeff: 5, default: 1 },
  { key: "soinsDetente", label: "Soins perso / détente", coeff: 1.35, default: 1.5 },
  { key: "prepRepas", label: "Préparation des repas", coeff: 2, default: 1 },
  { key: "voiture", label: "Temps en voiture", coeff: 1.5, default: 0.5 },
  { key: "enfants", label: "Soins des enfants", coeff: 2, default: 0 },
];

/** MB (MJ/jour) = coeff × poids^0.48 × taille(m)^0.50 × âge^-0.13 — Black et al. (1996)
 *  Résultat en MJ, × 1000 pour KJ */
function computeMB_KJ(sex: string, weightKg: number, heightCm: number, ageYears: number): number {
  const coeff = sex === "F" ? 0.963 : 1.083;
  const heightM = heightCm / 100;
  const mbMJ = coeff * Math.pow(weightKg, 0.48) * Math.pow(heightM, 0.50) * Math.pow(ageYears, -0.13);
  return mbMJ * 1000; // MJ → KJ
}

/** Calculate NAP from activity hours */
function computeNAP(activities: Record<string, number>): { nap: number; totalH: number; weightedH: number } {
  let weightedH = 0;
  let totalH = 0;
  for (const act of NAP_ACTIVITIES) {
    const h = activities[act.key] || 0;
    weightedH += h * act.coeff;
    totalH += h;
  }
  return { nap: totalH > 0 ? totalH / 24 : 1.55, totalH, weightedH };
}

/** Macros from DEJ in KJ using correct energy coefficients */
function computeMacrosFromKJ(dejKJ: number, pctProtein: number, pctFat: number, pctCarbs: number) {
  return {
    proteinG: Math.round((dejKJ * pctProtein / 100) / 17),
    fatG: Math.round((dejKJ * pctFat / 100) / 38),
    carbsG: Math.round((dejKJ * pctCarbs / 100) / 17),
  };
}

type CalcResult = {
  mbKJ: number;
  mbKcal: number;
  nap: number;
  dejKJ: number;
  dejKcal: number;
  goalKcal: number;
  goalKJ: number;
  stressFactor: number;
};


export default function ClientsPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Progress data per client
  const [progressMap, setProgressMap] = useState<Record<string, ProgressData>>({});
  const [progressLoading, setProgressLoading] = useState<Record<string, boolean>>({});

  // Expanded client detail
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Delete confirmation
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Edit panel
  const [editClientId, setEditClientId] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editData, setEditData] = useState<Record<string, string>>({});

  // Protocol calculator
  const [calcSex, setCalcSex] = useState("F");
  const [calcWeight, setCalcWeight] = useState("");
  const [calcHeight, setCalcHeight] = useState(""); // in cm
  const [calcAge, setCalcAge] = useState("");
  const [calcActivities, setCalcActivities] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const a of NAP_ACTIVITIES) init[a.key] = a.default;
    return init;
  });
  const [calcResult, setCalcResult] = useState<CalcResult | null>(null);
  const [macroPctProtein, setMacroPctProtein] = useState(15);
  const [macroPctFat, setMacroPctFat] = useState(35);
  const [macroPctCarbs, setMacroPctCarbs] = useState(50);
  const [fiberMode, setFiberMode] = useState<"auto" | "fixed">("auto");

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
        stressFactor: data.stressFactor?.toString() || "1",
      });
      setCalcSex(data.sex || "F");
      if (data.weight) setCalcWeight(data.weight.toString());
      if (data.height) {
        let h = Number(data.height);
        if (h < 3) h = h * 100; // convert m to cm
        setCalcHeight(Math.round(h).toString());
      }
      if (data.birthDate) {
        const age = Math.floor((Date.now() - new Date(data.birthDate).getTime()) / 31557600000);
        setCalcAge(age.toString());
      }
      // Load saved NAP activities or use defaults
      const savedAct = data.napActivities as Record<string, number> | null;
      const initAct: Record<string, number> = {};
      for (const a of NAP_ACTIVITIES) initAct[a.key] = savedAct?.[a.key] ?? a.default;
      setCalcActivities(initAct);
      setCalcResult(null);
      setMacroPctProtein(15);
      setMacroPctFat(35);
      setMacroPctCarbs(50);
      setFiberMode("auto");
    } catch { toast.error("Erreur chargement cliente"); }
    finally { setEditLoading(false); }
  }

  function handleFullCalc() {
    const w = Number(calcWeight);
    const h = Number(calcHeight); // cm
    const a = Number(calcAge);
    if (!w || !h || !a) { toast.error("Remplis poids, taille et âge"); return; }

    // Étape 1 — MB en KJ
    const mbKJ = computeMB_KJ(calcSex, w, h, a);
    const mbKcal = Math.round(mbKJ * 0.239);

    // Étape 2 — NAP from activities
    const { nap } = computeNAP(calcActivities);

    // Étape 3 — DEJ = MB × NAP (KJ)
    const dejKJRaw = mbKJ * nap;
    // Étape 3b — Facteur de stress / pathologie
    const sf = Number(editData.stressFactor || "1");
    const dejKJ = dejKJRaw * sf;
    // Étape 4 — DEJ en kcal
    const dejKcal = Math.round(dejKJ * 0.239);

    // Étape 5 — Ajustement selon objectif
    const balance = editData.energyBalance || "MAINTENANCE";
    const absDelta = Math.abs(parseInt(editData.caloricDeltaKcal || "0", 10));
    let goalKcal = dejKcal;
    if (balance === "DEFICIT") goalKcal = dejKcal - absDelta;
    if (balance === "SURPLUS") goalKcal = dejKcal + absDelta;
    const goalKJ = goalKcal / 0.239;

    const result: CalcResult = { mbKJ, mbKcal, nap, dejKJ, dejKcal, goalKcal, goalKJ, stressFactor: sf };
    setCalcResult(result);

    // Étape 6 — Macros (calculés en KJ puis convertis en g)
    const macros = computeMacrosFromKJ(goalKJ, macroPctProtein, macroPctFat, macroPctCarbs);

    // Étape 7 — Fibres
    const fiberG = fiberMode === "auto" ? Math.round((goalKcal / 1000) * 14) : 30;

    // Apply all to edit data
    setEditData((prev) => ({
      ...prev,
      maintenanceCalories: dejKcal.toString(),
      goalCalories: goalKcal.toString(),
      goalProtein: macros.proteinG.toString(),
      goalCarbs: macros.carbsG.toString(),
      goalFat: macros.fatG.toString(),
      goalFiber: fiberG.toString(),
    }));

    toast.success("Protocole complet appliqué");
  }

  function recalcMacros() {
    if (!calcResult) return;
    const balance = editData.energyBalance || "MAINTENANCE";
    const absDelta = Math.abs(parseInt(editData.caloricDeltaKcal || "0", 10));
    const sf = Number(editData.stressFactor || "1");
    const adjustedDej = Math.round(calcResult.dejKcal * (sf / (calcResult.stressFactor || 1)));
    let goalKcal = adjustedDej;
    if (balance === "DEFICIT") goalKcal = adjustedDej - absDelta;
    if (balance === "SURPLUS") goalKcal = adjustedDej + absDelta;
    const goalKJ = goalKcal / 0.239;
    const macros = computeMacrosFromKJ(goalKJ, macroPctProtein, macroPctFat, macroPctCarbs);
    const fiberG = fiberMode === "auto" ? Math.round((goalKcal / 1000) * 14) : Number(editData.goalFiber || 30);
    setCalcResult((prev) => prev ? { ...prev, goalKcal, goalKJ } : prev);
    setEditData((prev) => ({
      ...prev,
      goalCalories: goalKcal.toString(),
      goalProtein: macros.proteinG.toString(),
      goalCarbs: macros.carbsG.toString(),
      goalFat: macros.fatG.toString(),
      goalFiber: fiberG.toString(),
    }));
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
        "stressFactor",
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
      body.napActivities = calcActivities;

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

  async function handleDeleteClient() {
    if (!deleteClientId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/clients/${deleteClientId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Cliente supprimée");
      setDeleteClientId(null);
      fetchClients();
    } catch { toast.error("Erreur lors de la suppression"); }
    finally { setDeleting(false); }
  }

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
            const isExpanded = expandedId === c.id;

            function pct(current: number, goal: number | null) {
              if (!goal) return null;
              return Math.min(Math.round((current / goal) * 100), 999);
            }

            function statColor(current: number, goal: number | null) {
              if (!goal) return "text-muted-foreground";
              const p = (current / goal) * 100;
              if (p > 110) return "text-red-500";
              if (p >= 90) return "text-green-600";
              return "text-foreground";
            }

            return (
              <div key={c.id}>
                {/* Row */}
                <div
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : c.id)}
                >
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

                  {/* Compact summary */}
                  <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                    {c.client?.maintenanceCalories && (
                      <span className="flex items-center gap-1" title="DEJ maintien">
                        <span className="text-muted-foreground">{c.client.maintenanceCalories}</span>
                      </span>
                    )}
                    {c.client?.goalCalories && (
                      <span className="flex items-center gap-1 font-semibold text-foreground" title="Objectif kcal">
                        {c.client.goalCalories} kcal
                      </span>
                    )}
                    {pLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : progress && (progress.food.calories > 0 || progress.sport.calories > 0) ? (
                      <>
                        {progress.food.calories > 0 && progress.goals.goalCalories && (
                          <span className="flex items-center gap-1">
                            <span className={`font-semibold ${statColor(progress.food.calories, progress.goals.goalCalories)}`}>{progress.food.calories}</span>
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

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    {clientId && (
                      <>
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEditPanel(clientId); }} className="h-8 w-8 p-0">
                          <Settings2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setDeleteClientId(clientId); }} className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0">
                    {pLoading ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground py-3">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Chargement...
                      </div>
                    ) : progress && (progress.food.calories > 0 || progress.sport.calories > 0 || progress.sport.steps > 0) ? (
                      <div className="ml-14 space-y-3">
                        {/* Nutrition grid */}
                        {progress.food.calories > 0 && (
                          <div>
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Nutrition du jour</p>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-x-4 gap-y-2 text-xs">
                              {[
                                { label: "Calories", val: progress.food.calories, goal: progress.goals.goalCalories, unit: "kcal" },
                                { label: "Protéines", val: progress.food.protein, goal: progress.goals.goalProtein, unit: "g" },
                                { label: "Glucides", val: progress.food.carbs, goal: progress.goals.goalCarbs, unit: "g" },
                                { label: "Lipides", val: progress.food.fat, goal: progress.goals.goalFat, unit: "g" },
                                { label: "Fibres", val: progress.food.fiber, goal: progress.goals.goalFiber, unit: "g" },
                              ].map((item) => {
                                const p = pct(item.val, item.goal);
                                return (
                                  <div key={item.label} className="flex flex-col">
                                    <span className="text-muted-foreground text-[10px]">{item.label}</span>
                                    <div className="flex items-baseline gap-1">
                                      <span className={`font-semibold ${statColor(item.val, item.goal)}`}>{item.val}</span>
                                      {item.goal && <span className="text-muted-foreground">/ {item.goal}</span>}
                                      <span className="text-muted-foreground">{item.unit}</span>
                                    </div>
                                    {item.goal && (
                                      <div className="h-1 w-full bg-muted rounded-full mt-1 overflow-hidden">
                                        <div
                                          className={`h-full rounded-full transition-all ${
                                            (p ?? 0) > 110 ? "bg-red-500" : (p ?? 0) >= 90 ? "bg-green-500" : "bg-warm-primary"
                                          }`}
                                          style={{ width: `${Math.min(p ?? 0, 100)}%` }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Sport */}
                        {(progress.sport.calories > 0 || progress.sport.steps > 0) && (
                          <div>
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Activité du jour</p>
                            <div className="flex flex-wrap items-center gap-3 text-xs">
                              {progress.sport.calories > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                                  <span className="font-semibold">{progress.sport.calories}</span>
                                  <span className="text-muted-foreground">kcal brûlées</span>
                                </span>
                              )}
                              {progress.sport.duration > 0 && (
                                <span className="flex items-center gap-1">
                                  <span className="font-semibold">{progress.sport.duration}</span>
                                  <span className="text-muted-foreground">min</span>
                                </span>
                              )}
                              {progress.sport.steps > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <Footprints className="h-3.5 w-3.5 text-emerald-600" />
                                  <span className="font-semibold">{progress.sport.steps.toLocaleString()}</span>
                                  {progress.goals.goalSteps && (
                                    <span className="text-muted-foreground">/ {progress.goals.goalSteps.toLocaleString()} pas</span>
                                  )}
                                </span>
                              )}
                            </div>
                            {/* Sport breakdown */}
                            {progress.sportByType && Object.keys(progress.sportByType).length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {Object.entries(progress.sportByType).map(([type, data]) => (
                                  <span key={type} className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/60 rounded-md px-2 py-0.5">
                                    <span className="font-medium text-foreground">{SPORT_LABELS[type] || type}</span>
                                    <span>{data.calories} kcal</span>
                                    <span className="text-muted-foreground/50">·</span>
                                    <span>{data.duration} min</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="ml-14 text-xs text-muted-foreground py-1">Aucune donnée aujourd&apos;hui</p>
                    )}
                  </div>
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
            className="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-background shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 border-b border-warm-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Objectifs cliente</h2>
              <Button variant="ghost" size="icon" onClick={() => setEditClientId(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {editLoading ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
              ) : (
                <>
                  {/* ÉTAPE 1 — Profil & MB */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-warm-primary text-white text-[10px] font-bold flex items-center justify-center">1</span>
                      Profil — Métabolisme de Base
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[10px]">Sexe</Label>
                        <Select value={editData.sex || "F"} onValueChange={(v) => { if (v) { updateEdit("sex", v); setCalcSex(v); } }}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="F">Femme</SelectItem>
                            <SelectItem value="M">Homme</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px]">Naissance</Label>
                        <Input className="h-8 text-xs" type="date" value={editData.birthDate} onChange={(e) => {
                          updateEdit("birthDate", e.target.value);
                          if (e.target.value) {
                            const age = Math.floor((Date.now() - new Date(e.target.value).getTime()) / 31557600000);
                            setCalcAge(age.toString());
                          }
                        }} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px]">Poids (kg)</Label>
                        <Input className="h-8 text-xs" type="number" step="0.1" value={editData.weight} onChange={(e) => { updateEdit("weight", e.target.value); setCalcWeight(e.target.value); }} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px]">Taille (cm)</Label>
                        <Input className="h-8 text-xs" type="number" value={editData.height} onChange={(e) => { updateEdit("height", e.target.value); setCalcHeight(e.target.value); }} />
                      </div>
                    </div>
                    {calcResult && (
                      <div className="flex items-center gap-4 text-xs bg-muted/50 rounded-lg px-3 py-2">
                        <span>MB : <strong>{Math.round(calcResult.mbKJ)} KJ</strong> = <strong>{calcResult.mbKcal} kcal</strong></span>
                        <span className="text-muted-foreground">Black et al. — {calcSex === "F" ? "Femme" : "Homme"}, {calcWeight} kg, {calcHeight} cm, {calcAge} ans</span>
                      </div>
                    )}
                  </div>

                  {/* ÉTAPE 2 — NAP détaillé */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-warm-primary text-white text-[10px] font-bold flex items-center justify-center">2</span>
                      Activités sur 24h — NAP
                    </h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      {NAP_ACTIVITIES.map((act) => (
                        <div key={act.key} className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground w-36 truncate" title={act.label}>{act.label} <span className="text-muted-foreground/50">({act.coeff})</span></span>
                          <Input
                            className="h-7 text-xs w-16 text-center"
                            type="number"
                            step="0.5"
                            min="0"
                            max="24"
                            value={calcActivities[act.key] ?? 0}
                            onChange={(e) => setCalcActivities((prev) => ({ ...prev, [act.key]: Number(e.target.value) || 0 }))}
                          />
                          <span className="text-[10px] text-muted-foreground">h</span>
                        </div>
                      ))}
                    </div>
                    {(() => {
                      const { nap, totalH, weightedH } = computeNAP(calcActivities);
                      const mbKJ = (Number(calcWeight) && Number(calcHeight) && Number(calcAge))
                        ? computeMB_KJ(calcSex, Number(calcWeight), Number(calcHeight), Number(calcAge))
                        : 0;
                      const dejKcal = mbKJ > 0 ? Math.round(mbKJ * nap * 0.239) : 0;
                      const mbKcal = mbKJ > 0 ? Math.round(mbKJ * 0.239) : 0;
                      const sfVal = Number(editData.stressFactor || "1");
                      const dejKcalAdj = sfVal !== 1 && dejKcal > 0 ? Math.round(dejKcal * sfVal) : 0;
                      return (
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-4">
                            <span className="font-medium text-muted-foreground">
                              Total : <strong>{totalH.toFixed(2)}h</strong>
                            </span>
                            <span>÷ 24 = NAP : <strong className="text-foreground">{nap.toFixed(3)}</strong></span>
                          </div>
                          {mbKcal > 0 && (
                            <div className="text-muted-foreground">
                              DEJ (sans déficit) = NAP ({nap.toFixed(2)}) × MB ({mbKcal} kcal) = <strong className="text-foreground">{dejKcal} kcal</strong>
                            </div>
                          )}
                          {dejKcalAdj > 0 && (
                            <div className="text-red-600">
                              DEJ ajusté = {dejKcal} × {sfVal} (stress) = <strong>{dejKcalAdj} kcal</strong>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* FACTEUR DE RISQUE */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">!</span>
                      Facteur de stress / pathologie
                    </h3>
                    <p className="text-[10px] text-muted-foreground">Multiplie le DEJ. Utilisé en nutrition clinique pour ajuster les besoins en cas de pathologie, hospitalisation, etc.</p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { value: "1", label: "Aucun", desc: "Normal" },
                        { value: "1.1", label: "1.1", desc: "Stress léger" },
                        { value: "1.2", label: "1.2", desc: "Stress modéré" },
                        { value: "1.3", label: "1.3", desc: "Stress sévère" },
                        { value: "1.5", label: "1.5", desc: "Polytraumatisme" },
                      ].map((sf) => (
                        <button
                          key={sf.value}
                          type="button"
                          onClick={() => updateEdit("stressFactor", sf.value)}
                          className={`px-2.5 py-1.5 text-[10px] rounded-lg border transition-all ${
                            editData.stressFactor === sf.value || (!editData.stressFactor && sf.value === "1")
                              ? "border-red-400 bg-red-50 ring-1 ring-red-400 text-red-700"
                              : "border-warm-border hover:border-red-300"
                          }`}
                        >
                          <span className="font-semibold">{sf.label}</span>
                          <span className="ml-1 text-muted-foreground">{sf.desc}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-[10px]">Personnalisé :</Label>
                      <Input
                        className="h-7 text-xs w-20 text-center"
                        type="number"
                        step="0.05"
                        min="1"
                        max="2"
                        value={editData.stressFactor || "1"}
                        onChange={(e) => updateEdit("stressFactor", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* ÉTAPE 3-5 — Objectif énergétique */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-warm-primary text-white text-[10px] font-bold flex items-center justify-center">3</span>
                      Objectif énergétique
                    </h3>
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
                    {editData.energyBalance !== "MAINTENANCE" && (
                      <div className="space-y-1">
                        <Label className="text-[10px]">{editData.energyBalance === "DEFICIT" ? "Déficit" : "Surplus"} (kcal/jour)</Label>
                        <Input className="h-8 text-xs w-32" type="number" placeholder="300" value={editData.caloricDeltaKcal} onChange={(e) => updateEdit("caloricDeltaKcal", e.target.value)} />
                      </div>
                    )}
                  </div>

                  {/* ÉTAPE 6 — Macros (% → KJ → g) */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-warm-primary text-white text-[10px] font-bold flex items-center justify-center">4</span>
                      Répartition macros
                    </h3>
                    {(() => {
                      const goalKcal = calcResult?.goalKcal || Number(editData.goalCalories || 0);
                      const goalKJ = goalKcal > 0 ? goalKcal / 0.239 : 0;
                      const macroCalc = (pct: number, kjPerG: number) => {
                        if (goalKJ <= 0) return { kj: 0, kcal: 0, g: 0 };
                        const kj = goalKJ * pct / 100;
                        return { kj: Math.round(kj * 100) / 100, kcal: Math.round(kj * 0.239), g: Math.round((kj / kjPerG) * 10) / 10 };
                      };
                      const prot1 = macroCalc(15, 17);
                      const prot2 = macroCalc(20, 17);
                      const fat1 = macroCalc(35, 38);
                      const fat2 = macroCalc(40, 38);
                      const carb1 = macroCalc(40, 17);
                      const carb2 = macroCalc(55, 17);
                      const show = goalKJ > 0;
                      return (
                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <Label className="text-[10px]">Protéines (15-20%)</Label>
                            <div className="flex items-center gap-1">
                              <Input className="h-8 text-xs w-16 text-center" type="number" min={10} max={20} value={macroPctProtein} onChange={(e) => setMacroPctProtein(Number(e.target.value))} />
                              <span className="text-[10px] text-muted-foreground">%</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground">1g = 17 KJ</p>
                            {show && (
                              <div className="text-[10px] font-medium text-foreground space-y-0.5">
                                <p>15% → {prot1.kcal} kcal · {prot1.g}g</p>
                                <p>20% → {prot2.kcal} kcal · {prot2.g}g</p>
                              </div>
                            )}
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px]">Lipides (35-40%)</Label>
                            <div className="flex items-center gap-1">
                              <Input className="h-8 text-xs w-16 text-center" type="number" min={35} max={40} value={macroPctFat} onChange={(e) => setMacroPctFat(Number(e.target.value))} />
                              <span className="text-[10px] text-muted-foreground">%</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground">1g = 38 KJ</p>
                            {show && (
                              <div className="text-[10px] font-medium text-foreground space-y-0.5">
                                <p>35% → {fat1.kcal} kcal · {fat1.g}g</p>
                                <p>40% → {fat2.kcal} kcal · {fat2.g}g</p>
                              </div>
                            )}
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px]">Glucides (40-55%)</Label>
                            <div className="flex items-center gap-1">
                              <Input className="h-8 text-xs w-16 text-center" type="number" min={40} max={55} value={macroPctCarbs} onChange={(e) => setMacroPctCarbs(Number(e.target.value))} />
                              <span className="text-[10px] text-muted-foreground">%</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground">1g = 17 KJ</p>
                            {show && (
                              <div className="text-[10px] font-medium text-foreground space-y-0.5">
                                <p>40% → {carb1.kcal} kcal · {carb1.g}g</p>
                                <p>55% → {carb2.kcal} kcal · {carb2.g}g</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                    {(() => {
                      const total = macroPctProtein + macroPctFat + macroPctCarbs;
                      return total !== 100 && (
                        <p className="text-[10px] text-red-500 font-medium">Total : {total}% — doit faire 100%</p>
                      );
                    })()}
                  </div>

                  {/* ÉTAPE 7 — Fibres */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-warm-primary text-white text-[10px] font-bold flex items-center justify-center">5</span>
                      Fibres
                    </h3>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setFiberMode("auto")}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${fiberMode === "auto" ? "border-warm-primary bg-warm-primary/5 ring-1 ring-warm-primary" : "border-warm-border"}`}
                      >
                        Auto (14g / 1000 kcal)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFiberMode("fixed")}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${fiberMode === "fixed" ? "border-warm-primary bg-warm-primary/5 ring-1 ring-warm-primary" : "border-warm-border"}`}
                      >
                        Fixe (ANSES)
                      </button>
                      {fiberMode === "fixed" && (
                        <Input className="h-8 text-xs w-20" type="number" value={editData.goalFiber || "30"} onChange={(e) => updateEdit("goalFiber", e.target.value)} />
                      )}
                    </div>
                  </div>

                  {/* BOUTON CALCUL */}
                  <Button onClick={handleFullCalc} className="w-full bg-warm-primary hover:bg-warm-primary/90 text-white" size="sm">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculer tout le protocole
                  </Button>

                  {/* RÉSULTATS */}
                  {calcResult && (
                    <Card className="border-green-200 bg-green-50/50">
                      <CardContent className="p-4 space-y-3">
                        <p className="text-xs font-semibold text-green-800">Résultats du protocole</p>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                          <span className="text-muted-foreground">MB</span>
                          <span><strong>{Math.round(calcResult.mbKJ)} KJ</strong> = {calcResult.mbKcal} kcal</span>
                          <span className="text-muted-foreground">NAP</span>
                          <span><strong>{calcResult.nap.toFixed(3)}</strong></span>
                          {calcResult.stressFactor !== 1 && (
                            <>
                              <span className="text-muted-foreground">Facteur stress</span>
                              <span className="text-red-600 font-semibold">×{calcResult.stressFactor}</span>
                            </>
                          )}
                          <span className="text-muted-foreground">DEJ (maintien)</span>
                          <span><strong>{Math.round(calcResult.dejKJ)} KJ</strong> = {calcResult.dejKcal} kcal</span>
                          <span className="text-muted-foreground">Objectif final</span>
                          <span className="font-bold text-green-700">{calcResult.goalKcal} kcal</span>
                        </div>
                        <div className="border-t border-green-200 pt-2 grid grid-cols-4 gap-2 text-xs text-center">
                          <div>
                            <p className="text-muted-foreground">Protéines</p>
                            <p className="font-bold">{editData.goalProtein}g</p>
                            <p className="text-[10px] text-muted-foreground">{macroPctProtein}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Lipides</p>
                            <p className="font-bold">{editData.goalFat}g</p>
                            <p className="text-[10px] text-muted-foreground">{macroPctFat}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Glucides</p>
                            <p className="font-bold">{editData.goalCarbs}g</p>
                            <p className="text-[10px] text-muted-foreground">{macroPctCarbs}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Fibres</p>
                            <p className="font-bold">{editData.goalFiber}g</p>
                            <p className="text-[10px] text-muted-foreground">{fiberMode === "auto" ? "14g/1000kcal" : "fixe"}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full text-xs" onClick={recalcMacros}>
                          Recalculer macros (si % modifiés)
                        </Button>
                      </CardContent>
                    </Card>
                  )}

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

                </>
              )}
            </div>

            {/* Fixed bottom bar — always visible */}
            {!editLoading && (
              <div className="shrink-0 bg-background border-t border-warm-border px-6 py-4 flex gap-3">
                <Button onClick={handleSaveEdit} disabled={editSaving} className="flex-1 bg-warm-primary hover:bg-warm-primary/90 text-white">
                  {editSaving ? "Enregistrement..." : "Enregistrer"}
                </Button>
                <Button variant="outline" onClick={() => setEditClientId(null)}>Fermer</Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteClientId} onOpenChange={(open) => { if (!open) setDeleteClientId(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Supprimer cette cliente ?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Cette action est irréversible. Toutes les données de la cliente seront supprimées (nutrition, sport, cycle, bilans, programmes).
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteClientId(null)} className="flex-1">Annuler</Button>
            <Button onClick={handleDeleteClient} disabled={deleting} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting ? "Suppression..." : "Supprimer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
