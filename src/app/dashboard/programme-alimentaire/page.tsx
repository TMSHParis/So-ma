import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils, Clock, Flame } from "lucide-react";

export default function ProgrammeAlimentairePage() {
  // TODO: Fetch real data from DB
  const mealPlan = {
    title: "Programme nutritionnel personnalisé",
    description: "Adapté à votre profil et vos objectifs.",
    meals: [
      {
        name: "Petit-déjeuner",
        time: "7h30 - 8h30",
        items: [
          "Porridge d'avoine (50g) avec fruits frais",
          "1 cuillère de beurre de cacahuète",
          "1 poignée d'amandes",
          "Thé vert ou café",
        ],
        calories: 450,
      },
      {
        name: "Déjeuner",
        time: "12h - 13h",
        items: [
          "Poulet grillé (150g) ou tofu (200g)",
          "Riz complet (80g cru) ou patate douce",
          "Légumes de saison en abondance",
          "1 cuillère d'huile d'olive",
        ],
        calories: 550,
      },
      {
        name: "Collation",
        time: "16h",
        items: [
          "1 fruit de saison",
          "1 yaourt nature ou végétal",
          "Quelques noix ou graines",
        ],
        calories: 200,
      },
      {
        name: "Dîner",
        time: "19h - 20h",
        items: [
          "Poisson (150g) ou oeufs (2-3)",
          "Quinoa ou pâtes complètes (60g cru)",
          "Salade verte + crudités",
          "1 cuillère d'huile de colza",
        ],
        calories: 500,
      },
    ],
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-foreground">
          Programme alimentaire
        </h1>
        <p className="text-muted-foreground mt-1">{mealPlan.description}</p>
      </div>

      <div className="space-y-4">
        {mealPlan.meals.map((meal) => (
          <Card key={meal.name} className="border-warm-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Utensils className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{meal.name}</CardTitle>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Clock className="h-3 w-3" />
                      {meal.time}
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  <Flame className="h-3 w-3 mr-1" />
                  {meal.calories} kcal
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {meal.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-warm-border mt-6 bg-primary/5">
        <CardContent className="pt-4 pb-4">
          <p className="text-sm text-muted-foreground text-center">
            Ce programme est indicatif et doit être adapté selon vos envies et
            disponibilités. L&apos;important est de respecter les grandes lignes
            tout en gardant du plaisir.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
