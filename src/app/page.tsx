import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="flex-1">
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

          {/* Animated clouds band */}
          <div className="h-[280px] md:h-[380px] bg-gradient-to-b from-[#FBFAF8] via-[#f0ebe3] to-[#e6ddd0] relative overflow-hidden">
            {/* Cloud 1 - large, left */}
            <div className="cloud-1 absolute top-[30%] left-[8%] w-[180px] h-[60px] md:w-[260px] md:h-[80px]">
              <div className="absolute inset-0 bg-white/[0.25] rounded-full blur-[2px]" />
              <div className="absolute -top-[20px] left-[25%] w-[55%] h-[50px] md:h-[60px] bg-white/[0.20] rounded-full blur-[2px]" />
            </div>
            {/* Cloud 2 - medium, right */}
            <div className="cloud-2 absolute top-[18%] right-[10%] w-[140px] h-[48px] md:w-[200px] md:h-[64px]">
              <div className="absolute inset-0 bg-white/[0.22] rounded-full blur-[2px]" />
              <div className="absolute -top-[16px] left-[30%] w-[50%] h-[40px] md:h-[50px] bg-white/[0.18] rounded-full blur-[2px]" />
            </div>
            {/* Cloud 3 - small, center */}
            <div className="cloud-3 absolute top-[50%] left-[35%] w-[120px] h-[40px] md:w-[160px] md:h-[52px]">
              <div className="absolute inset-0 bg-white/[0.20] rounded-full blur-[2px]" />
              <div className="absolute -top-[12px] left-[28%] w-[48%] h-[32px] md:h-[40px] bg-white/[0.16] rounded-full blur-[2px]" />
            </div>
            {/* Cloud 4 - tiny, upper center-right */}
            <div className="cloud-1 absolute top-[12%] right-[35%] w-[90px] h-[30px] md:w-[120px] md:h-[40px] opacity-70">
              <div className="absolute inset-0 bg-white/[0.18] rounded-full blur-[2px]" />
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
                <div className="md:flex-shrink-0 w-[160px] h-[160px] rounded-full bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 mx-auto md:mx-0" />
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="a-propos" className="bg-[#FBFAF8]">
          <div className="max-w-[980px] mx-auto px-4 lg:px-0 py-20 md:py-28">
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

      <Footer />
    </>
  );
}
