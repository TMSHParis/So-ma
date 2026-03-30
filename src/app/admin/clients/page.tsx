"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Mail, Eye } from "lucide-react";
import { toast } from "sonner";

export default function ClientsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCreateClient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
    };

    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Compte cliente créé ! Un e-mail avec les identifiants a été envoyé.");
        setDialogOpen(false);
      } else {
        const error = await res.json();
        toast.error(error.message || "Erreur lors de la création");
      }
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  // TODO: Fetch real clients from DB
  const clients: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    status: string;
  }[] = [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-foreground">
            Gestion des clientes
          </h1>
          <p className="text-muted-foreground mt-1">
            Créez et gérez les comptes de vos clientes.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary hover:bg-primary/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle cliente
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un compte cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" name="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" name="lastName" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone (optionnel)</Label>
                <Input id="phone" name="phone" type="tel" />
              </div>
              <p className="text-xs text-muted-foreground">
                Un mot de passe sera généré automatiquement et envoyé par e-mail à
                la cliente avec ses identifiants de connexion.
              </p>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white"
                disabled={loading}
              >
                <Mail className="h-4 w-4 mr-2" />
                {loading ? "Création…" : "Créer et envoyer les identifiants"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-warm-border">
        <CardContent className="p-0">
          {clients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Aucune cliente pour le moment.
              </p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Créez un premier compte en cliquant sur &quot;Nouvelle
                cliente&quot;.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date d&apos;inscription</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      {client.name}
                    </TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.createdAt}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{client.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
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
