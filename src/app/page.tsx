import Link from "next/link";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnimatedClouds } from "@/components/illustrations/clouds";

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#FBFAF8] overflow-hidden">
          <div className="max-w-[980px] mx-auto px-4 lg:px-0 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
            <p className="text-primary text-sm font-medium tracking-wide uppercase mb-4">
              Nutrition &middot; Neuroatypie &middot; Mouvement fonctionnel
            </p>
            <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-semibold leading-[1.05] tracking-tight text-foreground max-w-[780px] mx-auto">
              Un accompagnement fait sur mesure, pour des cerveaux neurodivergents.
            </h1>
            <p className="text-[17px] md:text-[21px] font-normal leading-[1.4] text-muted-foreground mt-4 max-w-[580px] mx-auto">
              Suivi nutritionnel et sportif, conçu pour des femmes neuroatypiques, par une femme neuroatypique.
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
                Ma méthode est une approche intégrative et fonctionnelle, ancrée dans la science et dans le respect de ta physiologie &mdash; pas de protocole générique.
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
                    Un plan alimentaire qui respecte tes hormones et tes besoins, sans restriction extrême.
                  </h3>
                </div>
                <p className="text-[15px] text-muted-foreground leading-relaxed mt-6">
                  Calcul de ton métabolisme de base, recettes équilibrées que tes hormones vont kiffer, et organisation des repas en fonction de tes objectifs.
                </p>
              </div>

              {/* Card Mouvement */}
              <div className="bg-[#f5f5f7] rounded-[28px] p-10 md:p-12 flex flex-col justify-between min-h-[380px]">
                <div>
                  <p className="text-secondary text-sm font-medium uppercase tracking-wide mb-3">
                    Mouvement
                  </p>
                  <h3 className="text-[24px] md:text-[28px] font-semibold leading-[1.14] tracking-tight text-foreground">
                    Des programmes qui s&apos;adaptent à toi, et non l&apos;inverse.
                  </h3>
                </div>
                <p className="text-[15px] text-muted-foreground leading-relaxed mt-6">
                  Des séances faites pour toi, ta réalité, ta physiologie, et ton mode de vie. De façon progressive et durable.
                </p>
              </div>

              {/* Card Neuroatypie - Full width */}
              <div className="md:col-span-2 bg-gradient-to-br from-[#F5F2EC] to-[#E9F1EF] rounded-[28px] p-10 md:p-12 min-h-[260px]">
                <p className="text-accent text-sm font-medium uppercase tracking-wide mb-3">
                  Neuroatypie, TND&hellip;
                </p>
                <h3 className="text-[24px] md:text-[28px] font-semibold leading-[1.14] tracking-tight text-foreground max-w-[600px]">
                  Chaque profil est unique.
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed mt-4 max-w-[640px]">
                  Les méthodes classiques ne tiennent pas compte de nos spécificités neurologiques et cognitives, alors j&apos;ai construit une approche adaptée à notre fonctionnement.
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
                <p className="text-[20px] md:text-[24px] font-semibold text-foreground leading-[1.3] italic">
                  Pensées en arborescences,<br />
                  Créativité débordante,<br />
                  Soif de connaissance insatiable et besoins constants d&apos;évolution,<br />
                  Énergie foisonnante,<br />
                  Mais surtout, aussi décalée et fière que les rayures du zèbre&hellip;
                </p>

                <p>
                  J&apos;ai essayé de me conformer à la &laquo;&nbsp;norme&nbsp;&raquo; pendant des années&hellip;
                </p>

                <div className="pl-6 border-l-2 border-primary/30 space-y-1 text-foreground/70 italic text-left mx-auto max-w-fit">
                  <p>Parle normalement.</p>
                  <p>Bouge normalement.</p>
                  <p>Pense normalement.</p>
                </div>

                <p>
                  Donc j&apos;ai mangé comme la masse, sans écouter mes réels besoins.
                  J&apos;ai essayé de taire mon cerveau en l&apos;abrutissant.
                  Et je me suis forcée à marcher pour arrêter de courir.
                </p>

                <p className="text-[20px] md:text-[24px] font-semibold text-foreground leading-[1.2]">
                  Seulement, quand tu forces un arbre à agir comme une pierre, il en perd ses racines.
                </p>

                <p>
                  Je me suis dit&nbsp;: qu&apos;est-ce que &laquo;&nbsp;la norme&nbsp;&raquo; dans un monde qui déborde autant de profils que de divergences&nbsp;?
                </p>

                <p className="text-foreground font-medium">
                  C&apos;est finalement dans ma perte que je me suis retrouvée&nbsp;!
                </p>

                <p>
                  J&apos;ai donc encore lu et relu, étudié, et questionné jusqu&apos;à avoir les réponses et les acquis nécessaires pour savoir comment la développer.
                </p>

                <p className="text-foreground font-medium">
                  Et si j&apos;ai réussi, tu le peux aussi&nbsp;!
                </p>

                <div className="bg-white rounded-2xl p-6 mt-6 border border-warm-border text-left">
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="font-semibold text-foreground">Mais alors pourquoi ce nom de domaine&nbsp;?</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    C&apos;est un rappel au terme <span className="font-semibold text-foreground">SOMA</span>.
                    Si tu es intéressée par la psychologie, je t&apos;invite vivement à consulter la définition de ce terme.
                    Pour celles et ceux qui aiment les raccourcis, c&apos;est une référence à la <span className="italic">mémoire somatique</span>.
                  </p>
                </div>

                <div className="mt-8 space-y-4">
                  <p className="text-foreground font-medium">
                    Ta singularité mérite une approche sur mesure&nbsp;: nutrition consciente, programmes sportifs adaptés, et un accompagnement qui te ressemble&nbsp;!
                  </p>
                  <p>
                    Ici, pas besoin de rentrer dans une case&nbsp;: ton fonctionnement exceptionnel est la base d&apos;un chemin unique vers ta santé et ton équilibre.
                  </p>
                  <p>
                    Parce que ta différence est ta force, je t&apos;accompagne à transformer ton quotidien avec la nutrition et le mouvement, avec une approche intégrative fonctionnelle compatible avec ton cerveau.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mt-12 pt-8 border-t border-warm-border">
                <div className="text-center">
                  <p className="text-[36px] font-semibold tracking-tight text-primary">Plusieurs</p>
                  <p className="text-xs text-muted-foreground mt-0.5">femmes déjà accompagnées</p>
                </div>
                <div className="hidden sm:block w-px h-12 bg-black/[0.06]" />
                <div className="text-center">
                  <p className="text-[18px] font-semibold tracking-tight text-secondary leading-tight">Certifiée QUALIOPI</p>
                  <p className="text-xs text-muted-foreground mt-1">Conseillère en nutrition scientifique</p>
                  <p className="text-xs text-muted-foreground">Option sportive &middot; Médecine prophétique</p>
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
                Trois étapes <span className="relative inline-block">seulement<span className="absolute bottom-1 left-0 w-full h-[6px] md:h-[8px] bg-[#C4B5FD]/50 rounded-full -z-10" /></span>.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  num: "1",
                  title: "Bilan personnalisé",
                  desc: "Un questionnaire détaillé pour comprendre ton profil métabolique, tes habitudes de vie et tes objectifs.",
                },
                {
                  num: "2",
                  title: "Consultation individuelle",
                  desc: "Tu as droit à un échange en visio, afin que j\u2019apprenne à mieux te connaître et que je confectionne un programme qui matche avec tes objectifs.",
                },
                {
                  num: "3",
                  title: "Ton espace personnalisé",
                  desc: "Tableau de bord avec programme alimentaire, sportif, suivi quotidien et ressources utiles.",
                },
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

        {/* CTA */}
        <section id="contact" className="bg-[#1d1d1f]">
          <div className="max-w-[980px] mx-auto px-4 lg:px-0 py-20 md:py-28 text-center">
            <h2 className="text-[32px] md:text-[48px] font-semibold leading-[1.08] tracking-tight text-white">
              Prête à commencer ?
            </h2>
            <p className="text-[17px] text-white/60 mt-4 max-w-[480px] mx-auto">
              Rejoins les femmes qui ont choisi d&apos;exploiter à fond leurs potentiels.
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <Link
                href="/suivi-nutritionnel"
                className="inline-flex items-center justify-center h-11 px-6 bg-primary text-white text-sm font-normal rounded-full hover:bg-primary/90 transition-colors"
              >
                Découvre l&apos;accompagnement
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
