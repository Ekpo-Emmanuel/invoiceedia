import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Users } from "lucide-react";
import { getClientById } from "@/app/actions/clients";
import { ClientProfile } from "@/components/v2/clients/client-profile";
import ClientUserNotFound from "@/components/v2/clients/client-user-not-found";
import { checkOrganizationExists } from '@/utils/serverUtils';
import { auth } from '@clerk/nextjs/server';

export default async function ClientPage({
  params,
}: {
  params: Promise<{ organizationSlug: string; clientId: string }>;
}) {
  const { organizationSlug, clientId } = await params;
  const { orgId } = await auth();
  const organizationId = await checkOrganizationExists(organizationSlug);

  if (!organizationId) {
    throw new Error("Organization not found - this should be handled by layout");
  }
  
  const client = await getClientById(clientId);
  
  if (!client) {
    return <ClientUserNotFound />;
  }

  const breadcrumbs = [
    { label: "Home", href: `/${organizationSlug}` },
    { label: "Clients", href: `/${organizationSlug}/clients` },
    { label: `${client.firstName} ${client.lastName}`, href: "#" },
  ];

  return (
    <ContentLayout 
      title={`${client.firstName} ${client.lastName}`} 
      breadcrumbs={breadcrumbs}
    >
      <ClientProfile 
        client={client} 
        organizationSlug={organizationSlug} 
      />
    </ContentLayout>
  );
} 