/**
 * Recherche d'aliments basée sur la table CIQUAL 2025 (ANSES) —
 * 3300+ aliments français avec macros officielles — complétée par
 * une shortlist d'alias courants (boost pour "riz", "pâtes", etc.)
 * et une recherche fuzzy tolérante aux fautes via Fuse.js.
 */
import Fuse from "fuse.js";
import ciqualRaw from "@/data/ciqual.json";
import { WORLD_FOODS } from "@/data/foods-world";
import { SUPPLEMENT_FOODS } from "@/data/foods-supplements";

export type GenericFood = {
  name: string;         // nom court affiché
  aliases: string[];    // variantes & termes de recherche supplémentaires
  per100g: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
};

type CiqualEntry = {
  name: string;
  grp: string;
  ssgrp: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
  fi: number;
};

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
 * Nom d'affichage à partir du nom CIQUAL — on retire seulement les
 * parenthèses (souvent des précisions techniques verbeuses) mais on
 * garde les virgules qui apportent l'info de cuisson (« Poulet, rôti »).
 */
function shortDisplay(fullName: string): string {
  let s = fullName.replace(/\s*\([^)]*\)\s*/g, " ").trim();
  s = s.replace(/\s+/g, " ").replace(/\s*,\s*/g, ", ");
  // trim trailing commas
  s = s.replace(/[,;\s]+$/, "");
  return s;
}

/**
 * Shortlist de termes courants (populaires au quotidien) — si un aliment
 * CIQUAL contient l'un de ces mots, on lui donne un coup de pouce de
 * pertinence pour remonter en premier dans les résultats.
 */
const POPULAR_BOOST_TERMS = new Set(
  [
    "pomme", "banane", "orange", "pain", "riz", "pates", "pâtes", "poulet",
    "boeuf", "porc", "oeuf", "lait", "fromage", "yaourt", "beurre",
    "chocolat", "pizza", "burger", "frites", "salade", "tomate",
    "carotte", "courgette", "paris-brest", "tarte", "eclair",
    "croissant", "baguette", "sandwich", "quiche", "soupe", "saumon",
    "thon", "sardine", "crevette", "fraise", "framboise", "pomme de terre",
    "crepe", "gaufre", "gateau", "mousse", "flan", "creme", "compote",
    "miel", "confiture", "huile", "vinaigre", "mayonnaise", "moutarde",
    "amande", "noix", "noisette", "pistache", "cacahuete",
    "whey", "proteine", "isolate", "caseine",
    "datte", "dattes", "graines", "lin", "chia", "courge", "sesame", "tournesol",
  ].map(normalize)
);

const ciqual = ciqualRaw as CiqualEntry[];

/** Convertit WORLD_FOODS (plats méditerranéens, caucasiens, maghrébins,
 *  africains) au même schéma CIQUAL pour un traitement unifié. */
const worldEntries: CiqualEntry[] = WORLD_FOODS.map((w) => ({
  name: w.name,
  grp: w.region,
  ssgrp: w.region,
  kcal: w.kcal,
  p: w.p,
  c: w.c,
  f: w.f,
  fi: w.fi,
}));

/** Compléments sportifs (whey, isolate, caséine) — marques FR populaires. */
const supplementEntries: CiqualEntry[] = SUPPLEMENT_FOODS.map((s) => ({
  name: s.name,
  grp: "Compléments",
  ssgrp: s.brand,
  kcal: s.kcal,
  p: s.p,
  c: s.c,
  f: s.f,
  fi: s.fi,
}));

/** Ciqual + plats du monde + compléments (doublons filtrés par nom normalisé). */
const allEntries: CiqualEntry[] = (() => {
  const seen = new Set(ciqual.map((e) => normalize(shortDisplay(e.name))));
  const out = [...ciqual];
  for (const w of [...worldEntries, ...supplementEntries]) {
    const key = normalize(shortDisplay(w.name));
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(w);
  }
  return out;
})();

type IndexedFood = GenericFood & {
  _nameNorm: string;      // nom normalisé (sans accents, lowercase)
  _fullNorm: string;      // nom CIQUAL complet normalisé
  _tokensNorm: string;    // tokens uniques normalisés
  _popular: boolean;
};

