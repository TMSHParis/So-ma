"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  Loader2,
  Flame,
  Zap,
  Droplets,
  Wheat,
  Mail,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import {
  computeProtocol,
  computeMB_KJ,
  computeNAP,
  defaultNapActivities,
  napActivitiesFromBilan,
  balanceFromObjectif,
  defaultDelta,
  NAP_ACTIVITIES,
  KJ_TO_KCAL,
  type BilanData,
  type EnergyBalance,
  type ProtocolResult,
} from "@/lib/nutrition-calculator";

type TokenData = {
  id: string;
  token: string;
  name: string | null;
  email: string | null;
  used: boolean;
  expiresAt: string;
  createdAt: string;
  response: {
    id: string;
    clientId: string | null;
    data: Record<string, string | string[]>;
    submittedAt: string;
  } | null;
};

const BILAN_LABELS: Record<string, string> = {
  prenom: "Prénom",
  nom: "Nom",
  email: "Email",
  age: "Âge",
  telephone: "Téléphone",
  taille: "Taille (cm)",
  poids: "Poids (kg)",
  sexe: "Sexe",
  profil_neuro: "Profil neuroatypique",
  repas_par_jour: "Repas par jour",
  journee_type: "Journée type",
  allergies: "Allergies / Intolérances",
  regime: "Régime alimentaire",
  relation_nourriture: "Relation à la nourriture",
  eau: "Consommation d'eau",
  activite_physique: "Activité physique",
  types_sport: "Types de sport",
  pas_quotidiens: "Pas quotidiens",
  relation_sport: "Relation au sport",
  sommeil: "Qualité du sommeil",
  stress: "Niveau de stress",
  cycles: "Cycles menstruels",
  sante: "Problèmes de santé",
  troubles_digestifs: "Troubles digestifs",
  objectif_principal: "Objectif principal",
  poids_souhaite: "Poids souhaité (kg)",
  essaye_avant: "Déjà essayé",
  attentes: "Attentes",
  commentaires: "Commentaires",
  groupe_sanguin: "Groupe sanguin",
  temps_repas: "Durée des repas",
  aime_manger: "Aime manger",
  aime_cuisiner: "Aime cuisiner",
  temps_dispo_sport: "Temps dispo pour le sport",
  temps_assis: "Temps assis / travail par jour",
  temps_deplacements: "Déplacements divers par jour",
  temps_marche: "Marche par jour",
  temps_sport: "Sport par jour (hors marche)",
  temps_soins_detente: "Soins perso / détente par jour",
  temps_prep_repas: "Préparation des repas par jour",
  temps_voiture: "Temps en voiture par jour",
  temps_transports: "Temps dans les transports par jour",
  temps_toilettes: "Temps aux toilettes par jour",
  temps_enfants: "Soins des enfants par jour",
  temps_sommeil: "Heures de sommeil par nuit",
  frequence_selles: "Fréquence selles",
  frequence_urine: "Fréquence miction",
  motivation: "Motivation (1-10)",
};

const STRESS_OPTIONS = [
  { value: "1", label: "1.0", desc: "Aucun" },
  { value: "1.2", label: "1.2", desc: "Pathologies chroniques" },
  { value: "1.3", label: "1.3", desc: "Inflammatoire" },
  { value: "1.4", label: "1.4", desc: "État fébrile" },
  { value: "1.5", label: "1.5", desc: "Infection sévère" },
  { value: "1.8", label: "1.8", desc: "Trauma / grands brûlés" },
];

function parseProfile(bilan: Record<string, string | string[]>): {
  sex: string;
  age: number;
  heightCm: number;
  weightKg: number;
} {
  const sex = (bilan.sexe as string) || "F";
  const age = Number(bilan.age) || 30;
  let heightCm = Number(bilan.taille) || 165;
  if (heightCm < 3) heightCm = Math.round(heightCm * 100);
  const weightKg = Number(bilan.poids) || 60;
  return { sex, age, heightCm, weightKg };
}

