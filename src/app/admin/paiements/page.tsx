"use client";

import { useState, useEffect, useCallback } from "react";
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
import { CreditCard, Plus, Loader2, Send, Trash2 } from "lucide-react";
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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

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

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === payments.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(payments.map((p) => p.id)));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce paiement ?")) return;
    try {
      const res = await fetch(`/api/stripe/payments/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Paiement supprimé");
        fetchPayments();
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch {
      toast.error("Erreur de connexion");
    }
  }

  async function handleBulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Supprimer ${selected.size} paiement(s) ?`)) return;
    setDeleting(true);
    try {
      await Promise.all(
        Array.from(selected).map((id) =>
          fetch(`/api/stripe/payments/${id}`, { method: "DELETE" })
        )
      );
      toast.success(`${selected.size} paiement(s) supprimé(s)`);
      setSelected(new Set());
      fetchPayments();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  }

  const completedPayments = payments.filter((p) => p.status === "COMPLETED");
  const totalRevenue = completedPayments.reduce((a, p) => a + p.amount, 0);

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Paiements
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground tabular-nums">
            {payments.length} paiement{payments.length > 1 ? "s" : ""}
            {completedPayments.length > 0 && (
              <>
                <span className="text-muted-foreground/40 mx-2">·</span>
                {totalRevenue.toFixed(2)} € reçus
              </>
            )}
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

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-xl border border-warm-border bg-white px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Paiements reçus</p>
          <p className="text-2xl font-semibold tabular-nums mt-1.5 leading-none">{completedPayments.length}</p>
        </div>
        <div className="rounded-xl border border-warm-border bg-white px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Revenus totaux</p>
          <p className="text-2xl font-semibold tabular-nums mt-1.5 leading-none">
            {totalRevenue.toFixed(2)}
            <span className="text-base text-muted-foreground font-normal ml-1">€</span>
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-warm-border bg-white overflow-hidden">
        {payments.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-warm-border">
            <label className="flex items-center gap-2 text-sm cursor-pointer text-muted-foreground">
              <input
                type="checkbox"
                checked={selected.size === payments.length && payments.length > 0}
                onChange={toggleAll}
                className="rounded border-gray-300 accent-primary h-4 w-4"
              />
              Tout sélectionner
            </label>
            {selected.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                className="h-7 text-xs"
                onClick={handleBulkDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Trash2 className="h-3 w-3 mr-1" />
                )}
                Supprimer ({selected.size})
              </Button>
            )}
          </div>
        )}
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
              <TableRow className="border-warm-border hover:bg-transparent">
                <TableHead className="w-10"></TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Nom</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Email</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Montant</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Statut</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Date</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => {
                const statusConfig =
                  p.status === "COMPLETED" ? { label: "Payé", dot: "bg-emerald-500" } :
                  p.status === "PENDING" ? { label: "En attente", dot: "bg-amber-500" } :
                  p.status === "FAILED" ? { label: "Échec", dot: "bg-red-500" } :
                  p.status === "REFUNDED" ? { label: "Remboursé", dot: "bg-foreground/40" } :
                  { label: p.status, dot: "bg-foreground/40" };
                return (
                  <TableRow key={p.id} className="border-warm-border">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selected.has(p.id)}
                        onChange={() => toggleSelect(p.id)}
                        className="rounded border-gray-300 accent-primary h-4 w-4 cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {p.name || <span className="text-muted-foreground/60">—</span>}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.email}</TableCell>
                    <TableCell className="text-right tabular-nums text-sm font-medium">
                      {p.amount.toFixed(2)} {p.currency}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
                        {statusConfig.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm tabular-nums">
                      {new Date(p.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        onClick={() => handleDelete(p.id)}
                        title="Supprimer"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
