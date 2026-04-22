import { Users, FileText, CreditCard, ChevronRight } from "lucide-react";
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
    { label: "Clientes", value: clientCount.toLocaleString("fr-FR"), href: "/admin/clients" },
    { label: "Formulaires", value: formulaireCount.toLocaleString("fr-FR"), href: "/admin/formulaires" },
    { label: "Paiements", value: paiementCount.toLocaleString("fr-FR"), href: "/admin/paiements" },
    { label: "Revenus", value: `${totalRevenus.toLocaleString("fr-FR")} €`, href: "/admin/paiements" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Vue d&apos;ensemble</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl border border-warm-border bg-white px-5 py-4 hover:bg-muted/30 transition-colors"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </p>
            <p className="text-2xl font-semibold tabular-nums mt-1.5 leading-none text-foreground">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-warm-border bg-white overflow-hidden">
          <div className="px-5 py-3 border-b border-warm-border">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Actions rapides
            </p>
          </div>
          <div className="divide-y divide-warm-border">
            <Link
              href="/admin/clients?action=create"
              className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors group"
            >
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm flex-1">Créer un compte cliente</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
            </Link>
            <Link
              href="/admin/formulaires?action=generate"
              className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors group"
            >
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm flex-1">Générer un lien de formulaire</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
            </Link>
            <Link
              href="/admin/paiements"
              className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors group"
            >
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm flex-1">Envoyer un paiement</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-warm-border bg-white overflow-hidden">
          <div className="px-5 py-3 border-b border-warm-border flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Derniers formulaires
            </p>
            <Link
              href="/admin/formulaires"
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Tout voir
            </Link>
          </div>
          {formulairesRecents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucun formulaire reçu.
            </p>
          ) : (
            <div className="divide-y divide-warm-border">
              {formulairesRecents.map((r) => {
                const data = r.data as Record<string, unknown>;
                const name =
                  [data?.prenom, data?.nom].filter(Boolean).join(" ") ||
                  r.token.name ||
                  "Anonyme";
                return (
                  <div key={r.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <p className="text-sm font-medium truncate flex-1">{name}</p>
                    <p className="text-[11px] text-muted-foreground tabular-nums shrink-0">
                      {new Date(r.submittedAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
