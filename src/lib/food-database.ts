/**
 * Base locale d'aliments génériques français avec macros pour 100g.
 * Source : table Ciqual (ANSES) simplifiée.
 * Ces résultats sont prioritaires sur OpenFoodFacts car ce sont
 * des aliments bruts/génériques, pas des produits de marque.
 */
export type GenericFood = {
  name: string;
  aliases: string[];
  per100g: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
};

export const GENERIC_FOODS: GenericFood[] = [
  // Féculents
  { name: "Pomme de terre cuite", aliases: ["pomme de terre", "patate", "pdt", "pommes de terre"], per100g: { calories: 80, protein: 2, carbs: 17, fat: 0.1, fiber: 1.4 } },
  { name: "Riz blanc cuit", aliases: ["riz", "riz blanc", "riz cuit"], per100g: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 } },
  { name: "Riz complet cuit", aliases: ["riz complet", "riz brun"], per100g: { calories: 123, protein: 2.7, carbs: 25.6, fat: 1, fiber: 1.8 } },
  { name: "Pâtes cuites", aliases: ["pates", "pâtes", "spaghetti", "tagliatelles", "penne", "fusilli"], per100g: { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8 } },
  { name: "Pâtes complètes cuites", aliases: ["pates completes", "pâtes complètes"], per100g: { calories: 124, protein: 5.3, carbs: 23.2, fat: 1.1, fiber: 3.9 } },
  { name: "Pain blanc", aliases: ["pain", "baguette", "pain de mie"], per100g: { calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7 } },
  { name: "Pain complet", aliases: ["pain complet", "pain aux céréales"], per100g: { calories: 247, protein: 10, carbs: 41, fat: 3.5, fiber: 6.8 } },
  { name: "Quinoa cuit", aliases: ["quinoa"], per100g: { calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8 } },
  { name: "Semoule de blé cuite", aliases: ["semoule", "couscous", "taboulé"], per100g: { calories: 112, protein: 3.8, carbs: 23.2, fat: 0.2, fiber: 1.4 } },
  { name: "Patate douce cuite", aliases: ["patate douce", "sweet potato"], per100g: { calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3 } },
  { name: "Flocons d'avoine", aliases: ["avoine", "porridge", "oatmeal", "flocon avoine", "flocons avoine"], per100g: { calories: 367, protein: 14, carbs: 58, fat: 7, fiber: 10.6 } },
  { name: "Lentilles cuites", aliases: ["lentilles", "lentille"], per100g: { calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8 } },
  { name: "Pois chiches cuits", aliases: ["pois chiches", "pois chiche", "houmous"], per100g: { calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6 } },

  // Protéines animales
  { name: "Poulet (blanc, cuit)", aliases: ["poulet", "blanc de poulet", "filet de poulet", "escalope de poulet"], per100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 } },
  { name: "Dinde (escalope, cuite)", aliases: ["dinde", "escalope de dinde", "filet de dinde"], per100g: { calories: 135, protein: 30, carbs: 0, fat: 1.5, fiber: 0 } },
  { name: "Bœuf (steak haché 5%)", aliases: ["boeuf", "bœuf", "steak", "steak haché", "viande hachée"], per100g: { calories: 137, protein: 26, carbs: 0, fat: 5, fiber: 0 } },
  { name: "Saumon cuit", aliases: ["saumon", "pavé de saumon"], per100g: { calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 } },
  { name: "Thon en conserve (naturel)", aliases: ["thon", "thon en boite", "thon naturel"], per100g: { calories: 116, protein: 26, carbs: 0, fat: 1, fiber: 0 } },
  { name: "Cabillaud cuit", aliases: ["cabillaud", "colin", "poisson blanc", "merlu"], per100g: { calories: 82, protein: 18, carbs: 0, fat: 0.7, fiber: 0 } },
  { name: "Crevettes cuites", aliases: ["crevettes", "crevette", "gambas"], per100g: { calories: 99, protein: 21, carbs: 0.2, fat: 1.7, fiber: 0 } },
  { name: "Œuf entier", aliases: ["oeuf", "œuf", "oeufs", "œufs"], per100g: { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 } },
  { name: "Jambon blanc", aliases: ["jambon", "jambon blanc", "jambon cuit"], per100g: { calories: 115, protein: 21, carbs: 1, fat: 3, fiber: 0 } },

  // Produits laitiers
  { name: "Yaourt nature", aliases: ["yaourt", "yogourt", "yahourt"], per100g: { calories: 63, protein: 5, carbs: 7, fat: 1.5, fiber: 0 } },
  { name: "Fromage blanc 0%", aliases: ["fromage blanc", "faisselle"], per100g: { calories: 45, protein: 8, carbs: 4, fat: 0.2, fiber: 0 } },
  { name: "Lait demi-écrémé", aliases: ["lait", "lait demi ecreme"], per100g: { calories: 46, protein: 3.2, carbs: 4.8, fat: 1.6, fiber: 0 } },
  { name: "Emmental", aliases: ["emmental", "gruyère", "gruyere", "fromage rapé"], per100g: { calories: 380, protein: 28, carbs: 0.1, fat: 30, fiber: 0 } },
  { name: "Mozzarella", aliases: ["mozzarella", "mozza"], per100g: { calories: 280, protein: 22, carbs: 2, fat: 20, fiber: 0 } },

  // Fruits
  { name: "Pomme", aliases: ["pomme", "pommes"], per100g: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 } },
  { name: "Banane", aliases: ["banane", "bananes"], per100g: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 } },
  { name: "Orange", aliases: ["orange", "oranges"], per100g: { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4 } },
  { name: "Fraise", aliases: ["fraise", "fraises"], per100g: { calories: 33, protein: 0.7, carbs: 8, fat: 0.3, fiber: 2 } },
  { name: "Raisin", aliases: ["raisin", "raisins"], per100g: { calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9 } },
  { name: "Avocat", aliases: ["avocat", "avocats"], per100g: { calories: 160, protein: 2, carbs: 8.5, fat: 15, fiber: 6.7 } },
  { name: "Mangue", aliases: ["mangue"], per100g: { calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6 } },

  // Légumes
  { name: "Brocoli cuit", aliases: ["brocoli", "brocolis"], per100g: { calories: 35, protein: 2.4, carbs: 7, fat: 0.4, fiber: 3.3 } },
  { name: "Haricots verts cuits", aliases: ["haricots verts", "haricot vert"], per100g: { calories: 31, protein: 1.8, carbs: 7, fat: 0.1, fiber: 3.4 } },
  { name: "Courgette cuite", aliases: ["courgette", "courgettes"], per100g: { calories: 17, protein: 1.2, carbs: 3, fat: 0.3, fiber: 1 } },
  { name: "Tomate", aliases: ["tomate", "tomates"], per100g: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 } },
  { name: "Carotte cuite", aliases: ["carotte", "carottes"], per100g: { calories: 36, protein: 0.8, carbs: 8, fat: 0.2, fiber: 3 } },
  { name: "Épinards cuits", aliases: ["epinards", "épinards", "epinard"], per100g: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.3, fiber: 2.2 } },
  { name: "Salade verte", aliases: ["salade", "laitue", "salade verte"], per100g: { calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.3 } },
  { name: "Champignons", aliases: ["champignon", "champignons"], per100g: { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1 } },
  { name: "Poivron", aliases: ["poivron", "poivrons", "poivron rouge", "poivron vert"], per100g: { calories: 26, protein: 1, carbs: 6, fat: 0.3, fiber: 1.7 } },
  { name: "Oignon", aliases: ["oignon", "oignons", "echalote", "échalote"], per100g: { calories: 40, protein: 1.1, carbs: 9, fat: 0.1, fiber: 1.7 } },
  { name: "Concombre", aliases: ["concombre"], per100g: { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5 } },

  // Matières grasses & oléagineux
  { name: "Huile d'olive", aliases: ["huile olive", "huile d'olive"], per100g: { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 } },
  { name: "Beurre", aliases: ["beurre"], per100g: { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0 } },
  { name: "Beurre de cacahuète", aliases: ["beurre de cacahuete", "beurre de cacahuète", "peanut butter"], per100g: { calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6 } },
  { name: "Amandes", aliases: ["amande", "amandes"], per100g: { calories: 576, protein: 21, carbs: 22, fat: 49, fiber: 12.5 } },
  { name: "Noix", aliases: ["noix", "cerneaux de noix"], per100g: { calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7 } },

  // Divers
  { name: "Miel", aliases: ["miel"], per100g: { calories: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2 } },
  { name: "Chocolat noir 70%", aliases: ["chocolat", "chocolat noir"], per100g: { calories: 598, protein: 7.8, carbs: 46, fat: 43, fiber: 11 } },
  { name: "Tofu", aliases: ["tofu", "tofou"], per100g: { calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3 } },
  { name: "Houmous", aliases: ["houmous", "hummus", "houmos"], per100g: { calories: 166, protein: 7.9, carbs: 14, fat: 9.6, fiber: 6 } },
];

