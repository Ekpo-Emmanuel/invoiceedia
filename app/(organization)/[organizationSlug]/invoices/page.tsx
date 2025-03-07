import { ContentLayout } from '@/components/admin-panel/content-layout'
import DashboardInvoicePage from '@/components/v2/invoices/invoice-content-page';
import { Newspaper } from "lucide-react";
import { checkOrganizationExists } from '@/utils/serverUtils';

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ organizationSlug: string; clientId: string }>;
}) {
  const { organizationSlug } = await params;
  const organizationId = await checkOrganizationExists(organizationSlug);
  
  if (!organizationId) {
    throw new Error("Organization not found - this should be handled by layout");
  }

  return (
    <ContentLayout title="Invoices" icon={Newspaper}> 
      <DashboardInvoicePage 
        organizationId={organizationId}
        organizationSlug={organizationSlug} 
      />
    </ContentLayout>
  );
}