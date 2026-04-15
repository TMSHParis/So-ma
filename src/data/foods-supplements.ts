/**
 * Compléments alimentaires sportifs populaires (whey, isolate, caséine,
 * gainer, créatine). Macros pour 100 g de poudre — source : étiquettes
 * officielles des fabricants (Dymatize, Nutrimuscle, Optimum Nutrition,
 * MyProtein, Prozis, Eric Favre, Foodspring, Scitec, BioTech USA).
 *
 * Ajout motivé par le fait que ces produits sont mal indexés dans
 * OpenFoodFacts côté France — on garantit leur présence instantanée.
 */
export type SupplementFood = {
  name: string;
  brand: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
  fi: number;
};

export const SUPPLEMENT_FOODS: SupplementFood[] = [
  // ─── Dymatize ────────────────────────────────────────────
  { name: "Whey ISO 100 Chocolat Gourmet (Dymatize)", brand: "Dymatize", kcal: 375, p: 78, c: 6.3, f: 1.6, fi: 0 },
  { name: "Whey ISO 100 Vanille (Dymatize)", brand: "Dymatize", kcal: 375, p: 78, c: 6.3, f: 1.6, fi: 0 },
  { name: "Whey ISO 100 Fraise (Dymatize)", brand: "Dymatize", kcal: 375, p: 78, c: 6.3, f: 1.6, fi: 0 },
  { name: "Whey ISO 100 Cookies & Cream (Dymatize)", brand: "Dymatize", kcal: 380, p: 76, c: 9, f: 2, fi: 0 },
  { name: "Whey Elite 100% (Dymatize)", brand: "Dymatize", kcal: 400, p: 76, c: 8, f: 4, fi: 0 },

  // ─── Nutrimuscle ─────────────────────────────────────────
  { name: "Whey Native Isolate (Nutrimuscle)", brand: "Nutrimuscle", kcal: 375, p: 90, c: 1, f: 1, fi: 0 },
  { name: "Whey Native Concentrée (Nutrimuscle)", brand: "Nutrimuscle", kcal: 400, p: 80, c: 6, f: 6, fi: 0 },
  { name: "Whey Hydrolysée (Nutrimuscle)", brand: "Nutrimuscle", kcal: 380, p: 88, c: 2, f: 1.5, fi: 0 },
  { name: "Caséine Native Micellaire (Nutrimuscle)", brand: "Nutrimuscle", kcal: 370, p: 82, c: 5, f: 1.5, fi: 0 },

  // ─── Optimum Nutrition ──────────────────────────────────
  { name: "Gold Standard 100% Whey (Optimum Nutrition)", brand: "Optimum Nutrition", kcal: 375, p: 75, c: 10, f: 5, fi: 0 },
  { name: "Gold Standard 100% Isolate (Optimum Nutrition)", brand: "Optimum Nutrition", kcal: 370, p: 86, c: 4, f: 1, fi: 0 },
  { name: "Gold Standard Casein (Optimum Nutrition)", brand: "Optimum Nutrition", kcal: 365, p: 80, c: 6, f: 3, fi: 0 },

  // ─── MyProtein ──────────────────────────────────────────
  { name: "Impact Whey Protein (MyProtein)", brand: "MyProtein", kcal: 400, p: 80, c: 7, f: 7, fi: 0 },
  { name: "Impact Whey Isolate (MyProtein)", brand: "MyProtein", kcal: 370, p: 90, c: 2, f: 1, fi: 0 },
  { name: "Clear Whey Isolate (MyProtein)", brand: "MyProtein", kcal: 360, p: 85, c: 2, f: 0.4, fi: 0 },

  // ─── Prozis ─────────────────────────────────────────────
  { name: "100% Real Whey (Prozis)", brand: "Prozis", kcal: 392, p: 77, c: 7, f: 7, fi: 0 },
  { name: "100% Pure Whey Isolate (Prozis)", brand: "Prozis", kcal: 370, p: 88, c: 3, f: 1, fi: 0 },

  // ─── Eric Favre / Foodspring / Scitec / BioTech ─────────
  { name: "Whey Pure Isolate (Eric Favre)", brand: "Eric Favre", kcal: 375, p: 87, c: 3, f: 1.5, fi: 0 },
  { name: "Whey Protein (Foodspring)", brand: "Foodspring", kcal: 400, p: 80, c: 6, f: 7, fi: 0 },
  { name: "100% Whey Protein Professional (Scitec Nutrition)", brand: "Scitec Nutrition", kcal: 395, p: 74, c: 8, f: 6, fi: 0 },
  { name: "Iso Whey Zero (BioTech USA)", brand: "BioTech USA", kcal: 370, p: 86, c: 2, f: 1, fi: 0 },

  // ─── Génériques (repli) ─────────────────────────────────
  { name: "Whey protéine isolate (générique)", brand: "Générique", kcal: 375, p: 86, c: 4, f: 1.5, fi: 0 },
  { name: "Whey protéine concentrée (générique)", brand: "Générique", kcal: 400, p: 78, c: 7, f: 7, fi: 0 },
  { name: "Caséine micellaire (générique)", brand: "Générique", kcal: 370, p: 82, c: 5, f: 1.5, fi: 0 },
  { name: "Protéine végétale de pois (générique)", brand: "Générique", kcal: 380, p: 80, c: 6, f: 6, fi: 2 },
];
