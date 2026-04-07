import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) return {};
  return {
    title: `${article.title} | So-ma`,
    description: article.excerpt,
  };
}

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: { type: string; content: string; items?: string[] }[] = [];
  let currentList: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Flush list if we hit a non-list line
    if (currentList.length > 0 && !line.startsWith("- ") && !line.startsWith("* ")) {
      elements.push({ type: "list", content: "", items: [...currentList] });
      currentList = [];
    }

    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("## ")) {
      elements.push({ type: "heading", content: trimmed.slice(3) });
    } else if (trimmed.startsWith("### ")) {
      elements.push({ type: "subheading", content: trimmed.slice(4) });
    } else if (trimmed.startsWith("> ")) {
      elements.push({ type: "quote", content: trimmed.slice(2) });
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      currentList.push(trimmed.slice(2));
    } else if (trimmed.startsWith("---")) {
      elements.push({ type: "separator", content: "" });
    } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      elements.push({ type: "bold", content: trimmed.slice(2, -2) });
    } else if (trimmed.startsWith("*") && trimmed.endsWith("*") && !trimmed.startsWith("**")) {
      elements.push({ type: "italic", content: trimmed.slice(1, -1) });
    } else {
      elements.push({ type: "paragraph", content: trimmed });
    }
  }

  if (currentList.length > 0) {
    elements.push({ type: "list", content: "", items: [...currentList] });
  }

  return elements;
}

function InlineFormatted({ text }: { text: string }) {
  // Handle **bold** and *italic* inline
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-medium text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
  });

  if (!article || !article.published) notFound();

  // Get prev/next
  const allArticles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: { slug: true, title: true },
  });
  const currentIndex = allArticles.findIndex((a) => a.slug === slug);
  const prevArticle = allArticles[currentIndex - 1] ?? null;
  const nextArticle = allArticles[currentIndex + 1] ?? null;

  const allBlocks = renderMarkdown(article.content);
  // Skip first paragraph if it duplicates the excerpt
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-zà-ÿ0-9 ]/g, "").trim();
  const excerptNorm = normalize(article.excerpt);
  const blocks = allBlocks.filter((block, i) => {
    if (i > 1 || block.type !== "paragraph") return true;
    const blockNorm = normalize(block.content);
    // Skip if block starts with same words as excerpt
    return !excerptNorm.startsWith(blockNorm.slice(0, 40)) && !blockNorm.startsWith(excerptNorm.slice(0, 40));
  });

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Article image */}
        {article.imageUrl && (
          <section className="bg-[#FBFAF8]">
            <div className="max-w-[980px] mx-auto px-4 lg:px-0 pt-16 md:pt-24">
              <div className="relative w-full h-[280px] md:h-[420px] rounded-[24px] overflow-hidden bg-[#f5f5f7]">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>
        )}

        {/* Article header */}
        <section className="bg-[#FBFAF8]">
          <div className={`max-w-[680px] mx-auto px-4 lg:px-0 ${article.imageUrl ? "pt-10" : "pt-16 md:pt-24"} pb-10 md:pb-14`}>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour au blog
            </Link>
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white border border-black/[0.06] text-[11px] font-medium text-muted-foreground">
                {article.category}
              </span>
              <span className="text-[12px] text-muted-foreground/60">
                {article.date}
              </span>
            </div>
            <h1 className="text-[32px] md:text-[44px] font-semibold leading-[1.08] tracking-tight text-foreground">
              {article.title}
            </h1>
            <p className="text-[17px] text-muted-foreground leading-[1.5] mt-4">
              {article.excerpt}
            </p>
          </div>
        </section>

        {/* Article content */}
        <section className="bg-white">
          <article className="max-w-[680px] mx-auto px-4 lg:px-0 py-12 md:py-16">
            {blocks.map((block, i) => {
              switch (block.type) {
                case "heading":
                  return (
                    <h2
                      key={i}
                      className="text-[22px] md:text-[26px] font-semibold leading-[1.2] tracking-tight text-foreground mt-12 mb-4"
                    >
                      {block.content}
                    </h2>
                  );
                case "subheading":
                  return (
                    <h3
                      key={i}
                      className="text-[18px] md:text-[20px] font-semibold leading-[1.25] tracking-tight text-foreground mt-8 mb-3"
                    >
                      {block.content}
                    </h3>
                  );
                case "quote":
                  return (
                    <blockquote
                      key={i}
                      className="border-l-[3px] border-primary/30 pl-5 py-1 my-6"
                    >
                      <p className="text-[17px] leading-[1.6] text-foreground/80 italic">
                        <InlineFormatted text={block.content} />
                      </p>
                    </blockquote>
                  );
                case "list":
                  return (
                    <ul key={i} className="space-y-2.5 my-5 ml-1">
                      {block.items?.map((item, j) => (
                        <li
                          key={j}
                          className="flex gap-3 text-[15px] leading-[1.7] text-muted-foreground"
                        >
                          <span className="shrink-0 mt-[9px] w-1.5 h-1.5 rounded-full bg-primary/40" />
                          <span>
                            <InlineFormatted text={item} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  );
                case "separator":
                  return <hr key={i} className="border-black/[0.06] my-10" />;
                case "bold":
                  return (
                    <p
                      key={i}
                      className="text-[16px] leading-[1.75] text-foreground font-medium mb-4"
                    >
                      {block.content}
                    </p>
                  );
                case "italic":
                  return (
                    <p
                      key={i}
                      className="text-[16px] leading-[1.75] text-muted-foreground italic mb-4"
                    >
                      {block.content}
                    </p>
                  );
                default:
                  return (
                    <p
                      key={i}
                      className="text-[16px] leading-[1.75] text-muted-foreground mb-4"
                    >
                      <InlineFormatted text={block.content} />
                    </p>
                  );
              }
            })}

            {/* Signature */}
            <div className="mt-12 pt-8 border-t border-black/[0.06]">
              <p className="text-[15px] text-muted-foreground">
                So-ma.fr &ndash; Elie. Ta conseill&egrave;re en nutrition &amp; bien-&ecirc;tre, sp&eacute;cialis&eacute;e pour les neuroatypiques.
              </p>
            </div>
          </article>
        </section>

        {/* Navigation */}
        <section className="bg-[#FBFAF8]">
          <div className="max-w-[680px] mx-auto px-4 lg:px-0 py-12 md:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevArticle ? (
                <Link
                  href={`/blog/${prevArticle.slug}`}
                  className="group flex flex-col p-5 rounded-2xl border border-black/[0.06] bg-white hover:shadow-md transition-all"
                >
                  <span className="text-[11px] text-muted-foreground/60 flex items-center gap-1 mb-2">
                    <ArrowLeft className="h-3 w-3" /> Pr&eacute;c&eacute;dent
                  </span>
                  <span className="text-[14px] font-medium text-foreground leading-snug line-clamp-2">
                    {prevArticle.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {nextArticle && (
                <Link
                  href={`/blog/${nextArticle.slug}`}
                  className="group flex flex-col items-end text-right p-5 rounded-2xl border border-black/[0.06] bg-white hover:shadow-md transition-all"
                >
                  <span className="text-[11px] text-muted-foreground/60 flex items-center gap-1 mb-2">
                    Suivant <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="text-[14px] font-medium text-foreground leading-snug line-clamp-2">
                    {nextArticle.title}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
