import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Utensils,
  Dumbbell,
  Heart,
  TrendingUp,
  Flame,
  Droplets,
  Beef,
  Wheat,
  Footprints,
  Target,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import {
  calendarDateInTimeZone,
  calendarIsoToPrismaDate,
  CLIENT_TIMEZONE,
} from "@/lib/calendar-day";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");
  const role = (session.user as { role: string }).role;
  if (role !== "CLIENT") redirect("/admin");

  const client = await prisma.client.findUnique({
    where: { userId: session.user.id },
  });

  if (!client) {
    return (
      <div className="rounded-xl border border-warm-border bg-white p-8 text-center">
        <p className="text-muted-foreground">
          Votre profil cliente n&apos;est pas encore configuré. Contactez votre
          administratrice.
        </p>
      </div>
    );
  }

  const iso = calendarDateInTimeZone(CLIENT_TIMEZONE);
  const day = calendarIsoToPrismaDate(iso);

  const [foodEntries, sportEntries] = await Promise.all([
    prisma.foodEntry.findMany({
      where: { clientId: client.id, date: day },
    }),
    prisma.sportEntry.findMany({
      where: { clientId: client.id, date: day },
    }),
  ]);

  const foodTotals = foodEntries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs,
      fat: acc.fat + e.fat,
      fiber: acc.fiber + e.fiber,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const stepsToday = sportEntries.reduce((a, e) => a + (e.steps ?? 0), 0);
  const sportDuration = sportEntries.reduce((a, e) => a + (e.duration ?? 0), 0);
  const sportKcal = sportEntries.reduce((a, e) => a + (e.calories ?? 0), 0);

  const goals = {
    calories: client.goalCalories ?? 1800,
    protein: client.goalProtein ?? 120,
    carbs: client.goalCarbs ?? 200,
    fat: client.goalFat ?? 60,
    fiber: client.goalFiber ?? 25,
  };

  const todayMacros = {
    calories: { current: Math.round(foodTotals.calories), goal: goals.calories },
    protein: {
      current: Math.round(foodTotals.protein * 10) / 10,
      goal: goals.protein,
    },
    carbs: {
      current: Math.round(foodTotals.carbs * 10) / 10,
      goal: goals.carbs,
    },
    fat: {
      current: Math.round(foodTotals.fat * 10) / 10,
      goal: goals.fat,
    },
    fiber: {
      current: Math.round(foodTotals.fiber * 10) / 10,
      goal: goals.fiber,
    },
  };

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-foreground">
            Bonjour !
          </h1>
          <p className="text-muted-foreground mt-1">
            Voici le résumé de votre journée ({iso}).
          </p>
        </div>
        <p className="text-sm text-muted-foreground italic text-right whitespace-nowrap mt-1">
          السلام عليكم ورحمة الله
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          {
            label: "Calories",
            icon: Flame,
            ...todayMacros.calories,
            unit: "kcal",
            color: "text-orange-500",
          },
          {
            label: "Protéines",
            icon: Beef,
            ...todayMacros.protein,
            unit: "g",
            color: "text-red-400",
          },
          {
            label: "Glucides",
            icon: Wheat,
            ...todayMacros.carbs,
            unit: "g",
            color: "text-amber-500",
          },
          {
            label: "Lipides",
            icon: Droplets,
            ...todayMacros.fat,
            unit: "g",
            color: "text-yellow-500",
          },
          {
            label: "Fibres",
            icon: TrendingUp,
            ...todayMacros.fiber,
            unit: "g",
            color: "text-green-500",
          },
        ].map((macro) => (
          <Card key={macro.label} className="border-warm-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <macro.icon className={`h-4 w-4 ${macro.color}`} />
                <span className="text-xs font-medium text-muted-foreground">
                  {macro.label}
                </span>
              </div>
              <p className="text-lg font-bold text-foreground">
                {macro.current}
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  / {macro.goal} {macro.unit}
                </span>
              </p>
              <Progress
                value={Math.min((macro.current / macro.goal) * 100, 100)}
                className="h-1.5 mt-2"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Card className="border-warm-border">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Footprints className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Pas (sport)</span>
            </div>
            <p className="text-lg font-bold">{stepsToday.toLocaleString("fr-FR")}</p>
          </CardContent>
        </Card>
        <Card className="border-warm-border">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Dumbbell className="h-4 w-4 text-secondary-foreground" />
              <span className="text-xs text-muted-foreground">
                Durée séances
              </span>
            </div>
            <p className="text-lg font-bold">{sportDuration} min</p>
          </CardContent>
        </Card>
        <Card className="border-warm-border md:col-span-2">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">
                Dépense estimée (saisie)
              </span>
            </div>
            <p className="text-lg font-bold">{Math.round(sportKcal)} kcal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/objectifs">
          <Card className="border-warm-border hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Target className="h-5 w-5 text-accent-foreground" />
                </div>
                <CardTitle className="text-base">Mes objectifs</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Calories, déficit / maintien / surplus, macros et fibres.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/nutrition">
          <Card className="border-warm-border hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Utensils className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Suivi alimentaire</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Enregistrez vos repas et suivez vos macros au quotidien.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/sport">
          <Card className="border-warm-border hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-secondary-foreground" />
                </div>
                <CardTitle className="text-base">Suivi sportif</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Musculation, cardio, pas et dépense.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/cycle">
          <Card className="border-warm-border hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Heart className="h-5 w-5 text-accent-foreground" />
                </div>
                <CardTitle className="text-base">Cycle menstruel</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Suivez votre cycle et ses phases pour adapter votre routine.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
