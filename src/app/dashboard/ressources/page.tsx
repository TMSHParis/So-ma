import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Lightbulb, FileText, Heart } from "lucide-react";

export default function RessourcesPage() {
  // TODO: Fetch real data from DB
  const resources = {
    nutrition: [
      {
        title: "Comprendre les macronutriments",
        desc: "Protéines, glucides, lipides : à quoi servent-ils et comment les équilibrer au quotidien.",
        category: "Guide",
      },
      {
        title: "Organiser ses repas simplement",
        desc: "Batch cooking, meal prep et astuces pour les profils TDAH : comment simplifier la planification des repas.",
        category: "Astuce",
      },
      {
        title: "Les superaliments du quotidien",
        desc: "Pas besoin de produits exotiques ! Découvrez les aliments accessibles riches en nutriments essentiels.",
        category: "Article",
      },
    ],
    sport: [
      {
        title: "S'échauffer correctement",
        desc: "Une routine d'échauffement de 5 minutes adaptée à chaque type de séance.",
        category: "Guide",
      },
      {
        title: "Gérer la motivation variable",
        desc: "Quand la motivation fluctue (hello TDAH), voici comment maintenir une routine sportive durable.",
        category: "Astuce",
      },
    ],
    bienetre: [
      {
        title: "Sport et cycle menstruel",
        desc: "Adapter son entraînement et son alimentation selon les phases de son cycle pour optimiser ses performances.",
        category: "Guide",
      },
      {
        title: "Sommeil et récupération",
        desc: "L'importance du sommeil dans la perte de poids et la prise de muscle. Conseils pratiques pour mieux dormir.",
        category: "Article",
      },
      {
        title: "Gestion du stress pour neuroatypiques",
        desc: "Techniques de respiration, grounding et habitudes pour réduire le stress au quotidien.",
        category: "Astuce",
      },
    ],
  };

  const categories = [
    { value: "nutrition", label: "Nutrition", icon: Lightbulb },
    { value: "sport", label: "Sport", icon: FileText },
    { value: "bienetre", label: "Bien-être", icon: Heart },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-foreground">
          Ressources & Astuces
        </h1>
        <p className="text-muted-foreground mt-1">
          Articles, guides et astuces pour vous accompagner au quotidien.
        </p>
      </div>

      <Tabs defaultValue="nutrition">
        <TabsList className="mb-6">
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value} className="gap-2">
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.value} value={cat.value}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources[cat.value as keyof typeof resources].map((resource) => (
                <Card
                  key={resource.title}
                  className="border-warm-border hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {resource.title}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {resource.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {resource.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
