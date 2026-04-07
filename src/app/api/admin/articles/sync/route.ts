import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * One-time sync route: fetches the original articles from so-ma.fr
 * and updates the database to match exactly.
 * POST /api/admin/articles/sync
 */

const ARTICLES_TO_SYNC = [
  {
    slug: "qui-fera-pipi-le-plus-loin",
    url: "https://so-ma.fr/qui-fera-pipi-le-plus-loin/",
    title: "Qui fera pipi le plus loin ?",
    excerpt:
      "Un psychologue poste un carousel sur les réseaux, sans nuance, sur les neuroatypiques. Quand des professionnels parlent à la place des concernés sans l'expertise adéquate, il est temps de recadrer.",
    category: "Neuroatypie",
    date: "25 décembre 2025",
  },
  {
    slug: "quand-lia-est-plus-humaine-que-nous",
    url: "https://so-ma.fr/quand-lia-est-plus-humaine-que-nous/",
    title: "Quand l'IA est plus humaine que nous.",
    excerpt:
      "L'homme a inventé des IA pour comprendre le fonctionnement de l'humain. Et ces IA deviennent parfois plus empathiques que ceux qui les ont créées.",
    category: "Réflexion",
    date: "25 décembre 2025",
  },
  {
    slug: "ce-que-jaurais-aime-savoir-avant-de-devenir-une-femme",
    url: "https://so-ma.fr/ce-que-jaurais-aime-savoir-avant-de-devenir-une-femme/",
    title: "Ce que j'aurais aimé savoir avant de devenir une femme.",
    excerpt:
      "Si tu es une adolescente ou une jeune femme active, et que tu veux économiser des années d'erreurs, de fatigue et de confusion, reste ici. Cet article est pour toi !",
    category: "Sport & Nutrition féminine",
    date: "31 décembre 2025",
  },
  {
    slug: "le-role-de-ladn-et-des-traumatismes-transgenerationnel",
    url: "https://so-ma.fr/le-role-de-ladn-et-des-traumatismes-transgenerationnel-sur-la-repartition-du-gras/",
    title:
      "Le rôle de l'ADN et des traumatismes transgenerationnel sur la répartition du gras.",
    excerpt:
      "On t'a dit que si tu grossis, c'est seulement parce que tu manges trop, que tu ne bouges pas assez. Mais c'est la version simplifiée et fataliste qu'on nous sert depuis des années.",
    category: "Nutrition & Science",
    date: "20 mars 2026",
  },
  {
    slug: "le-rapport-avec-la-nourriture-tnd-traumas-neuroatypie",
    url: "https://so-ma.fr/le-rapport-avec-la-nourriture-pour-les-tnd-les-traumas-et-la-neuroatypie/",
    title:
      "Le rapport avec la nourriture pour les TND, les traumas et la neuroatypie.",
    excerpt:
      "Il existe plein de raisons qui peuvent expliquer ton rapport à la nourriture. Mais trois d'entre elles sont particulièrement sous-estimées — et pourtant, ce sont souvent elles qui bloquent.",
    category: "Nutrition & Neuroatypie",
    date: "29 mars 2026",
  },
];

