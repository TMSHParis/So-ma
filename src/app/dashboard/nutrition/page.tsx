"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { calendarDateInTimeZone, CLIENT_TIMEZONE } from "@/lib/calendar-day";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Trash2,
  Loader2,
  Search,
  ScanBarcode,
} from "lucide-react";
import { BarcodeScanner } from "@/components/barcode-scanner";

type FoodItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

type SearchResult = {
  id: string;
  name: string;
  source: "local" | "openfoodfacts";
  per100g: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
};

const mealTypes = [
  { value: "PETIT_DEJEUNER", label: "Petit-déjeuner" },
  { value: "DEJEUNER", label: "Déjeuner" },
  { value: "DINER", label: "Dîner" },
  { value: "COLLATION", label: "Collation" },
];

const emptyMeals = (): Record<string, FoodItem[]> => ({
  PETIT_DEJEUNER: [],
  DEJEUNER: [],
  DINER: [],
  COLLATION: [],
});

export default function NutritionPage() {
  const todayIso = useMemo(
    () => calendarDateInTimeZone(CLIENT_TIMEZONE),
    []
  );

  const [meals, setMeals] = useState<Record<string, FoodItem[]>>(emptyMeals);
  const [goals, setGoals] = useState({
    calories: 1800,
    protein: 120,
    carbs: 200,
    fat: 60,
    fiber: 25,
  });
  const [ready, setReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState("PETIT_DEJEUNER");
  const [quantity, setQuantity] = useState("100");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [sendingSuggestion, setSendingSuggestion] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);

  // Debounce ref
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const refreshData = useCallback(async () => {
    try {
      const [profileRes, foodRes] = await Promise.all([
        fetch("/api/client/profile"),
        fetch(`/api/client/food-entries?date=${todayIso}`),
      ]);
      if (profileRes.ok) {
        const p = await profileRes.json();
        setGoals({
          calories: p.goalCalories ?? 1800,
          protein: p.goalProtein ?? 120,
          carbs: p.goalCarbs ?? 200,
          fat: p.goalFat ?? 60,
          fiber: p.goalFiber ?? 25,
        });
      }
      if (foodRes.ok) {
        const { entries } = await foodRes.json();
        const next = emptyMeals();
        for (const e of entries as {
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
        }[]) {
          if (!next[e.mealType]) continue;
          next[e.mealType].push({
            id: e.id,
            name: e.foodName,
            quantity: e.quantity,
            unit: e.unit,
            calories: Math.round(e.calories),
            protein: Math.round(e.protein * 10) / 10,
            carbs: Math.round(e.carbs * 10) / 10,
            fat: Math.round(e.fat * 10) / 10,
            fiber: Math.round(e.fiber * 10) / 10,
          });
        }
        setMeals(next);
      } else if (foodRes.status === 401) {
        toast.error("Session expirée — reconnectez-vous");
      }
    } catch {
      toast.error("Impossible de charger le suivi alimentaire");
    } finally {
      setReady(true);
    }
  }, [todayIso]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Recherche auto avec debounce 300ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/food-search?q=${encodeURIComponent(searchQuery.trim())}`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } catch {
        // silently fail
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  async function addFood(result: SearchResult) {
    const qty = parseFloat(quantity) || 100;
    const ratio = qty / 100;

    const item = {
      name: result.name,
      quantity: qty,
      unit: "g",
      calories: Math.round(result.per100g.calories * ratio),
      protein: Math.round(result.per100g.protein * ratio * 10) / 10,
      carbs: Math.round(result.per100g.carbs * ratio * 10) / 10,
      fat: Math.round(result.per100g.fat * ratio * 10) / 10,
      fiber: Math.round(result.per100g.fiber * ratio * 10) / 10,
    };

    try {
      const res = await fetch("/api/client/food-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: todayIso,
          mealType: selectedMealType,
          foodName: item.name,
          quantity: item.quantity,
          unit: item.unit,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          fiber: item.fiber,
        }),
      });
      if (!res.ok) throw new Error();
      const row = await res.json();
      setMeals((prev) => ({
        ...prev,
        [selectedMealType]: [
          ...prev[selectedMealType],
          { ...item, id: row.id },
        ],
      }));
      setDialogOpen(false);
      setSearchQuery("");
      setSearchResults([]);
      setQuantity("100");
      toast.success(`${item.name} ajouté`);
    } catch {
      toast.error("Enregistrement impossible");
    }
  }

  async function removeFood(mealType: string, foodId: string) {
    try {
      const res = await fetch(
        `/api/client/food-entries?id=${encodeURIComponent(foodId)}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      setMeals((prev) => ({
        ...prev,
        [mealType]: prev[mealType].filter((f) => f.id !== foodId),
      }));
    } catch {
      toast.error("Suppression impossible");
    }
  }

  async function handleBarcodeScan(barcode: string) {
    setScannerOpen(false);
    setScanLoading(true);
    try {
      const res = await fetch(`/api/food-search?barcode=${encodeURIComponent(barcode)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.results?.length > 0) {
          setSearchResults(data.results);
          setSearchQuery(data.results[0].name);
          toast.success("Produit trouvé !");
        } else {
          toast.error("Produit non reconnu — essayez la recherche textuelle");
        }
      }
    } catch {
      toast.error("Erreur lors du scan");
    } finally {
      setScanLoading(false);
    }
  }

  async function sendSuggestion() {
    if (!suggestion.trim()) return;
    setSendingSuggestion(true);
    try {
      const res = await fetch("/api/client/food-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: suggestion.trim() }),
      });
      if (res.ok) {
        toast.success("Suggestion envoyée, merci !");
        setSuggestion("");
      } else {
        toast.error("Erreur lors de l'envoi");
      }
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setSendingSuggestion(false);
    }
  }

  const allFoods = Object.values(meals).flat();
  const totals = allFoods.reduce(
    (acc, f) => ({
      calories: acc.calories + f.calories,
      protein: acc.protein + f.protein,
      carbs: acc.carbs + f.carbs,
      fat: acc.fat + f.fat,
      fiber: acc.fiber + f.fiber,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  if (!ready) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-muted rounded w-1/2" />
        <div className="h-32 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Suivi alimentaire
          </h1>
          <p className="text-muted-foreground mt-1">
            Enregistrez vos repas et suivez vos macros.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setSearchQuery("");
            setSearchResults([]);
            setScannerOpen(false);
          }
        }}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary hover:bg-primary/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un aliment
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Ajouter un aliment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Repas</Label>
                <Select
                  value={selectedMealType}
                  onValueChange={(v) => v !== null && setSelectedMealType(v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mealTypes.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Rechercher un aliment</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tapez : poulet, riz, espresso, Big Mac..."
                      className="pl-9"
                      autoFocus
                    />
                    {(searching || scanLoading) && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={() => setScannerOpen((v) => !v)}
                    title="Scanner un code-barres"
                  >
                    <ScanBarcode className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recherche parmi 400+ aliments génériques + millions de produits (OpenFoodFacts). Tolère les fautes et accents.
                </p>
              </div>

              {scannerOpen && (
                <BarcodeScanner
                  onScan={handleBarcodeScan}
                  onClose={() => setScannerOpen(false)}
                />
              )}

              <div className="space-y-2">
                <Label>Quantité (g)</Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              {searchResults.length > 0 && (
                <div className="max-h-80 overflow-y-auto space-y-1.5">
                  {searchResults.map((result) => {
                    const qty = parseFloat(quantity) || 100;
                    const ratio = qty / 100;
                    return (
                      <button
                        key={result.id}
                        onClick={() => addFood(result)}
                        className="w-full text-left p-3 rounded-lg border border-warm-border hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground truncate pr-2">
                            {result.name}
                          </p>
                          {result.source === "local" && (
                            <Badge variant="secondary" className="text-[10px] flex-shrink-0">
                              Générique
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground/70">
                            {Math.round(result.per100g.calories * ratio)} kcal
                          </span>
                          <span>P: {Math.round(result.per100g.protein * ratio * 10) / 10}g</span>
                          <span>G: {Math.round(result.per100g.carbs * ratio * 10) / 10}g</span>
                          <span>L: {Math.round(result.per100g.fat * ratio * 10) / 10}g</span>
                          <span>F: {Math.round(result.per100g.fiber * ratio * 10) / 10}g</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun résultat pour &quot;{searchQuery}&quot;
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Daily totals */}
      <div className="grid grid-cols-5 gap-2 mb-8">
        {[
          {
            label: "Kcal",
            value: Math.round(totals.calories),
            goal: goals.calories,
            unit: "",
            bg: "bg-orange-100/70 dark:bg-orange-950/30",
            text: "text-orange-700 dark:text-orange-300",
            progress: "[&>div]:bg-orange-400",
          },
          {
            label: "P",
            value: Math.round(totals.protein * 10) / 10,
            goal: goals.protein,
            unit: "g",
            bg: "bg-rose-100/70 dark:bg-rose-950/30",
            text: "text-rose-700 dark:text-rose-300",
            progress: "[&>div]:bg-rose-400",
          },
          {
            label: "G",
            value: Math.round(totals.carbs * 10) / 10,
            goal: goals.carbs,
            unit: "g",
            bg: "bg-amber-100/70 dark:bg-amber-950/30",
            text: "text-amber-700 dark:text-amber-300",
            progress: "[&>div]:bg-amber-400",
          },
          {
            label: "L",
            value: Math.round(totals.fat * 10) / 10,
            goal: goals.fat,
            unit: "g",
            bg: "bg-yellow-100/70 dark:bg-yellow-950/30",
            text: "text-yellow-700 dark:text-yellow-300",
            progress: "[&>div]:bg-yellow-400",
          },
          {
            label: "F",
            value: Math.round(totals.fiber * 10) / 10,
            goal: goals.fiber,
            unit: "g",
            bg: "bg-green-100/70 dark:bg-green-950/30",
            text: "text-green-700 dark:text-green-300",
            progress: "[&>div]:bg-green-400",
          },
        ].map((m) => (
          <div
            key={m.label}
            className={`rounded-xl p-2.5 ${m.bg} flex flex-col`}
          >
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${m.text}`}
            >
              {m.label}
            </span>
            <div className="mt-1 flex items-baseline gap-0.5 min-w-0">
              <span className="text-base font-bold text-foreground leading-none truncate">
                {m.value}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                /{m.goal}
                {m.unit}
              </span>
            </div>
            <Progress
              value={Math.min((m.value / m.goal) * 100, 100)}
              className={`h-1 mt-1.5 bg-white/60 dark:bg-black/30 ${m.progress}`}
            />
          </div>
        ))}
      </div>

      {/* Meals */}
      <div className="space-y-6">
        {mealTypes.map((mealType) => (
          <Card key={mealType.value} className="border-warm-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{mealType.label}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {meals[mealType.value].reduce((a, f) => a + f.calories, 0)}{" "}
                  kcal
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {meals[mealType.value].length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun aliment enregistré
                </p>
              ) : (
                <div className="space-y-2">
                  {meals[mealType.value].map((food) => (
                    <div
                      key={food.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium">{food.name}</p>
                        <div className="flex gap-3 mt-0.5 text-xs text-muted-foreground">
                          <span>{food.quantity}g</span>
                          <span>{food.calories} kcal</span>
                          <span>P: {food.protein}g</span>
                          <span>G: {food.carbs}g</span>
                          <span>L: {food.fat}g</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive h-8 w-8"
                        onClick={() => removeFood(mealType.value, food.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Suggestions d'aliments */}
      <Card className="border-warm-border mt-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Suggérer un aliment</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Un aliment que vous mangez souvent n&apos;est pas dans la liste ? Dites-le nous et on l&apos;ajoutera.
          </p>
          <Textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="Ex : couscous marocain, talbina, mssemen..."
            className="border-warm-border mb-3"
          />
          <Button
            onClick={sendSuggestion}
            disabled={sendingSuggestion || !suggestion.trim()}
            variant="outline"
          >
            {sendingSuggestion ? "Envoi..." : "Envoyer la suggestion"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
