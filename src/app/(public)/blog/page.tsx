import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { articles } from "@/lib/articles";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | So-ma",
  description:
    "Articles sur la nutrition, la neuroatypie, l'epigenetique et le bien-etre. Par Elie, conseillere en nutrition specialisee pour les neuroatypiques.",
};

export default function BlogPage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#FBFAF8]">
          <div className="max-w-[980px] mx-auto px-4 lg:px-0 pt-20 pb-12 md:pt-28 md:pb-16 text-center">
            <p className="text-primary text-sm font-medium tracking-wide uppercase mb-4">
              Blog
            </p>
            <h1 className="text-[40px] md:text-[56px] font-semibold leading-[1.05] tracking-tight text-foreground max-w-[700px] mx-auto">
              Articles & Ressources
            </h1>
            <p className="text-[17px] md:text-[21px] font-normal leading-[1.4] text-muted-foreground mt-4 max-w-[540px] mx-auto">
              Nutrition, neuroatypie, physiologie, et réflexions — pour comprendre avant d'agir.
            </p>
          </div>
        </section>

        {/* Featured article */}
        <section className="bg-white">
          <div className="max-w-[980px] mx-auto px-4 lg:px-0 py-12 md:py-16">
            <Link
              href={`/blog/${articles[0].slug}`}
              className="group block rounded-[28px] relative overflow-hidden transition-all hover:shadow-lg"
            >
              <div className="relative min-h-[400px] md:min-h-[480px]">
                <img
                  src={articles[0].imageUrl}
                  alt={articles[0].title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-6 left-8 md:left-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm text-xs font-medium text-primary">
                    {articles[0].category}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                  <p className="text-xs text-white/70 mb-3">
                    {articles[0].date}
                  </p>
                  <h2 className="text-[24px] md:text-[32px] font-semibold leading-[1.14] tracking-tight text-white max-w-[640px]">
                    {articles[0].title}
                  </h2>
                  <p className="text-[15px] text-white/70 leading-relaxed mt-3 max-w-[560px]">
                    {articles[0].excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white mt-5 group-hover:gap-2.5 transition-all">
                    Lire l'article <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Articles grid */}
        <section className="bg-[#FBFAF8]">
          <div className="max-w-[980px] mx-auto px-4 lg:px-0 py-12 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {articles.slice(1).map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group bg-white rounded-[20px] overflow-hidden flex flex-col border border-black/[0.04] transition-all hover:shadow-md hover:border-black/[0.08]"
                >
                  <div className="relative h-[200px] overflow-hidden bg-[#f5f5f7]">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <div className="p-7 md:p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[11px] font-medium text-muted-foreground">
                        {article.category}
                      </span>
                      <span className="text-[11px] text-muted-foreground/60">
                        {article.date}
                      </span>
                    </div>
                    <div className="mt-4 flex-1 flex flex-col">
                      <h3 className="text-[19px] md:text-[21px] font-semibold leading-[1.2] tracking-tight text-foreground">
                        {article.title}
                      </h3>
                      <p className="text-[14px] text-muted-foreground leading-relaxed mt-2.5 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary mt-4 group-hover:gap-2.5 transition-all">
                        Lire <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white">
          <div className="max-w-[980px] mx-auto px-4 lg:px-0 py-16 md:py-24 text-center">
            <h2 className="text-[28px] md:text-[36px] font-semibold leading-[1.12] tracking-tight text-foreground">
              Envie d'\u00eatre accompagnée ?
            </h2>
            <p className="text-[15px] text-muted-foreground mt-3 max-w-[420px] mx-auto">
              Découvre un accompagnement sur mesure, adapté à ton fonctionnement.
            </p>
            <Link
              href="/suivi-nutritionnel"
              className="inline-flex items-center justify-center h-11 px-6 bg-primary text-white text-sm font-normal rounded-full hover:bg-primary/90 transition-colors mt-6"
            >
              Découvrir l'accompagnement
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
