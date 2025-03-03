import { clerkClient } from "@clerk/nextjs/server";
import { checkOrganizationExists } from '@/utils/serverUtils';
import OrganizationNotFound from "@/components/v2/organization/organization-not-found";
import { ContentLayout } from '@/components/admin-panel/content-layout'

import DashboardInvoicePage from '@/components/v2/invoices/invoice-content-page';
import { Newspaper } from "lucide-react";


export default async function InvoicePage({ params }: { params: Promise<{ organizationSlug: string }> }) {
  const { organizationSlug } = await params;
  const client = await clerkClient();

  const organizationExists = await checkOrganizationExists(organizationSlug);

  if (!organizationExists) {
    return <OrganizationNotFound />;
  }

  const organization = await client.organizations.getOrganization({ slug: organizationSlug });

  return (
    <ContentLayout title="Invoices" icon={Newspaper}> 
      <DashboardInvoicePage />
    </ContentLayout>
  )
}