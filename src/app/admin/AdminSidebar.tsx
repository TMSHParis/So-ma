"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  CreditCard,
  Lightbulb,
  LogOut,
  Menu,
  Shield,
  PenSquare,
  MessageSquare,
  Globe,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";

type NavLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const BASE_LINKS: NavLink[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/clients", label: "Clientes", icon: Users },
  { href: "/admin/formulaires", label: "Formulaires", icon: FileText },
  { href: "/admin/programmes", label: "Programmes", icon: ClipboardList },
  { href: "/admin/articles", label: "Articles", icon: PenSquare },
  { href: "/admin/ressources", label: "Ressources", icon: Lightbulb },
  { href: "/admin/paiements", label: "Paiements", icon: CreditCard },
  { href: "/admin/suggestions", label: "Suggestions", icon: MessageSquare },
  { href: "/admin/contenu", label: "Contenu du site", icon: Globe },
];

const SUPERADMIN_LINK: NavLink = {
  href: "/admin/assiettes",
  label: "Assiettes",
  icon: UtensilsCrossed,
};

function SidebarContent({ pathname, isSuperAdmin }: { pathname: string; isSuperAdmin: boolean }) {
  const links = isSuperAdmin ? [...BASE_LINKS, SUPERADMIN_LINK] : BASE_LINKS;

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-4 border-b border-warm-border">
        <Link href="/admin" className="inline-flex">
          <img src="/logo-soma.png" alt="So-ma" className="h-7 w-auto mix-blend-multiply" />
        </Link>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mt-2.5 font-medium">
          Administration
        </p>
      </div>

      <ScrollArea className="flex-1 px-2.5 py-3">
        <nav className="space-y-0.5">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
                }`}
              >
                <link.icon className="h-[15px] w-[15px] flex-shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="px-2.5 py-3 border-t border-warm-border space-y-0.5">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04] transition-colors"
        >
          <LayoutDashboard className="h-[15px] w-[15px]" />
          Espace client
        </Link>
        <button
          type="button"
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-[15px] w-[15px]" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-warm-border">
      <SidebarContent pathname={pathname} isSuperAdmin={isSuperAdmin} />
    </aside>
  );
}

export function AdminMobileHeader({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="md:hidden flex items-center justify-between h-14 px-4 bg-white border-b border-warm-border">
      <Link href="/admin" className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold tracking-tight">Administration</span>
      </Link>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="inline-flex items-center justify-center rounded-md h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-white">
          <SidebarContent pathname={pathname} isSuperAdmin={isSuperAdmin} />
        </SheetContent>
      </Sheet>
    </header>
  );
}
