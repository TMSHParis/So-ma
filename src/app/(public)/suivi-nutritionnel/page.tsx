import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Check } from "lucide-react";

export default function SuiviNutritionnelPage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#FBFAF8]">
          <div className="max-w-[980px] mx-auto px-4 lg:px-0 pt-20 pb-12 md:pt-28 md:pb-16 text-center">
            <p className="text-primary text-sm font-medium tracking-wide uppercase mb-4">
              Accompagnement santé
            </p>
            <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-semibold leading-[1.05] tracking-tight text-foreground max-w-[720px] mx-auto">
              Arrêtez de suivre des méthodes qui ne sont pas faites pour vous.
            </h1>
            <p className="text-[17px] md:text-[21px] font-normal leading-[1.4] text-muted-foreground mt-4 max-w-[540px] mx-auto">
              Vous ne réagissez pas comme les autres. Votre accompagnement ne devrait pas non plus.
            </p>
            <a
              href="#offre"
              className="inline-flex items-center justify-center h-11 px-7 bg-primary text-white text-sm font-normal rounded-full hover:bg-primary/90 transition-colors mt-8"
            >
              Voir l&apos;offre
            </a>
          </div>
        </section>

        {/* Problem */}
        <section className="bg-white">
          <div className="max-w-[680px] mx-auto px-4 lg:px-0 py-20 md:py-28">
            <h2 className="text-[28px] md:text-[40px] font-semibold leading-[1.1] tracking-tight text-foreground text-center mb-12">
              Vous vous reconnaissez ?
            </h2>
            <div className="space-y-4">
              {[
                "Vous avez essayé des dizaines de régimes sans résultat durable",
                "Vous culpabilisez de ne pas réussir à tenir un programme",
                "Vous avez du mal à planifier vos repas régulièrement",
                "Le sport vous semble une corvée plutôt qu'un plaisir",
                "Votre relation à la nourriture est compliquée",
                "Ce qui marche pour les autres ne marche pas pour vous",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 py-4 border-b border-black/[0.04] last:border-0"
                >
                  <span className="text-[15px] text-muted-foreground/40 font-mono tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[17px] text-foreground leading-[1.47]">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-[17px] text-muted-foreground leading-[1.47] mt-10">
              <strong className="text-foreground">Ce n&apos;est pas votre faute.</strong>{" "}
              Les méthodes classiques ne tiennent pas compte des spécificités neurologiques.
            </p>
          </div>
        </section>

        {/* Solution */}
        <section className="bg-[#f5f5f7]">
          <div className="max-w-[980px] mx-auto px-4 lg:px-0 py-20 md:py-28">
            <div className="text-center mb-16">
              <h2 className="text-[28px] md:text-[40px] font-semibold leading-[1.1] tracking-tight text-foreground">
                Un accompagnement qui respecte{" "}
                <br className="hidden md:block" />
                votre fonctionnement.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Neuro-adapté",
                  title: "Conçu pour votre profil cognitif",
                  desc: "TDAH, TSA, HPI/HPE, DYS. Chaque programme respecte votre fonctionnement unique.",
                  color: "text-primary",
                },
                {
                  label: "Evidence-based",
                  title: "Basé sur la science",
                  desc: "Bilan sanguin, calcul métabolique, approche validée scientifiquement.",
                  color: "text-secondary",
                },
                {
                  label: "Anti-restriction",
                  title: "Sans culpabilité",
                  desc: "On travaille avec votre corps, pas contre lui. Durablement.",
                  color: "text-accent",
                },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-[20px] p-8">
                  <p className={`text-xs font-medium uppercase tracking-wide ${item.color} mb-3`}>
                    {item.label}
                  </p>
                  <h3 className="text-[19px] font-semibold tracking-tight text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="bg-white">
          <div className="max-w-[680px] mx-auto px-4 lg:px-0 py-20 md:py-28">
            <h2 className="text-[28px] md:text-[40px] font-semibold leading-[1.1] tracking-tight text-foreground text-center mb-12">
              Tout est inclus.
            </h2>

            <div className="space-y-0">
              {[
                "Questionnaire de bilan complet",
                "Recommandations de bilan sanguin",
                "Consultation individuelle en visio",
                "Calcul métabolique personnalisé (NAP)",
                "Programme alimentaire sur mesure",
                "Programme sportif adapté",
                "20+ recettes équilibrées",
                "Guide d'organisation des repas",
                "Accès à votre espace client personnalisé",
                "Suivi nutrition, sport et cycle menstruel",
                "Documents et ressources bonus",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 py-3.5 border-b border-black/[0.04] last:border-0"
                >
                  <div className="w-5 h-5 rounded-full bg-secondary/15 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-secondary" />
                  </div>
                  <span className="text-[15px] text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="offre" className="bg-[#FBFAF8]">
          <div className="max-w-[480px] mx-auto px-4 lg:px-0 py-20 md:py-28 text-center">
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

            <div className="mt-10 space-y-3">
              <Link
                href="/api/payment/stripe"
                className="flex items-center justify-center w-full h-12 bg-primary text-white text-[15px] font-normal rounded-full hover:bg-primary/90 transition-colors"
              >
                Payer par carte bancaire
              </Link>
              <Link
                href="/api/payment/paypal"
                className="flex items-center justify-center w-full h-12 bg-[#0070BA] text-white text-[15px] font-normal rounded-full hover:bg-[#0070BA]/90 transition-colors"
              >
                Payer avec PayPal
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Paiement sécurisé. Vous recevrez un email de confirmation.
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
                  q: "C'est quoi la neuroatypie ?",
                  a: "La neuroatypie désigne les fonctionnements neurologiques qui diffèrent de la norme : TDAH, TSA, HPI/HPE, DYS. Ce n'est ni une maladie ni un handicap, c'est une façon différente de fonctionner.",
                },
                {
                  q: "Je ne suis pas diagnostiquée, c'est pour moi ?",
                  a: "Oui. Si les méthodes classiques n'ont jamais fonctionné pour vous, cet accompagnement peut vous convenir. Le diagnostic n'est pas un prérequis.",
                },
                {
                  q: "Comment se passe la consultation ?",
                  a: "Après le questionnaire, nous fixons un rendez-vous en visio. Je vous présente votre bilan personnalisé et réponds à toutes vos questions.",
                },
                {
                  q: "Est-ce un régime restrictif ?",
                  a: "Non. Mon approche est anti-régime. On travaille sur l'équilibre et le plaisir alimentaire. Pas de privation.",
                },
                {
                  q: "Comment accéder à mon espace client ?",
                  a: "Après votre consultation, vous recevez vos identifiants par email. Votre espace contient vos programmes et le suivi quotidien.",
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
              Investissez en vous.
            </h2>
            <p className="text-[17px] text-white/60 mt-3">
              Votre corps et votre esprit vous remercieront.
            </p>
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
