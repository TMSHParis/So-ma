"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { calendarDateInTimeZone, CLIENT_TIMEZONE } from "@/lib/calendar-day";
import { DateNavigator } from "@/components/date-navigator";
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
  Pencil,
  Check,
  X,
  BookOpen,
  Save,
  ChefHat,
  Droplets,
  Minus,
  PencilLine,
} from "lucide-react";
import { BarcodeScanner } from "@/components/barcode-scanner";
import { BilanSemaine } from "@/components/bilan-semaine";

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
  isLiquid?: boolean;
  per100g: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
};

type RecipeItem = {
  id: string;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

type Recipe = {
  id: string;
  name: string;
  items: RecipeItem[];
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
  const [selectedDate, setSelectedDate] = useState(todayIso);

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
  const [quantityUnit, setQuantityUnit] = useState<"g" | "ml" | "cl">("g");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [sendingSuggestion, setSendingSuggestion] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [dialogTab, setDialogTab] = useState<"search" | "recipes" | "create-recipe" | "manual">("search");
  const [manualForm, setManualForm] = useState({
    name: "",
    quantity: "100",
    unit: "g",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
  });
  const [savingManual, setSavingManual] = useState(false);
  const [saveRecipeOpen, setSaveRecipeOpen] = useState<string | null>(null);
  const [recipeName, setRecipeName] = useState("");
  const [draftRecipeName, setDraftRecipeName] = useState("");
  const [draftRecipeItems, setDraftRecipeItems] = useState<RecipeItem[]>([]);
  const [savingDraftRecipe, setSavingDraftRecipe] = useState(false);
  const [waterMl, setWaterMl] = useState(0);
  const [waterGoalMl, setWaterGoalMl] = useState(0);
  const [waterLoading, setWaterLoading] = useState(false);

  // Debounce ref
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const loadRecipes = useCallback(async () => {
    try {
      const res = await fetch("/api/client/recipes");
      if (res.ok) {
        const data = await res.json();
        setRecipes(data.recipes || []);
      }
    } catch { /* silent */ }
  }, []);

  const refreshData = useCallback(async () => {
    setReady(false);
    try {
      const [profileRes, foodRes, waterRes] = await Promise.all([
        fetch("/api/client/profile"),
        fetch(`/api/client/food-entries?date=${selectedDate}`),
        fetch(`/api/client/water-entries?date=${selectedDate}`),
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
        setWaterGoalMl(p.goalWaterL ? Math.round(p.goalWaterL * 1000) : 2000);
      }
      if (waterRes.ok) {
        const w = await waterRes.json();
        setWaterMl(w.totalMl ?? 0);
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
  }, [selectedDate]);

  useEffect(() => {
    refreshData();
    loadRecipes();
  }, [refreshData, loadRecipes]);

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
    // Pour les liquides, densité ≈ 1 donc 1 ml = 1 g et 1 cl = 10 ml = 10 g
    const chosenUnit = result.isLiquid ? quantityUnit : "g";
    const qtyGrams = chosenUnit === "cl" ? qty * 10 : qty;
    const ratio = qtyGrams / 100;

    const item = {
      name: result.name,
      quantity: qty,
      unit: chosenUnit,
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
          date: selectedDate,
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

  async function addManualFood() {
    const name = manualForm.name.trim();
    const calories = parseFloat(manualForm.calories);
    if (!name) {
      toast.error("Nom de l'aliment requis");
      return;
    }
    if (!Number.isFinite(calories) || calories < 0) {
      toast.error("Calories invalides");
      return;
    }

    const item = {
      name,
      quantity: parseFloat(manualForm.quantity) || 0,
      unit: manualForm.unit.trim() || "g",
      calories: Math.round(calories),
      protein: Math.round((parseFloat(manualForm.protein) || 0) * 10) / 10,
      carbs: Math.round((parseFloat(manualForm.carbs) || 0) * 10) / 10,
      fat: Math.round((parseFloat(manualForm.fat) || 0) * 10) / 10,
      fiber: Math.round((parseFloat(manualForm.fiber) || 0) * 10) / 10,
    };

    setSavingManual(true);
    try {
      const res = await fetch("/api/client/food-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
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
      setManualForm({
        name: "",
        quantity: "100",
        unit: "g",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        fiber: "",
      });
      toast.success(`${item.name} ajouté`);
    } catch {
      toast.error("Enregistrement impossible");
    } finally {
      setSavingManual(false);
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

  async function updateFood(mealType: string, food: FoodItem) {
    const newQty = parseFloat(editQty);
    if (!newQty || newQty <= 0 || newQty === food.quantity) {
      setEditingId(null);
      return;
    }
    const ratio = newQty / food.quantity;
    const updated = {
      quantity: newQty,
      calories: Math.round(food.calories * ratio),
      protein: Math.round(food.protein * ratio * 10) / 10,
      carbs: Math.round(food.carbs * ratio * 10) / 10,
      fat: Math.round(food.fat * ratio * 10) / 10,
      fiber: Math.round(food.fiber * ratio * 10) / 10,
    };
    try {
      const res = await fetch("/api/client/food-entries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: food.id, ...updated }),
      });
      if (!res.ok) throw new Error();
      setMeals((prev) => ({
        ...prev,
        [mealType]: prev[mealType].map((f) =>
          f.id === food.id ? { ...f, ...updated } : f
        ),
      }));
      toast.success("Quantité mise à jour");
    } catch {
      toast.error("Modification impossible");
    } finally {
      setEditingId(null);
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

  function addToDraftRecipe(result: SearchResult) {
    const qty = parseFloat(quantity) || 100;
    const chosenUnit = result.isLiquid ? quantityUnit : "g";
    const qtyGrams = chosenUnit === "cl" ? qty * 10 : qty;
    const ratio = qtyGrams / 100;
    const item: RecipeItem = {
      id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      foodName: result.name,
      quantity: qty,
      unit: chosenUnit,
      calories: Math.round(result.per100g.calories * ratio),
      protein: Math.round(result.per100g.protein * ratio * 10) / 10,
      carbs: Math.round(result.per100g.carbs * ratio * 10) / 10,
      fat: Math.round(result.per100g.fat * ratio * 10) / 10,
      fiber: Math.round(result.per100g.fiber * ratio * 10) / 10,
    };
    setDraftRecipeItems((prev) => [...prev, item]);
    setSearchQuery("");
    setSearchResults([]);
    toast.success(`${item.foodName} ajouté à la recette`);
  }

  function removeDraftItem(id: string) {
    setDraftRecipeItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function saveDraftRecipe() {
    if (!draftRecipeName.trim() || draftRecipeItems.length === 0) {
      toast.error("Nom de recette et au moins un aliment requis");
      return;
    }
    setSavingDraftRecipe(true);
    try {
      const res = await fetch("/api/client/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draftRecipeName.trim(),
          items: draftRecipeItems.map((it) => ({
            foodName: it.foodName,
            quantity: it.quantity,
            unit: it.unit,
            calories: it.calories,
            protein: it.protein,
            carbs: it.carbs,
            fat: it.fat,
            fiber: it.fiber,
          })),
        }),
      });
      if (!res.ok) throw new Error();
      const recipe = await res.json();
      setRecipes((prev) => [recipe, ...prev]);
      toast.success(`Recette "${draftRecipeName.trim()}" créée`);
      setDraftRecipeName("");
      setDraftRecipeItems([]);
      setDialogTab("recipes");
    } catch {
      toast.error("Impossible de sauvegarder la recette");
    } finally {
      setSavingDraftRecipe(false);
    }
  }

  async function saveAsRecipe(mealType: string) {
    const items = meals[mealType];
    if (!items.length || !recipeName.trim()) return;
    try {
      const res = await fetch("/api/client/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: recipeName.trim(),
          items: items.map((f) => ({
            foodName: f.name,
            quantity: f.quantity,
            unit: f.unit,
            calories: f.calories,
            protein: f.protein,
            carbs: f.carbs,
            fat: f.fat,
            fiber: f.fiber,
          })),
        }),
      });
      if (!res.ok) throw new Error();
      const recipe = await res.json();
      setRecipes((prev) => [recipe, ...prev]);
      toast.success(`Recette "${recipeName.trim()}" sauvegardée`);
      setSaveRecipeOpen(null);
      setRecipeName("");
    } catch {
      toast.error("Impossible de sauvegarder la recette");
    }
  }

  async function addRecipeToMeal(recipe: Recipe) {
    try {
      const created: FoodItem[] = [];
      for (const item of recipe.items) {
        const res = await fetch("/api/client/food-entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: selectedDate,
            mealType: selectedMealType,
            foodName: item.foodName,
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
        created.push({
          id: row.id,
          name: item.foodName,
          quantity: item.quantity,
          unit: item.unit,
          calories: Math.round(item.calories),
          protein: Math.round(item.protein * 10) / 10,
          carbs: Math.round(item.carbs * 10) / 10,
          fat: Math.round(item.fat * 10) / 10,
          fiber: Math.round(item.fiber * 10) / 10,
        });
      }
      setMeals((prev) => ({
        ...prev,
        [selectedMealType]: [...prev[selectedMealType], ...created],
      }));
      setDialogOpen(false);
      toast.success(`Recette "${recipe.name}" ajoutée`);
    } catch {
      toast.error("Erreur lors de l'ajout de la recette");
    }
  }

  async function deleteRecipe(recipeId: string) {
    try {
      const res = await fetch(`/api/client/recipes?id=${recipeId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
      toast.success("Recette supprimée");
    } catch {
      toast.error("Suppression impossible");
    }
  }

  async function addWater(ml: number) {
    setWaterLoading(true);
    try {
      const res = await fetch("/api/client/water-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, amountMl: ml }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setWaterMl(data.totalMl);
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setWaterLoading(false);
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
      <div className="flex items-center justify-between mb-4">
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
            setDialogTab("search");
          }
        }}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary hover:bg-primary/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Ajouter un aliment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Meal selector */}
              {dialogTab !== "create-recipe" && (
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
              )}

              {/* Tab toggle */}
              <div className="flex gap-1 p-1 bg-muted rounded-lg">
                <button
                  className={`flex-1 flex items-center justify-center gap-1.5 text-sm py-1.5 rounded-md transition-colors ${dialogTab === "search" ? "bg-background shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setDialogTab("search")}
                >
                  <Search className="h-3.5 w-3.5" />
                  Rechercher
                </button>
                <button
                  className={`flex-1 flex items-center justify-center gap-1.5 text-sm py-1.5 rounded-md transition-colors ${dialogTab === "recipes" ? "bg-background shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setDialogTab("recipes")}
                >
                  <ChefHat className="h-3.5 w-3.5" />
                  Mes recettes
                  {recipes.length > 0 && (
                    <Badge variant="secondary" className="text-[10px] h-4 px-1">
                      {recipes.length}
                    </Badge>
                  )}
                </button>
                <button
                  className={`flex-1 flex items-center justify-center gap-1.5 text-sm py-1.5 rounded-md transition-colors ${dialogTab === "create-recipe" ? "bg-background shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setDialogTab("create-recipe")}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Nouvelle
                  {draftRecipeItems.length > 0 && (
                    <Badge variant="secondary" className="text-[10px] h-4 px-1">
                      {draftRecipeItems.length}
                    </Badge>
                  )}
                </button>
                <button
                  className={`flex-1 flex items-center justify-center gap-1.5 text-sm py-1.5 rounded-md transition-colors ${dialogTab === "manual" ? "bg-background shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setDialogTab("manual")}
                >
                  <PencilLine className="h-3.5 w-3.5" />
                  Manuel
                </button>
              </div>

              {/* Create-recipe header */}
              {dialogTab === "create-recipe" && (
                <div className="space-y-3 rounded-lg border border-warm-border p-3 bg-amber-50/40">
                  <div className="space-y-1">
                    <Label className="text-xs">Nom de la recette</Label>
                    <Input
                      value={draftRecipeName}
                      onChange={(e) => setDraftRecipeName(e.target.value)}
                      placeholder="ex : Bowl quinoa poulet"
                    />
                  </div>
                  {draftRecipeItems.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                        Ingrédients ({draftRecipeItems.length})
                      </p>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {draftRecipeItems.map((it) => (
                          <div
                            key={it.id}
                            className="flex items-center justify-between gap-2 text-xs py-1 px-2 rounded bg-background"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium">{it.foodName}</p>
                              <p className="text-muted-foreground text-[10px]">
                                {it.quantity}{it.unit} · {it.calories} kcal · P{it.protein}g G{it.carbs}g L{it.fat}g
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDraftItem(it.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="text-[10px] text-muted-foreground pt-1">
                        Total :{" "}
                        <strong className="text-foreground">
                          {draftRecipeItems.reduce((s, i) => s + i.calories, 0)} kcal
                        </strong>
                        {" · "}
                        P {Math.round(draftRecipeItems.reduce((s, i) => s + i.protein, 0) * 10) / 10}g
                        {" · "}
                        G {Math.round(draftRecipeItems.reduce((s, i) => s + i.carbs, 0) * 10) / 10}g
                        {" · "}
                        L {Math.round(draftRecipeItems.reduce((s, i) => s + i.fat, 0) * 10) / 10}g
                      </div>
                    </div>
                  )}
                  <Button
                    onClick={saveDraftRecipe}
                    disabled={savingDraftRecipe || !draftRecipeName.trim() || draftRecipeItems.length === 0}
                    size="sm"
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    {savingDraftRecipe ? (
                      <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Sauvegarde...</>
                    ) : (
                      <><Save className="h-3.5 w-3.5 mr-1" /> Sauvegarder la recette</>
                    )}
                  </Button>
                </div>
              )}

              {/* Search tab */}
              {(dialogTab === "search" || dialogTab === "create-recipe") && (
                <>
                  <div className="space-y-2">
                    <Label>Rechercher un aliment</Label>
                    <div className="flex gap-2 min-w-0">
                      <div className="relative flex-1 min-w-0">
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
                      3 300+ aliments CIQUAL + millions de produits OpenFoodFacts.
                    </p>
                  </div>

                  {scannerOpen && (
                    <BarcodeScanner
                      onScan={handleBarcodeScan}
                      onClose={() => setScannerOpen(false)}
                    />
                  )}

                  <div className="space-y-2">
                    <Label>Quantité</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        className="flex-1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                      <div className="flex gap-0.5 p-0.5 bg-muted rounded-lg">
                        {(["g", "ml", "cl"] as const).map((u) => (
                          <button
                            key={u}
                            type="button"
                            onClick={() => setQuantityUnit(u)}
                            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                              quantityUnit === u
                                ? "bg-background shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      ml / cl uniquement pour les liquides (densité ≈ 1 : 1 ml = 1 g, 1 cl = 10 g).
                    </p>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="max-h-80 overflow-y-auto space-y-1.5">
                      {searchResults.map((result) => {
                        const qty = parseFloat(quantity) || 100;
                        const unitForResult = result.isLiquid ? quantityUnit : "g";
                        const qtyGrams = unitForResult === "cl" ? qty * 10 : qty;
                        const ratio = qtyGrams / 100;
                        return (
                          <button
                            key={result.id}
                            onClick={() =>
                              dialogTab === "create-recipe"
                                ? addToDraftRecipe(result)
                                : addFood(result)
                            }
                            className="w-full text-left p-3 rounded-lg border border-warm-border hover:bg-muted transition-colors"
                          >
                            <div className="flex items-center justify-between gap-2 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate min-w-0 flex-1">
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
                </>
              )}

              {/* Recipes tab */}
              {dialogTab === "recipes" && (
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {recipes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ChefHat className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">Aucune recette sauvegardée</p>
                      <p className="text-xs mt-1">
                        Ajoutez des aliments dans un repas, puis cliquez sur
                        <Save className="inline h-3 w-3 mx-1" />
                        pour sauvegarder comme recette.
                      </p>
                    </div>
                  ) : (
                    recipes.map((recipe) => {
                      const totals = recipe.items.reduce(
                        (acc, it) => ({
                          calories: acc.calories + it.calories,
                          protein: acc.protein + it.protein,
                          carbs: acc.carbs + it.carbs,
                          fat: acc.fat + it.fat,
                        }),
                        { calories: 0, protein: 0, carbs: 0, fat: 0 }
                      );
                      return (
                        <div
                          key={recipe.id}
                          className="p-3 rounded-lg border border-warm-border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{recipe.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {recipe.items.map((it) => it.foodName).join(", ")}
                              </p>
                              <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                                <span className="font-medium text-foreground/70">
                                  {Math.round(totals.calories)} kcal
                                </span>
                                <span>P: {Math.round(totals.protein)}g</span>
                                <span>G: {Math.round(totals.carbs)}g</span>
                                <span>L: {Math.round(totals.fat)}g</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                className="h-8"
                                onClick={() => addRecipeToMeal(recipe)}
                              >
                                <Plus className="h-3.5 w-3.5 mr-1" />
                                Ajouter
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => deleteRecipe(recipe.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Manual tab */}
              {dialogTab === "manual" && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Saisissez directement les valeurs — utile au restaurant,
                    depuis un emballage ou une estimation rapide.
                  </p>

                  <div className="space-y-2">
                    <Label>Nom de l&apos;aliment</Label>
                    <Input
                      value={manualForm.name}
                      onChange={(e) =>
                        setManualForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="Ex : Salade César restaurant"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Quantité</Label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={manualForm.quantity}
                        onChange={(e) =>
                          setManualForm((f) => ({
                            ...f,
                            quantity: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unité</Label>
                      <Select
                        value={manualForm.unit}
                        onValueChange={(v) =>
                          v && setManualForm((f) => ({ ...f, unit: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="g">g</SelectItem>
                          <SelectItem value="ml">ml</SelectItem>
                          <SelectItem value="portion">portion</SelectItem>
                          <SelectItem value="unité">unité</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Calories (kcal)</Label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      value={manualForm.calories}
                      onChange={(e) =>
                        setManualForm((f) => ({
                          ...f,
                          calories: e.target.value,
                        }))
                      }
                      placeholder="Ex : 450"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Protéines (g)</Label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={manualForm.protein}
                        onChange={(e) =>
                          setManualForm((f) => ({
                            ...f,
                            protein: e.target.value,
                          }))
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Glucides (g)</Label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={manualForm.carbs}
                        onChange={(e) =>
                          setManualForm((f) => ({
                            ...f,
                            carbs: e.target.value,
                          }))
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Lipides (g)</Label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={manualForm.fat}
                        onChange={(e) =>
                          setManualForm((f) => ({ ...f, fat: e.target.value }))
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fibres (g)</Label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={manualForm.fiber}
                        onChange={(e) =>
                          setManualForm((f) => ({
                            ...f,
                            fiber: e.target.value,
                          }))
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={addManualFood}
                    disabled={
                      savingManual ||
                      !manualForm.name.trim() ||
                      !manualForm.calories
                    }
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    {savingManual ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      "Ajouter l'aliment"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-8 flex justify-center sm:justify-start">
        <DateNavigator value={selectedDate} onChange={setSelectedDate} />
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

      {/* Water tracker */}
      <Card className="border-warm-border mb-8">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Droplets className="h-5 w-5 text-blue-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-foreground">
                    {(waterMl / 1000).toFixed(1)}L
                  </span>
                  <span className="text-xs text-muted-foreground">
                    / {(waterGoalMl / 1000).toFixed(1)}L
                  </span>
                </div>
                <Progress
                  value={Math.min((waterMl / waterGoalMl) * 100, 100)}
                  className="h-2 mt-1 bg-blue-100 dark:bg-blue-950/30 [&>div]:bg-blue-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => addWater(-250)}
                disabled={waterLoading || waterMl <= 0}
              >
                <Minus className="h-3.5 w-3.5 mr-1" />
                25cl
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                onClick={() => addWater(250)}
                disabled={waterLoading}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                25cl
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                onClick={() => addWater(500)}
                disabled={waterLoading}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                50cl
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals */}
      <div className="space-y-6">
        {mealTypes.map((mealType) => (
          <Card key={mealType.value} className="border-warm-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{mealType.label}</CardTitle>
                <div className="flex items-center gap-2">
                  {meals[mealType.value].length >= 2 && (
                    saveRecipeOpen === mealType.value ? (
                      <form
                        className="flex items-center gap-1.5"
                        onSubmit={(e) => {
                          e.preventDefault();
                          saveAsRecipe(mealType.value);
                        }}
                      >
                        <Input
                          value={recipeName}
                          onChange={(e) => setRecipeName(e.target.value)}
                          placeholder="Nom de la recette"
                          className="h-7 text-xs w-36"
                          autoFocus
                        />
                        <Button type="submit" variant="ghost" size="icon" className="h-7 w-7 text-green-600" disabled={!recipeName.trim()}>
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSaveRecipeOpen(null)}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </form>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        title="Sauvegarder comme recette"
                        onClick={() => {
                          setSaveRecipeOpen(mealType.value);
                          setRecipeName("");
                        }}
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                      </Button>
                    )
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {meals[mealType.value].reduce((a, f) => a + f.calories, 0)}{" "}
                    kcal
                  </Badge>
                </div>
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
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{food.name}</p>
                        <div className="flex gap-3 mt-0.5 text-xs text-muted-foreground items-center">
                          {editingId === food.id ? (
                            <form
                              className="flex items-center gap-1.5"
                              onSubmit={(e) => {
                                e.preventDefault();
                                updateFood(mealType.value, food);
                              }}
                            >
                              <Input
                                type="number"
                                value={editQty}
                                onChange={(e) => setEditQty(e.target.value)}
                                className="h-6 w-16 text-xs px-1.5"
                                autoFocus
                                min={1}
                              />
                              <span className="text-xs">g</span>
                              <Button
                                type="submit"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-green-600"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground"
                                onClick={() => setEditingId(null)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </form>
                          ) : (
                            <>
                              <button
                                className="underline decoration-dotted underline-offset-2 hover:text-foreground transition-colors"
                                onClick={() => {
                                  setEditingId(food.id);
                                  setEditQty(String(food.quantity));
                                }}
                              >
                                {food.quantity}{food.unit || "g"}
                              </button>
                              <span>{food.calories} kcal</span>
                              <span>P: {food.protein}g</span>
                              <span>G: {food.carbs}g</span>
                              <span>L: {food.fat}g</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {editingId !== food.id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground h-8 w-8"
                            onClick={() => {
                              setEditingId(food.id);
                              setEditQty(String(food.quantity));
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive h-8 w-8"
                          onClick={() => removeFood(mealType.value, food.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bilan semaine */}
      <div className="mt-6">
        <BilanSemaine
          endDate={selectedDate}
          goalCalories={goals.calories}
          onChanged={refreshData}
        />
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
