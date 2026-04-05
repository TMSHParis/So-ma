"use client";

import { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import {
  computeNutritionFromBilan,
  computeBMR,
  computeWater,
  type NutritionResult,
  type BilanData,
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

const NAP_OPTIONS = [
  { value: 1.2, label: "Sédentaire", desc: "Peu ou pas d'exercice" },
  { value: 1.375, label: "Légèrement actif", desc: "1-2×/semaine" },
  { value: 1.55, label: "Modérément actif", desc: "3-4×/semaine" },
  { value: 1.725, label: "Très actif", desc: "5+×/semaine" },
  { value: 1.9, label: "Extrêmement actif", desc: "Athlète / travail physique" },
];

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
  frequence_selles: "Fréquence selles",
  frequence_urine: "Fréquence miction",
  motivation: "Motivation (1-10)",
};

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

  // Editable calculation results
  const [calc, setCalc] = useState<NutritionResult | null>(null);
  const [nap, setNap] = useState("1.55");
  const [delta, setDelta] = useState("-300");
  const [balance, setBalance] = useState<string>("DEFICIT");

  // Editable macro/goal values
  const [goalCalories, setGoalCalories] = useState("");
  const [goalProtein, setGoalProtein] = useState("");
  const [goalCarbs, setGoalCarbs] = useState("");
  const [goalFat, setGoalFat] = useState("");
  const [goalFiber, setGoalFiber] = useState("");
  const [goalWaterL, setGoalWaterL] = useState("");

  const fetchToken = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/bilan-tokens/${tokenId}`);
      if (!res.ok) throw new Error();
      const data: TokenData = await res.json();
      setTokenData(data);

      if (data.response?.clientId) {
        setValidated(true);
      }

      // Auto-calculate from bilan data
      if (data.response) {
        const bilanData = data.response.data as unknown as BilanData;
        const result = computeNutritionFromBilan(bilanData);
        setCalc(result);
        setNap(result.nap.toString());
        setBalance(result.energyBalance);
        setDelta(result.delta.toString());
        setGoalCalories(result.goalCalories.toString());
        setGoalProtein(result.goalProtein.toString());
        setGoalCarbs(result.goalCarbs.toString());
        setGoalFat(result.goalFat.toString());
        setGoalFiber(result.goalFiber.toString());
        setGoalWaterL(result.goalWaterL.toString());
      }
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
    if (!tokenData?.response) return;
    const bilanData = tokenData.response.data as unknown as BilanData;

    const sex = (bilanData.sexe as string) || "F";
    const age = Number(bilanData.age) || 30;
    let heightCm = Number(bilanData.taille) || 165;
    if (heightCm < 3) heightCm = Math.round(heightCm * 100);
    const weightKg = Number(bilanData.poids) || 60;
    const heightM = heightCm / 100;

    const bmr = computeBMR(sex, weightKg, heightM, age);
    const napVal = Number(nap);
    const tdee = Math.round(bmr * napVal);
    const absDelta = Math.abs(Number(delta) || 0);
    const deltaVal = balance === "DEFICIT" ? -absDelta : balance === "SURPLUS" ? absDelta : 0;
    const goalCal = tdee + deltaVal;

    // Recalculate macros based on new calories
    const protein = Math.round(weightKg * 2);
    const fat = Math.round(weightKg * 1);
    const proteinCal = protein * 4;
    const fatCal = fat * 9;
    const remainingCal = Math.max(goalCal - proteinCal - fatCal, 0);
    const carbs = Math.round(remainingCal / 4);

    const water = computeWater(weightKg, bmr, tdee, napVal);

    setCalc({ bmr, nap: napVal, tdee, energyBalance: balance as "DEFICIT" | "MAINTENANCE" | "SURPLUS", delta: deltaVal, goalCalories: goalCal, goalProtein: protein, goalCarbs: carbs, goalFat: fat, goalFiber: 25, goalWaterL: water });
    setGoalCalories(goalCal.toString());
    setGoalProtein(protein.toString());
    setGoalCarbs(carbs.toString());
    setGoalFat(fat.toString());
    setGoalFiber("25");
    setGoalWaterL(water.toString());
  }

  async function handleValidate() {
    if (!tokenData) return;
    setValidating(true);
    try {
      const res = await fetch(
        `/api/admin/bilan-tokens/${tokenId}/validate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            goalCalories: Number(goalCalories),
            maintenanceCalories: calc?.tdee || 0,
            energyBalance: balance,
            caloricDeltaKcal: balance === "DEFICIT" ? -Math.abs(Number(delta) || 0) : Math.abs(Number(delta) || 0),
            goalProtein: Number(goalProtein),
            goalCarbs: Number(goalCarbs),
            goalFat: Number(goalFat),
            goalFiber: Number(goalFiber),
            goalWaterL: Number(goalWaterL),
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
        toast.success(
          `Compte créé pour ${result.email} ! Mot de passe temporaire affiché ci-dessous.`,
          { duration: 15000 },
        );
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
            <p className="text-xs text-green-600 mt-1">
              Transmettez ce mot de passe à la cliente. Elle pourra le changer
              après connexion.
            </p>
            <div className="mt-3">
              <Button
                onClick={handleSendCredentials}
                disabled={sendingCredentials || credentialsSent}
                size="sm"
                className={credentialsSent ? "bg-green-700 text-white" : "bg-primary hover:bg-primary/90 text-white"}
              >
                {credentialsSent ? (
                  <><CheckCircle2 className="h-4 w-4 mr-1" /> Accès envoyés</>
                ) : sendingCredentials ? (
                  <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Envoi en cours...</>
                ) : (
                  <><Mail className="h-4 w-4 mr-1" /> Envoyer les accès par email</>
                )}
              </Button>
            </div>
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
          {/* Auto-calculated summary */}
          {calc && (
            <Card className="border-primary/20 bg-primary/[0.02]">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">
                    Calcul automatique — Black et al.
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* BMR & TDEE display */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background rounded-lg p-3 border">
                    <p className="text-xs text-muted-foreground">
                      Métabolisme de base (BMR)
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {calc.bmr}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        kcal
                      </span>
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 border">
                    <p className="text-xs text-muted-foreground">
                      DEJ réel (TDEE)
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {calc.tdee}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        kcal
                      </span>
                    </p>
                  </div>
                </div>

                {/* NAP selector */}
                <div className="space-y-2">
                  <Label className="text-xs">NAP (niveau d&apos;activité physique)</Label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {NAP_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => setNap(o.value.toString())}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                          nap === o.value.toString()
                            ? "border-warm-primary bg-warm-primary/5 ring-1 ring-warm-primary"
                            : "border-warm-border hover:border-warm-primary/40"
                        }`}
                      >
                        <div>
                          <span className="font-medium">{o.label}</span>
                          <span className="ml-2 text-xs text-muted-foreground">{o.desc}</span>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">{o.value}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Balance énergétique */}
                <div className="space-y-2">
                  <Label className="text-xs">Balance énergétique</Label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {([
                      { value: "DEFICIT", label: "Déficit", icon: "↓" },
                      { value: "MAINTENANCE", label: "Maintien", icon: "=" },
                      { value: "SURPLUS", label: "Prise de masse", icon: "↑" },
                    ] as const).map((o) => (
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
                </div>

                {/* Delta */}
                {balance !== "MAINTENANCE" && (
                  <div className="space-y-1">
                    <Label className="text-xs">
                      Delta kcal/jour{" "}
                      {balance === "DEFICIT" ? "(sera soustrait)" : "(sera ajouté)"}
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={Math.abs(Number(delta) || 0).toString()}
                      onChange={(e) => setDelta(e.target.value)}
                      placeholder="300"
                    />
                  </div>
                )}

                <Button
                  onClick={recalculate}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Calculator className="h-4 w-4 mr-1" />
                  Recalculer
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Goal calories */}
          <Card className="border-warm-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <CardTitle className="text-base">
                  DEJ avec{" "}
                  {balance === "DEFICIT"
                    ? "déficit"
                    : balance === "SURPLUS"
                      ? "surplus"
                      : "maintien"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-100">
                <p className="text-4xl font-bold text-orange-600">
                  {goalCalories || "—"}
                </p>
                <p className="text-sm text-orange-500 mt-1">kcal / jour</p>
              </div>
            </CardContent>
          </Card>

          {/* Macros */}
          <Card className="border-warm-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-base">
                  Macros & Fibres (g/jour)
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Protéines</Label>
                  <Input
                    type="number"
                    value={goalProtein}
                    onChange={(e) => setGoalProtein(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    {goalProtein ? `${Number(goalProtein) * 4} kcal` : ""}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Glucides</Label>
                  <Input
                    type="number"
                    value={goalCarbs}
                    onChange={(e) => setGoalCarbs(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    {goalCarbs ? `${Number(goalCarbs) * 4} kcal` : ""}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Lipides</Label>
                  <Input
                    type="number"
                    value={goalFat}
                    onChange={(e) => setGoalFat(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    {goalFat ? `${Number(goalFat) * 9} kcal` : ""}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs flex items-center gap-1">
                    <Wheat className="h-3 w-3" /> Fibres
                  </Label>
                  <Input
                    type="number"
                    value={goalFiber}
                    onChange={(e) => setGoalFiber(e.target.value)}
                  />
                </div>
              </div>
              {goalProtein && goalCarbs && goalFat && (
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Total macros :{" "}
                  <strong>
                    {Number(goalProtein) * 4 +
                      Number(goalCarbs) * 4 +
                      Number(goalFat) * 9}{" "}
                    kcal
                  </strong>{" "}
                  / {goalCalories} kcal objectif
                </p>
              )}
            </CardContent>
          </Card>

          {/* Water */}
          <Card className="border-warm-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-base">Eau (L/jour)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                <p className="text-3xl font-bold text-blue-600">
                  {goalWaterL || "—"} L
                </p>
                <p className="text-sm text-blue-500 mt-1">
                  ≈{" "}
                  {goalWaterL
                    ? Math.round(Number(goalWaterL) / 0.25)
                    : "—"}{" "}
                  verres de 25cl
                </p>
              </div>
              <Input
                type="number"
                step="0.1"
                value={goalWaterL}
                onChange={(e) => setGoalWaterL(e.target.value)}
              />
              {calc && (
                <div className="text-xs text-muted-foreground space-y-0.5 bg-muted/50 rounded p-2">
                  <p className="font-medium text-foreground mb-1">Détail du calcul :</p>
                  <p>Base métabolique : {((Number(tokenData?.response?.data?.poids) || 60) * 0.033).toFixed(1)} L <span className="text-muted-foreground/70">(poids × 0.033)</span></p>
                  <p>Surplus activité : +{((calc.tdee - calc.bmr) / 1000).toFixed(1)} L <span className="text-muted-foreground/70">(dépense sport : {calc.tdee - calc.bmr} kcal)</span></p>
                  <p>Bonus NAP ({calc.nap}) : +{calc.nap >= 1.9 ? "0.5" : calc.nap >= 1.725 ? "0.3" : calc.nap >= 1.55 ? "0.15" : "0"} L</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Validate button */}
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
            <div className="text-center py-4">
              <Badge className="bg-green-100 text-green-700 text-sm px-4 py-2">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Compte cliente validé — objectifs envoyés
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
