import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CreditCard, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
    redirect("/connexion");
  }

  const [clientCount, formulaireCount, formulairesRecents, paiementCount, revenus] =
    await Promise.all([
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.bilanResponse.count(),
      prisma.bilanResponse.findMany({
        take: 5,
        orderBy: { submittedAt: "desc" },
        include: { token: true },
      }),
      prisma.payment.count({ where: { status: "COMPLETED" } }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
    ]);

  const totalRevenus = revenus._sum.amount || 0;

  const stats = [
    {
      label: "Clientes",
      value: clientCount,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
      href: "/admin/clients",
    },
    {
      label: "Formulaires reçus",
      value: formulaireCount,
      icon: FileText,
      color: "text-secondary-foreground",
      bg: "bg-secondary/20",
      href: "/admin/formulaires",
    },
    {
      label: "Paiements",
      value: paiementCount,
      icon: CreditCard,
      color: "text-accent-foreground",
      bg: "bg-accent/20",
      href: "/admin/paiements",
    },
    {
      label: "Revenus",
      value: `${totalRevenus} €`,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
      href: "/admin/paiements",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          Dashboard administrateur
        </h1>
        <p className="text-muted-foreground mt-1">
          Vue d&apos;ensemble de votre activité.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="border-warm-border hover:shadow-md transition-shadow h-full">
              <CardContent className="pt-5 pb-5">
                <div
                  className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}
                >
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
            {formulairesRecents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Aucun formulaire reçu pour le moment.
              </p>
            ) : (
              <div className="space-y-3">
                {formulairesRecents.map((r) => {
                  const data = r.data as Record<string, unknown>;
                  const name =
                    [data?.prenom, data?.nom].filter(Boolean).join(" ") ||
                    r.token.name ||
                    "Anonyme";
                  return (
                    <div
                      key={r.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                    >
                      <div>
                        <p className="text-sm font-medium">{name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(r.submittedAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Reçu
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
