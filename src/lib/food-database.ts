/**
 * Base locale d'aliments génériques français avec macros pour 100g.
 * Sources : table Ciqual (ANSES), USDA FoodData Central, données nutritionnelles publiques.
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
  // ═══════════════════════════════════════════════
  // FÉCULENTS & CÉRÉALES
  // ═══════════════════════════════════════════════
  { name: "Pomme de terre cuite", aliases: ["pomme de terre", "patate", "pdt", "pommes de terre"], per100g: { calories: 80, protein: 2, carbs: 17, fat: 0.1, fiber: 1.4 } },
  { name: "Riz blanc cuit", aliases: ["riz", "riz blanc", "riz cuit"], per100g: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 } },
  { name: "Riz complet cuit", aliases: ["riz complet", "riz brun"], per100g: { calories: 123, protein: 2.7, carbs: 25.6, fat: 1, fiber: 1.8 } },
  { name: "Riz basmati cuit", aliases: ["riz basmati", "basmati"], per100g: { calories: 121, protein: 3.5, carbs: 25.2, fat: 0.4, fiber: 0.4 } },
  { name: "Riz thaï cuit", aliases: ["riz thai", "riz thaï", "riz jasmin"], per100g: { calories: 130, protein: 2.7, carbs: 28.7, fat: 0.3, fiber: 0.3 } },
  { name: "Riz à sushi cuit", aliases: ["riz sushi", "riz vinaigré"], per100g: { calories: 143, protein: 2.5, carbs: 31, fat: 0.3, fiber: 0.3 } },
  { name: "Pâtes cuites", aliases: ["pates", "pâtes", "spaghetti", "tagliatelles", "penne", "fusilli", "farfalle", "rigatoni", "linguine"], per100g: { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8 } },
  { name: "Pâtes complètes cuites", aliases: ["pates completes", "pâtes complètes", "spaghetti complet"], per100g: { calories: 124, protein: 5.3, carbs: 23.2, fat: 1.1, fiber: 3.9 } },
  { name: "Pain blanc", aliases: ["pain", "baguette", "pain de mie"], per100g: { calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7 } },
  { name: "Pain complet", aliases: ["pain complet", "pain aux céréales", "pain multicéréales"], per100g: { calories: 247, protein: 10, carbs: 41, fat: 3.5, fiber: 6.8 } },
  { name: "Pain de seigle", aliases: ["pain seigle", "seigle"], per100g: { calories: 259, protein: 8.5, carbs: 48, fat: 3.3, fiber: 5.8 } },
  { name: "Pain de campagne", aliases: ["pain campagne"], per100g: { calories: 262, protein: 8.5, carbs: 50, fat: 2.8, fiber: 3 } },
  { name: "Pain aux noix", aliases: ["pain noix"], per100g: { calories: 290, protein: 9, carbs: 44, fat: 8, fiber: 4 } },
  { name: "Brioche", aliases: ["brioche"], per100g: { calories: 357, protein: 8, carbs: 48, fat: 14, fiber: 1.5 } },
  { name: "Croissant", aliases: ["croissant"], per100g: { calories: 406, protein: 8, carbs: 45, fat: 21, fiber: 2 } },
  { name: "Pain au chocolat", aliases: ["pain au chocolat", "chocolatine"], per100g: { calories: 414, protein: 7, carbs: 46, fat: 22, fiber: 2.4 } },
  { name: "Crêpe nature", aliases: ["crepe", "crêpe", "crêpes"], per100g: { calories: 227, protein: 6.6, carbs: 28, fat: 10, fiber: 1 } },
  { name: "Gaufre", aliases: ["gaufre", "gaufres"], per100g: { calories: 312, protein: 6, carbs: 42, fat: 13, fiber: 1 } },
  { name: "Pancake", aliases: ["pancake", "pancakes"], per100g: { calories: 227, protein: 6.4, carbs: 28, fat: 10, fiber: 1 } },
  { name: "Quinoa cuit", aliases: ["quinoa"], per100g: { calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8 } },
  { name: "Semoule de blé cuite", aliases: ["semoule", "couscous", "taboulé"], per100g: { calories: 112, protein: 3.8, carbs: 23.2, fat: 0.2, fiber: 1.4 } },
  { name: "Patate douce cuite", aliases: ["patate douce", "sweet potato"], per100g: { calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3 } },
  { name: "Flocons d'avoine", aliases: ["avoine", "porridge", "oatmeal", "flocon avoine", "flocons avoine"], per100g: { calories: 367, protein: 14, carbs: 58, fat: 7, fiber: 10.6 } },
  { name: "Lentilles cuites", aliases: ["lentilles", "lentille"], per100g: { calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8 } },
  { name: "Lentilles corail cuites", aliases: ["lentilles corail", "lentille corail"], per100g: { calories: 100, protein: 7.6, carbs: 17, fat: 0.4, fiber: 3.4 } },
  { name: "Pois chiches cuits", aliases: ["pois chiches", "pois chiche"], per100g: { calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6 } },
  { name: "Haricots rouges cuits", aliases: ["haricots rouges", "haricot rouge", "kidney beans"], per100g: { calories: 127, protein: 8.7, carbs: 22, fat: 0.5, fiber: 6.4 } },
  { name: "Haricots blancs cuits", aliases: ["haricots blancs", "mogettes", "flageolets"], per100g: { calories: 139, protein: 9.7, carbs: 25, fat: 0.5, fiber: 6.3 } },
  { name: "Pois cassés cuits", aliases: ["pois cassés", "pois casses"], per100g: { calories: 118, protein: 8.3, carbs: 21, fat: 0.4, fiber: 8.3 } },
  { name: "Boulgour cuit", aliases: ["boulgour", "boulghour", "bulgur"], per100g: { calories: 83, protein: 3.1, carbs: 18.6, fat: 0.2, fiber: 4.5 } },
  { name: "Blé ébly cuit", aliases: ["ble", "blé", "ebly", "ébly"], per100g: { calories: 128, protein: 4, carbs: 26, fat: 0.6, fiber: 3 } },
  { name: "Nouilles chinoises cuites", aliases: ["nouilles", "nouilles chinoises", "noodles"], per100g: { calories: 138, protein: 2.2, carbs: 25, fat: 3.3, fiber: 1 } },
  { name: "Vermicelles de riz cuits", aliases: ["vermicelles", "vermicelles de riz"], per100g: { calories: 109, protein: 0.9, carbs: 25, fat: 0.2, fiber: 0.9 } },
  { name: "Gnocchi cuits", aliases: ["gnocchi"], per100g: { calories: 133, protein: 3, carbs: 27, fat: 1.5, fiber: 1.5 } },
  { name: "Tortilla de blé", aliases: ["tortilla", "wrap", "wraps"], per100g: { calories: 312, protein: 8, carbs: 52, fat: 8, fiber: 2.5 } },
  { name: "Galette de riz soufflé", aliases: ["galette de riz", "galettes de riz", "rice cake"], per100g: { calories: 387, protein: 8, carbs: 81, fat: 3, fiber: 3.5 } },
  { name: "Frites", aliases: ["frites", "frite", "french fries"], per100g: { calories: 312, protein: 3.4, carbs: 41, fat: 15, fiber: 3.8 } },
  { name: "Purée de pommes de terre", aliases: ["purée", "puree", "mashed potatoes"], per100g: { calories: 83, protein: 2, carbs: 14, fat: 2.3, fiber: 1.3 } },

  // ═══════════════════════════════════════════════
  // PROTÉINES ANIMALES
  // ═══════════════════════════════════════════════
  { name: "Poulet (blanc, cuit)", aliases: ["poulet", "blanc de poulet", "filet de poulet", "escalope de poulet"], per100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 } },
  { name: "Cuisse de poulet (cuite)", aliases: ["cuisse de poulet", "haut de cuisse", "pilon"], per100g: { calories: 209, protein: 26, carbs: 0, fat: 11, fiber: 0 } },
  { name: "Poulet rôti (avec peau)", aliases: ["poulet roti", "poulet rôti"], per100g: { calories: 239, protein: 27, carbs: 0, fat: 14, fiber: 0 } },
  { name: "Nuggets de poulet", aliases: ["nuggets", "chicken nuggets"], per100g: { calories: 296, protein: 15, carbs: 18, fat: 18, fiber: 1 } },
  { name: "Dinde (escalope, cuite)", aliases: ["dinde", "escalope de dinde", "filet de dinde"], per100g: { calories: 135, protein: 30, carbs: 0, fat: 1.5, fiber: 0 } },
  { name: "Bœuf (steak haché 5%)", aliases: ["boeuf", "bœuf", "steak", "steak haché", "viande hachée", "steak hache"], per100g: { calories: 137, protein: 26, carbs: 0, fat: 5, fiber: 0 } },
  { name: "Bœuf (steak haché 15%)", aliases: ["steak hache 15", "viande hachée 15"], per100g: { calories: 225, protein: 24, carbs: 0, fat: 15, fiber: 0 } },
  { name: "Bœuf (entrecôte)", aliases: ["entrecote", "entrecôte", "cote de boeuf"], per100g: { calories: 271, protein: 26, carbs: 0, fat: 18, fiber: 0 } },
  { name: "Bœuf (filet)", aliases: ["filet de boeuf", "filet de bœuf", "tournedos"], per100g: { calories: 218, protein: 26, carbs: 0, fat: 12, fiber: 0 } },
  { name: "Bœuf (bourguignon, cuit)", aliases: ["bourguignon", "boeuf bourguignon"], per100g: { calories: 174, protein: 22, carbs: 4, fat: 8, fiber: 0.5 } },
  { name: "Porc (côte, cuite)", aliases: ["cote de porc", "côte de porc", "porc"], per100g: { calories: 242, protein: 27, carbs: 0, fat: 14, fiber: 0 } },
  { name: "Porc (filet mignon, cuit)", aliases: ["filet mignon", "filet mignon de porc"], per100g: { calories: 143, protein: 26, carbs: 0, fat: 4, fiber: 0 } },
  { name: "Porc (rôti, cuit)", aliases: ["roti de porc", "rôti de porc"], per100g: { calories: 182, protein: 27, carbs: 0, fat: 8, fiber: 0 } },
  { name: "Lardons fumés", aliases: ["lardons", "lardon", "bacon"], per100g: { calories: 260, protein: 16, carbs: 0.5, fat: 22, fiber: 0 } },
  { name: "Saucisse de Toulouse", aliases: ["saucisse", "chipolata"], per100g: { calories: 300, protein: 14, carbs: 1, fat: 26, fiber: 0 } },
  { name: "Merguez", aliases: ["merguez"], per100g: { calories: 280, protein: 14, carbs: 2, fat: 24, fiber: 0 } },
  { name: "Agneau (gigot, cuit)", aliases: ["agneau", "gigot", "gigot d'agneau"], per100g: { calories: 234, protein: 26, carbs: 0, fat: 14, fiber: 0 } },
  { name: "Canard (magret)", aliases: ["magret", "magret de canard", "canard"], per100g: { calories: 337, protein: 19, carbs: 0, fat: 28, fiber: 0 } },
  { name: "Veau (escalope)", aliases: ["veau", "escalope de veau", "blanquette"], per100g: { calories: 172, protein: 31, carbs: 0, fat: 5, fiber: 0 } },
  { name: "Lapin (cuit)", aliases: ["lapin"], per100g: { calories: 197, protein: 29, carbs: 0, fat: 8, fiber: 0 } },
  { name: "Saumon cuit", aliases: ["saumon", "pavé de saumon", "darne de saumon"], per100g: { calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 } },
  { name: "Saumon fumé", aliases: ["saumon fumé", "saumon fume"], per100g: { calories: 117, protein: 18, carbs: 0, fat: 4.3, fiber: 0 } },
  { name: "Thon en conserve (naturel)", aliases: ["thon", "thon en boite", "thon naturel"], per100g: { calories: 116, protein: 26, carbs: 0, fat: 1, fiber: 0 } },
  { name: "Thon en conserve (huile)", aliases: ["thon huile", "thon à l'huile"], per100g: { calories: 198, protein: 29, carbs: 0, fat: 9, fiber: 0 } },
  { name: "Thon frais (cuit)", aliases: ["thon frais", "steak de thon"], per100g: { calories: 132, protein: 29, carbs: 0, fat: 1.3, fiber: 0 } },
  { name: "Cabillaud cuit", aliases: ["cabillaud", "colin", "poisson blanc", "merlu", "lieu noir"], per100g: { calories: 82, protein: 18, carbs: 0, fat: 0.7, fiber: 0 } },
  { name: "Crevettes cuites", aliases: ["crevettes", "crevette", "gambas"], per100g: { calories: 99, protein: 21, carbs: 0.2, fat: 1.7, fiber: 0 } },
  { name: "Sardines en conserve", aliases: ["sardines", "sardine"], per100g: { calories: 208, protein: 24, carbs: 0, fat: 11, fiber: 0 } },
  { name: "Maquereau (cuit)", aliases: ["maquereau"], per100g: { calories: 205, protein: 19, carbs: 0, fat: 13, fiber: 0 } },
  { name: "Truite (cuite)", aliases: ["truite"], per100g: { calories: 190, protein: 20, carbs: 0, fat: 12, fiber: 0 } },
  { name: "Dorade (cuite)", aliases: ["dorade", "daurade"], per100g: { calories: 100, protein: 20, carbs: 0, fat: 2, fiber: 0 } },
  { name: "Bar/Loup (cuit)", aliases: ["bar", "loup", "loup de mer"], per100g: { calories: 97, protein: 18, carbs: 0, fat: 2, fiber: 0 } },
  { name: "Sole (cuite)", aliases: ["sole"], per100g: { calories: 86, protein: 18, carbs: 0, fat: 1.2, fiber: 0 } },
  { name: "Moules cuites", aliases: ["moules", "moule"], per100g: { calories: 86, protein: 12, carbs: 3.7, fat: 2.2, fiber: 0 } },
  { name: "Surimi", aliases: ["surimi", "bâtonnet de crabe"], per100g: { calories: 97, protein: 8, carbs: 12, fat: 1.5, fiber: 0 } },
  { name: "Œuf entier", aliases: ["oeuf", "œuf", "oeufs", "œufs"], per100g: { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 } },
  { name: "Blanc d'œuf", aliases: ["blanc d'oeuf", "blanc oeuf", "blanc d'œuf"], per100g: { calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0 } },
  { name: "Jaune d'œuf", aliases: ["jaune d'oeuf", "jaune oeuf", "jaune d'œuf"], per100g: { calories: 322, protein: 16, carbs: 3.6, fat: 27, fiber: 0 } },
  { name: "Œuf dur", aliases: ["oeuf dur", "œuf dur"], per100g: { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 } },
  { name: "Omelette nature", aliases: ["omelette"], per100g: { calories: 154, protein: 11, carbs: 0.6, fat: 12, fiber: 0 } },
  { name: "Jambon blanc", aliases: ["jambon", "jambon blanc", "jambon cuit"], per100g: { calories: 115, protein: 21, carbs: 1, fat: 3, fiber: 0 } },
  { name: "Jambon cru", aliases: ["jambon cru", "jambon sec", "prosciutto"], per100g: { calories: 241, protein: 26, carbs: 0, fat: 15, fiber: 0 } },
  { name: "Steak de soja", aliases: ["steak vegetal", "steak végétal", "steak de soja", "galette vegetale"], per100g: { calories: 180, protein: 18, carbs: 8, fat: 8, fiber: 4 } },

  // ═══════════════════════════════════════════════
  // PRODUITS LAITIERS
  // ═══════════════════════════════════════════════
  { name: "Yaourt nature", aliases: ["yaourt", "yogourt", "yahourt"], per100g: { calories: 63, protein: 5, carbs: 7, fat: 1.5, fiber: 0 } },
  { name: "Yaourt grec nature", aliases: ["yaourt grec", "greek yogurt", "skyr"], per100g: { calories: 97, protein: 9, carbs: 3.6, fat: 5, fiber: 0 } },
  { name: "Yaourt 0% nature", aliases: ["yaourt 0", "yaourt allege"], per100g: { calories: 43, protein: 4.3, carbs: 6, fat: 0.1, fiber: 0 } },
  { name: "Yaourt aux fruits", aliases: ["yaourt fruits", "yaourt fraise", "yaourt vanille"], per100g: { calories: 92, protein: 3.5, carbs: 15, fat: 1.5, fiber: 0 } },
  { name: "Fromage blanc 0%", aliases: ["fromage blanc", "faisselle"], per100g: { calories: 45, protein: 8, carbs: 4, fat: 0.2, fiber: 0 } },
  { name: "Fromage blanc 3%", aliases: ["fromage blanc 3", "fromage blanc entier"], per100g: { calories: 60, protein: 7, carbs: 4, fat: 3, fiber: 0 } },
  { name: "Skyr nature", aliases: ["skyr"], per100g: { calories: 63, protein: 11, carbs: 4, fat: 0.2, fiber: 0 } },
  { name: "Petits suisses", aliases: ["petit suisse", "petits suisses"], per100g: { calories: 112, protein: 7, carbs: 10, fat: 5, fiber: 0 } },
  { name: "Lait demi-écrémé", aliases: ["lait", "lait demi ecreme"], per100g: { calories: 46, protein: 3.2, carbs: 4.8, fat: 1.6, fiber: 0 } },
  { name: "Lait entier", aliases: ["lait entier"], per100g: { calories: 63, protein: 3.2, carbs: 4.8, fat: 3.5, fiber: 0 } },
  { name: "Lait écrémé", aliases: ["lait ecreme", "lait écrémé"], per100g: { calories: 34, protein: 3.4, carbs: 5, fat: 0.1, fiber: 0 } },
  { name: "Lait d'amande (non sucré)", aliases: ["lait d'amande", "lait amande", "almond milk"], per100g: { calories: 13, protein: 0.4, carbs: 0.3, fat: 1.1, fiber: 0.2 } },
  { name: "Lait d'avoine", aliases: ["lait d'avoine", "lait avoine", "oat milk"], per100g: { calories: 43, protein: 0.3, carbs: 7.5, fat: 1.4, fiber: 0.8 } },
  { name: "Lait de soja (non sucré)", aliases: ["lait de soja", "lait soja", "soy milk"], per100g: { calories: 33, protein: 2.9, carbs: 1.2, fat: 1.8, fiber: 0.4 } },
  { name: "Lait de coco", aliases: ["lait de coco", "lait coco", "coconut milk"], per100g: { calories: 187, protein: 2.2, carbs: 2.8, fat: 19, fiber: 0 } },
  { name: "Crème fraîche 15%", aliases: ["creme fraiche", "crème fraîche", "creme fraiche legere"], per100g: { calories: 160, protein: 2.5, carbs: 3.5, fat: 15, fiber: 0 } },
  { name: "Crème fraîche 30%", aliases: ["creme epaisse", "crème épaisse", "creme fraiche epaisse"], per100g: { calories: 301, protein: 2.5, carbs: 3, fat: 30, fiber: 0 } },
  { name: "Emmental", aliases: ["emmental", "gruyère", "gruyere", "fromage rapé"], per100g: { calories: 380, protein: 28, carbs: 0.1, fat: 30, fiber: 0 } },
  { name: "Mozzarella", aliases: ["mozzarella", "mozza"], per100g: { calories: 280, protein: 22, carbs: 2, fat: 20, fiber: 0 } },
  { name: "Camembert", aliases: ["camembert"], per100g: { calories: 299, protein: 20, carbs: 0.5, fat: 24, fiber: 0 } },
  { name: "Chèvre frais", aliases: ["chevre", "chèvre", "fromage de chèvre"], per100g: { calories: 209, protein: 13, carbs: 1, fat: 17, fiber: 0 } },
  { name: "Comté", aliases: ["comte", "comté"], per100g: { calories: 403, protein: 27, carbs: 0.1, fat: 33, fiber: 0 } },
  { name: "Parmesan", aliases: ["parmesan", "parmigiano", "grana padano"], per100g: { calories: 431, protein: 38, carbs: 3, fat: 29, fiber: 0 } },
  { name: "Feta", aliases: ["feta"], per100g: { calories: 264, protein: 14, carbs: 4, fat: 21, fiber: 0 } },
  { name: "Roquefort", aliases: ["roquefort", "bleu"], per100g: { calories: 369, protein: 21, carbs: 2, fat: 31, fiber: 0 } },
  { name: "Ricotta", aliases: ["ricotta"], per100g: { calories: 174, protein: 11, carbs: 3, fat: 13, fiber: 0 } },
  { name: "Cream cheese", aliases: ["cream cheese", "fromage à tartiner", "philadelphia", "saint moret", "kiri"], per100g: { calories: 342, protein: 6, carbs: 4, fat: 34, fiber: 0 } },
  { name: "Beurre", aliases: ["beurre"], per100g: { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0 } },
  { name: "Beurre demi-sel", aliases: ["beurre demi sel"], per100g: { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0 } },
  { name: "Mascarpone", aliases: ["mascarpone"], per100g: { calories: 429, protein: 5, carbs: 3, fat: 44, fiber: 0 } },

  // ═══════════════════════════════════════════════
  // FRUITS
  // ═══════════════════════════════════════════════
  { name: "Pomme", aliases: ["pomme", "pommes"], per100g: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 } },
  { name: "Banane", aliases: ["banane", "bananes"], per100g: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 } },
  { name: "Orange", aliases: ["orange", "oranges"], per100g: { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4 } },
  { name: "Fraise", aliases: ["fraise", "fraises"], per100g: { calories: 33, protein: 0.7, carbs: 8, fat: 0.3, fiber: 2 } },
  { name: "Raisin", aliases: ["raisin", "raisins"], per100g: { calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9 } },
  { name: "Avocat", aliases: ["avocat", "avocats"], per100g: { calories: 160, protein: 2, carbs: 8.5, fat: 15, fiber: 6.7 } },
  { name: "Mangue", aliases: ["mangue"], per100g: { calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6 } },
  { name: "Poire", aliases: ["poire", "poires"], per100g: { calories: 57, protein: 0.4, carbs: 15, fat: 0.1, fiber: 3.1 } },
  { name: "Pêche", aliases: ["peche", "pêche", "pêches"], per100g: { calories: 39, protein: 0.9, carbs: 10, fat: 0.3, fiber: 1.5 } },
  { name: "Nectarine", aliases: ["nectarine", "brugnon"], per100g: { calories: 44, protein: 1.1, carbs: 11, fat: 0.3, fiber: 1.7 } },
  { name: "Abricot", aliases: ["abricot", "abricots"], per100g: { calories: 48, protein: 1.4, carbs: 11, fat: 0.4, fiber: 2 } },
  { name: "Kiwi", aliases: ["kiwi", "kiwis"], per100g: { calories: 61, protein: 1.1, carbs: 15, fat: 0.5, fiber: 3 } },
  { name: "Ananas", aliases: ["ananas"], per100g: { calories: 50, protein: 0.5, carbs: 13, fat: 0.1, fiber: 1.4 } },
  { name: "Melon", aliases: ["melon"], per100g: { calories: 34, protein: 0.8, carbs: 8, fat: 0.2, fiber: 0.9 } },
  { name: "Pastèque", aliases: ["pasteque", "pastèque"], per100g: { calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2, fiber: 0.4 } },
  { name: "Cerises", aliases: ["cerise", "cerises"], per100g: { calories: 50, protein: 1, carbs: 12, fat: 0.3, fiber: 2.1 } },
  { name: "Prune", aliases: ["prune", "prunes", "mirabelle", "reine-claude"], per100g: { calories: 46, protein: 0.7, carbs: 11, fat: 0.3, fiber: 1.4 } },
  { name: "Framboises", aliases: ["framboise", "framboises"], per100g: { calories: 52, protein: 1.2, carbs: 12, fat: 0.7, fiber: 6.5 } },
  { name: "Myrtilles", aliases: ["myrtille", "myrtilles", "blueberry", "blueberries"], per100g: { calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4 } },
  { name: "Grenade", aliases: ["grenade", "grenades"], per100g: { calories: 83, protein: 1.7, carbs: 19, fat: 1.2, fiber: 4 } },
  { name: "Litchi", aliases: ["litchi", "lychee"], per100g: { calories: 66, protein: 0.8, carbs: 17, fat: 0.4, fiber: 1.3 } },
  { name: "Figues fraîches", aliases: ["figue", "figues"], per100g: { calories: 74, protein: 0.8, carbs: 19, fat: 0.3, fiber: 2.9 } },
  { name: "Dattes séchées", aliases: ["datte", "dattes"], per100g: { calories: 282, protein: 2.5, carbs: 75, fat: 0.4, fiber: 8 } },
  { name: "Pamplemousse", aliases: ["pamplemousse", "pomelo"], per100g: { calories: 42, protein: 0.8, carbs: 11, fat: 0.1, fiber: 1.6 } },
  { name: "Clémentine", aliases: ["clementine", "clémentine", "mandarine"], per100g: { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 1.7 } },
  { name: "Fruit de la passion", aliases: ["fruit de la passion", "maracuja"], per100g: { calories: 97, protein: 2.2, carbs: 23, fat: 0.7, fiber: 10.4 } },
  { name: "Papaye", aliases: ["papaye"], per100g: { calories: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7 } },
  { name: "Noix de coco fraîche", aliases: ["noix de coco", "coco"], per100g: { calories: 354, protein: 3.3, carbs: 15, fat: 33, fiber: 9 } },
  { name: "Compote de pommes (sans sucre)", aliases: ["compote", "compote de pommes"], per100g: { calories: 42, protein: 0.2, carbs: 11, fat: 0.1, fiber: 1.1 } },
  { name: "Raisins secs", aliases: ["raisins secs", "raisin sec"], per100g: { calories: 299, protein: 3.1, carbs: 79, fat: 0.5, fiber: 3.7 } },
  { name: "Pruneaux", aliases: ["pruneaux", "pruneau"], per100g: { calories: 240, protein: 2.2, carbs: 64, fat: 0.4, fiber: 7.1 } },
  { name: "Abricots secs", aliases: ["abricots secs", "abricot sec"], per100g: { calories: 241, protein: 3.4, carbs: 63, fat: 0.5, fiber: 7.3 } },
  { name: "Cranberries séchées", aliases: ["cranberries", "canneberges"], per100g: { calories: 308, protein: 0.1, carbs: 82, fat: 1.4, fiber: 5.7 } },

  // ═══════════════════════════════════════════════
  // LÉGUMES
  // ═══════════════════════════════════════════════
  { name: "Brocoli cuit", aliases: ["brocoli", "brocolis"], per100g: { calories: 35, protein: 2.4, carbs: 7, fat: 0.4, fiber: 3.3 } },
  { name: "Haricots verts cuits", aliases: ["haricots verts", "haricot vert"], per100g: { calories: 31, protein: 1.8, carbs: 7, fat: 0.1, fiber: 3.4 } },
  { name: "Courgette cuite", aliases: ["courgette", "courgettes"], per100g: { calories: 17, protein: 1.2, carbs: 3, fat: 0.3, fiber: 1 } },
  { name: "Tomate", aliases: ["tomate", "tomates"], per100g: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 } },
  { name: "Tomates cerises", aliases: ["tomates cerises", "tomate cerise", "cherry tomato"], per100g: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 } },
  { name: "Carotte cuite", aliases: ["carotte", "carottes"], per100g: { calories: 36, protein: 0.8, carbs: 8, fat: 0.2, fiber: 3 } },
  { name: "Épinards cuits", aliases: ["epinards", "épinards", "epinard"], per100g: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.3, fiber: 2.2 } },
  { name: "Salade verte", aliases: ["salade", "laitue", "salade verte", "mesclun", "mache", "roquette"], per100g: { calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.3 } },
  { name: "Champignons", aliases: ["champignon", "champignons", "champignon de paris"], per100g: { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1 } },
  { name: "Poivron", aliases: ["poivron", "poivrons", "poivron rouge", "poivron vert", "poivron jaune"], per100g: { calories: 26, protein: 1, carbs: 6, fat: 0.3, fiber: 1.7 } },
  { name: "Oignon", aliases: ["oignon", "oignons", "echalote", "échalote"], per100g: { calories: 40, protein: 1.1, carbs: 9, fat: 0.1, fiber: 1.7 } },
  { name: "Concombre", aliases: ["concombre"], per100g: { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5 } },
  { name: "Chou-fleur cuit", aliases: ["chou fleur", "chou-fleur"], per100g: { calories: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2 } },
  { name: "Chou blanc/vert", aliases: ["chou", "chou blanc", "chou vert"], per100g: { calories: 25, protein: 1.3, carbs: 6, fat: 0.1, fiber: 2.5 } },
  { name: "Chou rouge", aliases: ["chou rouge"], per100g: { calories: 31, protein: 1.4, carbs: 7, fat: 0.2, fiber: 2.1 } },
  { name: "Chou de Bruxelles", aliases: ["chou de bruxelles", "choux de bruxelles"], per100g: { calories: 43, protein: 3.4, carbs: 9, fat: 0.3, fiber: 3.8 } },
  { name: "Aubergine cuite", aliases: ["aubergine", "aubergines"], per100g: { calories: 25, protein: 1, carbs: 6, fat: 0.2, fiber: 3 } },
  { name: "Asperges cuites", aliases: ["asperge", "asperges"], per100g: { calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1, fiber: 1.8 } },
  { name: "Artichaut cuit", aliases: ["artichaut"], per100g: { calories: 47, protein: 3.3, carbs: 11, fat: 0.2, fiber: 5.4 } },
  { name: "Betterave cuite", aliases: ["betterave", "betteraves"], per100g: { calories: 44, protein: 1.7, carbs: 10, fat: 0.2, fiber: 2.8 } },
  { name: "Céleri branche", aliases: ["celeri", "céleri"], per100g: { calories: 16, protein: 0.7, carbs: 3, fat: 0.2, fiber: 1.6 } },
  { name: "Fenouil", aliases: ["fenouil"], per100g: { calories: 31, protein: 1.2, carbs: 7, fat: 0.2, fiber: 3.1 } },
  { name: "Navet cuit", aliases: ["navet", "navets"], per100g: { calories: 28, protein: 0.9, carbs: 6, fat: 0.1, fiber: 1.8 } },
  { name: "Petit pois cuits", aliases: ["petits pois", "petit pois"], per100g: { calories: 81, protein: 5.4, carbs: 14, fat: 0.4, fiber: 5.1 } },
  { name: "Maïs doux", aliases: ["mais", "maïs", "mais doux", "corn"], per100g: { calories: 86, protein: 3.3, carbs: 19, fat: 1.2, fiber: 2.7 } },
  { name: "Poireau cuit", aliases: ["poireau", "poireaux"], per100g: { calories: 24, protein: 1, carbs: 5, fat: 0.2, fiber: 1.8 } },
  { name: "Radis", aliases: ["radis"], per100g: { calories: 16, protein: 0.7, carbs: 3.4, fat: 0.1, fiber: 1.6 } },
  { name: "Edamame", aliases: ["edamame", "fèves de soja"], per100g: { calories: 122, protein: 11, carbs: 9, fat: 5, fiber: 5 } },
  { name: "Avocat", aliases: ["guacamole"], per100g: { calories: 160, protein: 2, carbs: 8.5, fat: 15, fiber: 6.7 } },

  // ═══════════════════════════════════════════════
  // MATIÈRES GRASSES & OLÉAGINEUX
  // ═══════════════════════════════════════════════
  { name: "Huile d'olive", aliases: ["huile olive", "huile d'olive"], per100g: { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 } },
  { name: "Huile de coco", aliases: ["huile coco", "huile de coco"], per100g: { calories: 862, protein: 0, carbs: 0, fat: 100, fiber: 0 } },
  { name: "Huile de tournesol", aliases: ["huile tournesol", "huile de tournesol"], per100g: { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 } },
  { name: "Huile de colza", aliases: ["huile colza", "huile de colza"], per100g: { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 } },
  { name: "Beurre de cacahuète", aliases: ["beurre de cacahuete", "beurre de cacahuète", "peanut butter"], per100g: { calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6 } },
  { name: "Beurre d'amande", aliases: ["beurre d'amande", "purée d'amande", "puree d'amande"], per100g: { calories: 614, protein: 21, carbs: 19, fat: 56, fiber: 4 } },
  { name: "Amandes", aliases: ["amande", "amandes"], per100g: { calories: 576, protein: 21, carbs: 22, fat: 49, fiber: 12.5 } },
  { name: "Noix", aliases: ["noix", "cerneaux de noix"], per100g: { calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7 } },
  { name: "Noix de cajou", aliases: ["cajou", "noix de cajou", "cashew"], per100g: { calories: 553, protein: 18, carbs: 30, fat: 44, fiber: 3.3 } },
  { name: "Noisettes", aliases: ["noisette", "noisettes"], per100g: { calories: 628, protein: 15, carbs: 17, fat: 61, fiber: 9.7 } },
  { name: "Pistaches", aliases: ["pistache", "pistaches"], per100g: { calories: 560, protein: 20, carbs: 28, fat: 45, fiber: 10 } },
  { name: "Noix de macadamia", aliases: ["macadamia"], per100g: { calories: 718, protein: 8, carbs: 14, fat: 76, fiber: 8.6 } },
  { name: "Noix du Brésil", aliases: ["noix du bresil", "noix du brésil"], per100g: { calories: 659, protein: 14, carbs: 12, fat: 67, fiber: 7.5 } },
  { name: "Noix de pécan", aliases: ["pecan", "noix de pecan"], per100g: { calories: 691, protein: 9, carbs: 14, fat: 72, fiber: 9.6 } },
  { name: "Graines de tournesol", aliases: ["graines tournesol", "tournesol"], per100g: { calories: 584, protein: 21, carbs: 20, fat: 51, fiber: 8.6 } },
  { name: "Graines de courge", aliases: ["graines courge", "graines de potiron"], per100g: { calories: 559, protein: 30, carbs: 11, fat: 49, fiber: 6 } },
  { name: "Graines de chia", aliases: ["chia", "graines de chia"], per100g: { calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34 } },
  { name: "Graines de lin", aliases: ["lin", "graines de lin"], per100g: { calories: 534, protein: 18, carbs: 29, fat: 42, fiber: 27 } },
  { name: "Graines de sésame", aliases: ["sesame", "sésame"], per100g: { calories: 573, protein: 18, carbs: 23, fat: 50, fiber: 12 } },
  { name: "Olives vertes", aliases: ["olives", "olive", "olives vertes"], per100g: { calories: 145, protein: 1, carbs: 3.8, fat: 15, fiber: 3.3 } },
  { name: "Olives noires", aliases: ["olives noires"], per100g: { calories: 115, protein: 0.8, carbs: 6, fat: 11, fiber: 3.2 } },

  // ═══════════════════════════════════════════════
  // BOISSONS
  // ═══════════════════════════════════════════════
  { name: "Café noir (sans sucre)", aliases: ["cafe", "café", "cafe noir", "café noir", "coffee"], per100g: { calories: 2, protein: 0.1, carbs: 0, fat: 0, fiber: 0 } },
  { name: "Espresso", aliases: ["espresso", "expresso", "ristretto", "café serré"], per100g: { calories: 2, protein: 0.1, carbs: 0, fat: 0, fiber: 0 } },
  { name: "Cappuccino", aliases: ["cappuccino", "cappucino"], per100g: { calories: 45, protein: 2.2, carbs: 4.5, fat: 1.8, fiber: 0 } },
  { name: "Café au lait", aliases: ["cafe au lait", "café au lait", "cafe latte", "caffè latte", "latte"], per100g: { calories: 29, protein: 1.6, carbs: 2.8, fat: 1.2, fiber: 0 } },
  { name: "Thé vert (sans sucre)", aliases: ["the vert", "thé vert", "the", "thé", "green tea"], per100g: { calories: 1, protein: 0, carbs: 0.2, fat: 0, fiber: 0 } },
  { name: "Thé noir (sans sucre)", aliases: ["the noir", "thé noir", "black tea", "earl grey"], per100g: { calories: 1, protein: 0, carbs: 0.3, fat: 0, fiber: 0 } },
  { name: "Infusion/Tisane", aliases: ["infusion", "tisane", "camomille", "verveine", "tilleul", "rooibos"], per100g: { calories: 1, protein: 0, carbs: 0.2, fat: 0, fiber: 0 } },
  { name: "Matcha latte", aliases: ["matcha", "matcha latte"], per100g: { calories: 45, protein: 2, carbs: 5, fat: 1.5, fiber: 0.3 } },
  { name: "Chocolat chaud", aliases: ["chocolat chaud", "cacao chaud", "hot chocolate"], per100g: { calories: 77, protein: 3.2, carbs: 10, fat: 2.5, fiber: 0.7 } },
  { name: "Jus d'orange (100%)", aliases: ["jus d'orange", "jus orange", "orange juice"], per100g: { calories: 45, protein: 0.7, carbs: 10, fat: 0.2, fiber: 0.2 } },
  { name: "Jus de pomme (100%)", aliases: ["jus de pomme", "jus pomme", "apple juice"], per100g: { calories: 46, protein: 0.1, carbs: 11, fat: 0.1, fiber: 0.1 } },
  { name: "Jus multifruits", aliases: ["jus multifruits", "jus multifruit", "jus de fruits"], per100g: { calories: 50, protein: 0.3, carbs: 12, fat: 0.1, fiber: 0.2 } },
  { name: "Smoothie fruits", aliases: ["smoothie", "smoothie fruits"], per100g: { calories: 65, protein: 0.8, carbs: 15, fat: 0.3, fiber: 1.5 } },
  { name: "Coca-Cola", aliases: ["coca", "coca-cola", "coca cola", "coke"], per100g: { calories: 42, protein: 0, carbs: 10.6, fat: 0, fiber: 0 } },
  { name: "Coca-Cola Zero", aliases: ["coca zero", "coke zero", "coca light", "coca zero sugar"], per100g: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 } },
  { name: "Fanta Orange", aliases: ["fanta", "fanta orange", "orangina"], per100g: { calories: 39, protein: 0, carbs: 9.8, fat: 0, fiber: 0 } },
  { name: "Sprite / 7Up", aliases: ["sprite", "7up", "limonade"], per100g: { calories: 36, protein: 0, carbs: 9, fat: 0, fiber: 0 } },
  { name: "Red Bull", aliases: ["red bull", "redbull"], per100g: { calories: 46, protein: 0, carbs: 11, fat: 0, fiber: 0 } },
  { name: "Red Bull Sugar Free", aliases: ["red bull zero", "red bull sugar free", "redbull zero"], per100g: { calories: 3, protein: 0, carbs: 0, fat: 0, fiber: 0 } },
  { name: "Monster Energy", aliases: ["monster", "monster energy"], per100g: { calories: 47, protein: 0, carbs: 12, fat: 0, fiber: 0 } },
  { name: "Ice Tea pêche", aliases: ["ice tea", "iced tea", "lipton", "thé glacé"], per100g: { calories: 30, protein: 0, carbs: 7.2, fat: 0, fiber: 0 } },
  { name: "Eau pétillante", aliases: ["eau gazeuse", "eau petillante", "perrier", "san pellegrino", "badoit"], per100g: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 } },
  { name: "Eau plate", aliases: ["eau", "eau plate", "eau minerale", "evian", "volvic", "cristaline"], per100g: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 } },
  { name: "Sirop (dilué)", aliases: ["sirop", "sirop de menthe", "sirop de grenadine", "sirop fraise"], per100g: { calories: 30, protein: 0, carbs: 7.5, fat: 0, fiber: 0 } },
  { name: "Bière (5%)", aliases: ["biere", "bière", "beer"], per100g: { calories: 43, protein: 0.5, carbs: 3.6, fat: 0, fiber: 0 } },
  { name: "Vin rouge", aliases: ["vin rouge", "vin"], per100g: { calories: 85, protein: 0.1, carbs: 2.6, fat: 0, fiber: 0 } },
  { name: "Vin blanc", aliases: ["vin blanc"], per100g: { calories: 82, protein: 0.1, carbs: 2.6, fat: 0, fiber: 0 } },
  { name: "Champagne", aliases: ["champagne", "mousseux", "prosecco", "cava"], per100g: { calories: 80, protein: 0.1, carbs: 1.4, fat: 0, fiber: 0 } },

  // ═══════════════════════════════════════════════
  // BOISSONS STARBUCKS & COFFEE SHOPS
  // ═══════════════════════════════════════════════
  { name: "Starbucks — Caffè Latte (Grande, lait entier)", aliases: ["starbucks latte", "caffe latte starbucks"], per100g: { calories: 38, protein: 2, carbs: 3.5, fat: 1.5, fiber: 0 } },
  { name: "Starbucks — Caramel Macchiato (Grande)", aliases: ["caramel macchiato", "starbucks caramel macchiato"], per100g: { calories: 51, protein: 1.9, carbs: 7.4, fat: 1.5, fiber: 0 } },
  { name: "Starbucks — Frappuccino Mocha (Grande)", aliases: ["frappuccino", "frappuccino mocha", "starbucks frappuccino"], per100g: { calories: 56, protein: 1, carbs: 10, fat: 1.5, fiber: 0.1 } },
  { name: "Starbucks — Flat White (Grande)", aliases: ["flat white", "starbucks flat white"], per100g: { calories: 38, protein: 2, carbs: 3.5, fat: 1.5, fiber: 0 } },
  { name: "Starbucks — Chai Tea Latte (Grande)", aliases: ["chai latte", "chai tea latte", "starbucks chai"], per100g: { calories: 51, protein: 1.4, carbs: 8.5, fat: 1.3, fiber: 0 } },
  { name: "Starbucks — Mocha (Grande)", aliases: ["mocha starbucks", "starbucks mocha"], per100g: { calories: 53, protein: 1.8, carbs: 8, fat: 1.6, fiber: 0.2 } },
  { name: "Starbucks — Americano", aliases: ["americano starbucks", "starbucks americano", "americano"], per100g: { calories: 2, protein: 0.1, carbs: 0, fat: 0, fiber: 0 } },
  { name: "Starbucks — Iced Matcha Latte (Grande)", aliases: ["iced matcha starbucks", "starbucks matcha"], per100g: { calories: 36, protein: 1.5, carbs: 5, fat: 1.2, fiber: 0 } },

  // ═══════════════════════════════════════════════
  // PETIT DÉJEUNER & CÉRÉALES
  // ═══════════════════════════════════════════════
  { name: "Muesli", aliases: ["muesli", "müsli"], per100g: { calories: 370, protein: 10, carbs: 60, fat: 9, fiber: 8 } },
  { name: "Granola", aliases: ["granola"], per100g: { calories: 471, protein: 10, carbs: 60, fat: 20, fiber: 6 } },
  { name: "Corn flakes", aliases: ["corn flakes", "cornflakes", "cereales", "céréales"], per100g: { calories: 378, protein: 7, carbs: 84, fat: 0.9, fiber: 3.3 } },
  { name: "Céréales chocolat (type Chocapic)", aliases: ["chocapic", "cereales chocolat", "coco pops", "nesquik cereales"], per100g: { calories: 390, protein: 6, carbs: 77, fat: 5, fiber: 5 } },
  { name: "All Bran", aliases: ["all bran", "all-bran", "bran flakes", "fibre"], per100g: { calories: 334, protein: 14, carbs: 48, fat: 3.5, fiber: 27 } },
  { name: "Confiture", aliases: ["confiture", "marmelade", "gelée"], per100g: { calories: 260, protein: 0.4, carbs: 64, fat: 0.1, fiber: 0.8 } },
  { name: "Pâte à tartiner chocolat-noisettes", aliases: ["nutella", "pate a tartiner", "pâte à tartiner", "nocciolata"], per100g: { calories: 539, protein: 6, carbs: 57, fat: 31, fiber: 3.4 } },
  { name: "Pain d'épices", aliases: ["pain d'epices", "pain d'épices"], per100g: { calories: 340, protein: 4, carbs: 72, fat: 3, fiber: 2.5 } },
  { name: "Biscotte", aliases: ["biscotte", "biscottes"], per100g: { calories: 407, protein: 10, carbs: 74, fat: 7, fiber: 3.5 } },
  { name: "Açaí bowl", aliases: ["acai", "açaí", "acai bowl"], per100g: { calories: 70, protein: 1, carbs: 12, fat: 2, fiber: 3 } },

  // ═══════════════════════════════════════════════
  // SNACKS, BISCUITS & SUCRERIES
  // ═══════════════════════════════════════════════
  { name: "Chocolat noir 70%", aliases: ["chocolat", "chocolat noir"], per100g: { calories: 598, protein: 7.8, carbs: 46, fat: 43, fiber: 11 } },
  { name: "Chocolat au lait", aliases: ["chocolat au lait", "chocolat lait"], per100g: { calories: 535, protein: 7, carbs: 59, fat: 30, fiber: 1.5 } },
  { name: "Chocolat blanc", aliases: ["chocolat blanc"], per100g: { calories: 539, protein: 6, carbs: 59, fat: 32, fiber: 0 } },
  { name: "Chips nature", aliases: ["chips", "chips nature"], per100g: { calories: 536, protein: 6, carbs: 53, fat: 33, fiber: 4.4 } },
  { name: "Chips de légumes", aliases: ["chips légumes", "chips de légumes"], per100g: { calories: 480, protein: 4, carbs: 55, fat: 26, fiber: 5 } },
  { name: "Cacahuètes grillées salées", aliases: ["cacahuetes", "cacahuètes", "arachides", "peanuts"], per100g: { calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 8.5 } },
  { name: "Cookies", aliases: ["cookie", "cookies"], per100g: { calories: 488, protein: 5, carbs: 64, fat: 24, fiber: 2 } },
  { name: "Barre de céréales", aliases: ["barre cereales", "barre de céréales", "nature valley", "grany"], per100g: { calories: 420, protein: 6, carbs: 65, fat: 15, fiber: 4 } },
  { name: "Barre protéinée", aliases: ["barre proteinee", "barre protéinée", "protein bar", "barre whey"], per100g: { calories: 350, protein: 30, carbs: 32, fat: 12, fiber: 5 } },
  { name: "Popcorn nature", aliases: ["popcorn", "pop corn", "pop-corn"], per100g: { calories: 387, protein: 13, carbs: 78, fat: 4.5, fiber: 15 } },
  { name: "Popcorn sucré", aliases: ["popcorn sucre", "popcorn sucré", "popcorn caramel"], per100g: { calories: 450, protein: 4, carbs: 76, fat: 15, fiber: 4 } },
  { name: "Glace vanille", aliases: ["glace", "glace vanille", "ice cream"], per100g: { calories: 207, protein: 3.5, carbs: 24, fat: 11, fiber: 0 } },
  { name: "Sorbet fruits", aliases: ["sorbet", "sorbet fruits"], per100g: { calories: 130, protein: 0.2, carbs: 33, fat: 0.1, fiber: 0.5 } },
  { name: "Brownie", aliases: ["brownie"], per100g: { calories: 405, protein: 5, carbs: 50, fat: 20, fiber: 2 } },
  { name: "Muffin", aliases: ["muffin", "muffins"], per100g: { calories: 377, protein: 6, carbs: 50, fat: 17, fiber: 1.5 } },
  { name: "Tiramisu", aliases: ["tiramisu"], per100g: { calories: 283, protein: 6, carbs: 28, fat: 16, fiber: 0.3 } },
  { name: "Crème brûlée", aliases: ["creme brulee", "crème brûlée"], per100g: { calories: 240, protein: 4, carbs: 22, fat: 15, fiber: 0 } },
  { name: "Mousse au chocolat", aliases: ["mousse chocolat", "mousse au chocolat"], per100g: { calories: 230, protein: 5, carbs: 22, fat: 13, fiber: 1 } },
  { name: "Fondant au chocolat", aliases: ["fondant chocolat", "moelleux chocolat", "coulant"], per100g: { calories: 380, protein: 6, carbs: 42, fat: 21, fiber: 2 } },
  { name: "Tarte aux pommes", aliases: ["tarte pommes", "tarte aux pommes"], per100g: { calories: 265, protein: 3, carbs: 38, fat: 11, fiber: 1.5 } },
  { name: "Cheesecake", aliases: ["cheesecake", "cheese cake"], per100g: { calories: 321, protein: 6, carbs: 26, fat: 22, fiber: 0.3 } },
  { name: "Croissant aux amandes", aliases: ["croissant amandes", "croissant aux amandes"], per100g: { calories: 430, protein: 9, carbs: 42, fat: 25, fiber: 2 } },
  { name: "Palmier (feuilleté)", aliases: ["palmier", "sacristain"], per100g: { calories: 530, protein: 5, carbs: 56, fat: 32, fiber: 1.5 } },
  { name: "Madeleine", aliases: ["madeleine", "madeleines"], per100g: { calories: 427, protein: 6, carbs: 50, fat: 23, fiber: 1 } },
  { name: "Éclair au chocolat", aliases: ["eclair", "éclair", "eclair chocolat"], per100g: { calories: 262, protein: 6, carbs: 24, fat: 16, fiber: 0.5 } },

  // ═══════════════════════════════════════════════
  // CONDIMENTS, SAUCES & ASSAISONNEMENTS
  // ═══════════════════════════════════════════════
  { name: "Ketchup", aliases: ["ketchup"], per100g: { calories: 112, protein: 1.2, carbs: 26, fat: 0.1, fiber: 0.3 } },
  { name: "Mayonnaise", aliases: ["mayonnaise", "mayo"], per100g: { calories: 680, protein: 1, carbs: 1, fat: 75, fiber: 0 } },
  { name: "Mayonnaise allégée", aliases: ["mayo legere", "mayo allégée", "mayonnaise allegee"], per100g: { calories: 330, protein: 0.8, carbs: 7, fat: 33, fiber: 0 } },
  { name: "Moutarde", aliases: ["moutarde", "moutarde de dijon"], per100g: { calories: 66, protein: 4, carbs: 5, fat: 3, fiber: 3 } },
  { name: "Sauce soja", aliases: ["sauce soja", "soy sauce", "shoyu", "tamari"], per100g: { calories: 53, protein: 5, carbs: 5, fat: 0, fiber: 0.8 } },
  { name: "Sauce tomate", aliases: ["sauce tomate", "coulis de tomate", "passata"], per100g: { calories: 29, protein: 1, carbs: 6, fat: 0.2, fiber: 1.5 } },
  { name: "Vinaigrette", aliases: ["vinaigrette", "sauce salade"], per100g: { calories: 300, protein: 0.3, carbs: 5, fat: 30, fiber: 0 } },
  { name: "Pesto", aliases: ["pesto", "pesto vert", "pesto rosso"], per100g: { calories: 387, protein: 5, carbs: 4, fat: 39, fiber: 1.5 } },
  { name: "Crème de soja cuisine", aliases: ["creme soja", "crème soja", "soja cuisine"], per100g: { calories: 47, protein: 1.4, carbs: 3.8, fat: 2.8, fiber: 0.3 } },
  { name: "Sauce Sriracha", aliases: ["sriracha"], per100g: { calories: 93, protein: 1, carbs: 19, fat: 1, fiber: 1 } },
  { name: "Sauce barbecue", aliases: ["sauce bbq", "sauce barbecue"], per100g: { calories: 172, protein: 0.8, carbs: 40, fat: 0.6, fiber: 0.5 } },
  { name: "Sauce teriyaki", aliases: ["teriyaki", "sauce teriyaki"], per100g: { calories: 89, protein: 5, carbs: 16, fat: 0, fiber: 0.1 } },
  { name: "Harissa", aliases: ["harissa"], per100g: { calories: 55, protein: 2, carbs: 8, fat: 1.5, fiber: 4 } },
  { name: "Tahini / Crème de sésame", aliases: ["tahini", "tahina", "creme de sesame", "purée de sésame"], per100g: { calories: 595, protein: 17, carbs: 21, fat: 54, fiber: 9 } },
  { name: "Sauce nuoc mam", aliases: ["nuoc mam", "fish sauce", "sauce poisson"], per100g: { calories: 35, protein: 5, carbs: 3.6, fat: 0, fiber: 0 } },
  { name: "Vinaigre balsamique", aliases: ["vinaigre balsamique", "balsamique"], per100g: { calories: 88, protein: 0.5, carbs: 17, fat: 0, fiber: 0 } },
  { name: "Sauce curry", aliases: ["sauce curry", "curry", "curry paste"], per100g: { calories: 107, protein: 2, carbs: 8, fat: 7, fiber: 1.5 } },

  // ═══════════════════════════════════════════════
  // PLATS PRÉPARÉS & CUISINE DU MONDE
  // ═══════════════════════════════════════════════
  { name: "Pizza Margherita", aliases: ["pizza", "pizza margherita"], per100g: { calories: 234, protein: 9, carbs: 28, fat: 9, fiber: 1.8 } },
  { name: "Pizza 4 fromages", aliases: ["pizza 4 fromages", "pizza quatre fromages"], per100g: { calories: 260, protein: 11, carbs: 27, fat: 12, fiber: 1.5 } },
  { name: "Pizza Reine (jambon-champignons)", aliases: ["pizza reine", "pizza jambon champignon"], per100g: { calories: 227, protein: 10, carbs: 26, fat: 9, fiber: 1.5 } },
  { name: "Hamburger (classique)", aliases: ["hamburger", "burger", "cheeseburger"], per100g: { calories: 254, protein: 13, carbs: 24, fat: 12, fiber: 1.3 } },
  { name: "Kebab (sandwich)", aliases: ["kebab", "döner", "doner", "shawarma"], per100g: { calories: 215, protein: 12, carbs: 20, fat: 10, fiber: 1.5 } },
  { name: "Tacos (garni)", aliases: ["tacos", "taco"], per100g: { calories: 226, protein: 10, carbs: 22, fat: 11, fiber: 2 } },
  { name: "Burrito", aliases: ["burrito", "burritos"], per100g: { calories: 170, protein: 8, carbs: 20, fat: 6.5, fiber: 2 } },
  { name: "Sandwich jambon-beurre", aliases: ["sandwich", "jambon beurre", "sandwich jambon"], per100g: { calories: 265, protein: 12, carbs: 30, fat: 11, fiber: 1.5 } },
  { name: "Croque-monsieur", aliases: ["croque monsieur", "croque-monsieur"], per100g: { calories: 265, protein: 14, carbs: 21, fat: 14, fiber: 1 } },
  { name: "Quiche lorraine", aliases: ["quiche", "quiche lorraine"], per100g: { calories: 236, protein: 10, carbs: 17, fat: 14, fiber: 0.5 } },
  { name: "Lasagnes bolognaise", aliases: ["lasagnes", "lasagne", "lasagne bolognaise"], per100g: { calories: 148, protein: 8, carbs: 14, fat: 7, fiber: 1 } },
  { name: "Gratin dauphinois", aliases: ["gratin dauphinois", "gratin de pommes de terre"], per100g: { calories: 137, protein: 4.5, carbs: 12, fat: 8, fiber: 1 } },
  { name: "Ratatouille", aliases: ["ratatouille"], per100g: { calories: 38, protein: 0.9, carbs: 5, fat: 1.5, fiber: 1.8 } },
  { name: "Couscous (plat complet)", aliases: ["couscous plat", "couscous complet", "couscous royal"], per100g: { calories: 130, protein: 7, carbs: 15, fat: 4.5, fiber: 2 } },
  { name: "Tajine poulet-citron", aliases: ["tajine", "tagine"], per100g: { calories: 110, protein: 10, carbs: 6, fat: 5, fiber: 1.5 } },
  { name: "Pad Thaï", aliases: ["pad thai", "pad thaï"], per100g: { calories: 150, protein: 7, carbs: 19, fat: 5, fiber: 1 } },
  { name: "Sushi (nigiris saumon)", aliases: ["sushi", "sushi saumon", "nigiri"], per100g: { calories: 150, protein: 7.5, carbs: 22, fat: 3, fiber: 0.5 } },
  { name: "California roll", aliases: ["california roll", "maki california", "california maki"], per100g: { calories: 140, protein: 5, carbs: 21, fat: 4, fiber: 1 } },
  { name: "Maki saumon", aliases: ["maki", "maki saumon"], per100g: { calories: 140, protein: 6, carbs: 22, fat: 3, fiber: 0.5 } },
  { name: "Sashimi saumon", aliases: ["sashimi", "sashimi saumon"], per100g: { calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 } },
  { name: "Ramen (bouillon + nouilles)", aliases: ["ramen", "ramen japonais"], per100g: { calories: 60, protein: 3, carbs: 8, fat: 2, fiber: 0.5 } },
  { name: "Pho (soupe vietnamienne)", aliases: ["pho", "phở", "soupe pho"], per100g: { calories: 30, protein: 2, carbs: 4, fat: 0.5, fiber: 0.3 } },
  { name: "Bo bun", aliases: ["bo bun", "bò bún", "bobun"], per100g: { calories: 120, protein: 7, carbs: 15, fat: 4, fiber: 1.5 } },
  { name: "Nems / Rouleaux de printemps frits", aliases: ["nems", "nem", "rouleau impérial"], per100g: { calories: 200, protein: 6, carbs: 22, fat: 10, fiber: 1 } },
  { name: "Rouleaux de printemps (frais)", aliases: ["rouleau de printemps", "rouleaux de printemps", "summer roll"], per100g: { calories: 105, protein: 5, carbs: 16, fat: 2, fiber: 1 } },
  { name: "Curry de poulet", aliases: ["curry poulet", "poulet curry", "chicken curry", "butter chicken"], per100g: { calories: 140, protein: 11, carbs: 6, fat: 8, fiber: 1 } },
  { name: "Dhal de lentilles", aliases: ["dhal", "dal", "daal", "lentilles indiennes"], per100g: { calories: 90, protein: 5, carbs: 13, fat: 2, fiber: 3 } },
  { name: "Samossa", aliases: ["samossa", "samosa"], per100g: { calories: 261, protein: 5, carbs: 28, fat: 14, fiber: 2 } },
  { name: "Falafel", aliases: ["falafel", "falafels"], per100g: { calories: 333, protein: 13, carbs: 31, fat: 18, fiber: 5 } },
  { name: "Chili con carne", aliases: ["chili", "chili con carne"], per100g: { calories: 100, protein: 8, carbs: 8, fat: 4, fiber: 3 } },
  { name: "Hachis parmentier", aliases: ["hachis parmentier", "parmentier"], per100g: { calories: 126, protein: 6, carbs: 12, fat: 6, fiber: 1 } },
  { name: "Raviolis", aliases: ["ravioli", "raviolis"], per100g: { calories: 175, protein: 7, carbs: 25, fat: 5, fiber: 1.5 } },
  { name: "Soupe de légumes", aliases: ["soupe", "velouté", "soupe legumes", "potage"], per100g: { calories: 30, protein: 0.8, carbs: 5, fat: 0.8, fiber: 1 } },
  { name: "Soupe miso", aliases: ["miso", "soupe miso"], per100g: { calories: 21, protein: 1.5, carbs: 2.3, fat: 0.6, fiber: 0.3 } },
  { name: "Gazpacho", aliases: ["gazpacho"], per100g: { calories: 25, protein: 0.5, carbs: 4, fat: 0.7, fiber: 0.8 } },
  { name: "Poke bowl (base)", aliases: ["poke bowl", "poké bowl", "poke"], per100g: { calories: 120, protein: 8, carbs: 14, fat: 4, fiber: 1.5 } },
  { name: "Galette complète (sarrasin)", aliases: ["galette bretonne", "galette sarrasin", "galette complète", "galette complete"], per100g: { calories: 168, protein: 9, carbs: 15, fat: 8, fiber: 2 } },
  { name: "Wok de légumes", aliases: ["wok", "legumes sautés", "stir fry"], per100g: { calories: 55, protein: 2, carbs: 7, fat: 2, fiber: 2 } },
  { name: "Risotto", aliases: ["risotto"], per100g: { calories: 140, protein: 3.5, carbs: 20, fat: 5, fiber: 0.5 } },
  { name: "Paella", aliases: ["paella"], per100g: { calories: 145, protein: 8, carbs: 17, fat: 5, fiber: 1 } },
  { name: "Moussaka", aliases: ["moussaka"], per100g: { calories: 140, protein: 7, carbs: 9, fat: 8, fiber: 1.5 } },
  { name: "Bibimbap", aliases: ["bibimbap"], per100g: { calories: 130, protein: 6, carbs: 17, fat: 4, fiber: 1.5 } },
  { name: "Gyoza / Raviolis vapeur", aliases: ["gyoza", "ravioli vapeur", "dumpling", "dim sum"], per100g: { calories: 180, protein: 7, carbs: 22, fat: 7, fiber: 1 } },

  // ═══════════════════════════════════════════════
  // FAST FOOD (MACROS MOYENNES)
  // ═══════════════════════════════════════════════
  { name: "McDonald's — Big Mac", aliases: ["big mac", "bigmac"], per100g: { calories: 241, protein: 13, carbs: 21, fat: 12, fiber: 1.5 } },
  { name: "McDonald's — McChicken", aliases: ["mcchicken", "mc chicken"], per100g: { calories: 246, protein: 11, carbs: 24, fat: 12, fiber: 1 } },
  { name: "McDonald's — McMuffin Egg", aliases: ["mcmuffin", "egg mcmuffin"], per100g: { calories: 216, protein: 13, carbs: 21, fat: 9, fiber: 1 } },
  { name: "McDonald's — Frites (portion moyenne)", aliases: ["frites mcdo", "mcdo frites", "frites mcdonald"], per100g: { calories: 312, protein: 3.4, carbs: 41, fat: 15, fiber: 3.8 } },
  { name: "KFC — Poulet original (cuisse)", aliases: ["kfc", "poulet kfc", "kfc poulet"], per100g: { calories: 260, protein: 17, carbs: 10, fat: 17, fiber: 0.5 } },
  { name: "Subway — Poulet teriyaki 15cm", aliases: ["subway", "sandwich subway", "subway poulet"], per100g: { calories: 155, protein: 10, carbs: 19, fat: 4, fiber: 1.5 } },
  { name: "Burger King — Whopper", aliases: ["whopper", "burger king whopper"], per100g: { calories: 230, protein: 11, carbs: 18, fat: 13, fiber: 1 } },
  { name: "Five Guys — Cheeseburger", aliases: ["five guys", "five guys burger"], per100g: { calories: 280, protein: 16, carbs: 16, fat: 18, fiber: 1 } },

  // ═══════════════════════════════════════════════
  // PROTÉINES EN POUDRE & COMPLÉMENTS
  // ═══════════════════════════════════════════════
  { name: "Whey protéine (poudre)", aliases: ["whey", "whey protein", "proteine en poudre", "whey isolate", "protein powder"], per100g: { calories: 380, protein: 80, carbs: 7, fat: 5, fiber: 0 } },
  { name: "Caséine (poudre)", aliases: ["caseine", "caséine", "casein"], per100g: { calories: 370, protein: 75, carbs: 8, fat: 4, fiber: 0 } },
  { name: "Protéine végétale (poudre)", aliases: ["proteine vegetale", "vegan protein", "pea protein", "protéine pois"], per100g: { calories: 370, protein: 72, carbs: 10, fat: 6, fiber: 5 } },
  { name: "Créatine monohydrate", aliases: ["creatine", "créatine"], per100g: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 } },

  // ═══════════════════════════════════════════════
  // DIVERS
  // ═══════════════════════════════════════════════
  { name: "Miel", aliases: ["miel"], per100g: { calories: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2 } },
  { name: "Sirop d'érable", aliases: ["sirop d'erable", "sirop d'érable", "maple syrup"], per100g: { calories: 260, protein: 0, carbs: 67, fat: 0, fiber: 0 } },
  { name: "Sirop d'agave", aliases: ["sirop d'agave", "agave"], per100g: { calories: 310, protein: 0, carbs: 76, fat: 0, fiber: 0.2 } },
  { name: "Sucre blanc", aliases: ["sucre", "sucre blanc", "sucre en poudre"], per100g: { calories: 400, protein: 0, carbs: 100, fat: 0, fiber: 0 } },
  { name: "Sucre de coco", aliases: ["sucre de coco", "sucre coco"], per100g: { calories: 375, protein: 1, carbs: 92, fat: 0.5, fiber: 2 } },
  { name: "Tofu", aliases: ["tofu", "tofou"], per100g: { calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3 } },
  { name: "Tofu fumé", aliases: ["tofu fumé", "tofu fume"], per100g: { calories: 176, protein: 19, carbs: 1, fat: 11, fiber: 0 } },
  { name: "Tempeh", aliases: ["tempeh"], per100g: { calories: 192, protein: 20, carbs: 8, fat: 11, fiber: 5 } },
  { name: "Seitan", aliases: ["seitan"], per100g: { calories: 126, protein: 22, carbs: 4, fat: 2, fiber: 0.6 } },
  { name: "Houmous", aliases: ["houmous", "hummus", "houmos"], per100g: { calories: 166, protein: 7.9, carbs: 14, fat: 9.6, fiber: 6 } },
  { name: "Guacamole", aliases: ["guacamole", "guacamole avocat"], per100g: { calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7 } },
  { name: "Tzatziki", aliases: ["tzatziki", "tzatzíki"], per100g: { calories: 55, protein: 3, carbs: 3.5, fat: 3, fiber: 0.3 } },
  { name: "Tarama", aliases: ["tarama"], per100g: { calories: 494, protein: 4, carbs: 5, fat: 51, fiber: 0 } },
  { name: "Pâté de campagne", aliases: ["pate", "pâté", "rillettes", "terrine"], per100g: { calories: 310, protein: 15, carbs: 2, fat: 27, fiber: 0 } },
  { name: "Saucisson sec", aliases: ["saucisson", "saucisson sec", "salami", "rosette"], per100g: { calories: 450, protein: 26, carbs: 2, fat: 38, fiber: 0 } },
  { name: "Chorizo", aliases: ["chorizo"], per100g: { calories: 455, protein: 24, carbs: 2, fat: 39, fiber: 0 } },
  { name: "Cornichons", aliases: ["cornichon", "cornichons"], per100g: { calories: 11, protein: 0.3, carbs: 2.3, fat: 0.2, fiber: 1.2 } },
  { name: "Cacao en poudre (non sucré)", aliases: ["cacao", "poudre de cacao", "cocoa"], per100g: { calories: 228, protein: 20, carbs: 58, fat: 14, fiber: 33 } },
  { name: "Protéine de soja texturée", aliases: ["proteine de soja", "PST", "soja texturé"], per100g: { calories: 330, protein: 50, carbs: 30, fat: 1, fiber: 18 } },
  { name: "Nori (algue)", aliases: ["nori", "algue nori", "feuille de nori"], per100g: { calories: 35, protein: 6, carbs: 5, fat: 0.3, fiber: 0.3 } },
  { name: "Sauce piquante (type Tabasco)", aliases: ["tabasco", "sauce piquante", "hot sauce"], per100g: { calories: 12, protein: 1, carbs: 1, fat: 0.8, fiber: 0.5 } },
  { name: "Miso", aliases: ["miso", "pâte miso"], per100g: { calories: 199, protein: 12, carbs: 26, fat: 6, fiber: 5 } },
  { name: "Kimchi", aliases: ["kimchi"], per100g: { calories: 15, protein: 1.1, carbs: 2.4, fat: 0.5, fiber: 1.6 } },
  { name: "Choucroute (chou)", aliases: ["choucroute"], per100g: { calories: 19, protein: 0.9, carbs: 4.3, fat: 0.1, fiber: 2.9 } },
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
