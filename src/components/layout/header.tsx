"use client";

import Link from "next/link";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const navLinks = [
  { href: "/#methode", label: "Méthode" },
  { href: "/#a-propos", label: "À propos" },
  { href: "/suivi-nutritionnel", label: "Accompagnement" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b border-black/[0.04]">
      <nav className="max-w-[980px] mx-auto flex items-center justify-between h-11 px-4 lg:px-0">
        <Link href="/" className="flex items-center">
          <img src="/logo-soma.png" alt="So-ma" className="h-8 w-auto mix-blend-multiply" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-normal text-foreground/80 hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/connexion"
            className="text-xs font-normal text-foreground/80 hover:text-foreground transition-colors"
          >
            Mon espace
          </Link>
        </div>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center h-8 w-8">
            <Menu className="h-4 w-4" />
          </SheetTrigger>
          <SheetContent side="right" className="bg-white/95 backdrop-blur-xl w-72 border-l-0">
            <nav className="flex flex-col gap-1 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-[28px] font-semibold tracking-tight text-foreground py-2"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-black/[0.06] mt-4 pt-4">
                <Link
                  href="/connexion"
                  onClick={() => setOpen(false)}
                  className="text-[17px] font-normal text-primary"
                >
                  Mon espace &rarr;
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
