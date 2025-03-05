"use client";

import { Client } from "@/types/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mail,
  Phone,
  Building2,
  MapPin,
  FileText,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ClientInvoicesTable } from "./client-invoices-table";
import { useState } from "react";
import { DeleteClientDialog } from "./delete-client-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ClientProfileProps {
  client: Client;
  organizationSlug: string;
}

export function ClientProfile({
  client,
  organizationSlug,
}: ClientProfileProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const totalRevenue =
    client.invoices?.reduce(
      (sum, invoice) => (invoice.status === "paid" ? sum + invoice.total / 100 : sum),
      0
    ) || 0;

  const outstandingBalance =
    client.invoices?.reduce(
      (sum, invoice) =>
        invoice.status !== "paid" ? sum + invoice.total / 100 : sum,
      0
    ) || 0;

  const handleDeleteClient = async () => {
    // Implementation for deleting client
    router.push(`/${organizationSlug}/clients`);
    toast.success("Client deleted successfully");
  };

  return (
    <div className="space-y-6">
      {/* Client Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${client.email}`} className="hover:underline">
                {client.email}
              </a>
            </div>
            {client.phone && (
              <div className="flex items-center gap-2 text-sm font-medium">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${client.phone}`} className="hover:underline">
                  {client.phone}
                </a>
              </div>
            )}
            {client.companyName && (
              <div className="flex items-center gap-2 text-sm font-medium">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{client.companyName}</span>
              </div>
            )}
            {(client.street ||
              client.city ||
              client.state ||
              client.country) && (
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {[client.street, client.city, client.state, client.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Client since</div>
              <div>{formatDate(client.createTs)}</div>
            </div>
            {client.notes && (
              <div>
                <div className="text-sm text-muted-foreground">Notes</div>
                <div>{client.notes}</div>
              </div>
            )}
            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* <Button asChild>
          <Link href={`/${organizationSlug}/clients/${client.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Client
          </Link>
        </Button> */}
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Client
              </Button>
              <Button asChild>
                <Link
                  href={`/${organizationSlug}/clients/${client.id}/invoices/new`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoices</CardTitle>
          <Button variant="outline" asChild>
            <Link href={`/${organizationSlug}/invoices?clientId=${client.id}`}>
              <FileText className="h-4 w-4 mr-2" />
              View All Invoices
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <ClientInvoicesTable
            invoices={client.invoices || []}
            organizationSlug={organizationSlug}
            customerId={client.id}
          />
          <div className="justify-between items-center flex mt-2">
            <div>
              <div className="text-sm text-muted-foreground tracking-tight">Total Revenue</div>
              <div className="text-xl font-bold">
                {formatCurrency(totalRevenue)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground tracking-tight">
                Outstanding Balance
              </div>
              <div className="text-xl font-bold">
                {formatCurrency(outstandingBalance)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteClientDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteClient}
      />
    </div>
  );
}