export default function BilanValidationPage() {
  const params = useParams();
  const router = useRouter();
  const tokenId = params.tokenId as string;

  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [sendingCredentials, setSendingCredentials] = useState(false);
  const [credentialsSent, setCredentialsSent] = useState(false);

  const [activities, setActivities] = useState<Record<string, number>>(() =>
    defaultNapActivities(),
  );
  const [stressFactor, setStressFactor] = useState("1");
  const [balance, setBalance] = useState<EnergyBalance>("MAINTENANCE");
  const [absDelta, setAbsDelta] = useState("0");
  const [pctProtein, setPctProtein] = useState(15);
  const [pctFat, setPctFat] = useState(35);
  const [pctCarbs, setPctCarbs] = useState(50);
  const [fiberMode, setFiberMode] = useState<"auto" | "fixed">("auto");

  const [goalCalories, setGoalCalories] = useState("");
  const [maintenanceCalories, setMaintenanceCalories] = useState("");
  const [goalProtein, setGoalProtein] = useState("");
  const [goalCarbs, setGoalCarbs] = useState("");
  const [goalFat, setGoalFat] = useState("");
  const [goalFiber, setGoalFiber] = useState("");
  const [goalWaterL, setGoalWaterL] = useState("");
  const [calcResult, setCalcResult] = useState<ProtocolResult | null>(null);

  const profile = useMemo(
    () =>
      tokenData?.response
        ? parseProfile(tokenData.response.data)
        : { sex: "F", age: 30, heightCm: 165, weightKg: 60 },
    [tokenData],
  );

  const fetchToken = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/bilan-tokens/${tokenId}`);
      if (!res.ok) throw new Error();
      const data: TokenData = await res.json();
      setTokenData(data);

      if (!data.response) {
        setLoading(false);
        return;
      }

      const bilanData = data.response.data as unknown as BilanData;
      const prof = parseProfile(data.response.data);
      const isValidated = !!data.response.clientId;
      setValidated(isValidated);

      if (isValidated && data.response.clientId) {
        const clientRes = await fetch(
          `/api/admin/clients/${data.response.clientId}`,
        );
        if (clientRes.ok) {
          const c = await clientRes.json();
          const saved = c.napActivities as Record<string, number> | null;
          const act = saved
            ? { ...defaultNapActivities(), ...saved }
            : napActivitiesFromBilan(bilanData);
          const sf = Number(c.stressFactor) || 1;
          const bal = (c.energyBalance || "MAINTENANCE") as EnergyBalance;
          const delta = Math.abs(Number(c.caloricDeltaKcal) || 0);
          setActivities(act);
          setStressFactor(String(sf));
          setBalance(bal);
          setAbsDelta(String(delta));
          setGoalCalories(String(c.goalCalories ?? ""));
          setMaintenanceCalories(String(c.maintenanceCalories ?? ""));
          setGoalProtein(String(c.goalProtein ?? ""));
          setGoalCarbs(String(c.goalCarbs ?? ""));
          setGoalFat(String(c.goalFat ?? ""));
          setGoalFiber(String(c.goalFiber ?? ""));
          setGoalWaterL(String(c.goalWaterL ?? ""));

          const mbKJ = computeMB_KJ(prof.sex, prof.weightKg, prof.heightCm, prof.age);
          const mbKcal = Math.round(mbKJ * KJ_TO_KCAL);
          const { nap } = computeNAP(act);
          const dejKJ = mbKJ * nap * sf;
          const dejKcal = Math.round(dejKJ * KJ_TO_KCAL);
          setCalcResult({
            mbKJ,
            mbKcal,
            nap,
            stressFactor: sf,
            dejKJ,
            dejKcal,
            goalKcal: Number(c.goalCalories) || dejKcal,
            goalKJ: (Number(c.goalCalories) || dejKcal) / KJ_TO_KCAL,
            proteinG: Number(c.goalProtein) || 0,
            fatG: Number(c.goalFat) || 0,
            carbsG: Number(c.goalCarbs) || 0,
            fiberG: Number(c.goalFiber) || 0,
            waterL: Number(c.goalWaterL) || 0,
          });
          setLoading(false);
          return;
        }
      }

      const act = napActivitiesFromBilan(bilanData);
      const objBalance = balanceFromObjectif(bilanData.objectif_principal as string);
      const delta = defaultDelta(objBalance);
      setActivities(act);
      setBalance(objBalance);
      setAbsDelta(String(delta));

      const result = computeProtocol({
        sex: prof.sex,
        weightKg: prof.weightKg,
        heightCm: prof.heightCm,
        ageYears: prof.age,
        activities: act,
        stressFactor: 1,
        balance: objBalance,
        absDeltaKcal: delta,
        pctProtein: 15,
        pctFat: 35,
        pctCarbs: 50,
        fiberMode: "auto",
      });
      setCalcResult(result);
      setMaintenanceCalories(String(result.dejKcal));
      setGoalCalories(String(result.goalKcal));
      setGoalProtein(String(result.proteinG));
      setGoalCarbs(String(result.carbsG));
      setGoalFat(String(result.fatG));
      setGoalFiber(String(result.fiberG));
      setGoalWaterL(String(result.waterL));
    } catch {
      toast.error("Erreur lors du chargement du bilan");
    } finally {
      setLoading(false);
    }
  }, [tokenId]);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  function recalculate() {
    const result = computeProtocol({
      sex: profile.sex,
      weightKg: profile.weightKg,
      heightCm: profile.heightCm,
      ageYears: profile.age,
      activities,
      stressFactor: Number(stressFactor) || 1,
      balance,
      absDeltaKcal: Number(absDelta) || 0,
      pctProtein,
      pctFat,
      pctCarbs,
      fiberMode,
      fiberFixedG: Number(goalFiber) || 30,
    });
    setCalcResult(result);
    setMaintenanceCalories(String(result.dejKcal));
    setGoalCalories(String(result.goalKcal));
    setGoalProtein(String(result.proteinG));
    setGoalCarbs(String(result.carbsG));
    setGoalFat(String(result.fatG));
    setGoalFiber(String(result.fiberG));
    setGoalWaterL(String(result.waterL));
    toast.success("Protocole recalculé");
  }

  async function handleValidate() {
    if (!tokenData) return;
    setValidating(true);
    try {
      const signedDelta =
        balance === "DEFICIT"
          ? -Math.abs(Number(absDelta) || 0)
          : balance === "SURPLUS"
            ? Math.abs(Number(absDelta) || 0)
            : 0;
      const res = await fetch(
        `/api/admin/bilan-tokens/${tokenId}/validate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            goalCalories: Number(goalCalories),
            maintenanceCalories: Number(maintenanceCalories) || calcResult?.dejKcal || 0,
            energyBalance: balance,
            caloricDeltaKcal: signedDelta,
            goalProtein: Number(goalProtein),
            goalCarbs: Number(goalCarbs),
            goalFat: Number(goalFat),
            goalFiber: Number(goalFiber),
            goalWaterL: Number(goalWaterL),
            napActivities: activities,
            stressFactor: Number(stressFactor) || 1,
          }),
        },
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur");
      }
      const result = await res.json();
      setValidated(true);
      if (result.temporaryPassword) {
        setTempPassword(result.temporaryPassword);
        if (result.credentialsSent) {
          setCredentialsSent(true);
          toast.success(
            `Compte créé pour ${result.email} ! Les accès ont été envoyés par email automatiquement.`,
            { duration: 15000 },
          );
        } else {
          toast.success(
            `Compte créé pour ${result.email} ! ⚠️ L'email n'a pas pu être envoyé — transmets le mot de passe manuellement.`,
            { duration: 15000 },
          );
        }
      } else {
        toast.success(`Objectifs mis à jour pour ${result.email}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur de validation");
    } finally {
      setValidating(false);
    }
  }

  async function handleSendCredentials() {
    if (!tempPassword || !tokenData?.response) return;
    const bilanData = tokenData.response.data;
    setSendingCredentials(true);
    try {
      const res = await fetch("/api/admin/send-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: bilanData.email,
          firstName: bilanData.prenom || tokenData.name,
          password: tempPassword,
        }),
      });
      if (!res.ok) throw new Error();
      setCredentialsSent(true);
      toast.success("Accès envoyés par email !");
    } catch {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setSendingCredentials(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!tokenData?.response) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">
          Ce bilan n&apos;a pas encore été rempli.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/admin/formulaires")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>
    );
  }

  const bilanData = tokenData.response.data;
  const { nap: napLive, totalH, weightedH } = computeNAP(activities);
  const macroSum = pctProtein + pctFat + pctCarbs;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/formulaires")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Bilan de {(bilanData.prenom as string) || tokenData.name || "—"}{" "}
            {(bilanData.nom as string) || ""}
          </h1>
          <p className="text-sm text-muted-foreground">
            Soumis le{" "}
            {new Date(tokenData.response.submittedAt).toLocaleDateString(
              "fr-FR",
              { day: "numeric", month: "long", year: "numeric" },
            )}
          </p>
        </div>
        {validated && (
          <Badge className="bg-green-100 text-green-700 text-sm">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Validé
          </Badge>
        )}
      </div>

      {/* Temp password banner */}
      {tempPassword && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="py-4">
            <p className="text-sm font-medium text-green-800">
              Compte créé ! Mot de passe temporaire :{" "}
              <code className="bg-green-100 px-2 py-0.5 rounded text-base font-bold">
                {tempPassword}
              </code>
            </p>
            {credentialsSent ? (
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Les accès ont été envoyés automatiquement par email à la cliente.
              </p>
            ) : (
              <>
                <p className="text-xs text-orange-600 mt-1">
                  L&apos;email automatique n&apos;a pas pu être envoyé. Tu peux réessayer ou transmettre le mot de passe manuellement.
                </p>
                <div className="mt-3">
                  <Button
                    onClick={handleSendCredentials}
                    disabled={sendingCredentials}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    {sendingCredentials ? (
                      <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Envoi en cours...</>
                    ) : (
                      <><Mail className="h-4 w-4 mr-1" /> Réessayer l&apos;envoi par email</>
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Bilan responses */}
        <div className="space-y-4">
          <Card className="border-warm-border">
            <CardHeader>
              <CardTitle className="text-base">Réponses du bilan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 max-h-[70vh] overflow-y-auto">
              {Object.entries(bilanData).map(([key, value]) => (
                <div
                  key={key}
                  className="py-2 border-b border-black/[0.04] last:border-0"
                >
                  <p className="text-xs font-medium text-muted-foreground">
                    {BILAN_LABELS[key] || key.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm text-foreground mt-0.5">
                    {Array.isArray(value)
                      ? value.join(", ")
                      : String(value || "—")}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Calculator + Validation */}
        <div className="space-y-4">
          {/* Profil */}
          <Card className="border-primary/20 bg-primary/[0.02]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">
                  Profil — Black et al. 1996
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>
                  <p className="text-[10px] text-muted-foreground">Sexe</p>
                  <p className="font-medium">{profile.sex === "F" ? "Femme" : "Homme"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Âge</p>
                  <p className="font-medium">{profile.age} ans</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Poids</p>
                  <p className="font-medium">{profile.weightKg} kg</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Taille</p>
                  <p className="font-medium">{profile.heightCm} cm</p>
                </div>
              </div>
              {calcResult && (
                <div className="text-xs bg-muted/50 rounded px-3 py-2">
                  MB : <strong>{Math.round(calcResult.mbKJ)} KJ</strong> ={" "}
                  <strong>{calcResult.mbKcal} kcal</strong>
                </div>
              )}
            </CardContent>
          </Card>

          {/* NAP activités */}
          <Card className="border-warm-border">
            <CardHeader>
              <CardTitle className="text-sm">Activités sur 24h — NAP</CardTitle>
              <p className="text-[11px] text-muted-foreground">
                Pré-rempli depuis le bilan. Ajuste si besoin.
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {NAP_ACTIVITIES.map((act) => (
                  <div key={act.key} className="flex items-center gap-2">
                    <span
                      className="text-[10px] text-muted-foreground w-36 truncate"
                      title={act.label}
                    >
                      {act.label}{" "}
                      <span className="text-muted-foreground/50">({act.coeff})</span>
                    </span>
                    <Input
                      className="h-7 text-xs w-16 text-center"
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      value={activities[act.key] ?? 0}
                      onChange={(e) =>
                        setActivities((prev) => ({
                          ...prev,
                          [act.key]: Number(e.target.value) || 0,
                        }))
                      }
                    />
                    <span className="text-[10px] text-muted-foreground">h</span>
                  </div>
                ))}
              </div>
              <div className="text-xs bg-muted/50 rounded px-3 py-2 flex items-center gap-4">
                <span>
                  Total : <strong>{totalH.toFixed(2)}h</strong>
                </span>
                <span>
                  Pondéré : <strong>{weightedH.toFixed(2)}</strong>
                </span>
                <span>
                  ÷ 24 = NAP :{" "}
                  <strong className="text-foreground">{napLive.toFixed(3)}</strong>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Facteur d'agression */}
          <Card className="border-warm-border">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  !
                </span>
                Facteur d&apos;agression (FA)
              </CardTitle>
              <p className="text-[10px] text-muted-foreground">
                DEJ = MB × NAP × FA. Théorique max 1.8, clinique 1.2-1.3.
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {STRESS_OPTIONS.map((sf) => (
                  <button
                    key={sf.value}
                    type="button"
                    onClick={() => setStressFactor(sf.value)}
                    className={`px-2.5 py-1.5 text-[10px] rounded-lg border transition-all ${
                      stressFactor === sf.value
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
                  value={stressFactor}
                  onChange={(e) => setStressFactor(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Balance énergétique */}
          <Card className="border-warm-border">
            <CardHeader>
              <CardTitle className="text-sm">Objectif énergétique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { value: "DEFICIT", label: "Déficit", icon: "↓" },
                    { value: "MAINTENANCE", label: "Maintien", icon: "=" },
                    { value: "SURPLUS", label: "Prise de masse", icon: "↑" },
                  ] as const
                ).map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setBalance(o.value)}
                    className={`flex flex-col items-center rounded-lg border px-2 py-2.5 text-sm transition-all ${
                      balance === o.value
                        ? "border-warm-primary bg-warm-primary/5 ring-1 ring-warm-primary"
                        : "border-warm-border hover:border-warm-primary/40"
                    }`}
                  >
                    <span className="text-lg">{o.icon}</span>
                    <span className="font-medium text-xs">{o.label}</span>
                  </button>
                ))}
              </div>
              {balance !== "MAINTENANCE" && (
                <div className="space-y-1">
                  <Label className="text-xs">
                    Delta kcal/jour{" "}
                    {balance === "DEFICIT" ? "(soustrait)" : "(ajouté)"}
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={absDelta}
                    onChange={(e) => setAbsDelta(e.target.value)}
                    placeholder="300"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Macros % */}
          <Card className="border-warm-border">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-500" />
                Répartition macros (en % de DEJ)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px]">Protéines (15-20%)</Label>
                  <div className="flex items-center gap-1">
                    <Input
                      className="h-8 text-xs w-16 text-center"
                      type="number"
                      min={10}
                      max={25}
                      value={pctProtein}
                      onChange={(e) => setPctProtein(Number(e.target.value))}
                    />
                    <span className="text-[10px] text-muted-foreground">%</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">1g = 17 KJ</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Lipides (35-40%)</Label>
                  <div className="flex items-center gap-1">
                    <Input
                      className="h-8 text-xs w-16 text-center"
                      type="number"
                      min={20}
                      max={50}
                      value={pctFat}
                      onChange={(e) => setPctFat(Number(e.target.value))}
                    />
                    <span className="text-[10px] text-muted-foreground">%</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">1g = 38 KJ</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Glucides (40-55%)</Label>
                  <div className="flex items-center gap-1">
                    <Input
                      className="h-8 text-xs w-16 text-center"
                      type="number"
                      min={30}
                      max={65}
                      value={pctCarbs}
                      onChange={(e) => setPctCarbs(Number(e.target.value))}
                    />
                    <span className="text-[10px] text-muted-foreground">%</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">1g = 17 KJ</p>
                </div>
              </div>
              {macroSum !== 100 && (
                <p className="text-[10px] text-red-500 font-medium">
                  Total : {macroSum}% — doit faire 100%
                </p>
              )}
            </CardContent>
          </Card>

          {/* Fibres */}
          <Card className="border-warm-border">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Wheat className="h-4 w-4 text-green-600" />
                Fibres
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setFiberMode("auto")}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                    fiberMode === "auto"
                      ? "border-warm-primary bg-warm-primary/5 ring-1 ring-warm-primary"
                      : "border-warm-border"
                  }`}
                >
                  Auto (14g / 1000 kcal)
                </button>
                <button
                  type="button"
                  onClick={() => setFiberMode("fixed")}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                    fiberMode === "fixed"
                      ? "border-warm-primary bg-warm-primary/5 ring-1 ring-warm-primary"
                      : "border-warm-border"
                  }`}
                >
                  Fixe (ANSES)
                </button>
                <Input
                  className="h-8 text-xs w-20"
                  type="number"
                  value={goalFiber}
                  onChange={(e) => setGoalFiber(e.target.value)}
                  disabled={fiberMode === "auto"}
                />
                <span className="text-[10px] text-muted-foreground">g/jour</span>
              </div>
            </CardContent>
          </Card>

          {/* Recalculate */}
          <Button
            onClick={recalculate}
            className="w-full bg-warm-primary hover:bg-warm-primary/90 text-white"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calculer tout le protocole
          </Button>

          {/* Results */}
          {calcResult && (
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-4 space-y-3">
                <p className="text-xs font-semibold text-green-800">
                  Résultats du protocole
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                  <span className="text-muted-foreground">MB</span>
                  <span>
                    <strong>{Math.round(calcResult.mbKJ)} KJ</strong> ={" "}
                    {calcResult.mbKcal} kcal
                  </span>
                  <span className="text-muted-foreground">NAP</span>
                  <span>
                    <strong>{calcResult.nap.toFixed(3)}</strong>
                  </span>
                  {calcResult.stressFactor !== 1 && (
                    <>
                      <span className="text-muted-foreground">FA</span>
                      <span className="text-red-600 font-semibold">
                        ×{calcResult.stressFactor}
                      </span>
                    </>
                  )}
                  <span className="text-muted-foreground">
                    DEJ {calcResult.stressFactor !== 1 ? "(MB × NAP × FA)" : "(MB × NAP)"}
                  </span>
                  <span>
                    <strong>{Math.round(calcResult.dejKJ)} KJ</strong> ={" "}
                    {calcResult.dejKcal} kcal
                  </span>
                  <span className="text-muted-foreground">Objectif final</span>
                  <span className="font-bold text-green-700">
                    {calcResult.goalKcal} kcal
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Final values (editable) */}
          <Card className="border-warm-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <CardTitle className="text-sm">
                  Objectifs finaux (modifiables)
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-100">
                <p className="text-3xl font-bold text-orange-600">
                  {goalCalories || "—"}
                </p>
                <p className="text-xs text-orange-500">kcal / jour</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px]">Calories</Label>
                  <Input
                    type="number"
                    value={goalCalories}
                    onChange={(e) => setGoalCalories(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Maintien (DEJ)</Label>
                  <Input
                    type="number"
                    value={maintenanceCalories}
                    onChange={(e) => setMaintenanceCalories(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Protéines (g)</Label>
                  <Input
                    type="number"
                    value={goalProtein}
                    onChange={(e) => setGoalProtein(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Glucides (g)</Label>
                  <Input
                    type="number"
                    value={goalCarbs}
                    onChange={(e) => setGoalCarbs(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Lipides (g)</Label>
                  <Input
                    type="number"
                    value={goalFat}
                    onChange={(e) => setGoalFat(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Fibres (g)</Label>
                  <Input
                    type="number"
                    value={goalFiber}
                    onChange={(e) => setGoalFiber(e.target.value)}
                  />
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <Label className="text-xs font-medium">Eau (L/jour)</Label>
                </div>
                <Input
                  type="number"
                  step="0.1"
                  value={goalWaterL}
                  onChange={(e) => setGoalWaterL(e.target.value)}
                />
                <p className="text-[10px] text-blue-600 mt-1">
                  ≈{" "}
                  {goalWaterL ? Math.round(Number(goalWaterL) / 0.25) : "—"} verres
                  de 25cl
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Validate / Update button */}
          {!validated ? (
            <Button
              onClick={handleValidate}
              disabled={validating}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-base py-6"
              size="lg"
            >
              {validating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Validation en cours...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Valider et créer le compte cliente
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="text-center py-2">
                <Badge className="bg-green-100 text-green-700 text-sm px-4 py-2">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Compte cliente validé — objectifs envoyés
                </Badge>
              </div>
              <Button
                onClick={handleValidate}
                disabled={validating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base py-5"
                size="lg"
              >
                {validating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Mettre à jour les objectifs
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
