"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Flame,
  Footprints,
  Scale,
  Ruler,
  Activity,
  Droplets,
} from "lucide-react";

type StatsData = {
  client: {
    name: string;
    goals: {
      goalCalories: number | null;
      goalProtein: number | null;
      goalCarbs: number | null;
      goalFat: number | null;
      goalFiber: number | null;
      goalWaterL: number | null;
      goalSteps: number | null;
      sessionsPerWeek: number | null;
      startWeight: number | null;
      goalWeight: number | null;
    };
  };
  days: number;
  totalDays: number;
  firstDataDate: string | null;
  dailyData: Array<{
    date: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    water: number;
    calorieGoalPct: number | null;
    proteinGoalPct: number | null;
    carbsGoalPct: number | null;
    fatGoalPct: number | null;
    waterGoalPct: number | null;
    sportDuration: number;
    sportCalories: number;
    sportSteps: number;
    sportSessions: number;
    logged: boolean;
  }>;
  weightData: Array<{ date: string; weight: number }>;
  measurementData: Array<{
    date: string;
    waistCm: number | null;
    hipCm: number | null;
    buttCm: number | null;
  }>;
  waterData: Array<{ date: string; liters: number }>;
  scores: {
    effortScore: number;
    loggingRate: number;
    nutritionCompliance: number;
    sportCompliance: number | null;
    waterCompliance: number | null;
    daysLogged: number;
    totalDays: number;
    daysOnTarget: number;
    avgSessionsPerWeek: number;
  };
};

type PeriodValue = number | "all";

