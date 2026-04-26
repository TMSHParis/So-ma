/**
 * Produits de marque distributeur (Carrefour, Carrefour Discount, Carrefour Bio,
 * Auchan, Leclerc, Lidl, Aldi…) et marques nationales (FR) — valeurs saisies
 * depuis l'étiquette officielle.
 *
 * Garantit que les macros collent **exactement** au produit acheté (et non
 * à la fiche CIQUAL générique, qui mélange souvent versions « égouttée /
 * non égouttée / au naturel » et fausse le suivi des protéines/lipides
 * sur les conserves en sauce).
 *
 * Valeurs pour 100 g (ou 100 ml si liquide). `quantityG` = poids net du
 * conditionnement vendu, pour proposer « 1 boîte / 1 sachet » dans l'UI.
 */
export type BrandFood = {
  name: string;
  brand: string;
  /** Code-barres EAN-13 si connu — sert à retrouver le produit après un scan. */
  barcode?: string;
  /** Poids net du conditionnement vendu (en g). */
  quantityG?: number;
  /** true = boisson/liquide (affichage ml/cl). */
  isLiquid?: boolean;
  kcal: number;
  p: number;
  c: number;
  f: number;
  fi: number;
};

export const BRAND_FOODS: BrandFood[] = [
  // ─── Carrefour Discount ─────────────────────────────────
  {
    name: "Filets de maquereaux espagnols à la moutarde — Carrefour Discount",
    brand: "Carrefour Discount",
    quantityG: 169,
    kcal: 200,
    p: 13,
    c: 0.7,
    f: 16,
    fi: 0.6,
  },
];
