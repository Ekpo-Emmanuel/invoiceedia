import { clerkClient } from "@clerk/nextjs/server";
import { checkOrganizationExists } from '@/utils/serverUtils';
import OrganizationNotFound from "@/components/v2/organization/organization-not-found";
import NewClientForm from "@/components/v2/clients/create-client/client-form";
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Users } from "lucide-react";

export default async function CreateClientPage({ params }: { params: Promise<{ organizationSlug: string }> }) {
  const { organizationSlug } = await params;
  const client = await clerkClient();

  const organizationExists = await checkOrganizationExists(organizationSlug);

  if (!organizationExists) {
    return <OrganizationNotFound />;
  }

  const organization = await client.organizations.getOrganization({ slug: organizationSlug });

  return (
    <ContentLayout title="Clients" icon={Users}> 
        <NewClientForm />
    </ContentLayout>
  )
}