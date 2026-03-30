import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Timer, Calendar } from "lucide-react";

export default function ProgrammeSportifPage() {
  // TODO: Fetch real data from DB
  const workoutPlan = {
    title: "Programme sportif personnalisé",
    frequency: "3 séances par semaine",
    weeks: [
      {
        day: "Lundi",
        type: "Haut du corps",
        exercises: [
          { name: "Développé couché", sets: 3, reps: "10-12", rest: "90s" },
          { name: "Rowing haltère", sets: 3, reps: "10-12", rest: "90s" },
          { name: "Développé épaules", sets: 3, reps: "10-12", rest: "60s" },
          { name: "Curl biceps", sets: 2, reps: "12-15", rest: "60s" },
          { name: "Dips ou extensions triceps", sets: 2, reps: "12-15", rest: "60s" },
        ],
        duration: 45,
      },
      {
        day: "Mercredi",
        type: "Bas du corps",
        exercises: [
          { name: "Squat", sets: 3, reps: "10-12", rest: "90s" },
          { name: "Fentes marchées", sets: 3, reps: "12 par jambe", rest: "60s" },
          { name: "Hip thrust", sets: 3, reps: "12-15", rest: "90s" },
          { name: "Leg curl", sets: 3, reps: "12-15", rest: "60s" },
          { name: "Mollets debout", sets: 3, reps: "15-20", rest: "45s" },
        ],
        duration: 50,
      },
      {
        day: "Vendredi",
        type: "Full body",
        exercises: [
          { name: "Deadlift roumain", sets: 3, reps: "10-12", rest: "90s" },
          { name: "Pompes ou développé incliné", sets: 3, reps: "10-12", rest: "60s" },
          { name: "Goblet squat", sets: 3, reps: "12-15", rest: "60s" },
          { name: "Tirage vertical", sets: 3, reps: "10-12", rest: "60s" },
          { name: "Planche", sets: 3, reps: "30-45s", rest: "45s" },
        ],
        duration: 45,
      },
    ],
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-foreground">
            Programme sportif
          </h1>
          <Badge variant="secondary">
            <Calendar className="h-3 w-3 mr-1" />
            {workoutPlan.frequency}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Programme adapté à votre niveau et vos objectifs. Échauffez-vous
          toujours 5-10 minutes avant chaque séance.
        </p>
      </div>

      <div className="space-y-6">
        {workoutPlan.weeks.map((day) => (
          <Card key={day.day} className="border-warm-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
                    <Dumbbell className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {day.day} - {day.type}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Timer className="h-3 w-3" />
                      ~{day.duration} min
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {day.exercises.map((ex, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {ex.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        {ex.sets} x {ex.reps}
                      </span>
                      <span>Repos: {ex.rest}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-warm-border mt-6 bg-secondary/5">
        <CardContent className="pt-4 pb-4">
          <p className="text-sm text-muted-foreground text-center">
            Adaptez les charges à votre niveau. Les dernières répétitions doivent
            être difficiles mais réalisables avec une bonne forme. En
            complément, visez 7 000 à 10 000 pas par jour.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
