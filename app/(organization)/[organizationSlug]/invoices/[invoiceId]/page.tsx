import { ContentLayout } from '@/components/admin-panel/content-layout'
import { FileText } from "lucide-react";
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { withOrganization } from '@/utils/withOrganization';
import InvoiceNotFound from '@/components/v2/invoices/invoice-not-found';
import { InvoiceDetails } from '@/components/v2/invoices/invoice-details';
import { currentUser } from '@clerk/nextjs/server'
import { getInvoiceById } from '@/app/actions/invoices';

interface PageProps {
  params: { 
    organizationSlug: string; 
    invoiceId: string 
  };
  organization: any;
}

async function InvoiceDetailPage({ params, organization }: PageProps) {
  const { organizationSlug, invoiceId } = await params;

  const invoiceData = await getInvoiceById(invoiceId, organization.id);
  if (!invoiceData) {
    return <InvoiceNotFound />;
  }

  try {
    const user = await currentUser();
    const userName = `${user?.firstName} ${user?.lastName}`.trim();

    // Fetch invoice with customer details and verify organization ownership in one query
    const invoice = await db.query.Invoices.findFirst({
      where: and(
        eq(Invoices.id, invoiceId),
        eq(Invoices.organizationId, organization.id)
      ),
      with: {
        customer: true
      }
    });

    // If no invoice found or doesn't belong to organization
    if (!invoice) {
      return <InvoiceNotFound />;
    }

    const breadcrumbs = [
      { label: "Home", href: `/${organizationSlug}` },
      { label: "Invoices", href: `/${organizationSlug}/invoices` },
      { label: `Invoice #${invoice.id}`, href: "#" },
    ];

    // Convert taxRate to number before passing to InvoiceDetails
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
          userName={userName}
        />
      </ContentLayout>
    );
  } catch (error) {
    return <InvoiceNotFound />;
  }
}

export default withOrganization(InvoiceDetailPage);