"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Send, Sparkles } from "lucide-react";

const steps = [
  "Informations personnelles",
  "Habitudes alimentaires",
  "Activité physique",
  "Rythme de vie",
  "Santé & Bien-être",
  "Objectifs",
];

export default function BilanPage() {
  const params = useParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});

  function updateField(key: string, value: string | string[] | null) {
    if (value === null) return;
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function toggleArrayField(key: string, value: string) {
    setFormData((prev) => {
      const arr = (prev[key] as string[]) || [];
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter((v) => v !== value) };
      }
      return { ...prev, [key]: [...arr, value] };
    });
  }

  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    const password = formData.password as string;
    const confirmPassword = formData.confirmPassword as string;
    const email = formData.email as string;
    const firstName = formData.prenom as string;
    const lastName = formData.nom as string;

    // Validate password
    if (password && password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }
    if (password && password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      // Create account if password provided
      if (password && email && firstName && lastName) {
        const registerRes = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, firstName, lastName, password }),
        });

        if (!registerRes.ok) {
          const data = await registerRes.json().catch(() => null);
          // If account already exists, that's OK - continue with bilan
          if (registerRes.status !== 409) {
            setError(data?.message || "Erreur lors de la création du compte.");
            setLoading(false);
            return;
          }
        }

        // Auto-login
        await signIn("credentials", { email, password, redirect: false });
      }

      // Submit bilan (password fields stripped from data sent to API)
      const { password: _p, confirmPassword: _cp, ...bilanData } = formData;
      const res = await fetch("/api/bilan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: params.token, data: bilanData }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.message || "Une erreur est survenue. Veuillez réessayer.");
      }
    } catch {
      setError("Erreur de connexion. Vérifiez votre connexion internet.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-cream px-4 safe-top safe-bottom">
        <Card className="max-w-md w-full border-warm-border text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-secondary-foreground" />
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-foreground mb-2">
              Merci !
            </h1>
            <p className="text-muted-foreground">
              Ton bilan a bien été envoyé. Tu seras contactée très
              prochainement pour ta consultation personnalisée.
            </p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="mt-4 bg-primary hover:bg-primary/90 text-white"
            >
              Accéder à mon espace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-[100dvh] bg-cream py-8 px-4 safe-top safe-bottom">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground mb-2">
            Votre bilan personnalisé
          </h1>
          <p className="text-muted-foreground">
            Prenez le temps de répondre honnêtement. Il n'y a pas de bonne ou
            mauvaise réponse.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>
              Étape {currentStep + 1} sur {steps.length}
            </span>
            <span>{steps[currentStep]}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Steps */}
        <Card className="border-warm-border">
          <CardHeader>
            <h2 className="text-xl font-semibold">{steps[currentStep]}</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prénom</Label>
                    <Input
                      value={(formData.prenom as string) || ""}
                      onChange={(e) => updateField("prenom", e.target.value)}
                      className="border-warm-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input
                      value={(formData.nom as string) || ""}
                      onChange={(e) => updateField("nom", e.target.value)}
                      className="border-warm-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={(formData.email as string) || ""}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="border-warm-border"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Mot de passe</Label>
                    <Input
                      type="password"
                      placeholder="Min. 8 caractères"
                      value={(formData.password as string) || ""}
                      onChange={(e) => updateField("password", e.target.value)}
                      className="border-warm-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirmer le mot de passe</Label>
                    <Input
                      type="password"
                      value={(formData.confirmPassword as string) || ""}
                      onChange={(e) => updateField("confirmPassword", e.target.value)}
                      className="border-warm-border"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground -mt-2">
                  Ce mot de passe te permettra de te connecter à ton espace client après le bilan.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input
                      type="number"
                      value={(formData.age as string) || ""}
                      onChange={(e) => updateField("age", e.target.value)}
                      className="border-warm-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input
                      type="tel"
                      value={(formData.telephone as string) || ""}
                      onChange={(e) => updateField("telephone", e.target.value)}
                      className="border-warm-border"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Taille (cm)</Label>
                    <Input
                      type="number"
                      placeholder="ex : 172"
                      min={100}
                      max={250}
                      value={(formData.taille as string) || ""}
                      onChange={(e) => updateField("taille", e.target.value)}
                      className="border-warm-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Poids actuel (kg)</Label>
                    <Input
                      type="number"
                      value={(formData.poids as string) || ""}
                      onChange={(e) => updateField("poids", e.target.value)}
                      className="border-warm-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Sexe</Label>
                  <Select
                    value={(formData.sexe as string) || ""}
                    onValueChange={(v) => updateField("sexe", v)}
                  >
                    <SelectTrigger className="border-warm-border">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="F">Femme</SelectItem>
                      <SelectItem value="M">Homme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Groupe sanguin</Label>
                  <Select
                    value={(formData.groupe_sanguin as string) || ""}
                    onValueChange={(v) => updateField("groupe_sanguin", v)}
                  >
                    <SelectTrigger className="border-warm-border">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Je ne sais pas"].map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Profil neuroatypique (si connu)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["TDAH", "TSA", "HPI/HPE", "DYS", "Non diagnostiquée", "Autre"].map(
                      (item) => (
                        <div key={item} className="flex items-center gap-2">
                          <Checkbox
                            checked={((formData.profil_neuro as string[]) || []).includes(item)}
                            onCheckedChange={() => toggleArrayField("profil_neuro", item)}
                          />
                          <span className="text-sm">{item}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </>
            )}

            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label>Combien de repas prenez-vous par jour ?</Label>
                  <Select
                    value={(formData.repas_par_jour as string) || ""}
                    onValueChange={(v) => updateField("repas_par_jour", v)}
                  >
                    <SelectTrigger className="border-warm-border">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2">1 à 2 repas</SelectItem>
                      <SelectItem value="3">3 repas</SelectItem>
                      <SelectItem value="3+collations">3 repas + collations</SelectItem>
                      <SelectItem value="irregulier">Irrégulier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Décrivez une journée type de repas</Label>
                  <Textarea
                    value={(formData.journee_type as string) || ""}
                    onChange={(e) => updateField("journee_type", e.target.value)}
                    className="border-warm-border min-h-[100px]"
                    placeholder="Petit-déjeuner, déjeuner, dîner, collations..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Avez-vous des allergies ou intolérances alimentaires ?</Label>
                  <Textarea
                    value={(formData.allergies as string) || ""}
                    onChange={(e) => updateField("allergies", e.target.value)}
                    className="border-warm-border"
                    placeholder="Gluten, lactose, fruits à coque..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Régime alimentaire particulier ?</Label>
                  <RadioGroup
                    value={(formData.regime as string) || ""}
                    onValueChange={(v) => updateField("regime", v)}
                  >
                    {["Omnivore", "Végétarien", "Vegan", "Flexitarien", "Autre"].map((r) => (
                      <div key={r} className="flex items-center gap-2">
                        <RadioGroupItem value={r} id={`regime-${r}`} />
                        <Label htmlFor={`regime-${r}`} className="font-normal">{r}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Quelle est votre relation avec la nourriture ?</Label>
                  <Textarea
                    value={(formData.relation_nourriture as string) || ""}
                    onChange={(e) => updateField("relation_nourriture", e.target.value)}
                    className="border-warm-border min-h-[80px]"
                    placeholder="Compulsions, restrictions, culpabilité, plaisir..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>En combien de temps prenez-vous vos repas en moyenne ?</Label>
                  <Select
                    value={(formData.temps_repas as string) || ""}
                    onValueChange={(v) => updateField("temps_repas", v)}
                  >
                    <SelectTrigger className="border-warm-border">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moins-10min">Moins de 10 min</SelectItem>
                      <SelectItem value="10-20min">10 à 20 min</SelectItem>
                      <SelectItem value="20-30min">20 à 30 min</SelectItem>
                      <SelectItem value="plus-30min">Plus de 30 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Aimez-vous manger ?</Label>
                  <RadioGroup
                    value={(formData.aime_manger as string) || ""}
                    onValueChange={(v) => updateField("aime_manger", v)}
                  >
                    {["Oui, beaucoup", "Oui, modérément", "C'est un besoin, pas un plaisir", "Non, pas vraiment"].map((r) => (
                      <div key={r} className="flex items-center gap-2">
                        <RadioGroupItem value={r} id={`manger-${r}`} />
                        <Label htmlFor={`manger-${r}`} className="font-normal">{r}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Aimez-vous cuisiner ?</Label>
                  <RadioGroup
                    value={(formData.aime_cuisiner as string) || ""}
                    onValueChange={(v) => updateField("aime_cuisiner", v)}
                  >
                    {["Oui, j'adore", "Oui, quand j'ai le temps", "Pas spécialement", "Non, je n'aime pas"].map((r) => (
                      <div key={r} className="flex items-center gap-2">
                        <RadioGroupItem value={r} id={`cuisiner-${r}`} />
                        <Label htmlFor={`cuisiner-${r}`} className="font-normal">{r}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Combien d'eau buvez-vous par jour ?</Label>
                  <Select
                    value={(formData.eau as string) || ""}
                    onValueChange={(v) => updateField("eau", v)}
                  >
                    <SelectTrigger className="border-warm-border">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moins-1L">Moins d'1L</SelectItem>
                      <SelectItem value="1-1.5L">1 à 1.5L</SelectItem>
                      <SelectItem value="1.5-2L">1.5 à 2L</SelectItem>
                      <SelectItem value="plus-2L">Plus de 2L</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label>Pratiquez-vous une activité physique régulière ?</Label>
                  <RadioGroup
                    value={(formData.activite_physique as string) || ""}
                    onValueChange={(v) => updateField("activite_physique", v)}
                  >
                    {[
                      "Aucune activité",
                      "1 à 2 fois par semaine",
                      "3 à 4 fois par semaine",
                      "5 fois ou plus par semaine",
                    ].map((r) => (
                      <div key={r} className="flex items-center gap-2">
                        <RadioGroupItem value={r} id={`activite-${r}`} />
                        <Label htmlFor={`activite-${r}`} className="font-normal">{r}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Quel(s) type(s) de sport pratiquez-vous ?</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Musculation",
                      "Cardio",
                      "Marche",
                      "Course à pied",
                      "Yoga/Pilates",
                      "Natation",
                      "Vélo",
                      "Danse",
                      "Sports collectifs",
                      "Autre",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <Checkbox
                          checked={((formData.types_sport as string[]) || []).includes(item)}
                          onCheckedChange={() => toggleArrayField("types_sport", item)}
                        />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Combien de pas faites-vous en moyenne par jour ?</Label>
                  <Select
                    value={(formData.pas_quotidiens as string) || ""}
                    onValueChange={(v) => updateField("pas_quotidiens", v)}
                  >
                    <SelectTrigger className="border-warm-border">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moins-3000">Moins de 3 000</SelectItem>
                      <SelectItem value="3000-5000">3 000 à 5 000</SelectItem>
                      <SelectItem value="5000-8000">5 000 à 8 000</SelectItem>
                      <SelectItem value="8000-10000">8 000 à 10 000</SelectItem>
                      <SelectItem value="plus-10000">Plus de 10 000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>De combien de temps disposez-vous pour le sport par jour ?</Label>
                  <Select
                    value={(formData.temps_dispo_sport as string) || ""}
                    onValueChange={(v) => updateField("temps_dispo_sport", v)}
                  >
                    <SelectTrigger className="border-warm-border">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moins-30min">Moins de 30 min</SelectItem>
                      <SelectItem value="30-45min">30 à 45 min</SelectItem>
                      <SelectItem value="45-60min">45 min à 1h</SelectItem>
                      <SelectItem value="1-1.5h">1h à 1h30</SelectItem>
                      <SelectItem value="plus-1.5h">Plus de 1h30</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Votre relation au sport</Label>
                  <Textarea
                    value={(formData.relation_sport as string) || ""}
                    onChange={(e) => updateField("relation_sport", e.target.value)}
                    className="border-warm-border min-h-[80px]"
                    placeholder="Plaisir, contrainte, motivation variable, difficulté à maintenir une routine..."
                  />
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <p className="text-sm text-muted-foreground">Ces informations nous permettent de calculer vos besoins énergétiques précis. Répondez en heures par jour.</p>
                <div className="space-y-2">
                  <Label>Combien de temps passez-vous en position assise / travail par jour ?</Label>
                  <Input type="text" placeholder="ex : 8h, 6h30..." value={(formData.temps_assis as string) || ""} onChange={(e) => updateField("temps_assis", e.target.value)} className="border-warm-border" />
                </div>
                <div className="space-y-2">
                  <Label>Combien de temps durent au total vos déplacements divers par jour ?</Label>
                  <Input type="text" placeholder="ex : 1h, 45min..." value={(formData.temps_deplacements as string) || ""} onChange={(e) => updateField("temps_deplacements", e.target.value)} className="border-warm-border" />
                </div>
                <div className="space-y-2">
                  <Label>Combien de temps de marche faites-vous par jour ?</Label>
                  <Input type="text" placeholder="ex : 30min, 1h..." value={(formData.temps_marche as string) || ""} onChange={(e) => updateField("temps_marche", e.target.value)} className="border-warm-border" />
                </div>
                <div className="space-y-2">
                  <Label>Combien de temps de sport faites-vous par jour (en dehors de la marche) ?</Label>
                  <Input type="text" placeholder="ex : 1h, 45min..." value={(formData.temps_sport as string) || ""} onChange={(e) => updateField("temps_sport", e.target.value)} className="border-warm-border" />
                </div>
                <div className="space-y-2">
                  <Label>Combien de temps passez-vous dans vos soins personnels et en détente par jour ?</Label>
                  <Input type="text" placeholder="ex : 1h, 2h..." value={(formData.temps_soins_detente as string) || ""} onChange={(e) => updateField("temps_soins_detente", e.target.value)} className="border-warm-border" />
                </div>
                <div className="space-y-2">
                  <Label>Combien de temps passez-vous par jour à préparer les repas ?</Label>
                  <Input type="text" placeholder="ex : 1h, 30min..." value={(formData.temps_prep_repas as string) || ""} onChange={(e) => updateField("temps_prep_repas", e.target.value)} className="border-warm-border" />
                </div>
                <div className="space-y-2">
                  <Label>Combien de temps passez-vous aux toilettes par jour ?</Label>
                  <Input type="text" placeholder="ex : 30min, 1h..." value={(formData.temps_toilettes as string) || ""} onChange={(e) => updateField("temps_toilettes", e.target.value)} className="border-warm-border" />
                </div>
                <div className="space-y-2">
                  <Label>Combien d&apos;heures dormez-vous par nuit en moyenne ?</Label>
                  <Input type="text" placeholder="ex : 7h, 6h30..." value={(formData.temps_sommeil as string) || ""} onChange={(e) => updateField("temps_sommeil", e.target.value)} className="border-warm-border" />
                </div>
                <div className="space-y-2">
                  <Label>Combien de temps passez-vous en voiture par jour ?</Label>
                  <Input type="text" placeholder="ex : 30min, 1h..." value={(formData.temps_voiture as string) || ""} onChange={(e) => updateField("temps_voiture", e.target.value)} className="border-warm-border" />
                </div>
                <div className="space-y-2">
                  <Label>Combien de temps passez-vous dans les transports par jour ?</Label>
                  <Input type="text" placeholder="ex : 45min, 1h30..." value={(formData.temps_transports as string) || ""} onChange={(e) => updateField("temps_transports", e.target.value)} className="border-warm-border" />
                </div>
                <div className="space-y-2">
                  <Label>Combien de temps passez-vous dans les soins de vos enfants par jour ? (douche, devoirs, jeux, etc.)</Label>
                  <Input type="text" placeholder="ex : 2h, 0, pas d'enfants..." value={(formData.temps_enfants as string) || ""} onChange={(e) => updateField("temps_enfants", e.target.value)} className="border-warm-border" />
                </div>
              </>
            )}

            {currentStep === 5 && (
              <>
                <div className="space-y-2">
                  <Label>Qualité de votre sommeil</Label>
                  <RadioGroup
                    value={(formData.sommeil as string) || ""}
                    onValueChange={(v) => updateField("sommeil", v)}
                  >
                    {["Très bon", "Bon", "Moyen", "Mauvais", "Très mauvais"].map((r) => (
                      <div key={r} className="flex items-center gap-2">
                        <RadioGroupItem value={r} id={`sommeil-${r}`} />
                        <Label htmlFor={`sommeil-${r}`} className="font-normal">{r}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Niveau de stress au quotidien</Label>
                  <RadioGroup
                    value={(formData.stress as string) || ""}
                    onValueChange={(v) => updateField("stress", v)}
                  >
                    {["Faible", "Modéré", "Élevé", "Très élevé"].map((r) => (
                      <div key={r} className="flex items-center gap-2">
                        <RadioGroupItem value={r} id={`stress-${r}`} />
                        <Label htmlFor={`stress-${r}`} className="font-normal">{r}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Avez-vous des cycles menstruels réguliers ?</Label>
                  <RadioGroup
                    value={(formData.cycles as string) || ""}
                    onValueChange={(v) => updateField("cycles", v)}
                  >
                    {[
                      "Oui, réguliers",
                      "Non, irréguliers",
                      "Aménorrhée",
                      "Ménopause",
                      "Contraception hormonale",
                    ].map((r) => (
                      <div key={r} className="flex items-center gap-2">
                        <RadioGroupItem value={r} id={`cycles-${r}`} />
                        <Label htmlFor={`cycles-${r}`} className="font-normal">{r}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Problèmes de santé ou traitements en cours</Label>
                  <Textarea
                    value={(formData.sante as string) || ""}
                    onChange={(e) => updateField("sante", e.target.value)}
                    className="border-warm-border min-h-[80px]"
                    placeholder="Médicaments, compléments, pathologies..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>À quelle fréquence allez-vous à la selle ?</Label>
                  <Select
                    value={(formData.frequence_selles as string) || ""}
                    onValueChange={(v) => updateField("frequence_selles", v)}
                  >
                    <SelectTrigger className="border-warm-border">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plusieurs-par-jour">Plusieurs fois par jour</SelectItem>
                      <SelectItem value="1-par-jour">1 fois par jour</SelectItem>
                      <SelectItem value="1-tous-les-2-jours">1 fois tous les 2 jours</SelectItem>
                      <SelectItem value="moins-souvent">Moins souvent</SelectItem>
                      <SelectItem value="irregulier">Très irrégulier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>À quelle fréquence urinez-vous par jour ?</Label>
                  <Select
                    value={(formData.frequence_urine as string) || ""}
                    onValueChange={(v) => updateField("frequence_urine", v)}
                  >
                    <SelectTrigger className="border-warm-border">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moins-4">Moins de 4 fois</SelectItem>
                      <SelectItem value="4-6">4 à 6 fois</SelectItem>
                      <SelectItem value="6-8">6 à 8 fois</SelectItem>
                      <SelectItem value="plus-8">Plus de 8 fois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Troubles digestifs ?</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Ballonnements",
                      "Constipation",
                      "Diarrhée",
                      "Reflux",
                      "Crampes",
                      "Aucun",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <Checkbox
                          checked={((formData.troubles_digestifs as string[]) || []).includes(item)}
                          onCheckedChange={() => toggleArrayField("troubles_digestifs", item)}
                        />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {currentStep === 5 && (
              <>
                <div className="space-y-2">
                  <Label>Quel est votre objectif principal ?</Label>
                  <RadioGroup
                    value={(formData.objectif_principal as string) || ""}
                    onValueChange={(v) => updateField("objectif_principal", v)}
                  >
                    {[
                      "Perte de poids",
                      "Prise de masse musculaire",
                      "Améliorer mon énergie",
                      "Meilleure relation à la nourriture",
                      "Équilibrer mon alimentation",
                      "Performance sportive",
                      "Santé globale",
                    ].map((r) => (
                      <div key={r} className="flex items-center gap-2">
                        <RadioGroupItem value={r} id={`objectif-${r}`} />
                        <Label htmlFor={`objectif-${r}`} className="font-normal">{r}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Poids souhaité (si applicable)</Label>
                  <Input
                    type="number"
                    value={(formData.poids_souhaite as string) || ""}
                    onChange={(e) => updateField("poids_souhaite", e.target.value)}
                    className="border-warm-border"
                    placeholder="En kg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Qu'avez-vous déjà essayé qui n'a pas fonctionné ?</Label>
                  <Textarea
                    value={(formData.essaye_avant as string) || ""}
                    onChange={(e) => updateField("essaye_avant", e.target.value)}
                    className="border-warm-border min-h-[80px]"
                    placeholder="Régimes, programmes, méthodes..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Qu'attendez-vous de cet accompagnement ?</Label>
                  <Textarea
                    value={(formData.attentes as string) || ""}
                    onChange={(e) => updateField("attentes", e.target.value)}
                    className="border-warm-border min-h-[80px]"
                    placeholder="Vos attentes, besoins, envies..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sur une échelle de 1 à 10, quelle est votre motivation ?</Label>
                  <Select
                    value={(formData.motivation as string) || ""}
                    onValueChange={(v) => updateField("motivation", v)}
                  >
                    <SelectTrigger className="border-warm-border">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                        <SelectItem key={n} value={n.toString()}>{n}{n <= 3 ? " — Faible" : n <= 6 ? " — Moyenne" : n <= 8 ? " — Bonne" : " — Très forte"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quelque chose à ajouter ?</Label>
                  <Textarea
                    value={(formData.commentaires as string) || ""}
                    onChange={(e) => updateField("commentaires", e.target.value)}
                    className="border-warm-border min-h-[60px]"
                    placeholder="Informations supplémentaires..."
                  />
                </div>
              </>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep((s) => s - 1)}
                disabled={currentStep === 0}
                className="border-warm-border"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Précédent
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={() => setCurrentStep((s) => s + 1)}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Suivant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <div className="flex flex-col items-end gap-2">
                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 w-full text-center">
                      {error}
                    </p>
                  )}
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-secondary hover:bg-secondary/90 text-white"
                  >
                    {loading ? "Envoi en cours..." : "Envoyer mon bilan"}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