const PERIOD_OPTIONS: Array<{ value: PeriodValue; label: string }> = [
  { value: 7, label: "7j" },
  { value: 14, label: "14j" },
  { value: 30, label: "30j" },
  { value: 60, label: "60j" },
  { value: 90, label: "90j" },
  { value: "all", label: "Tout" },
];

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function ScoreRing({
  value,
  label,
  size = 80,
}: {
  value: number;
  label: string;
  size?: number;
}) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (clamped / 100) * circumference;

  let color = "stroke-red-500";
  if (value >= 80) color = "stroke-green-500";
  else if (value >= 50) color = "stroke-amber-500";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-muted"
          strokeWidth={4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div
        className="absolute flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-lg font-bold">{value}%</span>
      </div>
      <span className="text-[11px] text-muted-foreground font-medium text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

function TrendBadge({ data, field }: { data: Array<Record<string, unknown>>; field: string }) {
  if (data.length < 2) return null;
  const first = Number(data[0][field]);
  const last = Number(data[data.length - 1][field]);
  if (isNaN(first) || isNaN(last)) return null;
  const diff = last - first;
  const pct = first > 0 ? Math.round((diff / first) * 100) : 0;

  if (Math.abs(pct) < 2) {
    return (
      <Badge variant="secondary" className="text-[10px] gap-1">
        <Minus className="h-3 w-3" /> Stable
      </Badge>
    );
  }
  if (diff < 0) {
    return (
      <Badge className="text-[10px] gap-1 bg-green-100 text-green-700 border-0">
        <TrendingDown className="h-3 w-3" /> {Math.abs(diff).toFixed(1)} ({pct}%)
      </Badge>
    );
  }
  return (
    <Badge className="text-[10px] gap-1 bg-red-100 text-red-700 border-0">
      <TrendingUp className="h-3 w-3" /> +{diff.toFixed(1)} (+{pct}%)
    </Badge>
  );
}

const calorieChartConfig: ChartConfig = {
  calories: { label: "Calories", color: "hsl(var(--chart-1, 220 70% 50%))" },
};

const macroChartConfig: ChartConfig = {
  proteinGoalPct: { label: "Protéines %", color: "hsl(340 80% 55%)" },
  carbsGoalPct: { label: "Glucides %", color: "hsl(40 90% 50%)" },
  fatGoalPct: { label: "Lipides %", color: "hsl(50 80% 45%)" },
};

const sportChartConfig: ChartConfig = {
  sportCalories: { label: "Calories brûlées", color: "hsl(25 90% 55%)" },
};

const weightChartConfig: ChartConfig = {
  weight: { label: "Poids (kg)", color: "hsl(220 70% 50%)" },
};

const measurementChartConfig: ChartConfig = {
  waistCm: { label: "Tour de taille", color: "hsl(340 70% 55%)" },
  hipCm: { label: "Hanches", color: "hsl(200 70% 50%)" },
  buttCm: { label: "Fessiers", color: "hsl(280 60% 55%)" },
};

const waterChartConfig: ChartConfig = {
  water: { label: "Eau (L)", color: "hsl(200 80% 55%)" },
};

export default function ClientStatsPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = use(params);
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodValue>("all");
  const [fetchKey, setFetchKey] = useState(0);

  function changePeriod(p: PeriodValue) {
    setPeriod(p);
    setLoading(true);
    setFetchKey((k) => k + 1);
  }

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    fetch(`/api/admin/clients/${clientId}/stats?days=${period}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setData(d); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; controller.abort(); };
  }, [clientId, period, fetchKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        Impossible de charger les statistiques.
      </div>
    );
  }

  const { client, dailyData, weightData, measurementData, waterData, scores } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/clients">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              {client.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Statistiques & progression
              {data.firstDataDate && (
                <span className="ml-1">
                  — depuis le {formatDate(data.firstDataDate)} ({scores.totalDays} jours)
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => changePeriod(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                period === opt.value
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="border-warm-border">
          <CardContent className="pt-5 pb-4 flex flex-col items-center">
            <div className="relative">
              <ScoreRing value={scores.effortScore} label="Score global" size={85} />
            </div>
          </CardContent>
        </Card>
        <Card className="border-warm-border">
          <CardContent className="pt-5 pb-4 flex flex-col items-center">
            <div className="relative">
              <ScoreRing value={scores.loggingRate} label="Régularité suivi" size={85} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {scores.daysLogged}/{scores.totalDays} jours
            </p>
          </CardContent>
        </Card>
        <Card className="border-warm-border">
          <CardContent className="pt-5 pb-4 flex flex-col items-center">
            <div className="relative">
              <ScoreRing
                value={scores.nutritionCompliance}
                label="Objectifs nutrition"
                size={85}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {scores.daysOnTarget} jours dans la cible
            </p>
          </CardContent>
        </Card>
        <Card className="border-warm-border">
          <CardContent className="pt-5 pb-4 flex flex-col items-center">
            <div className="relative">
              <ScoreRing
                value={scores.sportCompliance ?? 0}
                label="Assiduité sport"
                size={85}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {scores.avgSessionsPerWeek}
              {client.goals.sessionsPerWeek
                ? ` / ${client.goals.sessionsPerWeek}`
                : ""}{" "}
              séances/sem
            </p>
          </CardContent>
        </Card>
        <Card className="border-warm-border">
          <CardContent className="pt-5 pb-4 flex flex-col items-center">
            <div className="relative">
              <ScoreRing
                value={scores.waterCompliance ?? 0}
                label="Hydratation"
                size={85}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {client.goals.goalWaterL
                ? `Objectif : ${client.goals.goalWaterL}L/j`
                : "Pas d'objectif"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calorie chart */}
      {dailyData.length > 0 && (
        <Card className="border-warm-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Calories consommées
              </CardTitle>
              {client.goals.goalCalories && (
                <span className="text-xs text-muted-foreground">
                  Objectif : {client.goals.goalCalories} kcal
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={calorieChartConfig} className="h-[220px] w-full">
              <AreaChart data={dailyData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                <defs>
                  <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(220 70% 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(220 70% 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 10 }} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(v) => formatDate(v as string)}
                    />
                  }
                />
                {client.goals.goalCalories && (
                  <ReferenceLine
                    y={client.goals.goalCalories}
                    stroke="hsl(var(--destructive, 0 84% 60%))"
                    strokeDasharray="6 3"
                    strokeWidth={1.5}
                    label={{
                      value: `${client.goals.goalCalories}`,
                      position: "right",
                      fontSize: 10,
                      fill: "hsl(var(--destructive, 0 84% 60%))",
                    }}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="calories"
                  stroke="hsl(220 70% 50%)"
                  fill="url(#calGrad)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Macro compliance chart */}
      {dailyData.some((d) => d.proteinGoalPct !== null) && (
        <Card className="border-warm-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-rose-500" />
              Compliance macros (% de l&apos;objectif)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={macroChartConfig} className="h-[220px] w-full">
              <LineChart data={dailyData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 10 }} domain={[0, "auto"]} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(v) => formatDate(v as string)}
                      formatter={(value, name) => {
                        const labels: Record<string, string> = {
                          proteinGoalPct: "Protéines",
                          carbsGoalPct: "Glucides",
                          fatGoalPct: "Lipides",
                        };
                        return (
                          <span>
                            {labels[name as string] ?? name} : <strong>{value}%</strong>
                          </span>
                        );
                      }}
                    />
                  }
                />
                <ReferenceLine
                  y={100}
                  stroke="hsl(var(--muted-foreground, 0 0% 45%))"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                />
                <Line
                  type="monotone"
                  dataKey="proteinGoalPct"
                  stroke="hsl(340 80% 55%)"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="carbsGoalPct"
                  stroke="hsl(40 90% 50%)"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="fatGoalPct"
                  stroke="hsl(50 80% 45%)"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              </LineChart>
            </ChartContainer>
            <div className="flex items-center justify-center gap-4 mt-2 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: "hsl(340 80% 55%)" }} />
                Protéines
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: "hsl(40 90% 50%)" }} />
                Glucides
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: "hsl(50 80% 45%)" }} />
                Lipides
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-3 border-t border-dashed border-muted-foreground" />
                100% = objectif
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Water chart */}
      {(waterData.length > 0 || dailyData.some((d) => d.water > 0)) && (
        <Card className="border-warm-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-400" />
                Hydratation
              </CardTitle>
              {client.goals.goalWaterL && (
                <span className="text-xs text-muted-foreground">
                  Objectif : {client.goals.goalWaterL}L / jour
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={waterChartConfig} className="h-[180px] w-full">
              <BarChart data={dailyData.filter((d) => d.water > 0)} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                <defs>
                  <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(200 80% 55%)" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="hsl(200 80% 55%)" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 10 }} unit="L" />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(v) => formatDate(v as string)}
                      formatter={(value) => (
                        <span><strong>{value}L</strong></span>
                      )}
                    />
                  }
                />
                {client.goals.goalWaterL && (
                  <ReferenceLine
                    y={client.goals.goalWaterL}
                    stroke="hsl(200 70% 40%)"
                    strokeDasharray="6 3"
                    strokeWidth={1.5}
                    label={{
                      value: `${client.goals.goalWaterL}L`,
                      position: "right",
                      fontSize: 10,
                      fill: "hsl(200 70% 40%)",
                    }}
                  />
                )}
                <Bar
                  dataKey="water"
                  fill="url(#waterGrad)"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={24}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Sport chart */}
      {dailyData.some((d) => d.sportSessions > 0) && (
        <Card className="border-warm-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                Activité sportive
              </CardTitle>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Flame className="h-3 w-3 text-orange-500" />
                  {dailyData.reduce((s, d) => s + d.sportCalories, 0).toLocaleString()} kcal total
                </span>
                {dailyData.some((d) => d.sportSteps > 0) && (
                  <span className="flex items-center gap-1">
                    <Footprints className="h-3 w-3 text-emerald-600" />
                    {dailyData
                      .reduce((s, d) => s + d.sportSteps, 0)
                      .toLocaleString()}{" "}
                    pas total
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={sportChartConfig} className="h-[200px] w-full">
              <BarChart data={dailyData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 10 }} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(v) => formatDate(v as string)}
                    />
                  }
                />
                <Bar
                  dataKey="sportCalories"
                  fill="hsl(25 90% 55%)"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={20}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Weight chart */}
      {weightData.length > 0 && (
        <Card className="border-warm-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Scale className="h-4 w-4 text-blue-500" />
                Evolution du poids
                <TrendBadge data={weightData} field="weight" />
              </CardTitle>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {client.goals.startWeight && (
                  <span>Départ : {client.goals.startWeight} kg</span>
                )}
                {client.goals.goalWeight && (
                  <span>Objectif : {client.goals.goalWeight} kg</span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={weightChartConfig} className="h-[200px] w-full">
              <LineChart
                data={weightData}
                margin={{ top: 5, right: 5, bottom: 0, left: -15 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  domain={["dataMin - 1", "dataMax + 1"]}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(v) => formatDate(v as string)}
                      formatter={(value) => (
                        <span>
                          <strong>{value} kg</strong>
                        </span>
                      )}
                    />
                  }
                />
                {client.goals.goalWeight && (
                  <ReferenceLine
                    y={client.goals.goalWeight}
                    stroke="hsl(160 60% 45%)"
                    strokeDasharray="6 3"
                    strokeWidth={1.5}
                    label={{
                      value: `Obj: ${client.goals.goalWeight}`,
                      position: "right",
                      fontSize: 10,
                      fill: "hsl(160 60% 45%)",
                    }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(220 70% 50%)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "hsl(220 70% 50%)" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Measurements chart */}
      {measurementData.length > 0 && (
        <Card className="border-warm-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Ruler className="h-4 w-4 text-purple-500" />
              Evolution des mensurations (cm)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={measurementChartConfig} className="h-[200px] w-full">
              <LineChart
                data={measurementData}
                margin={{ top: 5, right: 5, bottom: 0, left: -15 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 10 }} domain={["dataMin - 2", "dataMax + 2"]} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(v) => formatDate(v as string)}
                    />
                  }
                />
                {measurementData.some((m) => m.waistCm !== null) && (
                  <Line
                    type="monotone"
                    dataKey="waistCm"
                    stroke="hsl(340 70% 55%)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                )}
                {measurementData.some((m) => m.hipCm !== null) && (
                  <Line
                    type="monotone"
                    dataKey="hipCm"
                    stroke="hsl(200 70% 50%)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                )}
                {measurementData.some((m) => m.buttCm !== null) && (
                  <Line
                    type="monotone"
                    dataKey="buttCm"
                    stroke="hsl(280 60% 55%)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                )}
              </LineChart>
            </ChartContainer>
            <div className="flex items-center justify-center gap-4 mt-2 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: "hsl(340 70% 55%)" }} />
                Taille
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: "hsl(200 70% 50%)" }} />
                Hanches
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: "hsl(280 60% 55%)" }} />
                Fessiers
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {dailyData.length === 0 && weightData.length === 0 && measurementData.length === 0 && waterData.length === 0 && (
        <Card className="border-warm-border">
          <CardContent className="py-16 text-center">
            <Activity className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              Aucune donnée sur cette période.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Les statistiques apparaitront quand la cliente commencera à enregistrer ses repas, sport et pesées.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
