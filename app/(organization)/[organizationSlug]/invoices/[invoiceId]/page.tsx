import { ContentLayout } from '@/components/admin-panel/content-layout'
import { FileText } from "lucide-react";
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import InvoiceNotFound from '@/components/v2/invoices/invoice-not-found';
import { InvoiceDetails } from '@/components/v2/invoices/invoice-details';
import { currentUser } from '@clerk/nextjs/server'
import { getInvoiceById } from '@/app/actions/invoices';
import { getOrganization } from '@/utils/getOrganization';
import { isValidElement } from 'react';
import { Organization } from '@clerk/nextjs/server';

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ organizationSlug: string; invoiceId: string }>;
}) {
  const { organizationSlug, invoiceId } = await params;
  
  const organizationResult = await getOrganization(organizationSlug);
  
  if (isValidElement(organizationResult)) {
    return organizationResult;
  }
  
  const organization = organizationResult as Organization;
  
  const invoice = await db.query.Invoices.findFirst({
    where: and(
      eq(Invoices.id, invoiceId),
      eq(Invoices.organizationId, organization.id)
    ),
    with: {
      customer: true
    }
  });

  if (!invoice) {
    return <InvoiceNotFound />;
  }

  const breadcrumbs = [
    { label: "Home", href: `/${organizationSlug}` },
    { label: "Invoices", href: `/${organizationSlug}/invoices` },
    { label: `Invoice #${invoice.id}`, href: "#" },
  ];

  const processedInvoice = {
    ...invoice,
    taxRate: invoice?.taxRate ? parseFloat(invoice.taxRate) : null
  };
  
  return (
    <ContentLayout 
      title={``}
      icon={FileText}
      breadcrumbs={breadcrumbs}
    >
      <InvoiceDetails 
        invoice={processedInvoice} 
        organizationSlug={organizationSlug}
        organizationName={organization.name}
        userName={''}
      />
    </ContentLayout>
  );
}