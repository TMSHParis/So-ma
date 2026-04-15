/**
 * Aliments complémentaires à CIQUAL : plats du monde absents ou mal nommés
 * dans la base officielle française. Macros pour 100 g (source : USDA
 * FoodData Central + publications ANSES + données publiques recoupées).
 *
 * Régions : Méditerranée (grecque, italienne, libanaise, turque),
 * Caucase (géorgien, arménien, russe), Maghreb (marocain, tunisien,
 * algérien) et Afrique sub-saharienne.
 */
export type WorldFood = {
  name: string;
  region: string;
  kcal: number;
  p: number;   // protein g
  c: number;   // carbs g
  f: number;   // fat g
  fi: number;  // fiber g
};

export const WORLD_FOODS: WorldFood[] = [
  // ═════════════════════════════════════════════════════
  // MÉDITERRANÉE
  // ═════════════════════════════════════════════════════
  // Grèce
  { name: "Moussaka", region: "Méditerranée", kcal: 162, p: 7.5, c: 9, f: 10.5, fi: 2.2 },
  { name: "Souvlaki (porc grillé)", region: "Méditerranée", kcal: 230, p: 22, c: 3, f: 14, fi: 0.5 },
  { name: "Souvlaki de poulet", region: "Méditerranée", kcal: 190, p: 25, c: 2, f: 9, fi: 0.3 },
  { name: "Gyros (pita porc)", region: "Méditerranée", kcal: 240, p: 13, c: 23, f: 11, fi: 1.8 },
  { name: "Tzatziki", region: "Méditerranée", kcal: 95, p: 3.5, c: 4, f: 7.2, fi: 0.3 },
  { name: "Dolmas (feuilles de vigne farcies)", region: "Méditerranée", kcal: 190, p: 3.2, c: 22, f: 9.5, fi: 2.5 },
  { name: "Spanakopita (feuilleté épinards feta)", region: "Méditerranée", kcal: 260, p: 7, c: 22, f: 16, fi: 2 },
  { name: "Baklava", region: "Méditerranée", kcal: 430, p: 6, c: 50, f: 23, fi: 2.5 },
  { name: "Loukoumades (beignets miel)", region: "Méditerranée", kcal: 370, p: 5.5, c: 55, f: 15, fi: 1 },
  { name: "Salade grecque (féta, olives)", region: "Méditerranée", kcal: 125, p: 4.2, c: 5, f: 10, fi: 2 },
  { name: "Pastitsio (gratin macaroni bœuf)", region: "Méditerranée", kcal: 195, p: 9, c: 18, f: 10, fi: 1.2 },
  { name: "Feta", region: "Méditerranée", kcal: 264, p: 14, c: 4, f: 21, fi: 0 },
  { name: "Halloumi", region: "Méditerranée", kcal: 321, p: 21, c: 2.2, f: 25, fi: 0 },

  // Liban / Levant
  { name: "Houmous (pois chiches, tahini)", region: "Méditerranée", kcal: 177, p: 8, c: 20, f: 8.5, fi: 5 },
  { name: "Mutabal / baba ghanoush", region: "Méditerranée", kcal: 130, p: 3, c: 10, f: 9, fi: 3.5 },
  { name: "Falafel", region: "Méditerranée", kcal: 333, p: 13.3, c: 31.8, f: 17.8, fi: 4.9 },
  { name: "Taboulé libanais (persil, boulgour)", region: "Méditerranée", kcal: 130, p: 3, c: 20, f: 4.5, fi: 3 },
  { name: "Fattouch (salade pain grillé)", region: "Méditerranée", kcal: 110, p: 2.5, c: 12, f: 6, fi: 2.5 },
  { name: "Kebbé (kibbeh bœuf boulgour)", region: "Méditerranée", kcal: 240, p: 13, c: 18, f: 13, fi: 2 },
  { name: "Manakich zaatar", region: "Méditerranée", kcal: 290, p: 7.5, c: 35, f: 13, fi: 2.5 },
  { name: "Shish taouk (brochette poulet mariné)", region: "Méditerranée", kcal: 175, p: 26, c: 2, f: 7, fi: 0.3 },
  { name: "Chawarma poulet", region: "Méditerranée", kcal: 245, p: 20, c: 12, f: 13, fi: 1.5 },
  { name: "Chawarma bœuf", region: "Méditerranée", kcal: 285, p: 18, c: 12, f: 18, fi: 1.5 },
  { name: "Mujadara (riz et lentilles)", region: "Méditerranée", kcal: 190, p: 6.5, c: 32, f: 4, fi: 5 },
  { name: "Labneh (fromage de yaourt)", region: "Méditerranée", kcal: 180, p: 8, c: 5, f: 15, fi: 0 },
  { name: "Kanafeh (kadaif fromage sirop)", region: "Méditerranée", kcal: 390, p: 9, c: 45, f: 20, fi: 1.5 },
  { name: "Maamoul (gâteau datte/noix)", region: "Méditerranée", kcal: 400, p: 5.5, c: 55, f: 18, fi: 3 },
  { name: "Kaak (petit pain sésame)", region: "Méditerranée", kcal: 305, p: 9, c: 55, f: 6, fi: 3 },
  { name: "Fatayer épinards", region: "Méditerranée", kcal: 230, p: 6, c: 30, f: 10, fi: 3 },

  // Turquie
  { name: "Kebab döner (agneau)", region: "Méditerranée", kcal: 290, p: 19, c: 15, f: 18, fi: 1.5 },
  { name: "Kebab iskender", region: "Méditerranée", kcal: 275, p: 17, c: 20, f: 15, fi: 1.5 },
  { name: "Lahmacun (pizza turque)", region: "Méditerranée", kcal: 235, p: 10, c: 30, f: 8, fi: 2.5 },
  { name: "Köfte (boulettes viande)", region: "Méditerranée", kcal: 255, p: 18, c: 6, f: 17, fi: 1 },
  { name: "Pide (pain turc fourré)", region: "Méditerranée", kcal: 260, p: 10, c: 35, f: 8, fi: 2 },
  { name: "Simit (pain sésame)", region: "Méditerranée", kcal: 320, p: 9, c: 60, f: 5, fi: 3 },
  { name: "Menemen (œufs tomate poivron)", region: "Méditerranée", kcal: 135, p: 7, c: 6, f: 10, fi: 1.5 },
  { name: "Ayran (boisson yaourt salé)", region: "Méditerranée", kcal: 45, p: 2.5, c: 3, f: 2.5, fi: 0 },
  { name: "Çiğ köfte (boulgour épicé)", region: "Méditerranée", kcal: 175, p: 6, c: 28, f: 4.5, fi: 4 },

  // Italie (absents de CIQUAL ou peu visibles)
  { name: "Focaccia", region: "Méditerranée", kcal: 290, p: 7, c: 42, f: 10, fi: 1.8 },
  { name: "Arancini (boulettes de riz)", region: "Méditerranée", kcal: 250, p: 7, c: 35, f: 9, fi: 1.5 },
  { name: "Panzanella (salade pain toscan)", region: "Méditerranée", kcal: 140, p: 3.5, c: 18, f: 6, fi: 2 },
  { name: "Vitello tonnato", region: "Méditerranée", kcal: 210, p: 22, c: 2, f: 13, fi: 0.3 },
  { name: "Saltimbocca alla romana", region: "Méditerranée", kcal: 230, p: 25, c: 2, f: 14, fi: 0.2 },
  { name: "Cannoli siciliens", region: "Méditerranée", kcal: 385, p: 7, c: 42, f: 21, fi: 1 },
  { name: "Panettone", region: "Méditerranée", kcal: 365, p: 7.5, c: 55, f: 13, fi: 1.5 },

  // Espagne
  { name: "Tortilla de patatas", region: "Méditerranée", kcal: 150, p: 5, c: 13, f: 9, fi: 1.3 },
  { name: "Gazpacho", region: "Méditerranée", kcal: 45, p: 1.2, c: 6, f: 2, fi: 1.5 },
  { name: "Paëlla (riz safran fruits de mer)", region: "Méditerranée", kcal: 160, p: 10, c: 20, f: 4.5, fi: 1 },
  { name: "Patatas bravas", region: "Méditerranée", kcal: 165, p: 2.5, c: 22, f: 8, fi: 2.5 },
  { name: "Chorizo (saucisse sèche)", region: "Méditerranée", kcal: 455, p: 24, c: 1.9, f: 38, fi: 0 },
  { name: "Jamón serrano", region: "Méditerranée", kcal: 241, p: 30, c: 0, f: 13, fi: 0 },
  { name: "Churros", region: "Méditerranée", kcal: 420, p: 5, c: 45, f: 25, fi: 1.5 },

  // ═════════════════════════════════════════════════════
  // CAUCASE / EUROPE DE L'EST
  // ═════════════════════════════════════════════════════
  { name: "Khachapuri (pain géorgien fromage)", region: "Caucase", kcal: 315, p: 11, c: 35, f: 14, fi: 1.5 },
  { name: "Khinkali (raviolis géorgiens)", region: "Caucase", kcal: 220, p: 9, c: 26, f: 8, fi: 1.2 },
  { name: "Chakhokhbili (ragoût poulet géorgien)", region: "Caucase", kcal: 140, p: 14, c: 5, f: 7.5, fi: 1 },
  { name: "Lobio (haricots rouges géorgiens)", region: "Caucase", kcal: 125, p: 7, c: 18, f: 2.5, fi: 6 },
  { name: "Adjika (pâte épicée)", region: "Caucase", kcal: 75, p: 2, c: 10, f: 3, fi: 2.5 },
  { name: "Satsivi (poulet sauce noix)", region: "Caucase", kcal: 225, p: 14, c: 6, f: 17, fi: 1.5 },
  { name: "Chachapouri Adjarouli", region: "Caucase", kcal: 340, p: 12, c: 33, f: 18, fi: 1.5 },
  { name: "Borsch (soupe betterave)", region: "Caucase", kcal: 60, p: 2.5, c: 8, f: 2, fi: 2 },
  { name: "Chtchi (soupe chou)", region: "Caucase", kcal: 45, p: 2, c: 5, f: 2, fi: 1.5 },
  { name: "Okrochka (soupe froide kvass)", region: "Caucase", kcal: 65, p: 3.5, c: 6, f: 3, fi: 1 },
  { name: "Pelmenis (raviolis russes)", region: "Caucase", kcal: 245, p: 10, c: 28, f: 10, fi: 1.3 },
  { name: "Vareniki (pierogis)", region: "Caucase", kcal: 210, p: 6, c: 35, f: 5, fi: 1.5 },
  { name: "Blinis", region: "Caucase", kcal: 220, p: 8, c: 32, f: 6.5, fi: 1 },
  { name: "Stroganoff de bœuf", region: "Caucase", kcal: 200, p: 14, c: 6, f: 14, fi: 0.5 },
  { name: "Pirojki (chaussons fourrés)", region: "Caucase", kcal: 275, p: 8, c: 35, f: 11, fi: 1.5 },
  { name: "Koulibiac (saumon en croûte)", region: "Caucase", kcal: 270, p: 13, c: 22, f: 14, fi: 1.2 },
  { name: "Basturma (viande séchée)", region: "Caucase", kcal: 240, p: 35, c: 2, f: 10, fi: 0 },
  { name: "Dolma arménien", region: "Caucase", kcal: 180, p: 4, c: 20, f: 9, fi: 2.2 },
  { name: "Lavash (pain arménien)", region: "Caucase", kcal: 275, p: 9, c: 55, f: 1.5, fi: 2 },
  { name: "Manti (raviolis arméniens)", region: "Caucase", kcal: 215, p: 9, c: 28, f: 8, fi: 1.5 },
  { name: "Tolma (légumes farcis)", region: "Caucase", kcal: 155, p: 5, c: 18, f: 7, fi: 2.5 },
  { name: "Gata (brioche arménienne)", region: "Caucase", kcal: 400, p: 7, c: 50, f: 19, fi: 1.5 },

  // ═════════════════════════════════════════════════════
  // MAGHREB
  // ═════════════════════════════════════════════════════
  { name: "Couscous poulet merguez", region: "Maghreb", kcal: 170, p: 9, c: 22, f: 5, fi: 2 },
  { name: "Tajine poulet citron olives", region: "Maghreb", kcal: 130, p: 13, c: 5, f: 7, fi: 1.2 },
  { name: "Tajine agneau pruneaux", region: "Maghreb", kcal: 195, p: 14, c: 12, f: 11, fi: 1.5 },
  { name: "Tajine kefta œuf", region: "Maghreb", kcal: 170, p: 12, c: 6, f: 11, fi: 1 },
  { name: "Tajine kafta", region: "Maghreb", kcal: 160, p: 12, c: 4, f: 11, fi: 0.8 },
  { name: "Méchoui (agneau rôti)", region: "Maghreb", kcal: 260, p: 24, c: 0, f: 18, fi: 0 },
  { name: "Pastilla poulet amandes", region: "Maghreb", kcal: 290, p: 11, c: 24, f: 17, fi: 2 },
  { name: "Harira (soupe tomate pois chiches)", region: "Maghreb", kcal: 70, p: 4, c: 11, f: 1.5, fi: 2 },
  { name: "Chorba frik", region: "Maghreb", kcal: 85, p: 5, c: 12, f: 2, fi: 1.5 },
  { name: "Chakchouka (œufs tomate poivron)", region: "Maghreb", kcal: 100, p: 5, c: 6, f: 6.5, fi: 1.5 },
  { name: "Mechouia (salade grillée)", region: "Maghreb", kcal: 85, p: 2, c: 6, f: 6, fi: 2 },
  { name: "Brick à l'œuf", region: "Maghreb", kcal: 230, p: 8, c: 20, f: 13, fi: 1.2 },
  { name: "Brick au thon", region: "Maghreb", kcal: 245, p: 11, c: 20, f: 14, fi: 1.2 },
  { name: "Msemen (crêpe feuilletée)", region: "Maghreb", kcal: 290, p: 7, c: 40, f: 11, fi: 1.8 },
  { name: "Baghrir (crêpe mille trous)", region: "Maghreb", kcal: 205, p: 6, c: 40, f: 2, fi: 1.5 },
  { name: "Rghaif", region: "Maghreb", kcal: 285, p: 7, c: 40, f: 11, fi: 1.8 },
  { name: "Harissa", region: "Maghreb", kcal: 70, p: 2, c: 5, f: 4, fi: 4 },
  { name: "Merguez", region: "Maghreb", kcal: 320, p: 14, c: 1.5, f: 29, fi: 0 },
  { name: "Kefta / kofta", region: "Maghreb", kcal: 250, p: 16, c: 2, f: 20, fi: 0.5 },
  { name: "Makroud (semoule miel datte)", region: "Maghreb", kcal: 395, p: 5, c: 60, f: 15, fi: 3 },
  { name: "Corne de gazelle", region: "Maghreb", kcal: 420, p: 8, c: 50, f: 20, fi: 2.5 },
  { name: "Chebakia (beignet sésame miel)", region: "Maghreb", kcal: 440, p: 6, c: 55, f: 22, fi: 2 },
  { name: "Zlabia", region: "Maghreb", kcal: 430, p: 3.5, c: 70, f: 16, fi: 0.5 },
  { name: "Ghoriba (sablé marocain)", region: "Maghreb", kcal: 470, p: 8, c: 50, f: 27, fi: 2 },
  { name: "Sellou / sfouf", region: "Maghreb", kcal: 515, p: 11, c: 55, f: 28, fi: 5 },
  { name: "Loubia (haricots blancs)", region: "Maghreb", kcal: 130, p: 8, c: 18, f: 3, fi: 6 },
  { name: "Hlalem (pâtes tunisiennes)", region: "Maghreb", kcal: 155, p: 5, c: 27, f: 3, fi: 1.5 },
  { name: "Ojja (œufs merguez sauce)", region: "Maghreb", kcal: 145, p: 9, c: 5, f: 10, fi: 1.2 },
  { name: "Rfissa (poulet lentilles msemen)", region: "Maghreb", kcal: 215, p: 11, c: 22, f: 10, fi: 3 },
  { name: "Lham lahlou (tajine sucré)", region: "Maghreb", kcal: 220, p: 10, c: 22, f: 10, fi: 1.8 },
  { name: "Dolma maghrébine (légumes farcis)", region: "Maghreb", kcal: 160, p: 6, c: 18, f: 7, fi: 2.5 },
  { name: "Thé à la menthe sucré", region: "Maghreb", kcal: 40, p: 0, c: 10, f: 0, fi: 0 },

  // ═════════════════════════════════════════════════════
  // AFRIQUE SUB-SAHARIENNE
  // ═════════════════════════════════════════════════════
  { name: "Mafé (ragoût arachide)", region: "Afrique", kcal: 210, p: 10, c: 12, f: 14, fi: 2.5 },
  { name: "Yassa poulet", region: "Afrique", kcal: 175, p: 14, c: 8, f: 10, fi: 1.2 },
  { name: "Yassa poisson", region: "Afrique", kcal: 155, p: 14, c: 8, f: 8, fi: 1.2 },
  { name: "Thiéboudienne (riz au poisson)", region: "Afrique", kcal: 175, p: 9, c: 22, f: 5.5, fi: 2 },
  { name: "Poulet DG (plantain, poulet)", region: "Afrique", kcal: 190, p: 12, c: 18, f: 8.5, fi: 1.8 },
  { name: "Ndolé (feuilles amères)", region: "Afrique", kcal: 160, p: 10, c: 8, f: 10, fi: 3 },
  { name: "Kedjenou (poulet mijoté)", region: "Afrique", kcal: 145, p: 14, c: 4, f: 8, fi: 1 },
  { name: "Attiéké (semoule de manioc)", region: "Afrique", kcal: 165, p: 1.5, c: 39, f: 0.3, fi: 1.5 },
  { name: "Foutou / fufu (banane manioc)", region: "Afrique", kcal: 155, p: 1.2, c: 38, f: 0.3, fi: 2 },
  { name: "Riz jollof", region: "Afrique", kcal: 165, p: 4, c: 29, f: 3, fi: 1.2 },
  { name: "Egusi (soupe graines melon)", region: "Afrique", kcal: 210, p: 11, c: 8, f: 15, fi: 2 },
  { name: "Suya (brochette bœuf épicée)", region: "Afrique", kcal: 230, p: 24, c: 3, f: 13, fi: 0.5 },
  { name: "Injera (pain éthiopien teff)", region: "Afrique", kcal: 85, p: 3, c: 18, f: 0.5, fi: 2 },
  { name: "Doro wat (poulet éthiopien)", region: "Afrique", kcal: 175, p: 15, c: 5, f: 10, fi: 1 },
  { name: "Misir wat (lentilles rouges)", region: "Afrique", kcal: 120, p: 7, c: 18, f: 2.5, fi: 4.5 },
  { name: "Bobotie (plat sud-africain)", region: "Afrique", kcal: 215, p: 13, c: 10, f: 13, fi: 1 },
  { name: "Piri piri (poulet épicé)", region: "Afrique", kcal: 190, p: 25, c: 2, f: 9, fi: 0.5 },
  { name: "Akara (beignets niébé)", region: "Afrique", kcal: 290, p: 13, c: 22, f: 17, fi: 5 },
  { name: "Pastels (friands poisson)", region: "Afrique", kcal: 280, p: 9, c: 28, f: 14, fi: 1.5 },
  { name: "Thiakry (couscous millet lait)", region: "Afrique", kcal: 150, p: 4, c: 25, f: 4, fi: 1.5 },
  { name: "Bissap (jus d'hibiscus)", region: "Afrique", kcal: 40, p: 0.2, c: 10, f: 0, fi: 0.2 },
  { name: "Bouye (jus de baobab)", region: "Afrique", kcal: 55, p: 0.8, c: 13, f: 0.1, fi: 1.5 },
  { name: "Gingembre boisson (gnamakoudji)", region: "Afrique", kcal: 45, p: 0.3, c: 11, f: 0.1, fi: 0.3 },
  { name: "Foufou de banane plantain", region: "Afrique", kcal: 125, p: 1.2, c: 32, f: 0.3, fi: 2.3 },
  { name: "Garba (thon attiéké)", region: "Afrique", kcal: 185, p: 10, c: 28, f: 4, fi: 1.5 },
  { name: "Soupe kandja (gombo)", region: "Afrique", kcal: 90, p: 6, c: 6, f: 5, fi: 2.5 },
  { name: "Alloco (banane plantain frite)", region: "Afrique", kcal: 165, p: 1.2, c: 30, f: 5, fi: 2.5 },
  { name: "Poisson braisé (daurade)", region: "Afrique", kcal: 135, p: 22, c: 0, f: 5, fi: 0 },
  { name: "Tô (pâte de mil)", region: "Afrique", kcal: 140, p: 3.5, c: 30, f: 0.8, fi: 1.8 },
];
