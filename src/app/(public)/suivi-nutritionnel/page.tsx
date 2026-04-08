import { getAllSections } from "@/lib/site-content";
import { SuiviNutritionnelClient } from "./suivi-client";

export default async function SuiviNutritionnelPage() {
  const content = await getAllSections(["suivi_hero", "suivi_pricing", "suivi_cta"]);

  return (
    <SuiviNutritionnelClient
      heroTitle={content.suivi_hero.title}
      pricingIntro={content.suivi_pricing.intro}
      pricingTitle={content.suivi_pricing.title}
      price={content.suivi_pricing.price}
      priceNote={content.suivi_pricing.price_note}
      ctaTitle={content.suivi_cta.title}
      ctaButton={content.suivi_cta.button}
    />
  );
}
