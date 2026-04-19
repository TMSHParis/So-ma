/**
 * Calculateur nutritionnel — méthode clinique unique.
 *
 * MB Black et al. (1996) en KJ → NAP = Σ(heures × coeff) / 24 sur 11 activités
 * → DEJ = MB × NAP × FA (facteur d'agression)
 * → Macros en % de DEJ exprimé en KJ (prot 17 KJ/g, lip 38, gluc 17)
 * → Fibres auto : 14g / 1000 kcal (ou fixe ANSES)
 */

export const KJ_TO_KCAL = 0.239;

/** MB Black (KJ/jour) = coeff × poids^0.48 × taille(m)^0.50 × âge^-0.13 × 1000 */
export function computeMB_KJ(
  sex: string,
  weightKg: number,
  heightCm: number,
  ageYears: number,
): number {
  const coeff = sex === "F" ? 0.963 : 1.083;
  const heightM = heightCm / 100;
  const mbMJ =
    coeff *
    Math.pow(weightKg, 0.48) *
    Math.pow(heightM, 0.5) *
    Math.pow(ageYears, -0.13);
  return mbMJ * 1000;
}

export type NapActivityKey =
  | "sommeil"
  | "toilettes"
  | "repas"
  | "travailAssis"
  | "deplacements"
  | "marche"
  | "sport"
  | "soinsDetente"
  | "prepRepas"
  | "voiture"
  | "enfants";

export const NAP_ACTIVITIES: Array<{
  key: NapActivityKey;
  label: string;
  coeff: number;
  default: number;
}> = [
  { key: "sommeil", label: "Sommeil", coeff: 1, default: 8 },
  { key: "toilettes", label: "Toilettes", coeff: 2, default: 0.5 },
  { key: "repas", label: "Repas (PDJ, déj, dîner)", coeff: 1.6, default: 1.5 },
  { key: "travailAssis", label: "Travail assis", coeff: 1.6, default: 8 },
  { key: "deplacements", label: "Déplacements divers", coeff: 1.5, default: 1 },
  { key: "marche", label: "Marche", coeff: 3, default: 1 },
  { key: "sport", label: "Sport", coeff: 5, default: 1 },
  { key: "soinsDetente", label: "Soins perso / détente", coeff: 1.35, default: 1.5 },
  { key: "prepRepas", label: "Préparation des repas", coeff: 2, default: 1 },
  { key: "voiture", label: "Temps en voiture", coeff: 1.5, default: 0.5 },
  { key: "enfants", label: "Soins des enfants", coeff: 2, default: 0 },
];

export type NapActivities = Record<NapActivityKey, number>;

export function defaultNapActivities(): NapActivities {
  const out = {} as NapActivities;
  for (const a of NAP_ACTIVITIES) out[a.key] = a.default;
  return out;
}

/** NAP = Σ(heures × coefficient) / 24 — fallback à 1.55 si aucune heure saisie */
export function computeNAP(
  activities: Partial<Record<NapActivityKey, number>> | Record<string, number>,
): { nap: number; totalH: number; weightedH: number } {
  let weightedH = 0;
  let totalH = 0;
  for (const a of NAP_ACTIVITIES) {
    const h = (activities as Record<string, number>)[a.key] || 0;
    weightedH += h * a.coeff;
    totalH += h;
  }
  return { nap: totalH > 0 ? weightedH / 24 : 1.55, totalH, weightedH };
}

/** Parse texte libre ("1h", "1h30", "30min", "1.5", "6h30", "0") en heures. */
export function parseHours(raw: string | undefined | null): number {
  if (raw === undefined || raw === null) return 0;
  const s = String(raw).toLowerCase().replace(/\s+/g, "").replace(",", ".");
  if (!s) return 0;
  const hm = s.match(/(\d+(?:\.\d+)?)h(\d*)/);
  if (hm) {
    const h = Number(hm[1]) || 0;
    const m = hm[2] ? Number(hm[2]) : 0;
    return h + m / 60;
  }
  const mOnly = s.match(/(\d+(?:\.\d+)?)min/);
  if (mOnly) return Number(mOnly[1]) / 60;
  const n = Number(s);
  if (Number.isFinite(n)) return n;
  return 0;
}

export type BilanData = Record<string, string | string[] | undefined>;

/** Active les activités NAP à partir des champs `temps_*` du bilan. */
export function napActivitiesFromBilan(data: BilanData): NapActivities {
  const out = defaultNapActivities();
  const get = (k: string) => {
    const v = data[k];
    return typeof v === "string" ? v : undefined;
  };
  const applyIf = (key: NapActivityKey, raw: string | undefined) => {
    if (raw === undefined || raw.trim() === "") return;
    out[key] = parseHours(raw);
  };
  applyIf("sommeil", get("temps_sommeil"));
  applyIf("toilettes", get("temps_toilettes"));
  applyIf("travailAssis", get("temps_assis"));
  const deplacements = get("temps_deplacements");
  const transports = get("temps_transports");
  if (deplacements !== undefined || transports !== undefined) {
    out.deplacements = parseHours(deplacements) + parseHours(transports);
  }
  applyIf("marche", get("temps_marche"));
  applyIf("sport", get("temps_sport"));
  applyIf("soinsDetente", get("temps_soins_detente"));
  applyIf("prepRepas", get("temps_prep_repas"));
  applyIf("voiture", get("temps_voiture"));
  applyIf("enfants", get("temps_enfants"));
  return out;
}