/**
 * Normalise une chaîne pour la comparaison fuzzy :
 * supprime accents, met en minuscule, compresse les espaces.
 */
export function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Distance de Levenshtein simplifiée (max 3 pour perf).
 */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  if (Math.abs(a.length - b.length) > 3) return 4;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Recherche fuzzy dans la base locale.
 * Retourne les aliments dont un alias matche le query (exact, contient, ou Levenshtein ≤ 2).
 */
export function searchLocalFoods(query: string): (GenericFood & { score: number })[] {
  const q = normalize(query);
  if (q.length < 2) return [];

  const qWords = q.split(" ");
  const results: (GenericFood & { score: number })[] = [];

  for (const food of GENERIC_FOODS) {
    let bestScore = Infinity;

    const targets = [normalize(food.name), ...food.aliases.map(normalize)];

    for (const target of targets) {
      // Match exact
      if (target === q) {
        bestScore = 0;
        break;
      }
      // Contient le query
      if (target.includes(q)) {
        bestScore = Math.min(bestScore, 0.5);
        continue;
      }
      // Le query contient le target
      if (q.includes(target)) {
        bestScore = Math.min(bestScore, 0.7);
        continue;
      }
      // Tous les mots du query sont dans le target
      if (qWords.every((w) => target.includes(w))) {
        bestScore = Math.min(bestScore, 1);
        continue;
      }
      // Levenshtein sur chaque mot
      const targetWords = target.split(" ");
      for (const tw of targetWords) {
        for (const qw of qWords) {
          const dist = levenshtein(qw, tw);
          if (dist <= 2) {
            bestScore = Math.min(bestScore, 2 + dist * 0.5);
          }
        }
      }
    }

    if (bestScore < Infinity) {
      results.push({ ...food, score: bestScore });
    }
  }

  return results.sort((a, b) => a.score - b.score);
}
