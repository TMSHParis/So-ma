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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Mail, Users, Loader2, Calculator, Settings2 } from "lucide-react";
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

/** Black et al. (1996) BMR formula */
function computeBMR(sex: string, weightKg: number, heightM: number, ageYears: number): number {
  const coeff = sex === "F" ? 0.963 : 1.083;
  const bmrMJ = coeff * Math.pow(weightKg, 0.48) * Math.pow(heightM, 0.50) * Math.pow(ageYears, -0.13);
  return Math.round(bmrMJ * 239.006); // MJ → kcal
}

const NAP_OPTIONS = [
  { value: 1.2, label: "Sédentaire (1.2)" },
  { value: 1.375, label: "Légèrement actif (1.375)" },
  { value: 1.55, label: "Modérément actif (1.55)" },
  { value: 1.725, label: "Très actif (1.725)" },
  { value: 1.9, label: "Extrêmement actif (1.9)" },
];

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

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
      if (res.ok) setClients(await res.json());
    } catch {
      toast.error("Erreur lors du chargement des clientes");
    } finally {
      setLoading(false);
    }
  }, []);

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
      // Pre-fill calculator
      setCalcSex(data.sex || "F");
      if (data.weight) setCalcWeight(data.weight.toString());
      if (data.height) setCalcHeight((data.height / 100).toFixed(2)); // cm → m
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
    const delta = parseInt(editData.caloricDeltaKcal || "0", 10);
    let goal = calcResult.tdee;
    if (balance === "DEFICIT") goal = calcResult.tdee + delta; // delta is negative
    if (balance === "SURPLUS") goal = calcResult.tdee + delta;
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Gestion des clientes
          </h1>
          <p className="text-muted-foreground mt-1">Créez et gérez les comptes et objectifs.</p>
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

      {/* Client list */}
      <Card className="border-warm-border mb-6">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : clients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Aucune cliente.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Objectif kcal</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.firstName} {c.lastName}</TableCell>
                    <TableCell className="text-muted-foreground">{c.email}</TableCell>
                    <TableCell>
                      {c.client?.goalCalories ? (
                        <Badge variant="secondary">{c.client.goalCalories} kcal</Badge>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {c.client?.energyBalance === "DEFICIT" ? "Déficit" : c.client?.energyBalance === "SURPLUS" ? "Surplus" : "Maintien"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {c.client && (
                        <Button variant="ghost" size="sm" onClick={() => openEditPanel(c.client!.id)}>
                          <Settings2 className="h-4 w-4 mr-1" />Objectifs
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit panel */}
      {editClientId && (
        <div className="space-y-6">
          {editLoading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : (
            <>
              {/* Black et al. Calculator */}
              <Card className="border-primary/20 bg-primary/[0.02]">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Calculateur BMR — Black et al. (1996)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Sexe</Label>
                      <Select value={calcSex} onValueChange={(v) => { if (v) setCalcSex(v); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="F">Femme</SelectItem>
                          <SelectItem value="M">Homme</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Poids (kg)</Label>
                      <Input type="number" step="0.1" value={calcWeight} onChange={(e) => setCalcWeight(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Taille (m)</Label>
                      <Input type="number" step="0.01" placeholder="1.65" value={calcHeight} onChange={(e) => setCalcHeight(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Âge (ans)</Label>
                      <Input type="number" value={calcAge} onChange={(e) => setCalcAge(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">NAP</Label>
                      <Select value={calcNAP} onValueChange={(v) => { if (v) setCalcNAP(v); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {NAP_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value.toString()}>{o.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button onClick={handleCalcBMR} className="bg-primary hover:bg-primary/90 text-white" size="sm">
                      <Calculator className="h-4 w-4 mr-1" />Calculer
                    </Button>
                    {calcResult && (
                      <>
                        <span className="text-sm">
                          BMR: <strong>{calcResult.bmr} kcal</strong> | TDEE: <strong>{calcResult.tdee} kcal</strong>
                        </span>
                        <Button variant="outline" size="sm" onClick={applyTDEE}>
                          Appliquer le TDEE
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Profil de base */}
              <Card className="border-warm-border">
                <CardHeader><CardTitle className="text-base">Profil</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Sexe</Label>
                      <Select value={editData.sex || "F"} onValueChange={(v) => { if (v) updateEdit("sex", v); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="F">Femme</SelectItem>
                          <SelectItem value="M">Homme</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Date de naissance</Label>
                      <Input type="date" value={editData.birthDate} onChange={(e) => updateEdit("birthDate", e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Poids actuel (kg)</Label>
                      <Input type="number" step="0.1" value={editData.weight} onChange={(e) => updateEdit("weight", e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Taille (cm)</Label>
                      <Input type="number" value={editData.height} onChange={(e) => updateEdit("height", e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Objectifs énergétiques */}
              <Card className="border-warm-border">
                <CardHeader><CardTitle className="text-base">Objectifs énergétiques</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Balance</Label>
                      <Select value={editData.energyBalance || "MAINTENANCE"} onValueChange={(v) => { if (v) updateEdit("energyBalance", v); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DEFICIT">Déficit</SelectItem>
                          <SelectItem value="MAINTENANCE">Maintien</SelectItem>
                          <SelectItem value="SURPLUS">Prise de masse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Maintien (kcal)</Label>
                      <Input type="number" value={editData.maintenanceCalories} onChange={(e) => updateEdit("maintenanceCalories", e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Delta kcal/jour</Label>
                      <Input type="number" placeholder="-300" value={editData.caloricDeltaKcal} onChange={(e) => updateEdit("caloricDeltaKcal", e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Objectif kcal/jour</Label>
                      <Input type="number" value={editData.goalCalories} onChange={(e) => updateEdit("goalCalories", e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Macros */}
              <Card className="border-warm-border">
                <CardHeader><CardTitle className="text-base">Macros & Fibres (g/jour)</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Protéines</Label><Input type="number" value={editData.goalProtein} onChange={(e) => updateEdit("goalProtein", e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Glucides</Label><Input type="number" value={editData.goalCarbs} onChange={(e) => updateEdit("goalCarbs", e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Lipides</Label><Input type="number" value={editData.goalFat} onChange={(e) => updateEdit("goalFat", e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Fibres</Label><Input type="number" value={editData.goalFiber} onChange={(e) => updateEdit("goalFiber", e.target.value)} /></div>
                  </div>
                </CardContent>
              </Card>

              {/* Mode de vie */}
              <Card className="border-warm-border">
                <CardHeader><CardTitle className="text-base">Mode de vie & Sport</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Eau (L/jour)</Label><Input type="number" step="0.1" value={editData.goalWaterL} onChange={(e) => updateEdit("goalWaterL", e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Objectif pas/jour</Label><Input type="number" value={editData.goalSteps} onChange={(e) => updateEdit("goalSteps", e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Séances/semaine</Label><Input type="number" value={editData.sessionsPerWeek} onChange={(e) => updateEdit("sessionsPerWeek", e.target.value)} /></div>
                    <div className="space-y-1">
                      <Label className="text-xs">Types de séances</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
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
                              className={`px-2 py-0.5 text-[11px] rounded-full border transition-colors ${selected ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
                            >
                              {s.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Poids objectif */}
              <Card className="border-warm-border">
                <CardHeader><CardTitle className="text-base">Objectif pondéral</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Poids de départ (kg)</Label><Input type="number" step="0.1" value={editData.startWeight} onChange={(e) => updateEdit("startWeight", e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Poids objectif (kg)</Label><Input type="number" step="0.1" value={editData.goalWeight} onChange={(e) => updateEdit("goalWeight", e.target.value)} /></div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button onClick={handleSaveEdit} disabled={editSaving} className="bg-primary hover:bg-primary/90 text-white">
                  {editSaving ? "Enregistrement..." : "Enregistrer les objectifs"}
                </Button>
                <Button variant="outline" onClick={() => setEditClientId(null)}>Fermer</Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
