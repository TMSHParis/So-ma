import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CreditCard, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  // TODO: Fetch real data from DB
  const stats = {
    clients: 12,
    formulaires: 8,
    paiements: 15,
    revenus: 1935,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-foreground">
          Dashboard administrateur
        </h1>
        <p className="text-muted-foreground mt-1">
          Vue d&apos;ensemble de votre activité.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Clientes",
            value: stats.clients,
            icon: Users,
            color: "text-primary",
            bg: "bg-primary/10",
            href: "/admin/clients",
          },
          {
            label: "Formulaires reçus",
            value: stats.formulaires,
            icon: FileText,
            color: "text-secondary-foreground",
            bg: "bg-secondary/20",
            href: "/admin/formulaires",
          },
          {
            label: "Paiements",
            value: stats.paiements,
            icon: CreditCard,
            color: "text-accent-foreground",
            bg: "bg-accent/20",
            href: "/admin/paiements",
          },
          {
            label: "Revenus",
            value: `${stats.revenus} \u20ac`,
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-50",
            href: "/admin/paiements",
          },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="border-warm-border hover:shadow-md transition-shadow h-full">
              <CardContent className="pt-5 pb-5">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-warm-border">
          <CardHeader>
            <CardTitle className="text-base">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/admin/clients?action=create"
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm">Créer un compte cliente</span>
            </Link>
            <Link
              href="/admin/formulaires?action=generate"
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <FileText className="h-4 w-4 text-secondary-foreground" />
              <span className="text-sm">Générer un lien de formulaire</span>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-warm-border">
          <CardHeader>
            <CardTitle className="text-base">Derniers formulaires reçus</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-6">
              Les formulaires reçus apparaîtront ici.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