function htmlToMarkdown(html: string): string {
  // Extract article body only
  const articleMatch = html.match(
    /<article[\s\S]*?<\/article>/i
  );
  if (!articleMatch) return "";

  let text = articleMatch[0];

  // Remove script/style
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");

  // Remove sharing/social links section
  text = text.replace(/Partager:[\s\S]*$/i, "");

  // Remove header metadata (BLOG, Par admin, sur date)
  text = text.replace(/^\s*BLOG[\s\S]*?<\/header>/i, "");

  // Remove the author signature at the end
  text = text.replace(
    /So-ma\.fr\s*[–—-]\s*Elie\.?\s*Ta conseill[èe]re en nutrition[\s\S]*$/i,
    ""
  );

  // Convert <br> and </p> to newlines
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n\n");
  text = text.replace(/<\/div>/gi, "\n");

  // Convert bold
  text = text.replace(/<strong>([\s\S]*?)<\/strong>/gi, "**$1**");
  text = text.replace(/<b>([\s\S]*?)<\/b>/gi, "**$1**");

  // Convert italic
  text = text.replace(/<em>([\s\S]*?)<\/em>/gi, "*$1*");
  text = text.replace(/<i>([\s\S]*?)<\/i>/gi, "*$1*");

  // Convert headings
  text = text.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n## $1\n");
  text = text.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n### $1\n");

  // Convert list items
  text = text.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n");

  // Remove remaining HTML tags
  text = text.replace(/<[^>]*>/g, "");

  // Clean up HTML entities
  text = text.replace(/&nbsp;/g, " ");
  text = text.replace(/&#8217;/g, "'");
  text = text.replace(/&#8220;/g, "\u201C");
  text = text.replace(/&#8221;/g, "\u201D");
  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/&hellip;/g, "\u2026");
  text = text.replace(/&rsquo;/g, "\u2019");
  text = text.replace(/&lsquo;/g, "\u2018");
  text = text.replace(/&rdquo;/g, "\u201D");
  text = text.replace(/&ldquo;/g, "\u201C");
  text = text.replace(/&mdash;/g, "\u2014");
  text = text.replace(/&ndash;/g, "\u2013");
  text = text.replace(/&#8211;/g, "\u2013");
  text = text.replace(/&#8212;/g, "\u2014");
  text = text.replace(/&#\d+;/g, "");

  // Clean up whitespace
  text = text.replace(/\t/g, "");
  text = text.replace(/ +/g, " ");
  text = text.replace(/\n /g, "\n");
  text = text.replace(/ \n/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.trim();

  // Remove metadata lines at top (BLOG, Par admin, sur date)
  const lines = text.split("\n");
  const cleanLines: string[] = [];
  let foundContent = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!foundContent) {
      if (
        trimmed === "BLOG" ||
        trimmed === "" ||
        trimmed.startsWith("Par") ||
        trimmed.startsWith("sur ") ||
        trimmed.match(/^\d{2}\.\d{2}\.\d{4}$/) ||
        trimmed === "admin4718"
      ) {
        continue;
      }
      // Skip the title (already stored separately)
      foundContent = true;
    }
    cleanLines.push(line);
  }

  return cleanLines.join("\n").trim();
}

export async function POST() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user as { role: string }).role !== "ADMIN"
  ) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  const results: { slug: string; status: string }[] = [];

  for (const article of ARTICLES_TO_SYNC) {
    try {
      // Fetch original from so-ma.fr
      const res = await fetch(article.url);
      if (!res.ok) {
        results.push({ slug: article.slug, status: `fetch error: ${res.status}` });
        continue;
      }

      const html = await res.text();
      const content = htmlToMarkdown(html);

      if (!content || content.length < 50) {
        results.push({ slug: article.slug, status: "content extraction failed" });
        continue;
      }

      // Upsert article
      const existing = await prisma.article.findUnique({
        where: { slug: article.slug },
      });

      if (existing) {
        await prisma.article.update({
          where: { slug: article.slug },
          data: {
            title: article.title,
            excerpt: article.excerpt,
            category: article.category,
            date: article.date,
            content,
            published: true,
          },
        });
        results.push({ slug: article.slug, status: "updated" });
      } else {
        await prisma.article.create({
          data: {
            slug: article.slug,
            title: article.title,
            excerpt: article.excerpt,
            category: article.category,
            date: article.date,
            content,
            published: true,
          },
        });
        results.push({ slug: article.slug, status: "created" });
      }
    } catch (err) {
      results.push({
        slug: article.slug,
        status: `error: ${err instanceof Error ? err.message : "unknown"}`,
      });
    }
  }

  return NextResponse.json({ results });
}
