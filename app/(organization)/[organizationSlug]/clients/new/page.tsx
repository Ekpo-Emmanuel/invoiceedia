import { ContentLayout } from '@/components/admin-panel/content-layout';
import { UserPlus } from 'lucide-react';
import NewClientForm from "@/components/v2/clients/create-client/client-form";
import { getOrganization } from '@/utils/getOrganization';


export default async function CreateClientPage({
  params,
}: {
  params: Promise<{ organizationSlug: string; clientId: string }>;
}) {
  const { organizationSlug } = await params;
  const organization = await getOrganization(organizationSlug);
  
  const breadcrumbs = [
    { label: "Home", href: `/${organizationSlug}` },
    { label: "Clients", href: `/${organizationSlug}/clients` },
    { label: "New Client", href: "#" },
  ];

  return (
    <ContentLayout title="New Client" icon={UserPlus} breadcrumbs={breadcrumbs}>
      <NewClientForm 
        // organizationId={organization.id} 
        // organizationSlug={organizationSlug} 
      />
    </ContentLayout>
  );
}