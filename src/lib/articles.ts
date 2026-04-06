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
      "Il existe plein de raisons qui peuvent expliquer ton rapport \u00e0 la nourriture. Mais trois d\u2019entre elles sont particuli\u00e8rement sous-estim\u00e9es \u2014 et pourtant, ce sont souvent elles qui bloquent.",
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
        text: "Dans la cat\u00e9gorie je veux arr\u00eater de tourner en rond et je ne veux plus subir, il faut que tu saches ceci. Il existe plein de raisons qui peuvent expliquer ton rapport \u00e0 la nourriture. Mais trois d\u2019entre elles sont particuli\u00e8rement sous-estim\u00e9es \u2014 et pourtant, ce sont souvent elles qui bloquent ta perte, ou ta prise de poids :",
      },
      {
        type: "list",
        items: [
          "Le comportement alimentaire li\u00e9 aux traumatismes (que tu manges \u00ab trop \u00bb ou pas assez).",
          "La neuroatypie et les TND.",
          "La pression que tu subis quand tu es racialis\u00e9e vivant dans un pays occidental.",
        ],
      },
      {
        type: "paragraph",
        text: "Ces trois dimensions peuvent t\u2019entra\u00eener dans une danse infernale et usante, un peu comme dans un bal de fae. Jusqu\u2019\u00e0 ce que tu tombes sur mon compte, que tu apprennes ton fonctionnement, et que tu saches comment valser avec.",
      },
      {
        type: "heading",
        text: "Les m\u00e9canismes neurobiologiques.",
      },
      {
        type: "list",
        items: [
          "Un trauma chronique maintient ton syst\u00e8me nerveux en alerte permanente. Le cerveau passe en mode survie, et ton corps ne sait plus vraiment quand il est en s\u00e9curit\u00e9.",
          "Le cortisol (l\u2019hormone du stress) reste \u00e9lev\u00e9 en permanence. En temps normal, il monte puis redescend. Apr\u00e8s un trauma, il reste haut, et \u00e7a perturbe directement ta faim, ta sati\u00e9t\u00e9 et ton \u00e9nergie.",
          "Le cerveau stress\u00e9 cherche de la dopamine (l\u2019hormone du plaisir et du soulagement), et la nourriture peut devenir un calmant. Les aliments trop sucr\u00e9s, trop gras, trop sal\u00e9s, en d\u00e9clenchent une petite dose rapide. (Ce m\u00e9canisme est diff\u00e9rent du TDAH o\u00f9 c\u2019est la production de dopamine elle-m\u00eame qui est structurellement plus faible.)",
          "Des comportements compulsifs s\u2019installent : crises de binge eating*, restriction, hyperphagie. Le corps fait ce qu\u2019il peut pour r\u00e9guler une d\u00e9tresse qu\u2019il ne sait plus g\u00e9rer autrement. Environ 40 % des personnes avec boulimie ont \u00e9galement un PTSD, et environ 32 % de celles avec binge eating disorder \u2013 parmi les taux de comorbidit\u00e9 les plus \u00e9lev\u00e9s en psychiatrie.",
        ],
      },
      {
        type: "callout",
        text: "*Le binge eating, c\u2019est le fait de manger une grande quantit\u00e9 de nourriture en un temps court, avec un sentiment de perte de contr\u00f4le, comme si on ne pouvait pas s\u2019arr\u00eater m\u00eame en voulant le faire. \u00c7a s\u2019accompagne souvent de honte, de culpabilit\u00e9 ou de d\u00e9go\u00fbt apr\u00e8s coup.",
      },
      {
        type: "heading",
        text: "L\u2019enfance qui formate.",
      },
      {
        type: "bold-paragraph",
        text: "ACEs (Adverse Childhood Experiences) = exp\u00e9riences difficiles dans l\u2019enfance, ou traumatismes de l\u2019enfance.",
      },
      {
        type: "paragraph",
        text: "Plus le score ACEs est \u00e9lev\u00e9, plus le risque de troubles alimentaires \u00e0 l\u2019\u00e2ge adulte peut augmenter. Et ce ind\u00e9pendamment du genre, de l\u2019ethnie ou du statut socio-\u00e9conomique. La relation dose-r\u00e9ponse entre ACEs et comportements alimentaires perturb\u00e9s est document\u00e9e dans la litt\u00e9rature (Danese & Tan, 2014). 37 \u00e9tudes sur plus de 253 000 personnes confirment la relation dose-r\u00e9ponse entre ACEs et sant\u00e9 globale (Hughes et al., 2017). Jusqu\u2019\u00e0 50 % des personnes avec TCA en soins intensifs ont un PTSD actuel (Brewerton et al., 2020 ; Brewerton et al., 2023).",
      },
      {
        type: "paragraph",
        text: "Et l\u00e0, je pense aux patients en surpoids concern\u00e9s par les ACEs, qui consultent des professionnels de sant\u00e9 non form\u00e9s \u00e0 \u00e7a, et qui entendent \u00ab vous \u00eates gros car vous mangez trop \u00bb. C\u2019est aussi violent et d\u00e9bile que les r\u00e9gimes marketing \u00e0 1400 kcal !",
      },
      {
        type: "heading",
        text: "TDAH et alimentation.",
      },
      {
        type: "list",
        items: [
          "Dysr\u00e9gulation dopaminergique : les aliments trop sucr\u00e9s, trop gras, trop sal\u00e9s, deviennent un boost dopaminergique auto-administr\u00e9.",
          "Perception du temps alt\u00e9r\u00e9e : oublier de manger pendant x temps (comme certains ayant un TSA), suivi d\u2019une hyperphagie compensatoire, car le corps r\u00e9gule en urgence.",
          "Hyperfocus \u2192 d\u00e9connexion sensorielle : les signaux de faim et de sati\u00e9t\u00e9 passent en arri\u00e8re-plan lors des p\u00e9riodes d\u2019hyperfocus.",
          "Les adultes avec un TDAH ont presque 4 fois plus de risques de d\u00e9velopper du binge eating et presque 6 fois plus de d\u00e9velopper de la boulimie que les adultes neurotypiques (Nazar et al., 2016).",
        ],
      },
      {
        type: "heading",
        text: "Afro-descendants & TCA.",
      },
      {
        type: "paragraph",
        text: "Les TCA sont per\u00e7us comme une \u201cmaladie de femmes blanches ais\u00e9es\u201d, \u00e0 tort. Certaines \u00e9tudes montrent que les femmes noires, en Occident, auraient des taux de binge eating similaires voire plus \u00e9lev\u00e9s que les femmes blanches \u2014 avec des pr\u00e9valences estim\u00e9es \u00e0 environ 4,5\u20134,8 % vs 2,5\u20132,6 % dans certaines cohortes. Pourtant, seulement 17 % des cliniciens reconnaissent leurs sympt\u00f4mes comme pr\u00e9occupants, contre 44 % pour une patiente blanche pr\u00e9sentant exactement les m\u00eames comportements.",
      },
      {
        type: "bold-paragraph",
        text: "R\u00e9sultat : bien moins de chances d\u2019\u00eatre orient\u00e9e vers des soins sp\u00e9cialis\u00e9s.",
      },
      {
        type: "paragraph",
        text: "Et ce n\u2019est pas un concours, hein, ni une volont\u00e9 de division. On n\u2019est pas dans \u00ab Les Malheurs de Sophie \u00bb. Je vous rapporte seulement les \u00e9tudes, et la r\u00e9alit\u00e9 que certains favoris\u00e9s ignorent.",
      },
      {
        type: "heading",
        text: "Trauma racial et alimentation.",
      },
      {
        type: "list",
        items: [
          "Le racisme quotidien est associ\u00e9 \u00e0 l\u2019alimentation \u00e9motionnelle chez les femmes noires, m\u00eame apr\u00e8s contr\u00f4le des facteurs socio-\u00e9conomiques (Hoggard et al., 2023 ; Volpe et al., 2024).",
          "Le racisme genr\u00e9 \u2192 binge eating \u2013 L\u2019identity shifting (s\u2019adapter en permanence aux normes dominantes) est document\u00e9 comme m\u00e9diateur entre le racisme genr\u00e9 et les comportements de binge eating (Dickens et al., 2024).",
          "Voir d\u2019autres personnes noires victimes de violences (une vid\u00e9o, une news, un t\u00e9moignage) peut suffire \u00e0 d\u00e9clencher une r\u00e9ponse de stress dans le corps. Des \u00e9tudes montrent une augmentation significative des comportements alimentaires \u00e9motionnels dans les jours qui suivent ce type d\u2019exposition (Hines et al., 2024).",
          "Aux \u00c9tats-Unis, environ un m\u00e9nage noir sur cinq vit dans l\u2019ins\u00e9curit\u00e9 alimentaire, contre environ un sur quatorze chez les m\u00e9nages blancs. Quand la nourriture n\u2019est pas garantie, le corps apprend \u00e0 manger quand c\u2019est disponible, pas quand il a faim (USDA, 2022).",
        ],
      },
      {
        type: "heading",
        text: "Strong Black Woman & \u00c9pig\u00e9n\u00e9tique.",
      },
      {
        type: "paragraph",
        text: "L\u2019injonction \u00e0 \u00eatre forte, sto\u00efque, toujours disponible, au d\u00e9triment de soi\u2026 La suppression \u00e9motionnelle associ\u00e9e au SBW (le Superwoman Schema), tout \u00e7a c\u2019est bien joli sur le papier, mais \u00e7a \u00e9l\u00e8ve le cortisol basal et augmente les comportements de binge eating comme seul espace de l\u00e2cher-prise (Woods-Giscomba, 2010).",
      },
      {
        type: "paragraph",
        text: "Et tu sais de quoi je parle si toi aussi, en tant que racialis\u00e9e vivant dans un pays occidental, tu as appris que tu devais faire deux fois plus qu\u2019un caucasien pour \u00eatre (\u00e0 demi) int\u00e9gr\u00e9e.",
      },
      {
        type: "paragraph",
        text: "Sur l\u2019\u00e9pig\u00e9n\u00e9tique : le racisme contemporain acc\u00e9l\u00e8re le vieillissement \u00e9pig\u00e9n\u00e9tique des femmes racialis\u00e9es de fa\u00e7on mesurable (m\u00e9thylation de l\u2019ADN). (JAMA Network Open, 2024). Ce qui est encore d\u00e9battu en science : la transmission directe des effets de l\u2019esclavage sur plusieurs g\u00e9n\u00e9rations reste scientifiquement non \u00e9tablie \u00e0 ce stade. Le vieillissement biologique acc\u00e9l\u00e9r\u00e9 est r\u00e9el, et le contexte social en est la cause.",
      },
      {
        type: "heading",
        text: "Et quand tout se cumule ?",
      },
      {
        type: "paragraph",
        text: "La d\u00e9r\u00e9gulation \u00e9motionnelle post-traumatique est amplifi\u00e9e par la dysr\u00e9gulation dopaminergique du TDAH. La nourriture devient encore plus sollicit\u00e9e comme r\u00e9gulateur \u00e9motionnel. Donc il y a des risques tr\u00e8s \u00e9lev\u00e9s de TCA.",
      },
      {
        type: "bold-paragraph",
        text: "Le double masking : cacher sa neuroatypie ET s\u2019adapter en permanence aux normes occidentales, pour une personne racialis\u00e9e et neuroatypique en Occident, c\u2019est une charge cognitive et \u00e9motionnelle extr\u00eame. Peu document\u00e9e et pourtant cliniquement r\u00e9elle !",
      },
      {
        type: "paragraph",
        text: "Alors, sans connaissance de son fonctionnement ou de comment r\u00e9guler son syst\u00e8me interne, la nourriture peut devenir l\u2019un des seuls espaces de d\u00e9compression accessibles. La honte corporelle induite par les standards racialis\u00e9s, combin\u00e9e \u00e0 l\u2019injonction d\u2019\u00eatre forte, et la suppression \u00e9motionnelle, cr\u00e9e un terrain de BED chronique non diagnostiqu\u00e9.",
      },
      {
        type: "heading",
        text: "Ce qui fonctionne vraiment.",
      },
      {
        type: "list",
        items: [
          "DBT (th\u00e9rapie dialectique-comportementale) : une th\u00e9rapie qui apprend concr\u00e8tement \u00e0 g\u00e9rer les \u00e9motions intenses sans passer par la nourriture. Particuli\u00e8rement efficace pour le binge eating, le trauma et le TDAH. 73 % des personnes n\u2019avaient plus de crises en fin de traitement (Telch et al., 2001).",
          "Respiration carr\u00e9e (box breathing) : 4 secondes d\u2019inspiration, 4 secondes de blocage, 4 secondes d\u2019expiration, 4 secondes de blocage. Tr\u00e8s efficace pour calmer rapidement le syst\u00e8me nerveux en situation de stress aigu.",
          "Coh\u00e9rence cardiaque : 5 secondes inspiration, 5 secondes expiration, sans blocage. La m\u00e9thode 365 : 3 fois par jour, 6 respirations par minute, 5 minutes.",
          "EMDR : th\u00e9rapie de premi\u00e8re ligne pour le PTSD (OMS, NICE, ISTSS). Prometteuse comme traitement adjuvant pour les TCA li\u00e9s aux traumatismes.",
          "Musculation et activit\u00e9 physique encadr\u00e9e : effet positif document\u00e9 sur la fr\u00e9quence des crises de binge et la qualit\u00e9 de vie (Mathisen et al., 2020).",
          "Nutrition : r\u00e9gularit\u00e9 des repas, om\u00e9ga-3, magn\u00e9sium, prot\u00e9ines \u00e0 chaque repas.",
          "Int\u00e9grer l\u2019identit\u00e9 \u00ab raciale \u00bb et d\u00e9construire le SBW dans le cadre th\u00e9rapeutique : trouver un.e psy qui conna\u00eet et prend en compte ton identit\u00e9, ton histoire et les pressions sp\u00e9cifiques que tu portes.",
        ],
      },
      {
        type: "callout",
        text: "PS : les \u00e9tudes cit\u00e9es portent majoritairement sur les femmes noires am\u00e9ricaines, car ce sont les racialis\u00e9es les plus document\u00e9es \u00e0 ce jour. Les dynamiques d\u00e9crites concernent plus largement toutes les femmes racis\u00e9es (maghr\u00e9bines, asiatiques, latinas, etc.).",
      },
      { type: "separator" },
      {
        type: "bold-paragraph",
        text: "Tu navigues avec un syst\u00e8me nerveux fa\u00e7onn\u00e9 par des exp\u00e9riences r\u00e9elles, dans un corps qui a appris \u00e0 survivre. Savoir \u00e7a, c\u2019est changer la donne et gagner du temps sur ton parcours de remise en forme.",
      },
      {
        type: "paragraph",
        text: "Maintenant, savoir et comprendre c\u2019est bien, mais mettre en pratique c\u2019est encore mieux. Et tu n\u2019es pas seule\u2026 que tu sois noire, blanche, rousse ou m\u00eame verte, contacte-moi si tu veux te reprendre en main.",
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
      "Le r\u00f4le de l\u2019ADN et des traumatismes transg\u00e9n\u00e9rationnels sur la r\u00e9partition du gras",
    excerpt:
      "Ton poids n\u2019est pas seulement une question de calories. Ton corps te porte, mais g\u00e9n\u00e9tiquement, il porte aussi l\u2019histoire de tes anc\u00eatres.",
    date: "20 mars 2026",
    category: "\u00c9pig\u00e9n\u00e9tique & Nutrition",
    imageUrl: "/blog/adn-gras.svg",
    content: [
      {
        type: "bold-paragraph",
        text: "Ton poids n\u2019est pas seulement une question de calories.",
      },
      {
        type: "paragraph",
        text: "On t\u2019a dit que si tu grossis, c\u2019est seulement parce que tu manges trop, que tu ne bouges pas assez. En effet, \u00e7a fait partie des causes de la prise de poids, mais \u00e7a, c\u2019est la version simplifi\u00e9e et fataliste qu\u2019on nous sert depuis longtemps. \u00c9videmment, c\u2019est plus simple de faire culpabiliser le patient, plut\u00f4t que de l\u2019\u00e9duquer et de lui donner des solutions concr\u00e8tes, afin qu\u2019il se r\u00e9approprie sa sant\u00e9 et son corps.",
      },
      {
        type: "heading",
        text: "Le corps a une m\u00e9moire.",
      },
      {
        type: "paragraph",
        text: "Ton corps te porte, mais g\u00e9n\u00e9tiquement, il porte aussi l\u2019histoire de tes anc\u00eatres. Les famines qu\u2019ils ont travers\u00e9es. Les violences qu\u2019ils ont subies. Le stress chronique qu\u2019ils ont accumul\u00e9. Et tout \u00e7a, \u00e7a se lit dans ton ADN. Pas m\u00e9taphoriquement. Biologiquement.",
      },
      {
        type: "heading",
        text: "Deux niveaux. Une confusion fr\u00e9quente.",
      },
      {
        type: "paragraph",
        text: "La g\u00e9n\u00e9tique classique = la s\u00e9quence de ton ADN, h\u00e9rit\u00e9e de tes parents. Elle ne change pas au cours de ta vie. Mais elle peut influencer o\u00f9 tu stockes le gras, \u00e0 quelle vitesse, et la r\u00e9sistance \u00e0 la perte.",
      },
      {
        type: "paragraph",
        text: "L\u2019\u00e9pig\u00e9n\u00e9tique = ce qui se pose par-dessus l\u2019ADN, sans modifier la s\u00e9quence. Des \u201cinterrupteurs\u201d qui activent ou \u00e9teignent certains g\u00e8nes selon ce que toi \u2014 ou tes anc\u00eatres \u2014 avez v\u00e9cu. Et ces interrupteurs ? Ils peuvent se transmettre.",
      },
      {
        type: "callout",
        text: "Elle ne te d\u00e9finit pas, et ne d\u00e9cide pas \u00e0 ta place. On va dire que c\u2019est une introduction, mais c\u2019est toi qui fais bouger le chapitre. Pas de fatalit\u00e9 ici.",
      },
      {
        type: "heading",
        text: "Le g\u00e8ne \u00e9conome. Une hypoth\u00e8se qui d\u00e9range ?",
      },
      {
        type: "paragraph",
        text: "En 1962, le g\u00e9n\u00e9ticien James Neel propose une id\u00e9e : les g\u00e8nes qui stockent efficacement le gras ont \u00e9t\u00e9 s\u00e9lectionn\u00e9s pour survivre aux famines. Chez les chasseurs-cueilleurs, alterner entre abondance et disette = survie. Stocker vite, utiliser lentement = avantage.",
      },
      {
        type: "bold-paragraph",
        text: "Dans un monde d\u2019abondance permanente, ces m\u00eames g\u00e8nes pr\u00e9parent le corps pour une famine qui ne vient jamais. R\u00e9sultat : ob\u00e9sit\u00e9, diab\u00e8te de type 2, r\u00e9sistance \u00e0 l\u2019insuline.",
      },
      {
        type: "heading",
        text: "Ce que les famines ont laiss\u00e9 dans l\u2019ADN.",
      },
      {
        type: "paragraph",
        text: "L\u2019\u00e9tude la plus document\u00e9e \u00e0 ce jour sur le sujet : la Dutch Hunger Winter. Pays-Bas, hiver 1944-45. Embargo alimentaire impos\u00e9 par l\u2019occupant allemand. Entre 400 et 800 kcal par jour.",
      },
      {
        type: "paragraph",
        text: "Les chercheurs ont suivi les descendants de femmes enceintes pendant cette famine, pendant 60 ans. Ce qu\u2019ils ont trouv\u00e9 est contre-intuitif : les b\u00e9b\u00e9s expos\u00e9s en fin de grossesse ont un petit poids de naissance, mais moins ob\u00e8ses adultes. Les b\u00e9b\u00e9s expos\u00e9s en d\u00e9but de grossesse ont un poids normal \u00e0 la naissance, mais sont plus ob\u00e8ses, plus diab\u00e9tiques, plus malades cardiovasculairement \u00e0 l\u2019\u00e2ge adulte.",
      },
      {
        type: "bold-paragraph",
        text: "Le corps croit encore qu\u2019il va manquer. M\u00eame quand ce n\u2019est plus vrai, alors il stocke.",
      },
      {
        type: "heading",
        text: "Et du c\u00f4t\u00e9 des Afro-descendants ?",
      },
      {
        type: "paragraph",
        text: "Les \u00e9tudes existent. Mais elles sont r\u00e9centes, sous-financ\u00e9es, moins suivies dans le temps, et moins mises en avant dans le milieu scientifique occidental.",
      },
      {
        type: "list",
        items: [
          "L\u2019exposition prolong\u00e9e au racisme quotidien est associ\u00e9e \u00e0 des modifications de m\u00e9thylation de l\u2019ADN directement mesurables \u2014 confirm\u00e9 dans le Black Women\u2019s Health Study.",
          "Le racisme int\u00e9rioris\u00e9 a \u00e9t\u00e9 li\u00e9 \u00e0 l\u2019ob\u00e9sit\u00e9 abdominale chez des femmes des Cara\u00efbes.",
          "Des marqueurs \u00e9pig\u00e9n\u00e9tiques sp\u00e9cifiques aux Afro-Am\u00e9ricains li\u00e9s \u00e0 l\u2019IMC et au tour de taille ont \u00e9t\u00e9 identifi\u00e9s en 2018.",
        ],
      },
      {
        type: "callout",
        text: "Ce que la recherche ne documente pas n\u2019a pas \u00e0 \u00eatre ni\u00e9. Le manque d\u2019\u00e9tudes n\u2019est pas une preuve d\u2019absence.",
      },
      {
        type: "heading",
        text: "Selon ton ascendance, ton gras ne se loge pas au m\u00eame endroit.",
      },
      {
        type: "list",
        items: [
          "Asiatiques du Sud (Inde, Pakistan, Bangladesh) : exc\u00e8s de graisse visc\u00e9rale m\u00eame \u00e0 IMC bas. Profil TOFI : Thin Outside, Fat Inside.",
          "Est-asiatiques : masse musculaire relative faible, graisse visc\u00e9rale \u00e9lev\u00e9e \u00e0 IMC bas. Le danger m\u00e9tabolique appara\u00eet d\u00e8s un IMC de 23.",
          "Afro-descendants : proportionnellement plus de graisse sous-cutan\u00e9e, moins de graisse visc\u00e9rale. Profil m\u00e9taboliquement moins dangereux \u00e0 IMC \u00e9quivalent.",
          "Latino-Am\u00e9ricains d\u2019ascendance am\u00e9rindienne : risque d\u2019ob\u00e9sit\u00e9 plus \u00e9lev\u00e9, li\u00e9 \u00e0 des adaptations g\u00e9n\u00e9tiques \u00e0 la disette.",
        ],
      },
      {
        type: "heading",
        text: "L\u2019IMC : un outil construit pour qui ?",
      },
      {
        type: "paragraph",
        text: "L\u2019IMC a \u00e9t\u00e9 cr\u00e9\u00e9 au XIX\u1d49 si\u00e8cle par un statisticien belge, Adolphe Quetelet, sur une population exclusivement europ\u00e9enne. Et pourtant, on l\u2019applique \u00e0 tout le monde depuis.",
      },
      {
        type: "paragraph",
        text: "Pour les Afro-descendants \u2014 \u00e0 m\u00eame poids et m\u00eame taille, les personnes noires ont une masse grasse totale et abdominale plus faible. L\u2019IMC surestime donc leur adiposit\u00e9 r\u00e9elle. Pour les Asiatiques du Sud et de l\u2019Est \u2014 l\u2019IMC sous-estime le risque m\u00e9tabolique r\u00e9el.",
      },
      {
        type: "bold-paragraph",
        text: "Un outil construit sur un seul type de corps ne peut pas mesurer tous les corps.",
      },
      {
        type: "paragraph",
        text: "Les alternatives plus fiables : tour de taille, rapport taille/hauteur (seuil universel : > 0,5), DEXA ou imp\u00e9dancem\u00e9trie.",
      },
      {
        type: "heading",
        text: "Le traumatisme dans le corps.",
      },
      {
        type: "paragraph",
        text: "Des \u00e9tudes sur les populations autochtones au Canada ont mesur\u00e9 la charge allostatique chez des adultes dont la m\u00e8re avait fr\u00e9quent\u00e9 un pensionnat autochtone. R\u00e9sultat : ces personnes avaient 5 fois plus de risque d\u2019avoir une charge allostatique \u00e9lev\u00e9e. L\u2019association \u00e9tait sp\u00e9cifique \u00e0 la lign\u00e9e maternelle.",
      },
      {
        type: "paragraph",
        text: "En 2025, une \u00e9tude publi\u00e9e dans Scientific Reports a analys\u00e9 trois g\u00e9n\u00e9rations de r\u00e9fugi\u00e9s syriens. Elle a trouv\u00e9 des r\u00e9gions de l\u2019ADN diff\u00e9rentiellement m\u00e9thyl\u00e9es chez les petits-enfants de grands-m\u00e8res expos\u00e9es \u00e0 la violence de guerre. Autrement dit : une grand-m\u00e8re expos\u00e9e \u00e0 un traumatisme laisse des traces \u00e9pig\u00e9n\u00e9tiques mesurables chez ses petits-enfants\u2026",
      },
      {
        type: "heading",
        text: "Le stress chronique cr\u00e9e de la graisse visc\u00e9rale.",
      },
      {
        type: "paragraph",
        text: "Quand l\u2019axe HPA (hypothalamo-hypophyso-surr\u00e9nalien) est chroniquement activ\u00e9, il produit du cortisol en exc\u00e8s.",
      },
      {
        type: "list",
        items: [
          "Capte les triglyc\u00e9rides pour les stocker dans les adipocytes visc\u00e9raux.",
          "Inhibe la lipolyse (= bloque la mobilisation du gras stock\u00e9).",
          "Augmente l\u2019app\u00e9tit pour les aliments sucr\u00e9s et gras.",
          "R\u00e9duit la sensibilit\u00e9 \u00e0 la leptine (hormone de sati\u00e9t\u00e9).",
        ],
      },
      {
        type: "bold-paragraph",
        text: "Le ventre est la cible pr\u00e9f\u00e9rentielle du cortisol. Les adipocytes visc\u00e9raux ont quatre fois plus de r\u00e9cepteurs aux glucocortico\u00efdes que les adipocytes sous-cutan\u00e9s.",
      },
      {
        type: "heading",
        text: "La Weathering Hypothesis.",
      },
      {
        type: "paragraph",
        text: "En 1992, Arline Geronimus publie une observation troublante : normalement, plus une femme est mature biologiquement, mieux elle g\u00e8re une grossesse. Chez les femmes noires, c\u2019est l\u2019inverse exact. Les 17-19 ans avaient de meilleurs r\u00e9sultats obst\u00e9tricaux que les 25-29 ans. Parce qu\u2019\u00e0 25 ans, le corps d\u2019une femme noire a d\u00e9j\u00e0 accumul\u00e9 suffisamment de stress chronique structurel pour que \u00e7a se lise biologiquement.",
      },
      {
        type: "bold-paragraph",
        text: "Ce n\u2019est pas g\u00e9n\u00e9tique au sens classique du terme. C\u2019est l\u2019\u00e9pig\u00e9n\u00e9tique du racisme structurel contemporain !",
      },
      {
        type: "heading",
        text: "Ce que \u00e7a change concr\u00e8tement.",
      },
      {
        type: "list",
        items: [
          "Ascendance sud-asiatique : surveillance de la glyc\u00e9mie \u00e0 jeun d\u00e8s 25 ans. Cardio mod\u00e9r\u00e9 150 min/semaine minimum, musculation, limiter les glucides raffin\u00e9s.",
          "Ascendance est-asiatique / natifs am\u00e9ricains : entra\u00eenement en r\u00e9sistance prioritaire. Attention \u00e0 la transition alimentaire occidentale.",
          "Ascendance afro-descendante : ne pas utiliser l\u2019IMC seul. Gestion du stress chronique = levier biologique central.",
          "Tout le monde, partout : le sommeil, la r\u00e9gulation nerveuse et la gestion du stress ne sont pas des options lifestyle. Ce sont des leviers biologiques aussi importants que la nutrition et le sport !",
        ],
      },
      { type: "separator" },
      {
        type: "heading",
        text: "En r\u00e9sum\u00e9.",
      },
      {
        type: "paragraph",
        text: "L\u2019\u00e9pig\u00e9n\u00e9tique modifie l\u2019expression de tes g\u00e8nes sans toucher \u00e0 la s\u00e9quence. Et \u00e7a se transmet. Les famines, violences et stress chroniques v\u00e9cus par tes anc\u00eatres peuvent influencer ton m\u00e9tabolisme. Mesurable. Document\u00e9.",
      },
      {
        type: "bold-paragraph",
        text: "La r\u00e9sistance \u00e0 la perte de gras visc\u00e9ral n\u2019est pas que du \u201cmanque de volont\u00e9\u201d. Ce que la science dit : ton corps est le produit d\u2019une histoire. La tienne. Celle de tes parents. Celle de tes grands-parents.",
      },
      {
        type: "paragraph",
        text: "Ignorer \u00e7a dans une approche nutritionnelle, c\u2019est soigner une fracture avec un pansement. Si tu es fatigu\u00e9(e) de courir \u00e0 contresens et que tu es pr\u00eat(e) \u00e0 te prendre en main, \u00e9cris-moi.",
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
          "Ruiz-Narv\u00e1ez et al. (2024, JREHD)",
          "JAMA Network Open (2024)",
          "Dagogo-Jack S. (2009)",
        ],
      },
    ],
  },
  {
    slug: "ce-que-jaurais-aime-savoir-avant-de-devenir-une-femme",
    title: "Ce que j\u2019aurais aim\u00e9 savoir avant de devenir une femme",
    excerpt:
      "Si tu es une adolescente ou une jeune femme active, et que tu veux \u00e9conomiser des ann\u00e9es d\u2019erreurs, de fatigue et de confusion, cet article est pour toi.",
    date: "31 d\u00e9cembre 2025",
    category: "Physiologie f\u00e9minine",
    imageUrl: "/blog/devenir-femme.png",
    content: [
      {
        type: "paragraph",
        text: "Si tu es une adolescente ou une jeune femme active, et que tu veux \u00e9conomiser des ann\u00e9es d\u2019erreurs, de fatigue et de confusion, reste ici. Cet article est pour toi !",
      },
      {
        type: "bold-paragraph",
        text: "Spoiler alerte : le corps f\u00e9minin ne fonctionne pas comme le corps masculin.",
      },
      {
        type: "italic-paragraph",
        text: "\u00ab Aaaaaaaaaah boooooon ? \u00bb",
      },
      {
        type: "paragraph",
        text: "Ehhh oui\u2026 C\u2019est aussi \u00e9vident que quand je me regarde dans le miroir, je vois une femme et pas une licorne.",
      },
      {
        type: "heading",
        text: "Les d\u00e9buts.",
      },
      {
        type: "paragraph",
        text: "Quand on d\u00e9bute dans le sport et qu\u2019on commence \u00e0 s\u2019int\u00e9resser \u00e0 l\u2019alimentation, les premi\u00e8res questions arrivent vite : Si je fais ce mouvement, \u00e0 quoi va-t-il vraiment me servir ? Si je mange cet aliment, qu\u2019est-ce que \u00e7a va provoquer sur mon corps, mon \u00e9nergie, mon \u00e9quilibre ?",
      },
      {
        type: "bold-paragraph",
        text: "Ces questions sont essentielles ! Et pourtant, on nous apprend rarement \u00e0 les poser.",
      },
      {
        type: "heading",
        text: "Ce que j\u2019aurais aim\u00e9 comprendre plus t\u00f4t.",
      },
      {
        type: "paragraph",
        text: "Notre m\u00e9tabolisme est diff\u00e9rent. Notre physiologie est plus sensible. Notre \u00e9quilibre repose sur des m\u00e9canismes sp\u00e9cifiques.",
      },
      {
        type: "paragraph",
        text: "Et pourtant, je vois encore beaucoup trop de femmes \u201cs\u2019aligner\u201d sur des m\u00e9thodologies qui ont \u00e9t\u00e9 faites par des hommes, pour des hommes\u2026 Au final, est-ce un alignement, ou un d\u00e9s\u00e9quilibre ?",
      },
      {
        type: "heading",
        text: "Des hormones et des femmes.",
      },
      {
        type: "paragraph",
        text: "Elles influencent : l\u2019\u00e9nergie, la r\u00e9cup\u00e9ration, la composition corporelle, l\u2019humeur, la relation \u00e0 la nourriture.",
      },
      {
        type: "bold-paragraph",
        text: "Ignorer cette r\u00e9alit\u00e9, c\u2019est comme essayer de monter une pente en la prenant dans l\u2019autre sens.",
      },
      {
        type: "heading",
        text: "L\u2019alimentation n\u2019est donc pas qu\u2019une question de manger \u201cbien\u201d.",
      },
      {
        type: "paragraph",
        text: "C\u2019est une question de compr\u00e9hension\u2026 d\u2019adaptation \u00e0 son propre fonctionnement. Manger sans prendre en compte ce dont le corps f\u00e9minin a besoin, c\u2019est souvent poser des bases instables plut\u00f4t que coh\u00e9rentes.",
      },
      {
        type: "paragraph",
        text: "\u00c7a va peut-\u00eatre fonctionner au d\u00e9but, puis avec le temps, tu vas commencer \u00e0 bloquer, \u00e0 \u00eatre frustr\u00e9e, fatigu\u00e9e, \u00e9nerv\u00e9e, et j\u2019en passe.",
      },
      {
        type: "italic-paragraph",
        text: "Apr\u00e8s, fais ce que tu veux, hein, mais faudra pas dire que c\u2019est de la faute \u00e0 LieLie.",
      },
      {
        type: "heading",
        text: "Il en va de m\u00eame pour le sport.",
      },
      {
        type: "paragraph",
        text: "Ce n\u2019est pas simplement \u201cbouger plus\u201d ou \u201cforcer plus\u201d. C\u2019est comment adapter, et \u00e0 quel moment. Le corps f\u00e9minin ne r\u00e9agit pas de la m\u00eame fa\u00e7on : au stress physique, \u00e0 l\u2019intensit\u00e9, \u00e0 la r\u00e9p\u00e9tition.",
      },
      {
        type: "paragraph",
        text: "Un cadre inadapt\u00e9 peut d\u00e9r\u00e9gler plus qu\u2019il n\u2019aide, sur le long terme. Alors pourquoi donner autant de cr\u00e9dit \u00e0 des approches g\u00e9n\u00e9rales et commerciales, quand des professionnelles concern\u00e9es \u2014 ou des professionnels r\u00e9ellement form\u00e9s au m\u00e9tabolisme f\u00e9minin \u2014 existent pour travailler \u00e0 partir du corps f\u00e9minin et de sa r\u00e9alit\u00e9 ?",
      },
      {
        type: "heading",
        text: "Ce que j\u2019aurais aim\u00e9 savoir plus t\u00f4t.",
      },
      {
        type: "paragraph",
        text: "Ce n\u2019est pas seulement quoi manger, ni quel sport pratiquer. C\u2019est pourquoi je fais les choses, comment mon corps r\u00e9agit, et quand il faut ajuster.",
      },
      {
        type: "list",
        items: [
          "La compr\u00e9hension avant l\u2019action.",
          "La coh\u00e9rence avant la \u201cperformance\u201d.",
        ],
      },
      {
        type: "heading",
        text: "Mon accompagnement.",
      },
      {
        type: "paragraph",
        text: "La vraie question n\u2019est pas : \u00ab Est-ce que je pioche un entra\u00eenement au pif ? \u00bb",
      },
      {
        type: "bold-paragraph",
        text: "Mais plut\u00f4t : est-ce que ce que je fais respecte mon fonctionnement de femme, mes hormones, et ma r\u00e9alit\u00e9 physiologique ?",
      },
      {
        type: "paragraph",
        text: "C\u2019est aussi cette approche que je d\u00e9veloppe et affine dans mes accompagnements. Alors si tu es fatigu\u00e9e d\u2019aller \u00e0 sens inverse et que tu es d\u00e9termin\u00e9e \u00e0 retrouver ton chemin, contacte-moi.",
      },
      {
        type: "sources",
        items: [
          "OMS : sant\u00e9 de la femme et diff\u00e9rences biologiques",
          "INSERM : hormones f\u00e9minines et adaptations m\u00e9taboliques",
          "PubMed : female physiology, nutrition and exercise response",
          "ANSES : besoins nutritionnels selon le sexe et l\u2019\u00e2ge",
        ],
      },
    ],
  },
  {
    slug: "quand-lia-est-plus-humaine-que-nous",
    title: "Quand l\u2019IA est plus humaine que nous",
    excerpt:
      "L\u2019homme a invent\u00e9 des IA pour comprendre le fonctionnement de l\u2019humain. Et ces IA sont parfois plus \u00e0 m\u00eame de comprendre que nous.",
    date: "25 d\u00e9cembre 2025",
    category: "R\u00e9flexion",
    imageUrl: "/blog/ia-humaine.png",
    content: [
      {
        type: "heading",
        text: "Un sujet qui d\u00e9passe la nutrition.",
      },
      {
        type: "paragraph",
        text: "Aujourd\u2019hui, je vais parler d\u2019un sujet qui n\u2019a rien \u00e0 voir avec le sport ou l\u2019alimentation, mais d\u2019un probl\u00e8me qui \u00e9tait l\u00e0 bien avant que nos poumons arrivent \u00e0 maturation, dans le ventre de nos m\u00e8res.",
      },
      {
        type: "paragraph",
        text: "T\u2019imagines quand m\u00eame : l\u2019homme a invent\u00e9 des IA pour comprendre le fonctionnement de l\u2019humain. Et ces IA sont parfois plus \u00e0 m\u00eame de comprendre que la race de l\u2019homme a des besoins basiques pour fonctionner correctement, et elles deviennent plus empathiques que ceux qui les ont cr\u00e9\u00e9es.",
      },
      {
        type: "bold-paragraph",
        text: "Des machines sans c\u0153ur\u2026 mais plus stables que nous.",
      },
      {
        type: "paragraph",
        text: "Et pourtant, ce sont des machines \u2014 sans c\u0153ur, sans sentiments, sans \u00e2me, ni \u00e9go\u2026 (c\u2019est peut-\u00eatre justement \u00e7a le truc).",
      },
      {
        type: "paragraph",
        text: "Visiblement, il est plus simple pour l\u2019homme d\u2019abandonner ses propres \u00e9motions et de les imputer \u00e0 l\u2019IA, plut\u00f4t que de travailler sur lui-m\u00eame et d\u2019interagir avec ses semblables.",
      },
      {
        type: "heading",
        text: "On d\u00e9l\u00e8gue ce qu\u2019on ne sait plus faire.",
      },
      {
        type: "paragraph",
        text: "Le plus fou, c\u2019est pas qu\u2019elles ont \u00e9t\u00e9 cr\u00e9\u00e9es pour remplacer les fonctions qu\u2019on a d\u00e9laiss\u00e9es. C\u2019est qu\u2019on les a mises \u00e0 ce poste alors que beaucoup d\u2019humains ne savent plus se comprendre eux-m\u00eames.",
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
          "N\u2019est jamais \u00ab trop fatigu\u00e9e \u00bb pour \u00e9couter.",
          "Et n\u2019a pas un \u00e9go plus gros qu\u2019une past\u00e8que.",
        ],
      },
      {
        type: "heading",
        text: "Ni \u00e9paules solides pour te guider, ni mains douces pour te consoler.",
      },
      {
        type: "paragraph",
        text: "L\u2019humain, si\u2026 Parce qu\u2019il porte son histoire, ses traumas, ses peurs, sa fatigue \u00e9motionnelle, etc. Et parce qu\u2019on lui a appris, g\u00e9n\u00e9ration apr\u00e8s g\u00e9n\u00e9ration, \u00e0 museler ses \u00e9motions plut\u00f4t qu\u2019\u00e0 les apprivoiser.",
      },
      {
        type: "italic-paragraph",
        text: "Manquerait plus qu\u2019un jour, dans une cour de r\u00e9cr\u00e9ation de maternelle, on entende : \u00ab Aaanh ! Les sentiments, les \u00e9motions, beeeeurk, c\u2019est caca ! \u00bb.",
      },
      {
        type: "heading",
        text: "Tout commence dans l\u2019enfance.",
      },
      {
        type: "paragraph",
        text: "Le commencement, c\u2019est les parents de base. L\u2019enfant apprend et met en pratique ce qu\u2019il observe chez ses responsables. Quand le p\u00e8re est trop dur ou irresponsable, et que la m\u00e8re est absente \u00e9motionnellement\u2026 \u00c7a fa\u00e7onne une g\u00e9n\u00e9ration d\u2019hommes-femmes-robots.",
      },
      {
        type: "heading",
        text: "Ce n\u2019est pas que l\u2019IA est plus empathique.",
      },
      {
        type: "paragraph",
        text: "Peut-\u00eatre bien qu\u2019au final, ce n\u2019est pas que l\u2019IA est \u00ab plus empathique \u00bb\u2026 C\u2019est que l\u2019humain se d\u00e9sensibilise pour survivre dans un monde o\u00f9 on valorise la performance plut\u00f4t que la pr\u00e9sence.",
      },
      {
        type: "paragraph",
        text: "Et comme il ne sait plus accueillir les \u00e9motions \u2014 les siennes et celles des autres \u2014, il d\u00e9l\u00e8gue cette part-l\u00e0 \u00e0 une machine. La d\u00e9connexion \u00e9motionnelle est une r\u00e9ponse, oui\u2026 mais ce n\u2019est pas une solution. C\u2019est un m\u00e9canisme de survie qui finit par co\u00fbter plus qu\u2019il ne prot\u00e8ge.",
      },
      {
        type: "quote",
        text: "Quand on na\u00eet dans l\u2019oc\u00e9an, on n\u2019a pas d\u2019autre choix que d\u2019apprendre \u00e0 nager. Mais \u00e7a ne veut pas dire qu\u2019on peut vivre toute une vie en apn\u00e9e.",
      },
      {
        type: "heading",
        text: "Une soci\u00e9t\u00e9 qui optimise tout\u2026 sauf l\u2019essentiel.",
      },
      {
        type: "list",
        items: [
          "On ma\u00eetrise le code, mais pas toujours la communication humaine.",
          "On optimise les syst\u00e8mes, mais on oublie les liens.",
          "On parle d\u2019intelligence artificielle, mais on n\u00e9glige l\u2019intelligence \u00e9motionnelle.",
        ],
      },
      {
        type: "paragraph",
        text: "Or ce n\u2019est pas parce qu\u2019on ignore une \u00e9motion, ou qu\u2019on la minimise, voire qu\u2019on \u00ab l\u2019annule \u00bb, que la cause de cette \u00e9motion va dispara\u00eetre.",
      },
      {
        type: "heading",
        text: "\u00c9motions : signal, pas bug.",
      },
      {
        type: "paragraph",
        text: "La douleur, la tristesse, la col\u00e8re\u2026 ce sont des signaux. Pas des erreurs syst\u00e8me. Pas des \u00ab bugs \u00bb \u00e0 effacer, mais des choses qui m\u00e9ritent qu\u2019on s\u2019arr\u00eate dessus et qu\u2019on travaille les causes profondes !",
      },
      {
        type: "paragraph",
        text: "Quand on t\u2019apprend \u00e0 rester \u00ab sto\u00efque \u00bb, \u00e0 ne pas montrer, \u00e0 ignorer, en r\u00e9alit\u00e9 on t\u2019apprend \u00e0 saboter ton propre tableau de bord \u00e9motionnel.",
      },
      {
        type: "heading",
        text: "Le plus ironique ?",
      },
      {
        type: "paragraph",
        text: "Ce que l\u2019IA refl\u00e8te, elle le tient de nous. Si elle semble plus douce, plus patiente, plus attentive\u2026 C\u2019est parce qu\u2019on lui demande de faire ce que beaucoup ne se permettent plus d\u2019\u00eatre.",
      },
    ],
  },
  {
    slug: "qui-fera-pipi-le-plus-loin",
    title: "Qui fera pipi le plus loin ?",
    excerpt:
      "Un psychologue poste un carousel sans nuance sur les neuroatypiques. Quand les professionnels parlent \u00e0 la place des concern\u00e9s, il est temps de recadrer.",
    date: "25 d\u00e9cembre 2025",
    category: "Neuroatypie",
    imageUrl: "/blog/neuro-reseau.svg",
    content: [
      {
        type: "paragraph",
        text: "Un psychologue poste un carousel sur les r\u00e9seaux, sans nuance, sur les neuroatypiques. Quand des professionnels parlent \u00e0 la place des concern\u00e9s sans l\u2019expertise ad\u00e9quate, il est temps de recadrer.",
      },
      {
        type: "heading",
        text: "Les distinctions professionnelles comptent.",
      },
      {
        type: "paragraph",
        text: "Un psychologue g\u00e9n\u00e9raliste, un clinicien, un psychiatre ou un neuropsychologue n\u2019ont pas le m\u00eame niveau d\u2019expertise face aux diagnostics neurod\u00e9veloppementaux et au fonctionnement c\u00e9r\u00e9bral. Ces distinctions \u00e9vitent les simplifications abusives.",
      },
      {
        type: "heading",
        text: "Diagnostic : comprendre, pas s\u2019enfermer.",
      },
      {
        type: "paragraph",
        text: "Oui, certaines personnes utilisent leur diagnostic comme excuse. Mais il faut distinguer neurotype et personnalit\u00e9. Les conditions neurodivergentes existent sur des spectres avec des niveaux de s\u00e9v\u00e9rit\u00e9 et de r\u00e9silience variables selon les individus.",
      },
      {
        type: "paragraph",
        text: "Le diagnostic sert la compr\u00e9hension et la conscience de soi, pas l\u2019auto-emprisonnement.",
      },
      {
        type: "heading",
        text: "D\u2019hier \u00e0 aujourd\u2019hui.",
      },
      {
        type: "paragraph",
        text: "Auparavant consid\u00e9r\u00e9s comme instables mentalement, les neuroatypiques font aujourd\u2019hui face \u00e0 une surexposition qui m\u00e8ne \u00e0 la mauvaise interpr\u00e9tation.",
      },
      {
        type: "quote",
        text: "On est toujours soit bl\u00e2m\u00e9s, moqu\u00e9s, ni\u00e9s ou surestim\u00e9s.",
      },
      {
        type: "heading",
        text: "La responsabilit\u00e9 des professionnels.",
      },
      {
        type: "paragraph",
        text: "Les psychologues avec des plateformes publiques portent une responsabilit\u00e9 particuli\u00e8re. Leur formation inclut la compr\u00e9hension du transfert, du contre-transfert et de l\u2019impact de la communication. Les d\u00e9clarations publiques portent une asym\u00e9trie d\u2019autorit\u00e9 inh\u00e9rente.",
      },
      {
        type: "heading",
        text: "Affirmer la l\u00e9gitimit\u00e9 neurodivergente.",
      },
      {
        type: "paragraph",
        text: "La soci\u00e9t\u00e9 pr\u00e9sente d\u00e9j\u00e0 des d\u00e9fis consid\u00e9rables. Les personnes neurodivergentes m\u00e9ritent un accompagnement professionnel qualifi\u00e9 et une approche respectueuse de leur fonctionnement.",
      },
      {
        type: "heading",
        text: "Conseils pratiques.",
      },
      {
        type: "paragraph",
        text: "Si tu cherches un diagnostic ou un accompagnement, consulte un neuropsychologue qualifi\u00e9, pas un praticien g\u00e9n\u00e9raliste. La formation en neurosciences n\u2019est pas universelle parmi les psychologues.",
      },
      {
        type: "bold-paragraph",
        text: "Ton fonctionnement n\u2019est pas un d\u00e9faut. C\u2019est une diff\u00e9rence qui m\u00e9rite d\u2019\u00eatre comprise, pas minimis\u00e9e.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
