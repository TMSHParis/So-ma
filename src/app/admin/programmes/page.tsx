import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Utensils, Dumbbell } from "lucide-react";

export default function ProgrammesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-foreground">
          Gestion des programmes
        </h1>
        <p className="text-muted-foreground mt-1">
          Créez et gérez les programmes alimentaires et sportifs de vos clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-warm-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Utensils className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">
                Programmes alimentaires
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Créez des plans de repas personnalisés avec recettes et macros pour
              chaque cliente.
            </p>
            <p className="text-xs text-muted-foreground text-center py-4 bg-muted/50 rounded-lg">
              Sélectionnez une cliente dans la section &quot;Clientes&quot; pour
              lui créer un programme.
            </p>
          </CardContent>
        </Card>

        <Card className="border-warm-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-secondary-foreground" />
              </div>
              <CardTitle className="text-base">Programmes sportifs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Créez des plannings d&apos;entraînement adaptés au niveau et aux
              objectifs de chaque cliente.
            </p>
            <p className="text-xs text-muted-foreground text-center py-4 bg-muted/50 rounded-lg">
              Sélectionnez une cliente dans la section &quot;Clientes&quot; pour
              lui créer un programme.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
