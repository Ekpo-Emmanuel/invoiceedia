"use client"

import { Client } from "@/types/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, Phone, Building2, MapPin } from "lucide-react"
import Link from "next/link"
import { formatDate, formatCurrency } from "@/lib/utils"

interface ClientDetailsProps {
  client: Client
  organizationSlug: string
}

export function ClientDetails({ client, organizationSlug }: ClientDetailsProps) {
  const totalInvoiceValue = client.invoices?.reduce((sum, invoice) => sum + invoice.total, 0) || 0;
  const paidInvoices = client.invoices?.filter(invoice => invoice.status === 'paid') || [];
  const totalPaidValue = paidInvoices.reduce((sum, invoice) => sum + invoice.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          asChild
        >
          <Link href={`/${organizationSlug}/clients`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${client.email}`} className="hover:underline">
                {client.email}
              </a>
            </div>
            {client.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${client.phone}`} className="hover:underline">
                  {client.phone}
                </a>
              </div>
            )}
            {client.companyName && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{client.companyName}</span>
              </div>
            )}
            {(client.city || client.state || client.country) && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {[client.city, client.state, client.country]
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
          </CardContent>
        </Card>

        {client.invoices && client.invoices.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-sm text-muted-foreground">Total Invoices</div>
                  <div className="text-2xl font-bold">{client.invoices.length}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Value</div>
                  <div className="text-2xl font-bold">{formatCurrency(totalInvoiceValue)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Paid Amount</div>
                  <div className="text-2xl font-bold">{formatCurrency(totalPaidValue)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 