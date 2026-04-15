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
  const barcode = request.nextUrl.searchParams.get("barcode")?.trim();

  // ── Recherche par code-barres ──────────────────────────────
  if (barcode) {
    try {
      const offRes = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json?fields=code,product_name,brands,nutriments,image_url`,
        { signal: AbortSignal.timeout(5000) }
      );

      if (offRes.ok) {
        const data = await offRes.json();
        if (data.status === 1 && data.product) {
          const p = data.product;
          const name = [p.product_name, p.brands].filter(Boolean).join(" — ");
          if (name && p.nutriments?.["energy-kcal_100g"] != null) {
            const result: SearchResult = {
              id: `off-${p.code}`,
              name,
              source: "openfoodfacts",
              per100g: {
                calories: Math.round(p.nutriments["energy-kcal_100g"] || 0),
                protein: Math.round((p.nutriments.proteins_100g || 0) * 10) / 10,
                carbs: Math.round((p.nutriments.carbohydrates_100g || 0) * 10) / 10,
                fat: Math.round((p.nutriments.fat_100g || 0) * 10) / 10,
                fiber: Math.round((p.nutriments.fiber_100g || 0) * 10) / 10,
              },
            };
            return NextResponse.json({ results: [result] });
          }
        }
      }
    } catch {
      // fallthrough
    }
    return NextResponse.json({ results: [], error: "Produit non trouvé pour ce code-barres" });
  }

  // ── Recherche textuelle ────────────────────────────────────
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  // 1. Recherche locale (instantanée, fuzzy, CIQUAL 3300+ aliments)
  const localResults = searchLocalFoods(q);
  const local: SearchResult[] = localResults.slice(0, 12).map((f, i) => ({
    id: `local-${i}`,
    name: f.name,
    source: "local" as const,
    per100g: f.per100g,
  }));

  // 2. Recherche OpenFoodFacts en parallèle (produits de marque, supermarchés, restaurants)
  //    API v2 : tri par popularité, recherche fr puis fallback monde si rien.
  let off: SearchResult[] = [];
  try {
    const normalizedQ = normalize(q);
    const offUrl = (lc: string) =>
      `https://world.openfoodfacts.org/api/v2/search?search_terms=${encodeURIComponent(q)}&fields=code,product_name,product_name_fr,brands,nutriments,categories_tags&sort_by=popularity_key&page_size=25&lc=${lc}${lc === "fr" ? "&countries_tags_en=france" : ""}`;

    let offRes = await fetch(offUrl("fr"), {
      signal: AbortSignal.timeout(4000),
      headers: { "User-Agent": "So-ma/1.0 (tmshparis@gmail.com)" },
    });
    let data = offRes.ok ? await offRes.json() : { products: [] };
    // Fallback sans filtre pays si 0 résultat
    if (!data.products?.length) {
      try {
        offRes = await fetch(offUrl("fr").replace("&countries_tags_en=france", ""), {
          signal: AbortSignal.timeout(3000),
          headers: { "User-Agent": "So-ma/1.0 (tmshparis@gmail.com)" },
        });
        if (offRes.ok) data = await offRes.json();
      } catch { /* noop */ }
    }

    {
      const products = (data.products || []) as {
        code: string;
        product_name?: string;
        product_name_fr?: string;
        brands?: string;
        categories_tags?: string[];
        nutriments?: {
          "energy-kcal_100g"?: number;
          proteins_100g?: number;
          carbohydrates_100g?: number;
          fat_100g?: number;
          fiber_100g?: number;
        };
      }[];

      off = products
        .filter((p) => {
          if (!p.product_name_fr && !p.product_name) return false;
          if (p.nutriments?.["energy-kcal_100g"] == null) return false;
          return true;
        })
        .map((p) => {
          const label = p.product_name_fr || p.product_name!;
          const name = p.brands ? `${label} — ${p.brands}` : label;
          const normalizedName = normalize(name);
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
        .slice(0, 12)
        .map(({ _relevance, ...rest }) => rest);
    }
  } catch {
    // OpenFoodFacts timeout ou erreur — on continue avec les résultats locaux
  }

  // 3. Fusionner : local d'abord, puis OFF (dédupliqués)
  const seen = new Set(local.map((l) => normalize(l.name)));
  const filtered = off.filter((o) => !seen.has(normalize(o.name)));

  return NextResponse.json({
    results: [...local, ...filtered].slice(0, 20),
  });
}
