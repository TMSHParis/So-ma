import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Check } from "lucide-react";

export default function PaiementConfirmePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-[#FBFAF8]">
          <div className="max-w-[560px] mx-auto px-4 lg:px-0 py-24 md:py-32 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-secondary" />
            </div>
            <h1 className="text-[28px] md:text-[40px] font-semibold leading-[1.1] tracking-tight text-foreground mb-4">
              Paiement confirmé
            </h1>
            <p className="text-[17px] text-muted-foreground leading-[1.6] mb-2">
              Merci pour ta confiance ! Tu vas recevoir un email avec toutes les
              informations pour la suite.
            </p>
            <p className="text-[15px] text-muted-foreground leading-[1.6] mb-8">
              Si tu ne reçois rien d'ici quelques minutes, vérifie tes
              spams.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center h-11 px-7 bg-primary text-white text-sm font-normal rounded-full hover:bg-primary/90 transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
