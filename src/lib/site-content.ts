import { prisma } from "./db";
import { DEFAULT_CONTENT } from "./site-content-config";

// Réexporter pour l'usage serveur
export { SECTION_LABELS, DEFAULT_CONTENT } from "./site-content-config";
export type { ContentField } from "./site-content-config";

type ContentMap = Record<string, string>;

/**
 * Récupère tout le contenu d'une section.
 * Retourne un objet { key: value } avec fallback sur les valeurs par défaut.
 */
export async function getSection(section: string): Promise<ContentMap> {
  const defaults = DEFAULT_CONTENT.filter((c) => c.section === section);
  const map: ContentMap = {};
  for (const d of defaults) {
    map[d.key] = d.value;
  }

  try {
    const rows = await prisma.siteContent.findMany({
      where: { section },
      select: { key: true, value: true },
    });
    for (const row of rows) {
      map[row.key] = row.value;
    }
  } catch {
    // Fallback defaults
  }

  return map;
}

/**
 * Récupère toutes les sections d'un coup.
 */
export async function getAllSections(
  sections: string[]
): Promise<Record<string, ContentMap>> {
  const result: Record<string, ContentMap> = {};

  for (const section of sections) {
    result[section] = {};
    const defaults = DEFAULT_CONTENT.filter((c) => c.section === section);
    for (const d of defaults) {
      result[section][d.key] = d.value;
    }
  }

  try {
    const rows = await prisma.siteContent.findMany({
      where: { section: { in: sections } },
      select: { section: true, key: true, value: true },
    });
    for (const row of rows) {
      if (result[row.section]) {
        result[row.section][row.key] = row.value;
      }
    }
  } catch {
    // Fallback defaults
  }

  return result;
}

/**
 * Seed initial : insère les valeurs par défaut si la table est vide.
 */
export async function seedContent() {
  const count = await prisma.siteContent.count();
  if (count > 0) return;

  await prisma.siteContent.createMany({
    data: DEFAULT_CONTENT.map((c) => ({
      section: c.section,
      key: c.key,
      value: c.value,
      type: c.type,
      label: c.label,
      position: c.position,
    })),
  });
}