const foods: IndexedFood[] = allEntries.map((e) => {
  const display = shortDisplay(e.name);
  const normFull = normalize(e.name);
  const normDisplay = normalize(display);
  const tokens = new Set(normFull.split(" ").filter((w) => w.length >= 3));
  const popular = [...POPULAR_BOOST_TERMS].some((t) => normFull.includes(t));

  return {
    name: display,
    aliases: [e.name],
    per100g: {
      calories: e.kcal,
      protein: e.p,
      carbs: e.c,
      fat: e.f,
      fiber: e.fi,
    },
    _nameNorm: normDisplay,
    _fullNorm: normFull,
    _tokensNorm: Array.from(tokens).join(" "),
    _popular: popular,
  };
});

/**
 * Index Fuse.js — construit au chargement du module.
 * On cherche sur les formes normalisées (sans accents) → tolérance
 * complète aux fautes d'accent et de casse.
 */
const fuse = new Fuse(foods, {
  keys: [
    { name: "_nameNorm", weight: 3 },
    { name: "_fullNorm", weight: 1.5 },
    { name: "_tokensNorm", weight: 1 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  includeScore: true,
  minMatchCharLength: 2,
  distance: 300,
});

/** Rétrocompatibilité : base exportée sans champs internes. */
export const GENERIC_FOODS: GenericFood[] = foods.map(
  ({ _nameNorm, _fullNorm, _tokensNorm, _popular, ...rest }) => {
    void _nameNorm; void _fullNorm; void _tokensNorm; void _popular;
    return rest;
  }
);

/**
 * Recherche fuzzy tolérante dans CIQUAL.
 * Renvoie les meilleurs résultats triés par pertinence, avec
 * un boost pour les aliments courants.
 */
export function searchLocalFoods(query: string): (GenericFood & { score: number })[] {
  const q = query.trim();
  if (q.length < 2) return [];

  const normQ = normalize(q);

  // Pré-filtre substring : garantit que toute occurrence directe dans le nom
  // remonte, même si Fuse.js rate la requête (fréquent sur les mots courts
  // type "whey", "iso", "dymatize").
  const directHits = foods
    .filter((f) => f._nameNorm.includes(normQ) || f._fullNorm.includes(normQ))
    .map((item) => ({ item, score: 0 as number }));

  const fuseHits = fuse.search(normQ, { limit: 60 });
  const hits = [...directHits, ...fuseHits];

  const queryWords = normQ.split(" ").filter((w) => w.length >= 2);

  const scored = hits.map(({ item, score = 1 }) => {
    let adj = score;
    if (item._nameNorm === normQ) adj -= 0.7;
    else if (item._nameNorm.startsWith(normQ)) adj -= 0.45;
    else if (item._nameNorm.includes(normQ)) adj -= 0.3;
    else if (item._fullNorm.includes(normQ)) adj -= 0.2;

    // Tous les mots du query présents dans le nom court → gros boost
    if (queryWords.length > 1 && queryWords.every((w) => item._nameNorm.includes(w))) {
      adj -= 0.5;
    }
    // Tous les mots présents dans le nom complet (moindre boost)
    else if (queryWords.every((w) => item._fullNorm.includes(w))) {
      adj -= 0.25;
    }

    if (item._popular) adj -= 0.1;
    // pénalise les noms très longs (variantes CIQUAL verbeuses)
    if (item.name.length > 50) adj += 0.1;
    // favorise les noms courts et directs
    if (item.name.length < 30) adj -= 0.05;
    return { item, score: Math.max(adj, 0) };
  });

  scored.sort((a, b) => a.score - b.score);

  const seen = new Set<string>();
  const results: (GenericFood & { score: number })[] = [];
  for (const { item, score } of scored) {
    const key = item._nameNorm;
    if (seen.has(key)) continue;
    seen.add(key);
    const { _nameNorm, _fullNorm, _tokensNorm, _popular, ...food } = item;
    void _nameNorm; void _fullNorm; void _tokensNorm; void _popular;
    results.push({ ...food, score });
    if (results.length >= 20) break;
  }
  return results;
}
