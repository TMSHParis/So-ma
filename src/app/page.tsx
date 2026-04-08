import Link from "next/link";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnimatedClouds } from "@/components/illustrations/clouds";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { getAllSections } from "@/lib/site-content";

export default async function HomePage() {
  const content = await getAllSections([
    "hero",
    "method",
    "about",
    "steps",
    "cta",
  ]);

  const hero = content.hero;
  const method = content.method;
  const about = content.about;
  const steps = content.steps;
  const cta = content.cta;

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#FBFAF8] overflow-hidden">
          <div className="max-w-[980px] mx-auto px-4 lg:px-0 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
            <p className="text-primary text-sm font-medium tracking-wide uppercase mb-4">
              {hero.badge}
            </p>
            <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-semibold leading-[1.05] tracking-tight text-foreground max-w-[780px] mx-auto">
              {hero.title}
            </h1>
            <p className="text-[17px] md:text-[21px] font-normal leading-[1.4] text-muted-foreground mt-4 max-w-[580px] mx-auto">
              {hero.subtitle}
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <Link
                href="/suivi-nutritionnel"
                className="inline-flex items-center justify-center h-11 px-6 bg-primary text-white text-sm font-normal rounded-full hover:bg-primary/90 transition-colors"
              >
                Découvrir
              </Link>
              <Link
                href="/suivi-nutritionnel"
                className="inline-flex items-center text-primary text-sm font-normal hover:underline"
              >
                En savoir plus &rsaquo;
              </Link>
            </div>
          </div>

          {/* Logo dans la bulle + nuages animés */}
          <div className="h-[200px] md:h-[260px] bg-gradient-to-b from-[#FBFAF8] via-[#F5F2EC] to-[#E9F1EF] relative overflow-hidden">
            <AnimatedClouds />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 flex items-center justify-center">
                <img src="/logo-soma.png" alt="So-ma" className="h-12 md:h-16 w-auto mix-blend-multiply" />
              </div>
            </div>
          </div>
        </section>

        {/* Méthode - intro */}
        <section id="methode" className="bg-white">
          <div className="max-w-[980px] mx-auto px-4 lg:px-0 py-20 md:py-28">
            <div className="text-center mb-16">
              <h2 className="text-[28px] md:text-[40px] font-semibold leading-[1.12] tracking-tight text-foreground max-w-[700px] mx-auto">
                {method.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card Nutrition */}
              <div className="bg-[#f5f5f7] rounded-[28px] p-10 md:p-12 flex flex-col justify-between min-h-[380px]">
                <div>
                  <p className="text-primary text-sm font-medium uppercase tracking-wide mb-3">
                    Nutrition
                  </p>
                  <h3 className="text-[24px] md:text-[28px] font-semibold leading-[1.14] tracking-tight text-foreground">
                    {method.nutrition_title}
                  </h3>
                </div>
                <p className="text-[15px] text-muted-foreground leading-relaxed mt-6">
                  {method.nutrition_desc}
                </p>
              </div>

              {/* Card Mouvement */}
              <div className="bg-[#f5f5f7] rounded-[28px] p-10 md:p-12 flex flex-col justify-between min-h-[380px]">
                <div>
                  <p className="text-secondary text-sm font-medium uppercase tracking-wide mb-3">
                    Mouvement
                  </p>
                  <h3 className="text-[24px] md:text-[28px] font-semibold leading-[1.14] tracking-tight text-foreground">
                    {method.movement_title}
                  </h3>
                </div>
                <p className="text-[15px] text-muted-foreground leading-relaxed mt-6">
                  {method.movement_desc}
                </p>
              </div>

              {/* Card Neuroatypie - Full width */}
              <div className="md:col-span-2 bg-gradient-to-br from-[#F5F2EC] to-[#E9F1EF] rounded-[28px] p-10 md:p-12 min-h-[260px]">
                <p className="text-accent text-sm font-medium uppercase tracking-wide mb-3">
                  Neuroatypie, TND…
                </p>
                <h3 className="text-[24px] md:text-[28px] font-semibold leading-[1.14] tracking-tight text-foreground max-w-[600px]">
                  {method.neuro_title}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed mt-4 max-w-[640px]">
                  {method.neuro_desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* À propos */}
        <section id="a-propos" className="bg-[#FBFAF8]">
          <div className="max-w-[980px] mx-auto px-4 lg:px-0 py-20 md:py-28">
            <div className="max-w-[700px] mx-auto text-center">
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide mb-6">
                À propos
              </p>

              <div className="text-[17px] text-muted-foreground leading-[1.6] space-y-5">
                <p className="text-[20px] md:text-[24px] font-semibold text-foreground leading-[1.3] italic whitespace-pre-line">
                  {about.poem}
                </p>

                <p>
                  J'ai essayé de me conformer à la &laquo; norme &raquo; pendant des années…
                </p>

                <div className="pl-6 border-l-2 border-primary/30 space-y-1 text-foreground/70 italic text-left mx-auto max-w-fit">
                  <p>Parle normalement.</p>
                  <p>Bouge normalement.</p>
                  <p>Pense normalement.</p>
                </div>

                <p>
                  Donc j'ai mangé comme la masse, sans écouter mes réels besoins.
                  J'ai essayé de taire mon cerveau en l'abrutissant.
                  Et je me suis forcée à marcher pour arrêter de courir.
                </p>

                <p className="text-[20px] md:text-[24px] font-semibold text-foreground leading-[1.2]">
                  {about.quote}
                </p>

                <p>
                  Je me suis dit : qu'est-ce que &laquo; la norme &raquo; dans un monde qui déborde autant de profils que de divergences ?
                </p>

                <p className="text-foreground font-medium">
                  C'est finalement dans ma perte que je me suis retrouvée !
                </p>

                <p>
                  J'ai donc encore lu et relu, étudié, et questionné jusqu'à avoir les réponses et les acquis nécessaires pour savoir comment la développer.
                </p>

                <p className="text-foreground font-medium">
                  Et si j'ai réussi, tu le peux aussi !
                </p>

                <div className="bg-white rounded-2xl p-6 mt-6 border border-warm-border text-left">
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="font-semibold text-foreground">Mais alors pourquoi ce nom de domaine ?</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    C'est un rappel au terme <span className="font-semibold text-foreground">SOMA</span>.
                    Si tu es intéressée par la psychologie, je t'invite vivement à consulter la définition de ce terme.
                    Pour celles et ceux qui aiment les raccourcis, c'est une référence à la <span className="italic">mémoire somatique</span>.
                  </p>
                </div>

                <div className="mt-8 space-y-4">
                  <p className="text-foreground font-medium">
                    {about.conclusion}
                  </p>
                  <p>
                    Ici, pas besoin de rentrer dans une case : ton fonctionnement exceptionnel est la base d'un chemin unique vers ta santé et ton équilibre.
                  </p>
                  <p>
                    Parce que ta différence est ta force, je t'accompagne à transformer ton quotidien avec la nutrition et le mouvement, avec une approche intégrative fonctionnelle compatible avec ton cerveau.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mt-12 pt-8 border-t border-warm-border">
                <div className="text-center">
                  <p className="text-[36px] font-semibold tracking-tight text-primary">{about.stat_label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{about.stat_desc}</p>
                </div>
                <div className="hidden sm:block w-px h-12 bg-black/[0.06]" />
                <div className="text-center">
                  <p className="text-[18px] font-semibold tracking-tight text-secondary leading-tight">{about.cert_label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{about.cert_desc}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="bg-white">
          <div className="max-w-[980px] mx-auto px-4 lg:px-0 py-20 md:py-28">
            <div className="text-center mb-16">
              <h2 className="text-[32px] md:text-[48px] font-semibold leading-[1.08] tracking-tight text-foreground">
                {steps.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                { num: "1", title: steps.step1_title, desc: steps.step1_desc },
                { num: "2", title: steps.step2_title, desc: steps.step2_desc },
                { num: "3", title: steps.step3_title, desc: steps.step3_desc },
              ].map((step) => (
                <div key={step.num} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-[#f5f5f7] flex items-center justify-center mx-auto mb-5">
                    <span className="text-[21px] font-semibold text-primary">{step.num}</span>
                  </div>
                  <h3 className="text-[19px] font-semibold tracking-tight text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Avis Google */}
        <TestimonialsCarousel />

        {/* CTA */}
        <section id="contact" className="bg-[#1d1d1f]">
          <div className="max-w-[980px] mx-auto px-4 lg:px-0 py-20 md:py-28 text-center">
            <h2 className="text-[32px] md:text-[48px] font-semibold leading-[1.08] tracking-tight text-white">
              {cta.title}
            </h2>
            <p className="text-[17px] text-white/60 mt-4 max-w-[480px] mx-auto">
              {cta.subtitle}
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <Link
                href="/suivi-nutritionnel"
                className="inline-flex items-center justify-center h-11 px-6 bg-primary text-white text-sm font-normal rounded-full hover:bg-primary/90 transition-colors"
              >
                {cta.button}
              </Link>
              <a
                href="https://www.instagram.com/so_masav"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-white/60 text-sm font-normal hover:text-white transition-colors"
              >
                Instagram &rsaquo;
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
