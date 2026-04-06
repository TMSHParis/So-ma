import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#f5f5f7]">
      {/* Top border */}
      <div className="max-w-[980px] mx-auto px-4 lg:px-0">
        <div className="border-t border-black/[0.06]" />
      </div>

      <div className="max-w-[980px] mx-auto px-4 lg:px-0 py-5">
        {/* Mini links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-5 text-xs">
          <div>
            <img src="/logo-soma.png" alt="So-ma" className="h-6 w-auto mb-2.5 mix-blend-multiply" />
            <ul className="space-y-1.5 text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Accueil</Link></li>
              <li><Link href="/suivi-nutritionnel" className="hover:text-foreground transition-colors">Accompagnement</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-foreground transition-colors">CGV &amp; Mentions légales</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2.5">Spécialités</h4>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>Nutrition</li>
              <li>Mouvement fonctionnel</li>
              <li>Neuroatypie</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2.5">Espace client</h4>
            <ul className="space-y-1.5 text-muted-foreground">
              <li><Link href="/connexion" className="hover:text-foreground transition-colors">Connexion</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Tableau de bord</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2.5">Contact</h4>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>
                <a href="mailto:so.ma.service.client@proton.me" className="hover:text-foreground transition-colors">
                  so.ma.service.client@proton.me
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/so_masav"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Instagram @so_masav
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-black/[0.06] pt-4 flex flex-col md:flex-row justify-between gap-2 text-xs text-muted-foreground">
          <p>Copyright &copy; {new Date().getFullYear()} So-ma. Tous droits réservés.</p>
          <p>Conseillère en nutrition</p>
        </div>
      </div>
    </footer>
  );
}
