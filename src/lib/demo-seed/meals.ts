// Banque de repas réalistes pour seeder le compte démo.
// Chaque template = liste d'aliments avec macros pré-calculées.
// Objectif quotidien visé : 2924 kcal / 168 P / 374 C / 84 F / 25 fib.

export type FoodItem = {
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

export type MealTemplate = {
  name: string;
  items: FoodItem[];
};

export const BREAKFASTS: MealTemplate[] = [
  {
    name: "Avoine gourmande",
    items: [
      { foodName: "Flocons d'avoine", quantity: 80, unit: "g", calories: 296, protein: 10.4, carbs: 48, fat: 5.6, fiber: 8 },
      { foodName: "Banane", quantity: 120, unit: "g", calories: 107, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3 },
      { foodName: "Amandes", quantity: 20, unit: "g", calories: 120, protein: 4, carbs: 4, fat: 10, fiber: 2.5 },
      { foodName: "Lait demi-écrémé", quantity: 250, unit: "ml", calories: 115, protein: 8.5, carbs: 12, fat: 4, fiber: 0 },
      { foodName: "Whey protéine", quantity: 20, unit: "g", calories: 77, protein: 15.3, carbs: 1.3, fat: 0.6, fiber: 0 },
    ],
  },
  {
    name: "Œufs pain complet avocat",
    items: [
      { foodName: "Œufs", quantity: 3, unit: "u", calories: 234, protein: 18.9, carbs: 1.8, fat: 15.9, fiber: 0 },
      { foodName: "Pain complet", quantity: 100, unit: "g", calories: 250, protein: 8.8, carbs: 44, fat: 3, fiber: 6.3 },
      { foodName: "Avocat", quantity: 80, unit: "g", calories: 128, protein: 1.6, carbs: 7.2, fat: 12, fiber: 5.6 },
      { foodName: "Fromage blanc 0%", quantity: 150, unit: "g", calories: 68, protein: 12, carbs: 6, fat: 0, fiber: 0 },
    ],
  },
  {
    name: "Fromage blanc granola fruits rouges",
    items: [
      { foodName: "Fromage blanc 0%", quantity: 350, unit: "g", calories: 158, protein: 28, carbs: 14, fat: 0, fiber: 0 },
      { foodName: "Granola", quantity: 60, unit: "g", calories: 270, protein: 6, carbs: 38, fat: 10, fiber: 4 },
      { foodName: "Fruits rouges", quantity: 150, unit: "g", calories: 55, protein: 1, carbs: 11, fat: 0.5, fiber: 5 },
      { foodName: "Miel", quantity: 20, unit: "g", calories: 60, protein: 0, carbs: 16, fat: 0, fiber: 0 },
      { foodName: "Amandes", quantity: 15, unit: "g", calories: 90, protein: 3, carbs: 3, fat: 7.5, fiber: 1.9 },
    ],
  },
  {
    name: "Pancakes protéinés",
    items: [
      { foodName: "Flocons d'avoine", quantity: 80, unit: "g", calories: 296, protein: 10.4, carbs: 48, fat: 5.6, fiber: 8 },
      { foodName: "Whey protéine", quantity: 30, unit: "g", calories: 115, protein: 23, carbs: 2, fat: 1, fiber: 0 },
      { foodName: "Œufs", quantity: 2, unit: "u", calories: 156, protein: 12.6, carbs: 1.2, fat: 10.6, fiber: 0 },
      { foodName: "Miel", quantity: 20, unit: "g", calories: 60, protein: 0, carbs: 16, fat: 0, fiber: 0 },
      { foodName: "Lait demi-écrémé", quantity: 200, unit: "ml", calories: 92, protein: 6.8, carbs: 9.6, fat: 3.2, fiber: 0 },
    ],
  },
];

export const LUNCHES: MealTemplate[] = [
  {
    name: "Poulet riz brocolis",
    items: [
      { foodName: "Blanc de poulet", quantity: 200, unit: "g", calories: 330, protein: 62, carbs: 0, fat: 8, fiber: 0 },
      { foodName: "Riz basmati cuit", quantity: 280, unit: "g", calories: 360, protein: 7, carbs: 78, fat: 1, fiber: 2 },
      { foodName: "Brocolis", quantity: 200, unit: "g", calories: 68, protein: 5.6, carbs: 13, fat: 0.8, fiber: 5 },
      { foodName: "Huile d'olive", quantity: 15, unit: "g", calories: 135, protein: 0, carbs: 0, fat: 15, fiber: 0 },
    ],
  },
  {
    name: "Bœuf pâtes complètes",
    items: [
      { foodName: "Steak haché 5%", quantity: 180, unit: "g", calories: 250, protein: 38, carbs: 0, fat: 10, fiber: 0 },
      { foodName: "Pâtes complètes cuites", quantity: 350, unit: "g", calories: 410, protein: 16, carbs: 82, fat: 2.3, fiber: 9 },
      { foodName: "Sauce tomate", quantity: 100, unit: "g", calories: 35, protein: 1.5, carbs: 7, fat: 0.3, fiber: 1.5 },
      { foodName: "Salade verte", quantity: 150, unit: "g", calories: 22, protein: 1.5, carbs: 3, fat: 0, fiber: 2.5 },
      { foodName: "Huile d'olive", quantity: 12, unit: "g", calories: 108, protein: 0, carbs: 0, fat: 12, fiber: 0 },
    ],
  },
  {
    name: "Saumon quinoa épinards",
    items: [
      { foodName: "Saumon", quantity: 180, unit: "g", calories: 370, protein: 45, carbs: 0, fat: 20, fiber: 0 },
      { foodName: "Quinoa cuit", quantity: 240, unit: "g", calories: 340, protein: 13, carbs: 60, fat: 5, fiber: 8 },
      { foodName: "Épinards", quantity: 150, unit: "g", calories: 35, protein: 4.3, carbs: 5.4, fat: 0.6, fiber: 3.3 },
      { foodName: "Avocat", quantity: 60, unit: "g", calories: 96, protein: 1.2, carbs: 5.4, fat: 9, fiber: 4.2 },
    ],
  },
  {
    name: "Dinde patate douce haricots",
    items: [
      { foodName: "Escalope de dinde", quantity: 200, unit: "g", calories: 290, protein: 58, carbs: 0, fat: 6, fiber: 0 },
      { foodName: "Patate douce cuite", quantity: 350, unit: "g", calories: 300, protein: 5.6, carbs: 70, fat: 0.4, fiber: 10.5 },
      { foodName: "Haricots verts", quantity: 200, unit: "g", calories: 62, protein: 3.6, carbs: 14, fat: 0.4, fiber: 8 },
      { foodName: "Huile d'olive", quantity: 15, unit: "g", calories: 135, protein: 0, carbs: 0, fat: 15, fiber: 0 },
      { foodName: "Amandes", quantity: 15, unit: "g", calories: 90, protein: 3, carbs: 3, fat: 7.5, fiber: 1.9 },
    ],
  },
  {
    name: "Poulet riz complet pois chiches",
    items: [
      { foodName: "Blanc de poulet", quantity: 180, unit: "g", calories: 297, protein: 56, carbs: 0, fat: 7, fiber: 0 },
      { foodName: "Riz complet cuit", quantity: 250, unit: "g", calories: 290, protein: 6.3, carbs: 60, fat: 2, fiber: 4 },
      { foodName: "Pois chiches cuits", quantity: 150, unit: "g", calories: 245, protein: 13, carbs: 40, fat: 4, fiber: 12 },
      { foodName: "Courgettes", quantity: 200, unit: "g", calories: 34, protein: 2.4, carbs: 6, fat: 0.6, fiber: 2.2 },
      { foodName: "Huile d'olive", quantity: 10, unit: "g", calories: 90, protein: 0, carbs: 0, fat: 10, fiber: 0 },
    ],
  },
];

export const SNACKS: MealTemplate[] = [
  {
    name: "Skyr myrtilles noix",
    items: [
      { foodName: "Skyr", quantity: 300, unit: "g", calories: 195, protein: 33, carbs: 12, fat: 0.6, fiber: 0 },
      { foodName: "Myrtilles", quantity: 150, unit: "g", calories: 86, protein: 1, carbs: 21, fat: 0.5, fiber: 3.6 },
      { foodName: "Noix", quantity: 20, unit: "g", calories: 132, protein: 3.2, carbs: 2.8, fat: 13.2, fiber: 1.4 },
      { foodName: "Miel", quantity: 10, unit: "g", calories: 30, protein: 0, carbs: 8, fat: 0, fiber: 0 },
    ],
  },
  {
    name: "Pomme beurre de cacahuète œuf",
    items: [
      { foodName: "Pomme", quantity: 180, unit: "g", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.3 },
      { foodName: "Beurre de cacahuète", quantity: 25, unit: "g", calories: 150, protein: 6.3, carbs: 5, fat: 12.5, fiber: 1.7 },
      { foodName: "Œuf dur", quantity: 1, unit: "u", calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, fiber: 0 },
      { foodName: "Fromage blanc 0%", quantity: 150, unit: "g", calories: 68, protein: 12, carbs: 6, fat: 0, fiber: 0 },
    ],
  },
  {
    name: "Barre protéinée banane yaourt",
    items: [
      { foodName: "Barre protéinée", quantity: 60, unit: "g", calories: 230, protein: 20, carbs: 22, fat: 8, fiber: 3 },
      { foodName: "Banane", quantity: 120, unit: "g", calories: 107, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3 },
      { foodName: "Yaourt grec 0%", quantity: 150, unit: "g", calories: 90, protein: 15, carbs: 6, fat: 0, fiber: 0 },
    ],
  },
  {
    name: "Pain complet houmous thon",
    items: [
      { foodName: "Pain complet", quantity: 60, unit: "g", calories: 150, protein: 5.3, carbs: 26.4, fat: 1.8, fiber: 3.8 },
      { foodName: "Houmous", quantity: 80, unit: "g", calories: 136, protein: 6.4, carbs: 12, fat: 8, fiber: 3.2 },
      { foodName: "Thon au naturel", quantity: 80, unit: "g", calories: 100, protein: 19, carbs: 0, fat: 2.4, fiber: 0 },
      { foodName: "Concombre", quantity: 100, unit: "g", calories: 15, protein: 0.7, carbs: 3, fat: 0.1, fiber: 0.5 },
    ],
  },
  {
    name: "Fromage blanc cajou banane",
    items: [
      { foodName: "Fromage blanc 0%", quantity: 300, unit: "g", calories: 135, protein: 24, carbs: 12, fat: 0, fiber: 0 },
      { foodName: "Noix de cajou", quantity: 30, unit: "g", calories: 165, protein: 5.5, carbs: 10, fat: 12.5, fiber: 1 },
      { foodName: "Miel", quantity: 15, unit: "g", calories: 45, protein: 0, carbs: 12, fat: 0, fiber: 0 },
      { foodName: "Banane", quantity: 100, unit: "g", calories: 89, protein: 1.1, carbs: 22, fat: 0.3, fiber: 2.5 },
    ],
  },
];

export const DINNERS: MealTemplate[] = [
  {
    name: "Cabillaud riz complet courgettes",
    items: [
      { foodName: "Cabillaud", quantity: 220, unit: "g", calories: 187, protein: 42, carbs: 0, fat: 1.5, fiber: 0 },
      { foodName: "Riz complet cuit", quantity: 300, unit: "g", calories: 348, protein: 7.5, carbs: 72, fat: 2.4, fiber: 4.8 },
      { foodName: "Courgettes", quantity: 250, unit: "g", calories: 43, protein: 3, carbs: 7.5, fat: 0.8, fiber: 2.8 },
      { foodName: "Huile d'olive", quantity: 15, unit: "g", calories: 135, protein: 0, carbs: 0, fat: 15, fiber: 0 },
      { foodName: "Pain complet", quantity: 60, unit: "g", calories: 150, protein: 5.3, carbs: 26.4, fat: 1.8, fiber: 3.8 },
    ],
  },
  {
    name: "Poulet semoule ratatouille",
    items: [
      { foodName: "Blanc de poulet", quantity: 180, unit: "g", calories: 297, protein: 56, carbs: 0, fat: 7, fiber: 0 },
      { foodName: "Semoule complète cuite", quantity: 300, unit: "g", calories: 340, protein: 12, carbs: 70, fat: 2, fiber: 6 },
      { foodName: "Ratatouille", quantity: 250, unit: "g", calories: 100, protein: 2.5, carbs: 12, fat: 5, fiber: 5 },
      { foodName: "Huile d'olive", quantity: 10, unit: "g", calories: 90, protein: 0, carbs: 0, fat: 10, fiber: 0 },
      { foodName: "Pain complet", quantity: 50, unit: "g", calories: 125, protein: 4.4, carbs: 22, fat: 1.5, fiber: 3.1 },
    ],
  },
  {
    name: "Lentilles œufs salade",
    items: [
      { foodName: "Lentilles cuites", quantity: 350, unit: "g", calories: 438, protein: 30, carbs: 70, fat: 1.8, fiber: 26.3 },
      { foodName: "Œufs", quantity: 2, unit: "u", calories: 156, protein: 12.6, carbs: 1.2, fat: 10.6, fiber: 0 },
      { foodName: "Salade verte", quantity: 150, unit: "g", calories: 22, protein: 1.5, carbs: 3, fat: 0, fiber: 2.5 },
      { foodName: "Huile d'olive", quantity: 15, unit: "g", calories: 135, protein: 0, carbs: 0, fat: 15, fiber: 0 },
      { foodName: "Pain complet", quantity: 60, unit: "g", calories: 150, protein: 5.3, carbs: 26.4, fat: 1.8, fiber: 3.8 },
    ],
  },
  {
    name: "Poisson blanc gnocchi épinards",
    items: [
      { foodName: "Cabillaud", quantity: 200, unit: "g", calories: 170, protein: 38, carbs: 0, fat: 1.4, fiber: 0 },
      { foodName: "Gnocchi", quantity: 250, unit: "g", calories: 330, protein: 7.5, carbs: 70, fat: 2, fiber: 2.5 },
      { foodName: "Épinards", quantity: 200, unit: "g", calories: 46, protein: 5.7, carbs: 7.2, fat: 0.8, fiber: 4.4 },
      { foodName: "Huile d'olive", quantity: 15, unit: "g", calories: 135, protein: 0, carbs: 0, fat: 15, fiber: 0 },
      { foodName: "Parmesan", quantity: 20, unit: "g", calories: 80, protein: 7, carbs: 1, fat: 6, fiber: 0 },
      { foodName: "Pain complet", quantity: 60, unit: "g", calories: 150, protein: 5.3, carbs: 26.4, fat: 1.8, fiber: 3.8 },
    ],
  },
  {
    name: "Boulettes de bœuf riz légumes",
    items: [
      { foodName: "Steak haché 5%", quantity: 200, unit: "g", calories: 278, protein: 42, carbs: 0, fat: 11, fiber: 0 },
      { foodName: "Riz basmati cuit", quantity: 320, unit: "g", calories: 412, protein: 8, carbs: 89, fat: 1.1, fiber: 2.3 },
      { foodName: "Légumes grillés mix", quantity: 200, unit: "g", calories: 90, protein: 3, carbs: 15, fat: 2, fiber: 5 },
      { foodName: "Huile d'olive", quantity: 12, unit: "g", calories: 108, protein: 0, carbs: 0, fat: 12, fiber: 0 },
      { foodName: "Parmesan", quantity: 15, unit: "g", calories: 60, protein: 5.3, carbs: 0.8, fat: 4.5, fiber: 0 },
    ],
  },
];
