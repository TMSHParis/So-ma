"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, TrendingUp, Plus, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

type Payment = {
  id: string;
  name: string | null;
  email: string;
  amount: number;
  currency: string;
  provider: string;
  status: string;
  createdAt: string;
};

export default function PaiementsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const fetchPayments = useCallback(async () => {
    try {
      const res = await fetch("/api/stripe/payments");
      if (res.ok) setPayments(await res.json());
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  // Check URL params for success/cancelled
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") {
      toast.success("Paiement envoyé avec succès !");
      window.history.replaceState({}, "", "/admin/paiements");
    }
    if (params.get("cancelled") === "1") {
      toast.info("Paiement annulé");
      window.history.replaceState({}, "", "/admin/paiements");
    }
  }, []);

  async function handleCreateCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fd.get("email"),
          name: fd.get("name"),
          amount: Number(fd.get("amount")),
          description: fd.get("description") || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      if (url) window.open(url, "_blank");
      setDialogOpen(false);
      toast.success("Lien de paiement ouvert dans un nouvel onglet");
    } catch { toast.error("Erreur lors de la création du paiement"); }
    finally { setSending(false); }
  }

  const completedPayments = payments.filter((p) => p.status === "COMPLETED");
  const totalRevenue = completedPayments.reduce((a, p) => a + p.amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Paiements
          </h1>
          <p className="text-muted-foreground mt-1">
            Historique des paiements Stripe.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <Button onClick={() => setDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="h-4 w-4 mr-2" />Nouveau paiement
          </Button>
          <DialogContent>
            <DialogHeader><DialogTitle>Envoyer un lien de paiement</DialogTitle></DialogHeader>
            <form onSubmit={handleCreateCheckout} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="name">Nom</Label><Input id="name" name="name" placeholder="Prénom Nom" /></div>
                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="amount">Montant (€)</Label><Input id="amount" name="amount" type="number" step="0.01" min="1" required placeholder="50" /></div>
                <div className="space-y-2"><Label htmlFor="description">Description</Label><Input id="description" name="description" placeholder="Accompagnement So-Ma" /></div>
              </div>
              <p className="text-xs text-muted-foreground">
                Un lien Stripe Checkout sera ouvert. La cliente pourra payer par carte bancaire.
              </p>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={sending}>
                <Send className="h-4 w-4 mr-2" />{sending ? "Création..." : "Générer le lien de paiement"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="border-warm-border">
          <CardContent className="pt-5 pb-5 text-center">
            <CreditCard className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{completedPayments.length}</p>
            <p className="text-xs text-muted-foreground">Paiements reçus</p>
          </CardContent>
        </Card>
        <Card className="border-warm-border">
          <CardContent className="pt-5 pb-5 text-center">
            <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{totalRevenue.toFixed(2)} €</p>
            <p className="text-xs text-muted-foreground">Revenus totaux</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-warm-border">
        <CardHeader>
          <CardTitle className="text-base">Historique</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Aucun paiement enregistré.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name || "—"}</TableCell>
                    <TableCell>{p.email}</TableCell>
                    <TableCell>{p.amount.toFixed(2)} {p.currency}</TableCell>
                    <TableCell>
                      <Badge className={
                        p.status === "COMPLETED" ? "bg-green-100 text-green-700 border-0" :
                        p.status === "PENDING" ? "bg-yellow-100 text-yellow-700 border-0" :
                        p.status === "FAILED" ? "bg-red-100 text-red-700 border-0" :
                        "bg-gray-100 text-gray-700 border-0"
                      }>
                        {p.status === "COMPLETED" ? "Payé" : p.status === "PENDING" ? "En attente" : p.status === "REFUNDED" ? "Remboursé" : p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(p.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
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
