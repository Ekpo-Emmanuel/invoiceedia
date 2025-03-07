import { ContentLayout } from '@/components/admin-panel/content-layout';
import { FileText } from "lucide-react";
import { getClientById } from "@/app/actions/clients";
import { notFound } from "next/navigation";
import { CreateInvoiceForm } from "@/components/v2/invoices/create-invoice-form";
import { withOrganization } from '@/utils/withOrganization';

type PageProps = {
  params: { 
    organizationSlug: string; 
    clientId: string;
  };
  organization: any;
};

async function CreateInvoicePage({ params, organization }: PageProps) {
  const { organizationSlug, clientId } = await params;

  const clientData = await getClientById(clientId);
  if (!clientData) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Home", href: `/${organizationSlug}` },
    { label: "Clients", href: `/${organizationSlug}/clients` },
    { label: `${clientData.firstName} ${clientData.lastName}`, href: `/${organizationSlug}/clients/${clientId}` },
    { label: "New Invoice", href: "#" },
  ];

  return (
    <ContentLayout 
      title="Create Invoice" 
      icon={FileText}
      breadcrumbs={breadcrumbs}
    > 
      <CreateInvoiceForm 
        client={clientData}
        organizationId={organization.id}
        organizationSlug={organizationSlug}
      />
    </ContentLayout>
  );
}

export default withOrganization(CreateInvoicePage);