"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Dentaire Cabinet",
    text: "Je voulais vous remercier pour votre professionnalisme, vous avez effectué de vrais recherches me concernant, mon poids actuel et cible, mais pas seulement, vous vous êtes intéressé à mon mode de vie, mon sommeil, le temps libre que j'ai (avec un bébé en bas âge) etc afin d'établir un réel plan sur mesure, adapté qui, par conséquent, devient facile à suivre.\nMerci beaucoup pour votre accompagnement, votre gentillesse et votre humanisme.",
    source: "Google",
  },
  {
    name: "Inaya",
    text: "Personnellement, j'ai beaucoup aimé être suivie ici pour plusieurs raisons. La coach a été chaleureuse, très compétente dans son domaine et surtout d'une grande gentillesse et compréhension. Ce qui m'a réellement conquise, c'est sa spécialisation dans l'accompagnement des personnes dans la perte de poids ayant un profil Asperger. J'ai compris et appris tellement de choses par sa cause… Je recommande vivement son suivi à quiconque !",
    source: "Google",
  },
  {
    name: "Lina Radaouin",
    text: "Cela fait plus de 10 ans, presque 15 ans, que j'essaie de perdre du poids. Comme beaucoup, j'en ai perdu… puis repris le double. Mais à l'aube de mes 40 ans, je ne me sentais plus bien, ni physiquement ni mentalement. J'étais totalement perdue, je savais que je ne pouvais pas y arriver seule, et surtout que je ne devais plus passer par des méthodes restrictives.\nJe tiens à remercier sincèrement Soma pour sa présence constante, son suivi et son soutien. Son accompagnement m'a redonné confiance et m'a permis de reprendre le contrôle de ma santé, en douceur.",
    source: "Google",
  },
];

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, next]);

  return (
    <section className="bg-[#FBFAF8]">
      <div className="max-w-[980px] mx-auto px-4 lg:px-0 py-20 md:py-28">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h2 className="text-[28px] md:text-[40px] font-semibold leading-[1.12] tracking-tight text-foreground">
            Ce qu&apos;elles en disent
          </h2>
          <a
            href="https://www.google.com/maps/place/So-ma/data=!4m2!3m1!1s0x0:0x69198e682e3bbb82?sa=X&ved=1t:2428&hl=fr&gl=ma&ictx=111"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground mt-2 underline hover:text-foreground transition-colors inline-block"
          >
            Voir tous les avis certifi&eacute;s Google &rsaquo;
          </a>
        </div>

        <div
          className="relative max-w-[680px] mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((t, i) => (
                <div key={i} className="w-full flex-shrink-0 px-4">
                  <blockquote className="bg-white rounded-[24px] border border-black/[0.06] p-8 md:p-10">
                    <p className="text-[15px] md:text-[16px] leading-[1.75] text-muted-foreground whitespace-pre-line">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <footer className="mt-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {t.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-[14px] font-medium text-foreground">{t.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-[11px] text-muted-foreground ml-1">
                            via {t.source}
                          </span>
                        </div>
                      </div>
                    </footer>
                  </blockquote>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white border border-black/[0.06] shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
            aria-label="Avis précédent"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white border border-black/[0.06] shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
            aria-label="Avis suivant"
          >
            <ChevronRight className="h-4 w-4 text-foreground" />
          </button>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? "bg-primary w-6" : "bg-black/10"
                }`}
                aria-label={`Avis ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
