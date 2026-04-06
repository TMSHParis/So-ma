import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { articles, getArticleBySlug } from "@/lib/articles";
import type { ArticleBlock } from "@/lib/articles";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} | So-ma`,
    description: article.excerpt,
  };
}

function BlockRenderer({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="text-[22px] md:text-[26px] font-semibold leading-[1.2] tracking-tight text-foreground mt-12 mb-4">
          {block.text}
        </h2>
      );
    case "subheading":
      return (
        <h3 className="text-[18px] md:text-[20px] font-semibold leading-[1.25] tracking-tight text-foreground mt-8 mb-3">
          {block.text}
        </h3>
      );
    case "paragraph":
      return (
        <p className="text-[16px] leading-[1.75] text-muted-foreground mb-4">
          {block.text}
        </p>
      );
    case "bold-paragraph":
      return (
        <p className="text-[16px] leading-[1.75] text-foreground font-medium mb-4">
          {block.text}
        </p>
      );
    case "italic-paragraph":
      return (
        <p className="text-[16px] leading-[1.75] text-muted-foreground italic mb-4">
          {block.text}
        </p>
      );
    case "quote":
      return (
        <blockquote className="border-l-[3px] border-primary/30 pl-5 py-1 my-6">
          <p className="text-[17px] leading-[1.6] text-foreground/80 italic">
            {block.text}
          </p>
        </blockquote>
      );
    case "list":
      return (
        <ul className="space-y-2.5 my-5 ml-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-[1.7] text-muted-foreground">
              <span className="shrink-0 mt-[9px] w-1.5 h-1.5 rounded-full bg-primary/40" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <div className="bg-[#f5f5f7] rounded-2xl px-6 py-5 my-6">
          <p className="text-[14px] leading-[1.7] text-muted-foreground">
            {block.text}
          </p>
        </div>
      );
    case "separator":
      return <hr className="border-black/[0.06] my-10" />;
    case "sources":
      return (
        <div className="mt-12 pt-8 border-t border-black/[0.06]">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
            Sources
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {block.items.map((source, i) => (
              <span key={i} className="text-[12px] text-muted-foreground/70">
                {source}
              </span>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const currentIndex = articles.findIndex((a) => a.slug === slug);
  const nextArticle = articles[currentIndex + 1] ?? null;
  const prevArticle = articles[currentIndex - 1] ?? null;

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Article image */}
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

        {/* Article header */}
        <section className="bg-[#FBFAF8]">
          <div className="max-w-[680px] mx-auto px-4 lg:px-0 pt-10 pb-10 md:pt-14 md:pb-14">
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
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-black/[0.06]">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">E</span>
              </div>
              <div>
                <p className="text-[13px] font-medium text-foreground">Elie</p>
                <p className="text-[11px] text-muted-foreground">
                  Conseill&egrave;re en nutrition & bien-&ecirc;tre
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Article content */}
        <section className="bg-white">
          <article className="max-w-[680px] mx-auto px-4 lg:px-0 py-12 md:py-16">
            {article.content.map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}

            {/* Author signature */}
            <div className="mt-12 pt-8 border-t border-black/[0.06]">
              <p className="text-[15px] text-foreground font-medium">
                So-ma.fr &mdash; Elie
              </p>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                Ta conseill&egrave;re en nutrition & bien-&ecirc;tre, sp&eacute;cialis&eacute;e pour les neuroatypiques.
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