/** Macros en grammes à partir de DEJ en KJ et répartition en %. */
export function computeMacrosFromKJ(
  dejKJ: number,
  pctProtein: number,
  pctFat: number,
  pctCarbs: number,
): { proteinG: number; fatG: number; carbsG: number } {
  return {
    proteinG: Math.round((dejKJ * pctProtein) / 100 / 17),
    fatG: Math.round((dejKJ * pctFat) / 100 / 38),
    carbsG: Math.round((dejKJ * pctCarbs) / 100 / 17),
  };
}

/** Fibres auto : 14g pour 1000 kcal. */
export function computeFiberAuto(goalKcal: number): number {
  return Math.round((goalKcal / 1000) * 14);
}

export type EnergyBalance = "DEFICIT" | "MAINTENANCE" | "SURPLUS";

export function balanceFromObjectif(objectif: string | undefined): EnergyBalance {
  if (objectif === "Perte de poids") return "DEFICIT";
  if (objectif === "Prise de masse musculaire") return "SURPLUS";
  return "MAINTENANCE";
}

export function defaultDelta(balance: EnergyBalance): number {
  if (balance === "DEFICIT") return 300;
  if (balance === "SURPLUS") return 250;
  return 0;
}

/**
 * Eau quotidienne : 0.033 L/kg (base) + (DEJ − MB)/1000 L (surplus activité)
 *                   + palier NAP (0.15 / 0.3 / 0.5 L si NAP ≥ 1.55/1.725/1.9).
 */
export function computeWater(
  weightKg: number,
  mbKcal: number,
  dejKcal: number,
  nap: number,
): number {
  const base = weightKg * 0.033;
  const activityExtra = (dejKcal - mbKcal) / 1000;
  let napBonus = 0;
  if (nap >= 1.9) napBonus = 0.5;
  else if (nap >= 1.725) napBonus = 0.3;
  else if (nap >= 1.55) napBonus = 0.15;
  return Math.round((base + activityExtra + napBonus) * 10) / 10;
}

/**
 * Protocole complet : MB → NAP → DEJ (avec FA) → objectif (déficit/surplus)
 * → macros (%) → fibres → eau.
 */
export type ProtocolInput = {
  sex: string;
  weightKg: number;
  heightCm: number;
  ageYears: number;
  activities: Partial<Record<NapActivityKey, number>>;
  stressFactor?: number;
  balance: EnergyBalance;
  absDeltaKcal: number;
  pctProtein: number;
  pctFat: number;
  pctCarbs: number;
  fiberMode: "auto" | "fixed";
  fiberFixedG?: number;
};

export type ProtocolResult = {
  mbKJ: number;
  mbKcal: number;
  nap: number;
  stressFactor: number;
  dejKJ: number;
  dejKcal: number;
  goalKcal: number;
  goalKJ: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
  fiberG: number;
  waterL: number;
};

export function computeProtocol(input: ProtocolInput): ProtocolResult {
  const mbKJ = computeMB_KJ(input.sex, input.weightKg, input.heightCm, input.ageYears);
  const mbKcal = Math.round(mbKJ * KJ_TO_KCAL);
  const { nap } = computeNAP(input.activities);
  const sf = input.stressFactor ?? 1;
  const dejKJ = mbKJ * nap * sf;
  const dejKcal = Math.round(dejKJ * KJ_TO_KCAL);
  const absDelta = Math.abs(input.absDeltaKcal);
  let goalKcal = dejKcal;
  if (input.balance === "DEFICIT") goalKcal = dejKcal - absDelta;
  else if (input.balance === "SURPLUS") goalKcal = dejKcal + absDelta;
  const goalKJ = goalKcal / KJ_TO_KCAL;
  const macros = computeMacrosFromKJ(goalKJ, input.pctProtein, input.pctFat, input.pctCarbs);
  const fiberG =
    input.fiberMode === "auto" ? computeFiberAuto(goalKcal) : input.fiberFixedG ?? 30;
  const waterL = computeWater(input.weightKg, mbKcal, dejKcal, nap);
  return {
    mbKJ,
    mbKcal,
    nap,
    stressFactor: sf,
    dejKJ,
    dejKcal,
    goalKcal,
    goalKJ,
    proteinG: macros.proteinG,
    fatG: macros.fatG,
    carbsG: macros.carbsG,
    fiberG,
    waterL,
  };
}
