"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Utensils,
  Dumbbell,
  Calendar,
  ClipboardList,
  Heart,
  LogOut,
  Menu,
  Lightbulb,
  Target,
  Share2,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ShareGuidelinesModal } from "@/components/share-guidelines-modal";

type SidebarLink = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
};

const baseLinks: SidebarLink[] = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/objectifs", label: "Mes objectifs", icon: Target },
  { href: "/dashboard/nutrition", label: "Suivi alimentaire", icon: Utensils },
  { href: "/dashboard/sport", label: "Suivi sportif", icon: Dumbbell },
  { href: "/dashboard/cycle", label: "Cycle menstruel", icon: Heart },
  {
    href: "/dashboard/programme-alimentaire",
    label: "Programme alimentaire",
    icon: ClipboardList,
  },
  {
    href: "/dashboard/programme-sportif",
    label: "Programme sportif",
    icon: Calendar,
  },
  { href: "/dashboard/ressources", label: "Ressources", icon: Lightbulb },
  { href: "/dashboard/partage", label: "Parler de So-ma", icon: Share2 },
];

function SidebarContent({
  pathname,
  sidebarLinks,
  isAdmin,
}: {
  pathname: string;
  sidebarLinks: SidebarLink[];
  isAdmin: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-warm-border">
        <Link href="/dashboard">
          <img src="/logo-soma.png" alt="So-ma" className="h-8 w-auto mix-blend-multiply" />
          <p className="text-xs text-muted-foreground mt-1">
            Mon espace bien-être
          </p>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <link.icon className="h-4 w-4 flex-shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-3 border-t border-warm-border space-y-1">
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Shield className="h-4 w-4" />
            Espace admin
          </Link>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hideCycle, setHideCycle] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/client/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.sex === "M") setHideCycle(true);
      })
      .catch(() => {});
    fetch("/api/auth/session")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user?.role === "ADMIN") setIsAdmin(true);
      })
      .catch(() => {});
  }, []);

  const sidebarLinks = hideCycle
    ? baseLinks.filter((l) => l.href !== "/dashboard/cycle")
    : baseLinks;

  return (
    <div className="flex h-screen bg-cream">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-warm-border">
        <SidebarContent pathname={pathname} sidebarLinks={sidebarLinks} isAdmin={isAdmin} />
      </aside>

      {/* Mobile header + sidebar */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="md:hidden flex items-center justify-between h-14 px-4 bg-white border-b border-warm-border">
          <Link href="/dashboard">
            <img src="/logo-soma.png" alt="So-ma" className="h-7 w-auto mix-blend-multiply" />
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="inline-flex items-center justify-center rounded-lg h-8 w-8 hover:bg-muted transition-colors">
                <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-white">
              <SidebarContent pathname={pathname} sidebarLinks={sidebarLinks} isAdmin={isAdmin} />
            </SheetContent>
          </Sheet>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-4 md:p-8">{children}</div>
        </main>
      </div>

      <ShareGuidelinesModal />
    </div>
  );
}
