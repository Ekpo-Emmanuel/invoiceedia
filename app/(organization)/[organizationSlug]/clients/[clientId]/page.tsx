import { clerkClient } from "@clerk/nextjs/server";
import { checkOrganizationExists } from '@/utils/serverUtils';
import OrganizationNotFound from "@/components/v2/organization/organization-not-found";
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Users } from "lucide-react";
import { getClientById } from "@/app/actions/clients";
import { ClientDetails } from "@/components/v2/clients/client-details";
import { notFound } from "next/navigation";

interface ClientPageProps {
  params: {
    organizationSlug: string;
    clientId: string;
  };
}

export default async function ClientPage({ params }: { params: Promise<{ organizationSlug: string, clientId: string }> }) {
  const { organizationSlug, clientId } = await params;
  const client = await clerkClient();

  const organizationExists = await checkOrganizationExists(organizationSlug);
  if (!organizationExists) {
    return <OrganizationNotFound />;
  }

  const organization = await client.organizations.getOrganization({ slug: organizationSlug });
  const clientData = await getClientById(clientId);


  if (!clientData) {
    notFound();
  }

  return (
    <ContentLayout title={`${clientData.firstName} ${clientData.lastName}`} icon={Users}> 
      <ClientDetails 
        client={clientData}
        organizationSlug={organizationSlug}
      />
    </ContentLayout>
  );
} 