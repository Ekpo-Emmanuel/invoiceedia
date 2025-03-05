import { Client as ClientType } from "@/types/client";
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Users } from "lucide-react";
import ClientContentPage from "@/components/v2/clients/client-content-page";
import { getClientList, getClientStats } from "@/app/actions/clients";
import { withOrganization } from '@/utils/withOrganization';

interface PageProps {
  params: { organizationSlug: string };
  organization: any;
}

async function ClientPage({ params, organization }: PageProps) {
  const { organizationSlug } = await params;

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
        initialClients={clients as ClientType[]}
        initialStats={stats}
      />
    </ContentLayout>
  )
}

export default withOrganization(ClientPage);