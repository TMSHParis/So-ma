/**
 * Nutrition sportive (pâtes de fruits, gels, barres énergétiques) —
 * produits souvent mal ou pas indexés dans OpenFoodFacts, ajoutés à la
 * main depuis les étiquettes officielles pour une résolution instantanée.
 *
 * Valeurs pour 100 g. Pour les bornes « < X », on retient X (majorant),
 * ce qui évite de sous-estimer un apport dans le journal alimentaire.
 */
export type SportsFood = {
  name: string;
  brand: string;
  /** Code-barres EAN-13 si connu — sert à retrouver le produit après un scan. */
  barcode?: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
  fi: number;
};

export const SPORTS_FOODS: SportsFood[] = [
  // ─── Aptonia / Decathlon ────────────────────────────────
  {
    name: "Spécialité de fruits énergétique pomme (Aptonia)",
    brand: "Aptonia",
    barcode: "3583788156291",
    kcal: 106,
    p: 0.5,
    c: 24,
    f: 0.5,
    fi: 1.9,
  },
];
