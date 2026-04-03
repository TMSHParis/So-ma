"use client";

import Link from "next/link";
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Check, X } from "lucide-react";

export default function SuiviNutritionnelPage() {
  const [accepted, setAccepted] = useState(false);
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#FBFAF8]">
          <div className="max-w-[980px] mx-auto px-4 lg:px-0 pt-20 pb-12 md:pt-28 md:pb-16 text-center">
            <h1 className="text-[36px] md:text-[52px] lg:text-[60px] font-semibold leading-[1.05] tracking-tight text-foreground max-w-[800px] mx-auto">
              Si tu es neuroatypique, les méthodes classiques ne peuvent pas fonctionner <span className="text-primary">durablement</span> sur toi.
            </h1>
          </div>
        </section>

        {/* Le schéma qui se répète */}
        <section className="bg-white">
          <div className="max-w-[680px] mx-auto px-4 lg:px-0 py-16 md:py-24">
            <div className="space-y-5 text-[17px] text-muted-foreground leading-[1.6]">
              <p>Tu te motives.</p>
              <p>Tu regardes des contenus généraux en boucle, que tu consommes, avant d&apos;enfin essayer de les appliquer.</p>
              <p>Tu manges mieux.</p>
              <p>Mais sans bonne direction, tu t&apos;épuises et tu finis par lâcher&hellip; À chaque fois c&apos;est le même schéma.</p>
              <p className="text-foreground font-medium">
                Tu craques. Tu culpabilises. Tu t&apos;en veux&hellip; et tu finis par penser que le code erreur c&apos;est toi.
              </p>
            </div>

            <div className="mt-12 bg-gradient-to-br from-[#F5F2EC] to-[#E9F1EF] rounded-[20px] p-8 md:p-10">
              <p className="text-[20px] md:text-[24px] font-semibold text-foreground leading-[1.3]">
                Et si le vrai problème, ce n&apos;était pas toi, mais que tu utilises des méthodes qui n&apos;ont jamais été faites pour ton cerveau&nbsp;?
              </p>
            </div>

            <div className="mt-10 space-y-5 text-[17px] text-muted-foreground leading-[1.6]">
              <p className="text-[20px] md:text-[24px] font-semibold text-foreground leading-[1.2]">
                Tu ne réagis pas comme la masse, alors pourquoi suivre les mêmes méthodes&nbsp;?
              </p>
              <p>
                Ce n&apos;est pas toujours un problème de discipline. Ce n&apos;est pas que &laquo;&nbsp;tu fais mal&nbsp;&raquo; ou pas assez. Au contraire, tu fais beaucoup, mais à contresens.
              </p>
              <p>
                Car tu appliques des méthodes qui n&apos;ont jamais été pensées pour ton fonctionnement.
              </p>
              <p className="italic">
                Est-ce que tu arrives facilement à destination, toi, si la carte que tu suis n&apos;est pas dans le bon sens&nbsp;?
              </p>
            </div>
          </div>
        </section>

        {/* Ce que beaucoup ignorent */}
        <section className="bg-[#FBFAF8]">
          <div className="max-w-[680px] mx-auto px-4 lg:px-0 py-16 md:py-24">
            <h2 className="text-[28px] md:text-[40px] font-semibold leading-[1.1] tracking-tight text-foreground mb-6">
              Ce que beaucoup ignorent, c&apos;est que les personnes neuroatypiques ne sont pas juste &laquo;&nbsp;différentes&nbsp;&raquo;.
            </h2>
            <p className="text-[17px] text-muted-foreground leading-[1.6] mb-8">
              Elles sont aussi plus exposées à de vraies fragilités physiques et mentales (si elles ne sont pas prises en charge)&nbsp;:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Des troubles du comportement alimentaire (TCA)",
                "De l\u2019anxiété chronique",
                "Des burnouts précoces",
                "Une fatigue persistante",
                "Des troubles digestifs et hormonaux",
                "Des déséquilibres liés au stress et à la surcharge mentale",
              ].map((item) => (
                <div key={item} className="bg-white rounded-xl p-4 border border-warm-border">
                  <p className="text-[15px] text-foreground leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Les méthodes standardisées */}
        <section className="bg-white">
          <div className="max-w-[680px] mx-auto px-4 lg:px-0 py-16 md:py-24">
            <h2 className="text-[24px] md:text-[32px] font-semibold leading-[1.15] tracking-tight text-foreground mb-4">
              Peut-on écrire un livre lorsqu&apos;on ne nous donne qu&apos;une seule feuille&nbsp;?
            </h2>
            <p className="text-[17px] text-muted-foreground leading-[1.6] mb-8">
              Les méthodes standardisées sont construites pour&nbsp;:
            </p>
            <div className="space-y-3 mb-8">
              {[
                "Un système nerveux \"stable\"",
                "Une tolérance élevée à la contrainte",
                "Une régularité neurologique linéaire",
                "Une relation neutre au contrôle",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 py-2">
                  <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <X className="h-3 w-3 text-destructive" />
                  </div>
                  <span className="text-[15px] text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-[17px] text-foreground font-medium">
              Ce qui ne correspond pas à la réalité de beaucoup de personnes neuroatypiques&nbsp;!
            </p>
          </div>
        </section>

        {/* La femme neuroatypique */}
        <section className="bg-[#FBFAF8]">
          <div className="max-w-[680px] mx-auto px-4 lg:px-0 py-16 md:py-24">
            <h2 className="text-[28px] md:text-[40px] font-semibold leading-[1.1] tracking-tight text-foreground mb-6">
              La femme neuroatypique a des particularités spécifiques.
            </h2>
            <div className="space-y-5 text-[17px] text-muted-foreground leading-[1.6]">
              <p>
                Le corps, le mental et le système nerveux fonctionnent ensemble (ainsi que d&apos;autres particularités abordées dans mes carrousels).
              </p>
              <p>
                Et quand on y ajoute un profil métabolique féminin, encore plus contraint chez les femmes neurodivergentes, si on ne prend pas tous les facteurs en compte, on s&apos;épuise. On se rigidifie, et on finit par abandonner.
              </p>
              <p className="text-foreground font-medium">
                S&apos;imposer un cadre inadapté n&apos;est pas le bon objectif. En plus, c&apos;est très souvent la cause de régression.
              </p>
              <p>
                C&apos;est pour ça que j&apos;ai créé mon accompagnement&nbsp;: pour t&apos;aider à comprendre ton fonctionnement, et t&apos;accompagner avec un cadre construit pour toi.
              </p>
              <p className="text-[20px] md:text-[24px] font-semibold text-foreground leading-[1.3]">
                Progressif, adapté, et pensé pour réussir sur la durée.
              </p>
            </div>
          </div>
        </section>

        {/* Pour qui / pas pour qui */}
        <section className="bg-white">
          <div className="max-w-[680px] mx-auto px-4 lg:px-0 py-16 md:py-24">
            <h2 className="text-[28px] md:text-[40px] font-semibold leading-[1.1] tracking-tight text-foreground text-center mb-4">
              Ce type d&apos;accompagnement n&apos;est pas pour tout le monde.
            </h2>
            <p className="text-[17px] text-muted-foreground text-center mb-12">
              Car, avec moi&nbsp;: pas de flagellation, mais de l&apos;introspection et des remises en question.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pas pour */}
              <div className="bg-[#fef2f2] rounded-[20px] p-8">
                <p className="text-sm font-medium uppercase tracking-wide text-destructive mb-4">
                  Il n&apos;est pas fait pour celles
                </p>
                <p className="text-[15px] text-foreground leading-relaxed">
                  Qui veulent une méthode miracle et qui cherchent un plan générique, conçu pour la masse.
                </p>
              </div>

              {/* Pour */}
              <div className="bg-[#f0fdf4] rounded-[20px] p-8">
                <p className="text-sm font-medium uppercase tracking-wide text-secondary mb-4">
                  Il est pour
                </p>
                <p className="text-[15px] text-foreground leading-relaxed">
                  Celles qui veulent arrêter de se battre contre elles-mêmes, et sortir de leurs blocages.
                </p>
              </div>
            </div>

            <div className="mt-10 bg-gradient-to-br from-[#F5F2EC] to-[#E9F1EF] rounded-[20px] p-8 md:p-10 space-y-4 text-[17px] text-muted-foreground leading-[1.6]">
              <p>
                Nous sommes une équipe. Ce qui veut dire que si je m&apos;investis pour toi, toi tu dois aussi t&apos;investir pour toi-même, en retour.
              </p>
              <p>
                Je n&apos;impose pas des règles impossibles, mais elles doivent être respectées. Parce qu&apos;un accompagnement juste n&apos;est pas moins efficace&hellip; il est simplement plus durable.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="offre" className="bg-[#FBFAF8]">
          <div className="max-w-[480px] mx-auto px-4 lg:px-0 py-20 md:py-28 text-center">
            <p className="text-[20px] md:text-[24px] font-semibold text-foreground leading-[1.3] mb-8">
              Alors si tu es prête à exploiter ton plein potentiel, fais le pas maintenant.
            </p>
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide mb-4">
              Offre complète
            </p>
            <h2 className="text-[28px] md:text-[40px] font-semibold leading-[1.1] tracking-tight text-foreground mb-2">
              Bilan + Suivi personnalisé
            </h2>
            <div className="flex items-baseline justify-center gap-1 mt-6">
              <span className="text-[72px] md:text-[80px] font-semibold tracking-tight text-foreground leading-none">
                129
              </span>
              <span className="text-[28px] font-normal text-muted-foreground">&euro;</span>
            </div>
            <p className="text-[15px] text-muted-foreground mt-2">Paiement unique</p>

            {/* Déroulement après paiement */}
            <div className="mt-6 bg-white rounded-[16px] p-6 border border-warm-border text-left">
              <p className="text-sm font-semibold text-foreground mb-4">Comment ça se passe&nbsp;?</p>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary">1</span>
                  </div>
                  <p className="text-[15px] text-muted-foreground">Tu effectues ton paiement et tu reçois immédiatement <strong className="text-foreground">tes accès à ton espace client</strong>.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary">2</span>
                  </div>
                  <p className="text-[15px] text-muted-foreground">Tu remplis <strong className="text-foreground">ton questionnaire de bilan personnalisé</strong> pour que j&apos;apprenne à te connaître.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary">3</span>
                  </div>
                  <p className="text-[15px] text-muted-foreground">Une fois complété, tu reçois <strong className="text-foreground">ton bilan complet, tes programmes alimentaire et sportif, tes fiches pratiques, et ton ebook de recettes saines</strong>.</p>
                </div>
              </div>
            </div>

            {/* Checkbox CGV */}
            <label className="flex items-start gap-3 mt-6 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/20 accent-primary"
              />
              <span className="text-xs text-muted-foreground leading-relaxed">
                J&apos;atteste avoir lu et accepté les{" "}
                <Link href="/mentions-legales" className="text-primary underline hover:text-primary/80">
                  conditions générales de vente et mentions légales
                </Link>.
              </span>
            </label>

            <div className="mt-6 space-y-3">
              <a
                href={accepted ? "/api/stripe/checkout-public" : "#offre"}
                onClick={(e) => { if (!accepted) e.preventDefault(); }}
                className={`flex items-center justify-center w-full h-12 text-white text-[15px] font-normal rounded-full transition-colors ${accepted ? "bg-primary hover:bg-primary/90" : "bg-primary/40 cursor-not-allowed"}`}
                aria-disabled={!accepted}
              >
                Payer par carte bancaire
              </a>
              <a
                href={accepted ? "/api/payment/paypal" : "#offre"}
                onClick={(e) => { if (!accepted) e.preventDefault(); }}
                className={`flex items-center justify-center w-full h-12 text-white text-[15px] font-normal rounded-full transition-colors ${accepted ? "bg-[#0070BA] hover:bg-[#0070BA]/90" : "bg-[#0070BA]/40 cursor-not-allowed"}`}
                aria-disabled={!accepted}
              >
                Payer avec PayPal
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Paiement sécurisé.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white">
          <div className="max-w-[680px] mx-auto px-4 lg:px-0 py-20 md:py-28">
            <h2 className="text-[28px] md:text-[40px] font-semibold leading-[1.1] tracking-tight text-foreground text-center mb-12">
              Questions fréquentes
            </h2>

            <div className="space-y-0">
              {[
                {
                  q: "C\u2019est quoi la neuroatypie ?",
                  a: "La neuroatypie et les TND désignent les fonctionnements neurologiques et cognitifs qui diffèrent de la norme : TDAH, TSA, HPI/HPE, DYS, etc. Ce n\u2019est ni une maladie ni un handicap, c\u2019est une façon différente de fonctionner.",
                },
                {
                  q: "Je ne suis pas diagnostiquée, c\u2019est pour moi ?",
                  a: "Oui. Si les méthodes classiques n\u2019ont jamais fonctionné pour toi, cet accompagnement peut te convenir. Le diagnostic n\u2019est pas un prérequis.",
                },
                {
                  q: "Comment se passe la consultation ?",
                  a: "Après le questionnaire, nous fixons un rendez-vous en visio où nous échangerons afin de mieux te connaître.",
                },
                {
                  q: "Est-ce un régime restrictif ?",
                  a: "Non. Mon approche est anti-régime. On travaille sur le rééquilibrage, avec un déficit léger qui n\u2019enlève pas le plaisir alimentaire.",
                },
                {
                  q: "Comment accéder à mon espace client ?",
                  a: "Après le retour de ton formulaire rempli, tu reçois tes identifiants par email. Ton espace contient tes programmes et le suivi quotidien.",
                },
              ].map((item) => (
                <div
                  key={item.q}
                  className="py-6 border-b border-black/[0.04] last:border-0"
                >
                  <h3 className="text-[17px] font-semibold tracking-tight text-foreground">
                    {item.q}
                  </h3>
                  <p className="text-[15px] text-muted-foreground leading-relaxed mt-2">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-[#1d1d1f]">
          <div className="max-w-[680px] mx-auto px-4 lg:px-0 py-20 md:py-24 text-center">
            <h2 className="text-[28px] md:text-[40px] font-semibold leading-[1.1] tracking-tight text-white">
              Investis en toi.
            </h2>
            <a
              href="#offre"
              className="inline-flex items-center justify-center h-11 px-7 bg-primary text-white text-sm font-normal rounded-full hover:bg-primary/90 transition-colors mt-8"
            >
              Commencer maintenant
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
