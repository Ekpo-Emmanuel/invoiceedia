import { clerkClient } from "@clerk/nextjs/server";
import { checkOrganizationExists } from '@/utils/serverUtils';
import OrganizationNotFound from "@/components/v2/organization/organization-not-found";
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Users } from "lucide-react";
import ClientContentPage from "@/components/v2/clients/client-content-page";
import { getClientList, getClientStats } from "@/app/actions/clients";

export default async function ClientPage({ params }: { params: Promise<{ organizationSlug: string }> }) {
  const { organizationSlug } = await params;
  const client = await clerkClient();

  const organizationExists = await checkOrganizationExists(organizationSlug);

  if (!organizationExists) {
    return <OrganizationNotFound />;
  }

  const organization = await client.organizations.getOrganization({ slug: organizationSlug });

  const [clients, stats] = await Promise.all([
    getClientList(organization.id),
    getClientStats(organization.id)
  ]);

  return (
    <ContentLayout title="Clients" icon={Users}> 
      <ClientContentPage 
        title={`${organizationSlug}/clients`} 
        organizationId={organization.id}
        organizationSlug={organizationSlug}
        initialClients={clients}
        initialStats={stats}
      />
    </ContentLayout>
  )
}