import { ContentLayout } from '@/components/admin-panel/content-layout';
import { FileText } from "lucide-react";
import { getClientById } from "@/app/actions/clients";
import { notFound } from "next/navigation";
import { CreateInvoiceForm } from "@/components/v2/invoices/create-invoice-form";
import { auth } from '@clerk/nextjs/server';

export default async function CreateClientPage({
  params,
}: {
  params: Promise<{ organizationSlug: string; clientId: string }>;
}) {
  const { organizationSlug, clientId } = await params;
  const { orgId } = await auth();
  
  if (!orgId) {
    throw new Error("Organization not found - this should be handled by layout");
  }
  
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
        organizationId={orgId} 
        organizationSlug={organizationSlug} 
      />
    </ContentLayout>
  );
}