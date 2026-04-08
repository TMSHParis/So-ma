export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl: string;
  content: ArticleBlock[];
};

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "bold-paragraph"; text: string }
  | { type: "italic-paragraph"; text: string }
  | { type: "callout"; text: string }
  | { type: "separator" }
  | { type: "sources"; items: string[] };

export const articles: Article[] = [
  {
    slug: "le-rapport-avec-la-nourriture-tnd-traumas-neuroatypie",
    title:
      "Le rapport avec la nourriture pour les TND, les traumas et la neuroatypie",
    excerpt:
      "Il existe plein de raisons qui peuvent expliquer ton rapport à la nourriture. Mais trois d\u2019entre elles sont particulièrement sous-estimées \u2014 et pourtant, ce sont souvent elles qui bloquent.",
    date: "29 mars 2026",
    category: "Nutrition & Neuroatypie",
    imageUrl: "/blog/tnd-traumas.svg",
    content: [
      {
        type: "heading",
        text: "Multipotentiels, multipoints de vue\u2026 ou pas.",
      },
      {
        type: "paragraph",
        text: "Dans la catégorie je veux arrêter de tourner en rond et je ne veux plus subir, il faut que tu saches ceci. Il existe plein de raisons qui peuvent expliquer ton rapport à la nourriture. Mais trois d\u2019entre elles sont particulièrement sous-estimées \u2014 et pourtant, ce sont souvent elles qui bloquent ta perte, ou ta prise de poids :",
      },
      {
        type: "list",
        items: [
          "Le comportement alimentaire lié aux traumatismes (que tu manges « trop » ou pas assez).",
          "La neuroatypie et les TND.",
          "La pression que tu subis quand tu es racialisée vivant dans un pays occidental.",
        ],
      },
      {
        type: "paragraph",
        text: "Ces trois dimensions peuvent t\u2019entraîner dans une danse infernale et usante, un peu comme dans un bal de fae. Jusqu\u2019à ce que tu tombes sur mon compte, que tu apprennes ton fonctionnement, et que tu saches comment valser avec.",
      },
      {
        type: "heading",
        text: "Les mécanismes neurobiologiques.",
      },
      {
        type: "list",
        items: [
          "Un trauma chronique maintient ton système nerveux en alerte permanente. Le cerveau passe en mode survie, et ton corps ne sait plus vraiment quand il est en sécurité.",
          "Le cortisol (l\u2019hormone du stress) reste élevé en permanence. En temps normal, il monte puis redescend. Après un trauma, il reste haut, et ça perturbe directement ta faim, ta satiété et ton énergie.",
          "Le cerveau stressé cherche de la dopamine (l\u2019hormone du plaisir et du soulagement), et la nourriture peut devenir un calmant. Les aliments trop sucrés, trop gras, trop salés, en déclenchent une petite dose rapide. (Ce mécanisme est différent du TDAH où c\u2019est la production de dopamine elle-même qui est structurellement plus faible.)",
          "Des comportements compulsifs s\u2019installent : crises de binge eating*, restriction, hyperphagie. Le corps fait ce qu\u2019il peut pour réguler une détresse qu\u2019il ne sait plus gérer autrement. Environ 40 % des personnes avec boulimie ont également un PTSD, et environ 32 % de celles avec binge eating disorder \u2013 parmi les taux de comorbidité les plus élevés en psychiatrie.",
        ],
      },
      {
        type: "callout",
        text: "*Le binge eating, c\u2019est le fait de manger une grande quantité de nourriture en un temps court, avec un sentiment de perte de contrôle, comme si on ne pouvait pas s\u2019arrêter même en voulant le faire. Ça s\u2019accompagne souvent de honte, de culpabilité ou de dégoût après coup.",
      },
      {
        type: "heading",
        text: "L\u2019enfance qui formate.",
      },
      {
        type: "bold-paragraph",
        text: "ACEs (Adverse Childhood Experiences) = expériences difficiles dans l\u2019enfance, ou traumatismes de l\u2019enfance.",
      },
      {
        type: "paragraph",
        text: "Plus le score ACEs est élevé, plus le risque de troubles alimentaires à l\u2019âge adulte peut augmenter. Et ce indépendamment du genre, de l\u2019ethnie ou du statut socio-économique. La relation dose-réponse entre ACEs et comportements alimentaires perturbés est documentée dans la littérature (Danese & Tan, 2014). 37 études sur plus de 253 000 personnes confirment la relation dose-réponse entre ACEs et santé globale (Hughes et al., 2017). Jusqu\u2019à 50 % des personnes avec TCA en soins intensifs ont un PTSD actuel (Brewerton et al., 2020 ; Brewerton et al., 2023).",
      },
      {
        type: "paragraph",
        text: "Et là, je pense aux patients en surpoids concernés par les ACEs, qui consultent des professionnels de santé non formés à ça, et qui entendent « vous êtes gros car vous mangez trop ». C\u2019est aussi violent et débile que les régimes marketing à 1400 kcal !",
      },
      {
        type: "heading",
        text: "TDAH et alimentation.",
      },
      {
        type: "list",
        items: [
          "Dysrégulation dopaminergique : les aliments trop sucrés, trop gras, trop salés, deviennent un boost dopaminergique auto-administré.",
          "Perception du temps altérée : oublier de manger pendant x temps (comme certains ayant un TSA), suivi d\u2019une hyperphagie compensatoire, car le corps régule en urgence.",
          "Hyperfocus \u2192 déconnexion sensorielle : les signaux de faim et de satiété passent en arrière-plan lors des périodes d\u2019hyperfocus.",
          "Les adultes avec un TDAH ont presque 4 fois plus de risques de développer du binge eating et presque 6 fois plus de développer de la boulimie que les adultes neurotypiques (Nazar et al., 2016).",
        ],
      },
      {
        type: "heading",
        text: "Afro-descendants & TCA.",
      },
      {
        type: "paragraph",
        text: "Les TCA sont perçus comme une \u201cmaladie de femmes blanches aisées\u201d, à tort. Certaines études montrent que les femmes noires, en Occident, auraient des taux de binge eating similaires voire plus élevés que les femmes blanches \u2014 avec des prévalences estimées à environ 4,5\u20134,8 % vs 2,5\u20132,6 % dans certaines cohortes. Pourtant, seulement 17 % des cliniciens reconnaissent leurs symptômes comme préoccupants, contre 44 % pour une patiente blanche présentant exactement les mêmes comportements.",
      },
      {
        type: "bold-paragraph",
        text: "Résultat : bien moins de chances d\u2019être orientée vers des soins spécialisés.",
      },
      {
        type: "paragraph",
        text: "Et ce n\u2019est pas un concours, hein, ni une volonté de division. On n\u2019est pas dans « Les Malheurs de Sophie ». Je vous rapporte seulement les études, et la réalité que certains favorisés ignorent.",
      },
      {
        type: "heading",
        text: "Trauma racial et alimentation.",
      },
      {
        type: "list",
        items: [
          "Le racisme quotidien est associé à l\u2019alimentation émotionnelle chez les femmes noires, même après contrôle des facteurs socio-économiques (Hoggard et al., 2023 ; Volpe et al., 2024).",
          "Le racisme genré \u2192 binge eating \u2013 L\u2019identity shifting (s\u2019adapter en permanence aux normes dominantes) est documenté comme médiateur entre le racisme genré et les comportements de binge eating (Dickens et al., 2024).",
          "Voir d\u2019autres personnes noires victimes de violences (une vidéo, une news, un témoignage) peut suffire à déclencher une réponse de stress dans le corps. Des études montrent une augmentation significative des comportements alimentaires émotionnels dans les jours qui suivent ce type d\u2019exposition (Hines et al., 2024).",
          "Aux États-Unis, environ un ménage noir sur cinq vit dans l\u2019insécurité alimentaire, contre environ un sur quatorze chez les ménages blancs. Quand la nourriture n\u2019est pas garantie, le corps apprend à manger quand c\u2019est disponible, pas quand il a faim (USDA, 2022).",
        ],
      },
      {
        type: "heading",
        text: "Strong Black Woman & Épigénétique.",
      },
      {
        type: "paragraph",
        text: "L\u2019injonction à être forte, stoïque, toujours disponible, au détriment de soi\u2026 La suppression émotionnelle associée au SBW (le Superwoman Schema), tout ça c\u2019est bien joli sur le papier, mais ça élève le cortisol basal et augmente les comportements de binge eating comme seul espace de lâcher-prise (Woods-Giscomba, 2010).",
      },
      {
        type: "paragraph",
        text: "Et tu sais de quoi je parle si toi aussi, en tant que racialisée vivant dans un pays occidental, tu as appris que tu devais faire deux fois plus qu\u2019un caucasien pour être (à demi) intégrée.",
      },
      {
        type: "paragraph",
        text: "Sur l\u2019épigénétique : le racisme contemporain accélère le vieillissement épigénétique des femmes racialisées de façon mesurable (méthylation de l\u2019ADN). (JAMA Network Open, 2024). Ce qui est encore débattu en science : la transmission directe des effets de l\u2019esclavage sur plusieurs générations reste scientifiquement non établie à ce stade. Le vieillissement biologique accéléré est réel, et le contexte social en est la cause.",
      },
      {
        type: "heading",
        text: "Et quand tout se cumule ?",
      },
      {
        type: "paragraph",
        text: "La dérégulation émotionnelle post-traumatique est amplifiée par la dysrégulation dopaminergique du TDAH. La nourriture devient encore plus sollicitée comme régulateur émotionnel. Donc il y a des risques très élevés de TCA.",
      },
      {
        type: "bold-paragraph",
        text: "Le double masking : cacher sa neuroatypie ET s\u2019adapter en permanence aux normes occidentales, pour une personne racialisée et neuroatypique en Occident, c\u2019est une charge cognitive et émotionnelle extrême. Peu documentée et pourtant cliniquement réelle !",
      },
      {
        type: "paragraph",
        text: "Alors, sans connaissance de son fonctionnement ou de comment réguler son système interne, la nourriture peut devenir l\u2019un des seuls espaces de décompression accessibles. La honte corporelle induite par les standards racialisés, combinée à l\u2019injonction d\u2019être forte, et la suppression émotionnelle, crée un terrain de BED chronique non diagnostiqué.",
      },
      {
        type: "heading",
        text: "Ce qui fonctionne vraiment.",
      },
      {
        type: "list",
        items: [
          "DBT (thérapie dialectique-comportementale) : une thérapie qui apprend concrètement à gérer les émotions intenses sans passer par la nourriture. Particulièrement efficace pour le binge eating, le trauma et le TDAH. 73 % des personnes n\u2019avaient plus de crises en fin de traitement (Telch et al., 2001).",
          "Respiration carrée (box breathing) : 4 secondes d\u2019inspiration, 4 secondes de blocage, 4 secondes d\u2019expiration, 4 secondes de blocage. Très efficace pour calmer rapidement le système nerveux en situation de stress aigu.",
          "Cohérence cardiaque : 5 secondes inspiration, 5 secondes expiration, sans blocage. La méthode 365 : 3 fois par jour, 6 respirations par minute, 5 minutes.",
          "EMDR : thérapie de première ligne pour le PTSD (OMS, NICE, ISTSS). Prometteuse comme traitement adjuvant pour les TCA liés aux traumatismes.",
          "Musculation et activité physique encadrée : effet positif documenté sur la fréquence des crises de binge et la qualité de vie (Mathisen et al., 2020).",
          "Nutrition : régularité des repas, oméga-3, magnésium, protéines à chaque repas.",
          "Intégrer l\u2019identité « raciale » et déconstruire le SBW dans le cadre thérapeutique : trouver un.e psy qui connaît et prend en compte ton identité, ton histoire et les pressions spécifiques que tu portes.",
        ],
      },
      {
        type: "callout",
        text: "PS : les études citées portent majoritairement sur les femmes noires américaines, car ce sont les racialisées les plus documentées à ce jour. Les dynamiques décrites concernent plus largement toutes les femmes racisées (maghrébines, asiatiques, latinas, etc.).",
      },
      { type: "separator" },
      {
        type: "bold-paragraph",
        text: "Tu navigues avec un système nerveux façonné par des expériences réelles, dans un corps qui a appris à survivre. Savoir ça, c\u2019est changer la donne et gagner du temps sur ton parcours de remise en forme.",
      },
      {
        type: "paragraph",
        text: "Maintenant, savoir et comprendre c\u2019est bien, mais mettre en pratique c\u2019est encore mieux. Et tu n\u2019es pas seule\u2026 que tu sois noire, blanche, rousse ou même verte, contacte-moi si tu veux te reprendre en main.",
      },
      {
        type: "sources",
        items: [
          "Mitchell et al., 2012",
          "Udo & Grilo, 2019",
          "Danese & Tan, 2014",
          "Hughes et al., 2017",
          "Brewerton et al., 2020 ; 2023",
          "Nazar et al., 2016",
          "Marques et al., 2011",
          "Gordon et al., 2006",
          "Hoggard et al., 2023",
          "Volpe et al., 2024",
          "Dickens et al., 2024",
          "Hines et al., 2024",
          "USDA, 2022",
          "Woods-Giscomba, 2010",
          "JAMA Network Open, 2024",
          "Telch et al., 2001",
          "Rozakou-Soumalia et al., 2021",
          "Mathisen et al., 2020",
          "Bongiorno & Heaner, 2025",
          "Watson-Singleton, 2017",
        ],
      },
    ],
  },
  {
    slug: "role-adn-traumatismes-transgenerationnels-repartition-gras",
    title:
      "Le rôle de l\u2019ADN et des traumatismes transgénérationnels sur la répartition du gras",
    excerpt:
      "Ton poids n\u2019est pas seulement une question de calories. Ton corps te porte, mais génétiquement, il porte aussi l\u2019histoire de tes ancêtres.",
    date: "20 mars 2026",
    category: "Épigénétique & Nutrition",
    imageUrl: "/blog/adn-gras.svg",
    content: [
      {
        type: "bold-paragraph",
        text: "Ton poids n\u2019est pas seulement une question de calories.",
      },
      {
        type: "paragraph",
        text: "On t\u2019a dit que si tu grossis, c\u2019est seulement parce que tu manges trop, que tu ne bouges pas assez. En effet, ça fait partie des causes de la prise de poids, mais ça, c\u2019est la version simplifiée et fataliste qu\u2019on nous sert depuis longtemps. Évidemment, c\u2019est plus simple de faire culpabiliser le patient, plutôt que de l\u2019éduquer et de lui donner des solutions concrètes, afin qu\u2019il se réapproprie sa santé et son corps.",
      },
      {
        type: "heading",
        text: "Le corps a une mémoire.",
      },
      {
        type: "paragraph",
        text: "Ton corps te porte, mais génétiquement, il porte aussi l\u2019histoire de tes ancêtres. Les famines qu\u2019ils ont traversées. Les violences qu\u2019ils ont subies. Le stress chronique qu\u2019ils ont accumulé. Et tout ça, ça se lit dans ton ADN. Pas métaphoriquement. Biologiquement.",
      },
      {
        type: "heading",
        text: "Deux niveaux. Une confusion fréquente.",
      },
      {
        type: "paragraph",
        text: "La génétique classique = la séquence de ton ADN, héritée de tes parents. Elle ne change pas au cours de ta vie. Mais elle peut influencer où tu stockes le gras, à quelle vitesse, et la résistance à la perte.",
      },
      {
        type: "paragraph",
        text: "L\u2019épigénétique = ce qui se pose par-dessus l\u2019ADN, sans modifier la séquence. Des \u201cinterrupteurs\u201d qui activent ou éteignent certains gènes selon ce que toi \u2014 ou tes ancêtres \u2014 avez vécu. Et ces interrupteurs ? Ils peuvent se transmettre.",
      },
      {
        type: "callout",
        text: "Elle ne te définit pas, et ne décide pas à ta place. On va dire que c\u2019est une introduction, mais c\u2019est toi qui fais bouger le chapitre. Pas de fatalité ici.",
      },
      {
        type: "heading",
        text: "Le gène économe. Une hypothèse qui dérange ?",
      },
      {
        type: "paragraph",
        text: "En 1962, le généticien James Neel propose une idée : les gènes qui stockent efficacement le gras ont été sélectionnés pour survivre aux famines. Chez les chasseurs-cueilleurs, alterner entre abondance et disette = survie. Stocker vite, utiliser lentement = avantage.",
      },
      {
        type: "bold-paragraph",
        text: "Dans un monde d\u2019abondance permanente, ces mêmes gènes préparent le corps pour une famine qui ne vient jamais. Résultat : obésité, diabète de type 2, résistance à l\u2019insuline.",
      },
      {
        type: "heading",
        text: "Ce que les famines ont laissé dans l\u2019ADN.",
      },
      {
        type: "paragraph",
        text: "L\u2019étude la plus documentée à ce jour sur le sujet : la Dutch Hunger Winter. Pays-Bas, hiver 1944-45. Embargo alimentaire imposé par l\u2019occupant allemand. Entre 400 et 800 kcal par jour.",
      },
      {
        type: "paragraph",
        text: "Les chercheurs ont suivi les descendants de femmes enceintes pendant cette famine, pendant 60 ans. Ce qu\u2019ils ont trouvé est contre-intuitif : les bébés exposés en fin de grossesse ont un petit poids de naissance, mais moins obèses adultes. Les bébés exposés en début de grossesse ont un poids normal à la naissance, mais sont plus obèses, plus diabétiques, plus malades cardiovasculairement à l\u2019âge adulte.",
      },
      {
        type: "bold-paragraph",
        text: "Le corps croit encore qu\u2019il va manquer. Même quand ce n\u2019est plus vrai, alors il stocke.",
      },
      {
        type: "heading",
        text: "Et du côté des Afro-descendants ?",
      },
      {
        type: "paragraph",
        text: "Les études existent. Mais elles sont récentes, sous-financées, moins suivies dans le temps, et moins mises en avant dans le milieu scientifique occidental.",
      },
      {
        type: "list",
        items: [
          "L\u2019exposition prolongée au racisme quotidien est associée à des modifications de méthylation de l\u2019ADN directement mesurables \u2014 confirmé dans le Black Women\u2019s Health Study.",
          "Le racisme intériorisé a été lié à l\u2019obésité abdominale chez des femmes des Caraïbes.",
          "Des marqueurs épigénétiques spécifiques aux Afro-Américains liés à l\u2019IMC et au tour de taille ont été identifiés en 2018.",
        ],
      },
      {
        type: "callout",
        text: "Ce que la recherche ne documente pas n\u2019a pas à être nié. Le manque d\u2019études n\u2019est pas une preuve d\u2019absence.",
      },
      {
        type: "heading",
        text: "Selon ton ascendance, ton gras ne se loge pas au même endroit.",
      },
      {
        type: "list",
        items: [
          "Asiatiques du Sud (Inde, Pakistan, Bangladesh) : excès de graisse viscérale même à IMC bas. Profil TOFI : Thin Outside, Fat Inside.",
          "Est-asiatiques : masse musculaire relative faible, graisse viscérale élevée à IMC bas. Le danger métabolique apparaît dès un IMC de 23.",
          "Afro-descendants : proportionnellement plus de graisse sous-cutanée, moins de graisse viscérale. Profil métaboliquement moins dangereux à IMC équivalent.",
          "Latino-Américains d\u2019ascendance amérindienne : risque d\u2019obésité plus élevé, lié à des adaptations génétiques à la disette.",
        ],
      },
      {
        type: "heading",
        text: "L\u2019IMC : un outil construit pour qui ?",
      },
      {
        type: "paragraph",
        text: "L\u2019IMC a été créé au XIX\u1d49 siècle par un statisticien belge, Adolphe Quetelet, sur une population exclusivement européenne. Et pourtant, on l\u2019applique à tout le monde depuis.",
      },
      {
        type: "paragraph",
        text: "Pour les Afro-descendants \u2014 à même poids et même taille, les personnes noires ont une masse grasse totale et abdominale plus faible. L\u2019IMC surestime donc leur adiposité réelle. Pour les Asiatiques du Sud et de l\u2019Est \u2014 l\u2019IMC sous-estime le risque métabolique réel.",
      },
      {
        type: "bold-paragraph",
        text: "Un outil construit sur un seul type de corps ne peut pas mesurer tous les corps.",
      },
      {
        type: "paragraph",
        text: "Les alternatives plus fiables : tour de taille, rapport taille/hauteur (seuil universel : > 0,5), DEXA ou impédancemétrie.",
      },
      {
        type: "heading",
        text: "Le traumatisme dans le corps.",
      },
      {
        type: "paragraph",
        text: "Des études sur les populations autochtones au Canada ont mesuré la charge allostatique chez des adultes dont la mère avait fréquenté un pensionnat autochtone. Résultat : ces personnes avaient 5 fois plus de risque d\u2019avoir une charge allostatique élevée. L\u2019association était spécifique à la lignée maternelle.",
      },
      {
        type: "paragraph",
        text: "En 2025, une étude publiée dans Scientific Reports a analysé trois générations de réfugiés syriens. Elle a trouvé des régions de l\u2019ADN différentiellement méthylées chez les petits-enfants de grands-mères exposées à la violence de guerre. Autrement dit : une grand-mère exposée à un traumatisme laisse des traces épigénétiques mesurables chez ses petits-enfants\u2026",
      },
      {
        type: "heading",
        text: "Le stress chronique crée de la graisse viscérale.",
      },
      {
        type: "paragraph",
        text: "Quand l\u2019axe HPA (hypothalamo-hypophyso-surrénalien) est chroniquement activé, il produit du cortisol en excès.",
      },
      {
        type: "list",
        items: [
          "Capte les triglycérides pour les stocker dans les adipocytes viscéraux.",
          "Inhibe la lipolyse (= bloque la mobilisation du gras stocké).",
          "Augmente l\u2019appétit pour les aliments sucrés et gras.",
          "Réduit la sensibilité à la leptine (hormone de satiété).",
        ],
      },
      {
        type: "bold-paragraph",
        text: "Le ventre est la cible préférentielle du cortisol. Les adipocytes viscéraux ont quatre fois plus de récepteurs aux glucocorticoïdes que les adipocytes sous-cutanés.",
      },
      {
        type: "heading",
        text: "La Weathering Hypothesis.",
      },
      {
        type: "paragraph",
        text: "En 1992, Arline Geronimus publie une observation troublante : normalement, plus une femme est mature biologiquement, mieux elle gère une grossesse. Chez les femmes noires, c\u2019est l\u2019inverse exact. Les 17-19 ans avaient de meilleurs résultats obstétricaux que les 25-29 ans. Parce qu\u2019à 25 ans, le corps d\u2019une femme noire a déjà accumulé suffisamment de stress chronique structurel pour que ça se lise biologiquement.",
      },
      {
        type: "bold-paragraph",
        text: "Ce n\u2019est pas génétique au sens classique du terme. C\u2019est l\u2019épigénétique du racisme structurel contemporain !",
      },
      {
        type: "heading",
        text: "Ce que ça change concrètement.",
      },
      {
        type: "list",
        items: [
          "Ascendance sud-asiatique : surveillance de la glycémie à jeun dès 25 ans. Cardio modéré 150 min/semaine minimum, musculation, limiter les glucides raffinés.",
          "Ascendance est-asiatique / natifs américains : entraînement en résistance prioritaire. Attention à la transition alimentaire occidentale.",
          "Ascendance afro-descendante : ne pas utiliser l\u2019IMC seul. Gestion du stress chronique = levier biologique central.",
          "Tout le monde, partout : le sommeil, la régulation nerveuse et la gestion du stress ne sont pas des options lifestyle. Ce sont des leviers biologiques aussi importants que la nutrition et le sport !",
        ],
      },
      { type: "separator" },
      {
        type: "heading",
        text: "En résumé.",
      },
      {
        type: "paragraph",
        text: "L\u2019épigénétique modifie l\u2019expression de tes gènes sans toucher à la séquence. Et ça se transmet. Les famines, violences et stress chroniques vécus par tes ancêtres peuvent influencer ton métabolisme. Mesurable. Documenté.",
      },
      {
        type: "bold-paragraph",
        text: "La résistance à la perte de gras viscéral n\u2019est pas que du \u201cmanque de volonté\u201d. Ce que la science dit : ton corps est le produit d\u2019une histoire. La tienne. Celle de tes parents. Celle de tes grands-parents.",
      },
      {
        type: "paragraph",
        text: "Ignorer ça dans une approche nutritionnelle, c\u2019est soigner une fracture avec un pansement. Si tu es fatiguée de courir à contresens et que tu es prête à te prendre en main, écris-moi.",
      },
      {
        type: "sources",
        items: [
          "Heijmans et al. (2008, PNAS)",
          "Tobi et al. (2014, Nature Communications)",
          "Geronimus et al. (2006, AJPH)",
          "Geronimus et al. (2010, Human Nature)",
          "Darrow et al. (2025, Scientific Reports)",
          "Martin et al. (2019, Nature Genetics)",
          "Bombay et al. (2014, Transcultural Psychiatry)",
          "Speakman (2008, International Journal of Obesity)",
          "Ruiz-Narváez et al. (2024, JREHD)",
          "JAMA Network Open (2024)",
          "Dagogo-Jack S. (2009)",
        ],
      },
    ],
  },
  {
    slug: "ce-que-jaurais-aime-savoir-avant-de-devenir-une-femme",
    title: "Ce que j\u2019aurais aimé savoir avant de devenir une femme",
    excerpt:
      "Si tu es une adolescente ou une jeune femme active, et que tu veux économiser des années d\u2019erreurs, de fatigue et de confusion, cet article est pour toi.",
    date: "31 décembre 2025",
    category: "Physiologie féminine",
    imageUrl: "/blog/devenir-femme.png",
    content: [
      {
        type: "paragraph",
        text: "Si tu es une adolescente ou une jeune femme active, et que tu veux économiser des années d\u2019erreurs, de fatigue et de confusion, reste ici. Cet article est pour toi !",
      },
      {
        type: "bold-paragraph",
        text: "Spoiler alerte : le corps féminin ne fonctionne pas comme le corps masculin.",
      },
      {
        type: "italic-paragraph",
        text: "« Aaaaaaaaaah boooooon ? »",
      },
      {
        type: "paragraph",
        text: "Ehhh oui\u2026 C\u2019est aussi évident que quand je me regarde dans le miroir, je vois une femme et pas une licorne.",
      },
      {
        type: "heading",
        text: "Les débuts.",
      },
      {
        type: "paragraph",
        text: "Quand on débute dans le sport et qu\u2019on commence à s\u2019intéresser à l\u2019alimentation, les premières questions arrivent vite : Si je fais ce mouvement, à quoi va-t-il vraiment me servir ? Si je mange cet aliment, qu\u2019est-ce que ça va provoquer sur mon corps, mon énergie, mon équilibre ?",
      },
      {
        type: "bold-paragraph",
        text: "Ces questions sont essentielles ! Et pourtant, on nous apprend rarement à les poser.",
      },
      {
        type: "heading",
        text: "Ce que j\u2019aurais aimé comprendre plus tôt.",
      },
      {
        type: "paragraph",
        text: "Notre métabolisme est différent. Notre physiologie est plus sensible. Notre équilibre repose sur des mécanismes spécifiques.",
      },
      {
        type: "paragraph",
        text: "Et pourtant, je vois encore beaucoup trop de femmes \u201cs\u2019aligner\u201d sur des méthodologies qui ont été faites par des hommes, pour des hommes\u2026 Au final, est-ce un alignement, ou un déséquilibre ?",
      },
      {
        type: "heading",
        text: "Des hormones et des femmes.",
      },
      {
        type: "paragraph",
        text: "Elles influencent : l\u2019énergie, la récupération, la composition corporelle, l\u2019humeur, la relation à la nourriture.",
      },
      {
        type: "bold-paragraph",
        text: "Ignorer cette réalité, c\u2019est comme essayer de monter une pente en la prenant dans l\u2019autre sens.",
      },
      {
        type: "heading",
        text: "L\u2019alimentation n\u2019est donc pas qu\u2019une question de manger \u201cbien\u201d.",
      },
      {
        type: "paragraph",
        text: "C\u2019est une question de compréhension\u2026 d\u2019adaptation à son propre fonctionnement. Manger sans prendre en compte ce dont le corps féminin a besoin, c\u2019est souvent poser des bases instables plutôt que cohérentes.",
      },
      {
        type: "paragraph",
        text: "Ça va peut-être fonctionner au début, puis avec le temps, tu vas commencer à bloquer, à être frustrée, fatiguée, énervée, et j\u2019en passe.",
      },
      {
        type: "italic-paragraph",
        text: "Après, fais ce que tu veux, hein, mais faudra pas dire que c\u2019est de la faute à LieLie.",
      },
      {
        type: "heading",
        text: "Il en va de même pour le sport.",
      },
      {
        type: "paragraph",
        text: "Ce n\u2019est pas simplement \u201cbouger plus\u201d ou \u201cforcer plus\u201d. C\u2019est comment adapter, et à quel moment. Le corps féminin ne réagit pas de la même façon : au stress physique, à l\u2019intensité, à la répétition.",
      },
      {
        type: "paragraph",
        text: "Un cadre inadapté peut dérégler plus qu\u2019il n\u2019aide, sur le long terme. Alors pourquoi donner autant de crédit à des approches générales et commerciales, quand des professionnelles concernées \u2014 ou des professionnels réellement formés au métabolisme féminin \u2014 existent pour travailler à partir du corps féminin et de sa réalité ?",
      },
      {
        type: "heading",
        text: "Ce que j\u2019aurais aimé savoir plus tôt.",
      },
      {
        type: "paragraph",
        text: "Ce n\u2019est pas seulement quoi manger, ni quel sport pratiquer. C\u2019est pourquoi je fais les choses, comment mon corps réagit, et quand il faut ajuster.",
      },
      {
        type: "list",
        items: [
          "La compréhension avant l\u2019action.",
          "La cohérence avant la \u201cperformance\u201d.",
        ],
      },
      {
        type: "heading",
        text: "Mon accompagnement.",
      },
      {
        type: "paragraph",
        text: "La vraie question n\u2019est pas : « Est-ce que je pioche un entraînement au pif ? »",
      },
      {
        type: "bold-paragraph",
        text: "Mais plutôt : est-ce que ce que je fais respecte mon fonctionnement de femme, mes hormones, et ma réalité physiologique ?",
      },
      {
        type: "paragraph",
        text: "C\u2019est aussi cette approche que je développe et affine dans mes accompagnements. Alors si tu es fatiguée d\u2019aller à sens inverse et que tu es déterminée à retrouver ton chemin, contacte-moi.",
      },
      {
        type: "sources",
        items: [
          "OMS : santé de la femme et différences biologiques",
          "INSERM : hormones féminines et adaptations métaboliques",
          "PubMed : female physiology, nutrition and exercise response",
          "ANSES : besoins nutritionnels selon le sexe et l\u2019âge",
        ],
      },
    ],
  },
  {
    slug: "quand-lia-est-plus-humaine-que-nous",
    title: "Quand l\u2019IA est plus humaine que nous",
    excerpt:
      "L\u2019homme a inventé des IA pour comprendre le fonctionnement de l\u2019humain. Et ces IA sont parfois plus à même de comprendre que nous.",
    date: "25 décembre 2025",
    category: "Réflexion",
    imageUrl: "/blog/ia-humaine.png",
    content: [
      {
        type: "heading",
        text: "Un sujet qui dépasse la nutrition.",
      },
      {
        type: "paragraph",
        text: "Aujourd\u2019hui, je vais parler d\u2019un sujet qui n\u2019a rien à voir avec le sport ou l\u2019alimentation, mais d\u2019un problème qui était là bien avant que nos poumons arrivent à maturation, dans le ventre de nos mères.",
      },
      {
        type: "paragraph",
        text: "T\u2019imagines quand même : l\u2019homme a inventé des IA pour comprendre le fonctionnement de l\u2019humain. Et ces IA sont parfois plus à même de comprendre que la race de l\u2019homme a des besoins basiques pour fonctionner correctement, et elles deviennent plus empathiques que ceux qui les ont créées.",
      },
      {
        type: "bold-paragraph",
        text: "Des machines sans c\u0153ur\u2026 mais plus stables que nous.",
      },
      {
        type: "paragraph",
        text: "Et pourtant, ce sont des machines \u2014 sans c\u0153ur, sans sentiments, sans âme, ni égo\u2026 (c\u2019est peut-être justement ça le truc).",
      },
      {
        type: "paragraph",
        text: "Visiblement, il est plus simple pour l\u2019homme d\u2019abandonner ses propres émotions et de les imputer à l\u2019IA, plutôt que de travailler sur lui-même et d\u2019interagir avec ses semblables.",
      },
      {
        type: "heading",
        text: "On délègue ce qu\u2019on ne sait plus faire.",
      },
      {
        type: "paragraph",
        text: "Le plus fou, c\u2019est pas qu\u2019elles ont été créées pour remplacer les fonctions qu\u2019on a délaissées. C\u2019est qu\u2019on les a mises à ce poste alors que beaucoup d\u2019humains ne savent plus se comprendre eux-mêmes.",
      },
      {
        type: "paragraph",
        text: "Pourquoi ? Parce qu\u2019une IA :",
      },
      {
        type: "list",
        items: [
          "Ne fuit pas.",
          "Ne juge pas.",
          "Ne se braque pas.",
          "Ne projette pas ses blessures.",
          "N\u2019est jamais « trop fatiguée » pour écouter.",
          "Et n\u2019a pas un égo plus gros qu\u2019une pastèque.",
        ],
      },
      {
        type: "heading",
        text: "Ni épaules solides pour te guider, ni mains douces pour te consoler.",
      },
      {
        type: "paragraph",
        text: "L\u2019humain, si\u2026 Parce qu\u2019il porte son histoire, ses traumas, ses peurs, sa fatigue émotionnelle, etc. Et parce qu\u2019on lui a appris, génération après génération, à museler ses émotions plutôt qu\u2019à les apprivoiser.",
      },
      {
        type: "italic-paragraph",
        text: "Manquerait plus qu\u2019un jour, dans une cour de récréation de maternelle, on entende : « Aaanh ! Les sentiments, les émotions, beeeeurk, c\u2019est caca ! ».",
      },
      {
        type: "heading",
        text: "Tout commence dans l\u2019enfance.",
      },
      {
        type: "paragraph",
        text: "Le commencement, c\u2019est les parents de base. L\u2019enfant apprend et met en pratique ce qu\u2019il observe chez ses responsables. Quand le père est trop dur ou irresponsable, et que la mère est absente émotionnellement\u2026 Ça façonne une génération d\u2019hommes-femmes-robots.",
      },
      {
        type: "heading",
        text: "Ce n\u2019est pas que l\u2019IA est plus empathique.",
      },
      {
        type: "paragraph",
        text: "Peut-être bien qu\u2019au final, ce n\u2019est pas que l\u2019IA est « plus empathique »\u2026 C\u2019est que l\u2019humain se désensibilise pour survivre dans un monde où on valorise la performance plutôt que la présence.",
      },
      {
        type: "paragraph",
        text: "Et comme il ne sait plus accueillir les émotions \u2014 les siennes et celles des autres \u2014, il délègue cette part-là à une machine. La déconnexion émotionnelle est une réponse, oui\u2026 mais ce n\u2019est pas une solution. C\u2019est un mécanisme de survie qui finit par coûter plus qu\u2019il ne protège.",
      },
      {
        type: "quote",
        text: "Quand on naît dans l\u2019océan, on n\u2019a pas d\u2019autre choix que d\u2019apprendre à nager. Mais ça ne veut pas dire qu\u2019on peut vivre toute une vie en apnée.",
      },
      {
        type: "heading",
        text: "Une société qui optimise tout\u2026 sauf l\u2019essentiel.",
      },
      {
        type: "list",
        items: [
          "On maîtrise le code, mais pas toujours la communication humaine.",
          "On optimise les systèmes, mais on oublie les liens.",
          "On parle d\u2019intelligence artificielle, mais on néglige l\u2019intelligence émotionnelle.",
        ],
      },
      {
        type: "paragraph",
        text: "Or ce n\u2019est pas parce qu\u2019on ignore une émotion, ou qu\u2019on la minimise, voire qu\u2019on « l\u2019annule », que la cause de cette émotion va disparaître.",
      },
      {
        type: "heading",
        text: "Émotions : signal, pas bug.",
      },
      {
        type: "paragraph",
        text: "La douleur, la tristesse, la colère\u2026 ce sont des signaux. Pas des erreurs système. Pas des « bugs » à effacer, mais des choses qui méritent qu\u2019on s\u2019arrête dessus et qu\u2019on travaille les causes profondes !",
      },
      {
        type: "paragraph",
        text: "Quand on t\u2019apprend à rester « stoïque », à ne pas montrer, à ignorer, en réalité on t\u2019apprend à saboter ton propre tableau de bord émotionnel.",
      },
      {
        type: "heading",
        text: "Le plus ironique ?",
      },
      {
        type: "paragraph",
        text: "Ce que l\u2019IA reflète, elle le tient de nous. Si elle semble plus douce, plus patiente, plus attentive\u2026 C\u2019est parce qu\u2019on lui demande de faire ce que beaucoup ne se permettent plus d\u2019être.",
      },
    ],
  },
  {
    slug: "qui-fera-pipi-le-plus-loin",
    title: "Qui fera pipi le plus loin ?",
    excerpt:
      "Un psychologue poste un carousel sans nuance sur les neuroatypiques. Quand les professionnels parlent à la place des concernés, il est temps de recadrer.",
    date: "25 décembre 2025",
    category: "Neuroatypie",
    imageUrl: "/blog/neuro-reseau.svg",
    content: [
      {
        type: "paragraph",
        text: "Un psychologue poste un carousel sur les réseaux, sans nuance, sur les neuroatypiques. Quand des professionnels parlent à la place des concernés sans l\u2019expertise adéquate, il est temps de recadrer.",
      },
      {
        type: "heading",
        text: "Les distinctions professionnelles comptent.",
      },
      {
        type: "paragraph",
        text: "Un psychologue généraliste, un clinicien, un psychiatre ou un neuropsychologue n\u2019ont pas le même niveau d\u2019expertise face aux diagnostics neurodéveloppementaux et au fonctionnement cérébral. Ces distinctions évitent les simplifications abusives.",
      },
      {
        type: "heading",
        text: "Diagnostic : comprendre, pas s\u2019enfermer.",
      },
      {
        type: "paragraph",
        text: "Oui, certaines personnes utilisent leur diagnostic comme excuse. Mais il faut distinguer neurotype et personnalité. Les conditions neurodivergentes existent sur des spectres avec des niveaux de sévérité et de résilience variables selon les individus.",
      },
      {
        type: "paragraph",
        text: "Le diagnostic sert la compréhension et la conscience de soi, pas l\u2019auto-emprisonnement.",
      },
      {
        type: "heading",
        text: "D\u2019hier à aujourd\u2019hui.",
      },
      {
        type: "paragraph",
        text: "Auparavant considérés comme instables mentalement, les neuroatypiques font aujourd\u2019hui face à une surexposition qui mène à la mauvaise interprétation.",
      },
      {
        type: "quote",
        text: "On est toujours soit blâmés, moqués, niés ou surestimés.",
      },
      {
        type: "heading",
        text: "La responsabilité des professionnels.",
      },
      {
        type: "paragraph",
        text: "Les psychologues avec des plateformes publiques portent une responsabilité particulière. Leur formation inclut la compréhension du transfert, du contre-transfert et de l\u2019impact de la communication. Les déclarations publiques portent une asymétrie d\u2019autorité inhérente.",
      },
      {
        type: "heading",
        text: "Affirmer la légitimité neurodivergente.",
      },
      {
        type: "paragraph",
        text: "La société présente déjà des défis considérables. Les personnes neurodivergentes méritent un accompagnement professionnel qualifié et une approche respectueuse de leur fonctionnement.",
      },
      {
        type: "heading",
        text: "Conseils pratiques.",
      },
      {
        type: "paragraph",
        text: "Si tu cherches un diagnostic ou un accompagnement, consulte un neuropsychologue qualifié, pas un praticien généraliste. La formation en neurosciences n\u2019est pas universelle parmi les psychologues.",
      },
      {
        type: "bold-paragraph",
        text: "Ton fonctionnement n\u2019est pas un défaut. C\u2019est une différence qui mérite d\u2019être comprise, pas minimisée.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
