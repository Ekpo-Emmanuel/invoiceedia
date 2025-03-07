import { ContentLayout } from '@/components/admin-panel/content-layout';
import { Client as ClientType } from "@/types/client";
import { Users } from "lucide-react";
import ClientContentPage from "@/components/v2/clients/client-content-page";
import { getClientList, getClientStats } from "@/app/actions/clients";
import { checkOrganizationExists } from '@/utils/serverUtils';

export default async function ClientPage({
  params,
}: {
  params: Promise<{ organizationSlug: string; clientId: string }>;
}) {
  const { organizationSlug } = await params;
  const organizationId = await checkOrganizationExists(organizationSlug);
  
  if (!organizationId) {
    throw new Error("Organization not found - this should be handled by layout");
  }
  
  const [clients, stats] = await Promise.all([
    getClientList(organizationId),
    getClientStats(organizationId)
  ]);

  return (
    <ContentLayout title="Clients" icon={Users}>
      <ClientContentPage 
        title={`${organizationSlug}/clients`} 
        organizationId={organizationId}
        organizationSlug={organizationSlug}
        initialClients={clients as ClientType[]}
        initialStats={stats}
      />
    </ContentLayout>
  );
}