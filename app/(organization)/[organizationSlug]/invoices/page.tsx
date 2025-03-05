import { ContentLayout } from '@/components/admin-panel/content-layout'
import DashboardInvoicePage from '@/components/v2/invoices/invoice-content-page';
import { Newspaper } from "lucide-react";
import { withOrganization } from '@/utils/withOrganization';

interface PageProps {
  params: { organizationSlug: string };
  organization: any;
}

async function InvoicePage({ params, organization }: PageProps) {
  const { organizationSlug } = await params;
  
  return (
    <ContentLayout title="Invoices" icon={Newspaper}> 
      <DashboardInvoicePage 
        organizationId={organization.id}
        organizationSlug={organizationSlug} 
      />
    </ContentLayout>
  )
}

export default withOrganization(InvoicePage);