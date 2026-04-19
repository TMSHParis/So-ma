"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Copy,
  Flame,
  Loader2,
  RefreshCw,
} from "lucide-react";

type Entry = {
  id: string;
  mealType: string;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

type DayData = {
  date: string;
  entries: Entry[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
};

const MEAL_LABELS: Record<string, string> = {
  PETIT_DEJEUNER: "Petit-déj",
  DEJEUNER: "Déjeuner",
  DINER: "Dîner",
  COLLATION: "Collation",
};

function formatDayLabel(iso: string, todayIso: string): string {
  const d = new Date(iso + "T12:00:00");
  const today = new Date(todayIso + "T12:00:00");
  const diff = Math.round((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "short" });
}

export function BilanSemaine({
  endDate,
  goalCalories,
  onChanged,
}: {
  endDate: string;
  goalCalories: number | null;
  onChanged?: () => void;
}) {
  const [days, setDays] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [duplicating, setDuplicating] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/client/food-entries/week?endDate=${endDate}`,
        { cache: "no-store" },
      );
      if (res.ok) {
        const data = await res.json();
        setDays(data.days || []);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [endDate]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function duplicate(sourceDate: string, targetDate: string, mode: "append" | "replace") {
    setDuplicating(sourceDate);
    try {
      const res = await fetch("/api/client/food-entries/duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceDate, targetDate, mode }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Erreur");
      }
      const result = await res.json();
      toast.success(
        `${result.copied} aliment${result.copied > 1 ? "s" : ""} copié${result.copied > 1 ? "s" : ""} vers ${targetDate}`,
      );
      await refresh();
      onChanged?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Duplication impossible");
    } finally {
      setDuplicating(null);
    }
  }

  const weekTotal = days.reduce((s, d) => s + d.totals.calories, 0);
  const loggedDays = days.filter((d) => d.entries.length > 0).length;
  const avgKcal = loggedDays > 0 ? Math.round(weekTotal / loggedDays) : 0;

  return (
    <Card className="border-warm-border">
      <CardHeader
        className="pb-3 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            Bilan semaine
          </CardTitle>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>
              <strong className="text-foreground">{loggedDays}</strong>/7 jours
            </span>
            {avgKcal > 0 && (
              <span>
                Moy : <strong className="text-foreground">{avgKcal}</strong> kcal
              </span>
            )}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            days.map((day) => {
              const isExpanded = expandedDay === day.date;
              const pct = goalCalories ? Math.round((day.totals.calories / goalCalories) * 100) : null;
              const color =
                pct == null
                  ? "text-muted-foreground"
                  : pct > 110
                    ? "text-red-500"
                    : pct >= 90
                      ? "text-green-600"
                      : pct > 0
                        ? "text-foreground"
                        : "text-muted-foreground";
              return (
                <div
                  key={day.date}
                  className="rounded-lg border border-warm-border overflow-hidden"
                >
                  <div className="flex items-center gap-2 p-2.5 bg-muted/20">
                    <button
                      onClick={() =>
                        setExpandedDay(isExpanded ? null : day.date)
                      }
                      className="flex items-center gap-2 flex-1 min-w-0 text-left"
                      disabled={day.entries.length === 0}
                    >
                      <ChevronRight
                        className={`h-3.5 w-3.5 text-muted-foreground transition-transform flex-shrink-0 ${isExpanded ? "rotate-90" : ""} ${day.entries.length === 0 ? "opacity-30" : ""}`}
                      />
                      <span className="text-sm font-medium capitalize">
                        {formatDayLabel(day.date, endDate)}
                      </span>
                    </button>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={`font-semibold ${color}`}>
                        {day.totals.calories} kcal
                      </span>
                      {goalCalories && day.totals.calories > 0 && (
                        <span className="text-muted-foreground">
                          ({pct}%)
                        </span>
                      )}
                      {day.entries.length > 0 && (
                        <Popover>
                          <PopoverTrigger
                            disabled={duplicating === day.date}
                            className="inline-flex items-center h-7 text-[10px] px-2 rounded-md hover:bg-muted text-foreground/80 transition-colors"
                          >
                            {duplicating === day.date ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <Copy className="h-3 w-3 mr-1" />
                                Dupliquer
                              </>
                            )}
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-3 space-y-2">
                            <p className="text-xs font-medium">
                              Copier ce jour vers…
                            </p>
                            <input
                              type="date"
                              defaultValue={endDate}
                              className="w-full text-xs border border-warm-border rounded-md px-2 py-1.5"
                              id={`dup-${day.date}`}
                            />
                            <div className="flex gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 text-[10px]"
                                onClick={() => {
                                  const input = document.getElementById(
                                    `dup-${day.date}`,
                                  ) as HTMLInputElement | null;
                                  const target = input?.value || endDate;
                                  duplicate(day.date, target, "append");
                                }}
                              >
                                Ajouter
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1 text-[10px] bg-primary text-white"
                                onClick={() => {
                                  const input = document.getElementById(
                                    `dup-${day.date}`,
                                  ) as HTMLInputElement | null;
                                  const target = input?.value || endDate;
                                  duplicate(day.date, target, "replace");
                                }}
                              >
                                <RefreshCw className="h-2.5 w-2.5 mr-1" />
                                Remplacer
                              </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground leading-snug">
                              Ajouter : garde les entrées existantes de la date cible.
                              Remplacer : écrase les entrées de la date cible.
                            </p>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </div>
                  {isExpanded && day.entries.length > 0 && (
                    <div className="p-2.5 space-y-1.5 text-xs border-t border-warm-border">
                      {Object.entries(MEAL_LABELS).map(([key, label]) => {
                        const mealEntries = day.entries.filter(
                          (e) => e.mealType === key,
                        );
                        if (mealEntries.length === 0) return null;
                        return (
                          <div key={key} className="space-y-0.5">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                              {label}
                            </p>
                            {mealEntries.map((e) => (
                              <div
                                key={e.id}
                                className="flex items-center justify-between gap-2 py-0.5"
                              >
                                <span className="truncate">{e.foodName}</span>
                                <span className="text-muted-foreground flex-shrink-0">
                                  {e.quantity}{e.unit || "g"} · {e.calories} kcal
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                      <div className="flex items-center justify-between pt-1.5 border-t text-[11px]">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-semibold flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          {day.totals.calories} kcal · P{day.totals.protein}g · G{day.totals.carbs}g · L{day.totals.fat}g
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      )}
    </Card>
  );
}
