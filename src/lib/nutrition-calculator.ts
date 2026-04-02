/**
 * Calculateur nutritionnel automatique
 * Formule BMR : Black et al. (1996)
 */

/** Black et al. (1996) — retourne le BMR en kcal/jour */
export function computeBMR(
  sex: string,
  weightKg: number,
  heightM: number,
  ageYears: number,
): number {
  const coeff = sex === "F" ? 0.963 : 1.083;
  const bmrMJ =
    coeff *
    Math.pow(weightKg, 0.48) *
    Math.pow(heightM, 0.5) *
    Math.pow(ageYears, -0.13);
  return Math.round(bmrMJ * 239.006); // MJ → kcal
}

/** Mapping activité physique du bilan → coefficient NAP */
export function mapActivityToNAP(activitePhysique: string): number {
  switch (activitePhysique) {
    case "Aucune activité":
      return 1.2;
    case "1 à 2 fois par semaine":
      return 1.375;
    case "3 à 4 fois par semaine":
      return 1.55;
    case "5 fois ou plus par semaine":
      return 1.725;
    default:
      return 1.55;
  }
}

/** Mapping objectif principal → balance énergétique */
export function mapObjectifToBalance(
  objectif: string,
): "DEFICIT" | "MAINTENANCE" | "SURPLUS" {
  switch (objectif) {
    case "Perte de poids":
      return "DEFICIT";
    case "Prise de masse musculaire":
      return "SURPLUS";
    default:
      return "MAINTENANCE";
  }
}

/**
 * Calcul de l'eau quotidienne en fonction du poids, du BMR, du TDEE et du NAP.
 *
 * Base : 0.033 L/kg de poids corporel (recommandation classique).
 * Ajustement activité : la dépense liée au sport (TDEE − BMR) génère de la
 * transpiration. On estime ~1 mL d'eau supplémentaire par kcal dépensé au-dessus
 * du BMR, soit (TDEE − BMR) / 1000 L en plus.
 * Bonus NAP : un palier supplémentaire pour les NAP élevés (≥ 1.55) qui reflète
 * les besoins accrus en hydratation liés à la récupération musculaire.
 *
 * Résultat arrondi à 0.1 L.
 */
export function computeWater(
  weightKg: number,
  bmr: number,
  tdee: number,
  nap: number,
): number {
  // Base métabolique
  const base = weightKg * 0.033;

  // Surplus lié à la dépense sportive : ~1 mL par kcal au-dessus du BMR
  const activityExtra = (tdee - bmr) / 1000;

  // Bonus palier NAP
  let napBonus = 0;
  if (nap >= 1.9) napBonus = 0.5;
  else if (nap >= 1.725) napBonus = 0.3;
  else if (nap >= 1.55) napBonus = 0.15;

  const total = base + activityExtra + napBonus;
  return Math.round(total * 10) / 10;
}

/** Déficit/surplus par défaut en kcal */
export function defaultDelta(balance: string): number {
  switch (balance) {
    case "DEFICIT":
      return -300;
    case "SURPLUS":
      return 250;
    default:
      return 0;
  }
}

export type NutritionResult = {
  bmr: number;
  nap: number;
  tdee: number; // DEJ réel (maintien)
  energyBalance: "DEFICIT" | "MAINTENANCE" | "SURPLUS";
  delta: number;
  goalCalories: number; // DEJ avec déficit/surplus
  goalProtein: number; // g/jour
  goalCarbs: number; // g/jour
  goalFat: number; // g/jour
  goalFiber: number; // g/jour
  goalWaterL: number; // L/jour
};

export type BilanData = {
  sexe?: string;
  age?: string;
  taille?: string; // cm
  poids?: string; // kg
  activite_physique?: string;
  objectif_principal?: string;
  poids_souhaite?: string;
};

/**
 * Calcule tous les objectifs nutritionnels à partir des données du bilan.
 *
 * Macros par défaut :
 *  - Protéines : 2 g/kg de poids corporel
 *  - Lipides : 1 g/kg de poids corporel
 *  - Glucides : reste des calories
 *  - Fibres : 25 g
 *  - Eau : basée sur poids + BMR + TDEE + NAP (plus on est active, plus on boit)
 */
export function computeNutritionFromBilan(data: BilanData): NutritionResult {
  const sex = data.sexe || "F";
  const age = Number(data.age) || 30;
  let heightCm = Number(data.taille) || 165;
  // Auto-correction : si la valeur est < 3, l'utilisateur a saisi en mètres
  if (heightCm < 3) heightCm = Math.round(heightCm * 100);
  const weightKg = Number(data.poids) || 60;
  const heightM = heightCm / 100;

  const bmr = computeBMR(sex, weightKg, heightM, age);
  const nap = mapActivityToNAP(data.activite_physique || "");
  const tdee = Math.round(bmr * nap);

  const energyBalance = mapObjectifToBalance(data.objectif_principal || "");
  const delta = defaultDelta(energyBalance);
  const goalCalories = tdee + delta;

  // Macros
  const goalProtein = Math.round(weightKg * 2); // 2g/kg
  const goalFat = Math.round(weightKg * 1); // 1g/kg
  const proteinCal = goalProtein * 4;
  const fatCal = goalFat * 9;
  const remainingCal = Math.max(goalCalories - proteinCal - fatCal, 0);
  const goalCarbs = Math.round(remainingCal / 4);

  const goalFiber = 25;
  const goalWaterL = computeWater(weightKg, bmr, tdee, nap);

  return {
    bmr,
    nap,
    tdee,
    energyBalance,
    delta,
    goalCalories,
    goalProtein,
    goalCarbs,
    goalFat,
    goalFiber,
    goalWaterL,
  };
}
