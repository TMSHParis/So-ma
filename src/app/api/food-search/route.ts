import { NextRequest, NextResponse } from "next/server";
import { searchLocalFoods, normalize } from "@/lib/food-database";

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

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  // 1. Recherche locale (instantanée, fuzzy, aliments génériques)
  const localResults = searchLocalFoods(q);
  const local: SearchResult[] = localResults.slice(0, 5).map((f, i) => ({
    id: `local-${i}`,
    name: f.name,
    source: "local" as const,
    per100g: f.per100g,
  }));

  // 2. Recherche OpenFoodFacts en parallèle (produits de marque)
  let off: SearchResult[] = [];
  try {
    const normalizedQ = normalize(q);
    const offRes = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=15&fields=code,product_name,nutriments,categories_tags&lc=fr&cc=fr`,
      { signal: AbortSignal.timeout(3000) }
    );

    if (offRes.ok) {
      const data = await offRes.json();
      const products = (data.products || []) as {
        code: string;
        product_name?: string;
        categories_tags?: string[];
        nutriments?: {
          "energy-kcal_100g"?: number;
          proteins_100g?: number;
          carbohydrates_100g?: number;
          fat_100g?: number;
          fiber_100g?: number;
        };
      }[];

      // Filtrer et scorer les résultats OFF
      off = products
        .filter((p) => {
          if (!p.product_name) return false;
          if (!p.nutriments?.["energy-kcal_100g"]) return false;
          return true;
        })
        .map((p) => {
          const name = p.product_name!;
          const normalizedName = normalize(name);
          // Score : bonus si le nom contient le query
          const relevance = normalizedName.includes(normalizedQ)
            ? 0
            : normalizedQ.split(" ").every((w) => normalizedName.includes(w))
              ? 1
              : 2;

          return {
            id: `off-${p.code}`,
            name,
            source: "openfoodfacts" as const,
            per100g: {
              calories: Math.round(p.nutriments!["energy-kcal_100g"] || 0),
              protein: Math.round((p.nutriments!.proteins_100g || 0) * 10) / 10,
              carbs: Math.round((p.nutriments!.carbohydrates_100g || 0) * 10) / 10,
              fat: Math.round((p.nutriments!.fat_100g || 0) * 10) / 10,
              fiber: Math.round((p.nutriments!.fiber_100g || 0) * 10) / 10,
            },
            _relevance: relevance,
          };
        })
        .sort((a, b) => a._relevance - b._relevance)
        .slice(0, 8)
        .map(({ _relevance, ...rest }) => rest);
    }
  } catch {
    // OpenFoodFacts timeout ou erreur — on continue avec les résultats locaux
  }

  // 3. Fusionner : local d'abord, puis OFF (dédupliqués)
  const seen = new Set(local.map((l) => normalize(l.name)));
  const filtered = off.filter((o) => !seen.has(normalize(o.name)));

  return NextResponse.json({
    results: [...local, ...filtered].slice(0, 12),
  });
}
