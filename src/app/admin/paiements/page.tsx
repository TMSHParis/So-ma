import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, TrendingUp } from "lucide-react";

export default function PaiementsPage() {
  // TODO: Fetch real data from DB
  const payments: {
    id: string;
    name: string;
    email: string;
    amount: number;
    provider: string;
    status: string;
    date: string;
  }[] = [];

  const totalRevenue = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((a, p) => a + p.amount, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-foreground">
          Paiements
        </h1>
        <p className="text-muted-foreground mt-1">
          Historique des paiements Stripe et PayPal.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="border-warm-border">
          <CardContent className="pt-5 pb-5 text-center">
            <CreditCard className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{payments.length}</p>
            <p className="text-xs text-muted-foreground">Total paiements</p>
          </CardContent>
        </Card>
        <Card className="border-warm-border">
          <CardContent className="pt-5 pb-5 text-center">
            <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{totalRevenue} &euro;</p>
            <p className="text-xs text-muted-foreground">Revenus totaux</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-warm-border">
        <CardHeader>
          <CardTitle className="text-base">Historique</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">
                Aucun paiement enregistre.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Moyen</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.name}
                    </TableCell>
                    <TableCell>{payment.email}</TableCell>
                    <TableCell>{payment.amount} &euro;</TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.provider}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.status === "COMPLETED"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {payment.status === "COMPLETED" ? "Paye" : payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
