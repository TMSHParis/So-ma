"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await fetch("/api/bilan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: params.token, data: formData }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <Card className="max-w-md w-full border-warm-border text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-secondary-foreground" />
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-foreground mb-2">
              Merci !
            </h1>
            <p className="text-muted-foreground">
              Votre bilan a bien été envoyé. Vous serez contactée très
              prochainement pour votre consultation personnalisée.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-cream py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground mb-2">
            Votre bilan personnalisé
          </h1>
          <p className="text-muted-foreground">
            Prenez le temps de répondre honnêtement. Il n&apos;y a pas de bonne ou
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
                  <Label>Combien d&apos;eau buvez-vous par jour ?</Label>
                  <Select
                    value={(formData.eau as string) || ""}
                    onValueChange={(v) => updateField("eau", v)}
                  >
                    <SelectTrigger className="border-warm-border">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moins-1L">Moins d&apos;1L</SelectItem>
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

            {currentStep === 4 && (
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
                  <Label>Qu&apos;avez-vous déjà essayé qui n&apos;a pas fonctionné ?</Label>
                  <Textarea
                    value={(formData.essaye_avant as string) || ""}
                    onChange={(e) => updateField("essaye_avant", e.target.value)}
                    className="border-warm-border min-h-[80px]"
                    placeholder="Régimes, programmes, méthodes..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Qu&apos;attendez-vous de cet accompagnement ?</Label>
                  <Textarea
                    value={(formData.attentes as string) || ""}
                    onChange={(e) => updateField("attentes", e.target.value)}
                    className="border-warm-border min-h-[80px]"
                    placeholder="Vos attentes, besoins, envies..."
                  />
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
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-secondary hover:bg-secondary/90 text-white"
                >
                  {loading ? "Envoi en cours..." : "Envoyer mon bilan"}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
