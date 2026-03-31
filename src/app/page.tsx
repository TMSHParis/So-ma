import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CloudsIllustration } from "@/components/illustrations/clouds";
import { OliveTreeIllustration } from "@/components/illustrations/olive-tree";
import { RootsLeft, RootsRight } from "@/components/illustrations/roots-vine";
import { FooterTree } from "@/components/illustrations/footer-tree";

export default function HomePage() {
  return (
    <div className="relative">
      {/* Racines grimpantes sur les côtés - visibles uniquement sur desktop */}
      <RootsLeft className="hidden lg:block fixed left-0 top-0 w-[80px] h-screen z-0 pointer-events-none" />
      <RootsRight className="hidden lg:block fixed right-0 top-0 w-[80px] h-screen z-0 pointer-events-none" />

      <Header />

      <main className="flex-1 relative z-10">
        {/* Hero */}
        <section className="bg-[#FBFAF8] overflow-hidden">
          <div className="max-w-[980px] mx-auto px-4 lg:px-0 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
            <p className="text-primary text-sm font-medium tracking-wide uppercase mb-4">
              Nutrition &middot; Neuroatypie &middot; Mouvement
            </p>
            <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-semibold leading-[1.05] tracking-tight text-foreground max-w-[720px] mx-auto">
              Un accompagnement qui vous ressemble.
            </h1>
            <p className="text-[17px] md:text-[21px] font-normal leading-[1.4] text-muted-foreground mt-4 max-w-[540px] mx-auto">
              Suivi nutritionnel et sportif personnalisé, conçu pour les femmes neuroatypiques.
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <Link
                href="/suivi-nutritionnel"
                className="inline-flex items-center justify-center h-11 px-6 bg-primary text-white text-sm font-normal rounded-full hover:bg-primary/90 transition-colors"
              >
                Découvrir
              </Link>
              <Link
                href="/#methode"
                className="inline-flex items-center text-primary text-sm font-normal hover:underline"
              >
                En savoir plus &rsaquo;
              </Link>
            </div>
          </div>

          {/* Illustrated decorative band */}
          <div className="h-[320px] md:h-[420px] bg-gradient-to-b from-[#FBFAF8] via-[#f0ebe3] to-[#e6ddd0] relative overflow-hidden">
            {/* Nuages en arrière-plan */}
            <CloudsIllustration className="absolute inset-x-0 top-0 w-full h-[200px] md:h-[260px]" />

            {/* Olivier centré */}
            <div className="absolute inset-0 flex items-end justify-center">
              <OliveTreeIllustration className="w-[220px] h-[280px] md:w-[300px] md:h-[380px] translate-y-[30px]" />
            </div>
          </div>
        </section>

        {/* Features - Apple style tiles */}
        <section id="methode" className="bg-white">
          <div className="max-w-[980px] mx-auto px-4 lg:px-0 py-20 md:py-28">
            <div className="text-center mb-16">
              <h2 className="text-[32px] md:text-[48px] font-semibold leading-[1.08] tracking-tight text-foreground">
                Votre cerveau fonctionne{" "}
                <br className="hidden md:block" />
                différemment. Votre suivi aussi.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="bg-[#f5f5f7] rounded-[28px] p-10 md:p-12 flex flex-col justify-between min-h-[400px]">
                <div>
                  <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide mb-3">
                    Nutrition
                  </p>
                  <h3 className="text-[24px] md:text-[28px] font-semibold leading-[1.14] tracking-tight text-foreground">
                    Des plans alimentaires sans restriction, basés sur la science.
                  </h3>
                </div>
                <p className="text-[15px] text-muted-foreground leading-relaxed mt-6">
                  Calcul métabolique personnalisé, recettes équilibrées et organisation des repas adaptée à votre rythme cognitif.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-[#f5f5f7] rounded-[28px] p-10 md:p-12 flex flex-col justify-between min-h-[400px]">
                <div>
                  <p className="text-secondary text-sm font-medium uppercase tracking-wide mb-3">
                    Mouvement
                  </p>
                  <h3 className="text-[24px] md:text-[28px] font-semibold leading-[1.14] tracking-tight text-foreground">
                    Du sport qui s&apos;adapte à vous, pas l&apos;inverse.
                  </h3>
                </div>
                <p className="text-[15px] text-muted-foreground leading-relaxed mt-6">
                  Musculation, cardio, marche, yoga. Un programme progressif qui respecte votre énergie et vos envies du moment.
                </p>
              </div>

              {/* Card 3 - Full width */}
              <div className="md:col-span-2 bg-gradient-to-br from-[#faf6f1] to-[#f0ebe3] rounded-[28px] p-10 md:p-12 flex flex-col md:flex-row md:items-center gap-8 min-h-[300px]">
                <div className="md:flex-1">
                  <p className="text-accent text-sm font-medium uppercase tracking-wide mb-3">
                    Neuroatypie
                  </p>
                  <h3 className="text-[24px] md:text-[28px] font-semibold leading-[1.14] tracking-tight text-foreground">
                    TDAH, TSA, HPI, DYS.{" "}
                    <br className="hidden md:block" />
                    Chaque profil est unique.
                  </h3>
                  <p className="text-[15px] text-muted-foreground leading-relaxed mt-4">
                    Les méthodes classiques ne tiennent pas compte de vos spécificités neurologiques. Mon approche est conçue autour de votre fonctionnement, pas contre lui.
                  </p>
                </div>
                <div className="md:flex-shrink-0 w-[160px] h-[200px] mx-auto md:mx-0">
                  <OliveTreeIllustration className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="a-propos" className="bg-[#FBFAF8] relative overflow-hidden">
          <CloudsIllustration className="absolute inset-x-0 top-8 w-full h-[180px] opacity-60 pointer-events-none" />
          <div className="max-w-[980px] mx-auto px-4 lg:px-0 py-20 md:py-28 relative">
            <div className="max-w-[660px] mx-auto text-center">
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide mb-4">
                À propos
              </p>
              <h2 className="text-[32px] md:text-[48px] font-semibold leading-[1.08] tracking-tight text-foreground mb-6">
                Quand on force un arbre à se comporter comme une pierre, il perd ses racines.
              </h2>
              <div className="space-y-5 text-[17px] text-muted-foreground leading-[1.47]">
                <p>
                  Je suis professionnelle de santé et nutrition, moi-même diagnostiquée neuroatypique. J&apos;ai transformé mes propres difficultés en expertise.
                </p>
                <p>
                  Mon approche est basée sur la science, l&apos;écoute et le respect de votre rythme. Pas de restriction, pas de culpabilité. Juste un chemin adapté à qui vous êtes.
                </p>
              </div>
              <div className="flex items-center justify-center gap-8 mt-10">
                <div>
                  <p className="text-[40px] font-semibold tracking-tight text-primary">100+</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Femmes accompagnées</p>
                </div>
                <div className="w-px h-12 bg-black/[0.06]" />
                <div>
                  <p className="text-[40px] font-semibold tracking-tight text-secondary">Certifiée</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Professionnelle de santé</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white">
          <div className="max-w-[980px] mx-auto px-4 lg:px-0 py-20 md:py-28">
            <div className="text-center mb-16">
              <h2 className="text-[32px] md:text-[48px] font-semibold leading-[1.08] tracking-tight text-foreground">
                Trois étapes. C&apos;est tout.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  num: "1",
                  title: "Bilan personnalisé",
                  desc: "Un questionnaire détaillé pour comprendre votre profil, vos habitudes et vos objectifs.",
                },
                {
                  num: "2",
                  title: "Consultation individuelle",
                  desc: "Un échange en visio pour affiner votre programme et répondre à toutes vos questions.",
                },
                {
                  num: "3",
                  title: "Votre espace personnalisé",
                  desc: "Tableau de bord avec programme alimentaire, sportif, suivi quotidien et ressources.",
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
              Rejoignez les femmes qui ont choisi un accompagnement adapté à leur fonctionnement.
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <Link
                href="/suivi-nutritionnel"
                className="inline-flex items-center justify-center h-11 px-6 bg-primary text-white text-sm font-normal rounded-full hover:bg-primary/90 transition-colors"
              >
                Découvrir l&apos;accompagnement
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

      {/* Olivier qui pousse depuis le footer */}
      <div className="relative">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[260px] h-[350px] md:w-[340px] md:h-[420px] pointer-events-none z-0 translate-y-[20px]">
          <FooterTree className="w-full h-full" />
        </div>
        <Footer />
      </div>
    </div>
  );
}
