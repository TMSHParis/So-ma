// Constantes partagées entre client et serveur (pas d'import serveur ici)

export type ContentField = {
  section: string;
  key: string;
  label: string;
  type: "text" | "textarea" | "image";
  value: string;
  position: number;
};

/** Sections affichées dans l'admin */
export const SECTION_LABELS: Record<string, string> = {
  hero: "Accueil — Hero",
  method: "Accueil — Méthode",
  about: "Accueil — À propos",
  steps: "Accueil — Les 3 étapes",
  cta: "Accueil — Appel à l'action",
  suivi_hero: "Suivi — En-tête",
  suivi_pricing: "Suivi — Tarification",
  suivi_cta: "Suivi — Appel à l'action",
};

/** Valeurs par défaut — servent de fallback et de seed initial */
export const DEFAULT_CONTENT: ContentField[] = [
  // ── Hero ──
  {
    section: "hero",
    key: "badge",
    label: "Badge (texte au-dessus du titre)",
    type: "text",
    value: "Nutrition · Neuroatypie · Mouvement fonctionnel",
    position: 0,
  },
  {
    section: "hero",
    key: "title",
    label: "Titre principal",
    type: "text",
    value:
      "Un accompagnement fait sur mesure, pour des cerveaux neurodivergents.",
    position: 1,
  },
  {
    section: "hero",
    key: "subtitle",
    label: "Sous-titre",
    type: "text",
    value:
      "Suivi nutritionnel et sportif, conçu pour des femmes neuroatypiques, par une femme neuroatypique.",
    position: 2,
  },

  // ── Méthode ──
  {
    section: "method",
    key: "title",
    label: "Titre de section",
    type: "textarea",
    value:
      "Ma méthode est une approche intégrative et fonctionnelle, ancrée dans la science et dans le respect de ta physiologie — pas de protocole générique.",
    position: 0,
  },
  {
    section: "method",
    key: "nutrition_title",
    label: "Carte Nutrition — Titre",
    type: "text",
    value:
      "Un plan alimentaire qui respecte tes hormones et tes besoins, sans restriction extrême.",
    position: 1,
  },
  {
    section: "method",
    key: "nutrition_desc",
    label: "Carte Nutrition — Description",
    type: "textarea",
    value:
      "Calcul de ton métabolisme de base, recettes équilibrées que tes hormones vont kiffer, et organisation des repas en fonction de tes objectifs.",
    position: 2,
  },
  {
    section: "method",
    key: "movement_title",
    label: "Carte Mouvement — Titre",
    type: "text",
    value: "Des programmes qui s'adaptent à toi, et non l'inverse.",
    position: 3,
  },
  {
    section: "method",
    key: "movement_desc",
    label: "Carte Mouvement — Description",
    type: "textarea",
    value:
      "Des séances faites pour toi, ta réalité, ta physiologie, et ton mode de vie. De façon progressive et durable.",
    position: 4,
  },
  {
    section: "method",
    key: "neuro_title",
    label: "Carte Neuroatypie — Titre",
    type: "text",
    value: "Chaque profil est unique.",
    position: 5,
  },
  {
    section: "method",
    key: "neuro_desc",
    label: "Carte Neuroatypie — Description",
    type: "textarea",
    value:
      "Les méthodes classiques ne tiennent pas compte de nos spécificités neurologiques et cognitives, alors j'ai construit une approche adaptée à notre fonctionnement.",
    position: 6,
  },

  // ── À propos ──
  {
    section: "about",
    key: "poem",
    label: "Texte poétique (introduction)",
    type: "textarea",
    value:
      "Pensées en arborescences,\nCréativité débordante,\nSoif de connaissance insatiable et besoins constants d'évolution,\nÉnergie foisonnante,\nMais surtout, aussi décalée et fière que les rayures du zèbre…",
    position: 0,
  },
  {
    section: "about",
    key: "quote",
    label: "Citation forte",
    type: "text",
    value:
      "Seulement, quand tu forces un arbre à agir comme une pierre, il en perd ses racines.",
    position: 1,
  },
  {
    section: "about",
    key: "conclusion",
    label: "Message de conclusion",
    type: "textarea",
    value:
      "Ta singularité mérite une approche sur mesure : nutrition consciente, programmes sportifs adaptés, et un accompagnement qui te ressemble !",
    position: 2,
  },
  {
    section: "about",
    key: "stat_label",
    label: "Stat principale (ex: Plusieurs)",
    type: "text",
    value: "Plusieurs",
    position: 3,
  },
  {
    section: "about",
    key: "stat_desc",
    label: "Description de la stat",
    type: "text",
    value: "femmes déjà accompagnées",
    position: 4,
  },
  {
    section: "about",
    key: "cert_label",
    label: "Label certification",
    type: "text",
    value: "Certifiée QUALIOPI",
    position: 5,
  },
  {
    section: "about",
    key: "cert_desc",
    label: "Description certification",
    type: "text",
    value: "Diététique et sport selon la médecine prophétique",
    position: 6,
  },

  // ── Les 3 étapes ──
  {
    section: "steps",
    key: "title",
    label: "Titre de section",
    type: "text",
    value: "Trois étapes seulement.",
    position: 0,
  },
  {
    section: "steps",
    key: "step1_title",
    label: "Étape 1 — Titre",
    type: "text",
    value: "Bilan personnalisé",
    position: 1,
  },
  {
    section: "steps",
    key: "step1_desc",
    label: "Étape 1 — Description",
    type: "textarea",
    value:
      "Un questionnaire détaillé pour comprendre ton profil métabolique, tes habitudes de vie et tes objectifs.",
    position: 2,
  },
  {
    section: "steps",
    key: "step2_title",
    label: "Étape 2 — Titre",
    type: "text",
    value: "Consultation individuelle",
    position: 3,
  },
  {
    section: "steps",
    key: "step2_desc",
    label: "Étape 2 — Description",
    type: "textarea",
    value:
      "Tu as droit à un échange en visio, afin que j\u2019apprenne à mieux te connaître et que je confectionne un programme qui matche avec tes objectifs.",
    position: 4,
  },
  {
    section: "steps",
    key: "step3_title",
    label: "Étape 3 — Titre",
    type: "text",
    value: "Ton espace personnalisé",
    position: 5,
  },
  {
    section: "steps",
    key: "step3_desc",
    label: "Étape 3 — Description",
    type: "textarea",
    value:
      "Tableau de bord avec programme alimentaire, sportif, suivi quotidien et ressources utiles.",
    position: 6,
  },

  // ── CTA ──
  {
    section: "cta",
    key: "title",
    label: "Titre",
    type: "text",
    value: "Prête à commencer ?",
    position: 0,
  },
  {
    section: "cta",
    key: "subtitle",
    label: "Sous-titre",
    type: "text",
    value:
      "Rejoins les femmes qui ont choisi d'exploiter à fond leurs potentiels.",
    position: 1,
  },
  {
    section: "cta",
    key: "button",
    label: "Texte du bouton",
    type: "text",
    value: "Découvre l'accompagnement",
    position: 2,
  },

  // ── Suivi — Hero ──
  {
    section: "suivi_hero",
    key: "title",
    label: "Titre principal",
    type: "textarea",
    value:
      "Si tu es neuroatypique, les méthodes classiques ne peuvent pas fonctionner durablement sur toi.",
    position: 0,
  },

  // ── Suivi — Pricing ──
  {
    section: "suivi_pricing",
    key: "intro",
    label: "Texte d'introduction",
    type: "text",
    value:
      "Alors si tu es prête à exploiter ton plein potentiel, fais le pas maintenant.",
    position: 0,
  },
  {
    section: "suivi_pricing",
    key: "title",
    label: "Titre de l'offre",
    type: "text",
    value: "Bilan + Suivi personnalisé",
    position: 1,
  },
  {
    section: "suivi_pricing",
    key: "price",
    label: "Prix (nombre uniquement)",
    type: "text",
    value: "129",
    position: 2,
  },
  {
    section: "suivi_pricing",
    key: "price_note",
    label: "Note sous le prix",
    type: "text",
    value: "Paiement unique",
    position: 3,
  },

  // ── Suivi — CTA final ──
  {
    section: "suivi_cta",
    key: "title",
    label: "Titre",
    type: "text",
    value: "Investis en toi.",
    position: 0,
  },
  {
    section: "suivi_cta",
    key: "button",
    label: "Texte du bouton",
    type: "text",
    value: "Commencer maintenant",
    position: 1,
  },
];
