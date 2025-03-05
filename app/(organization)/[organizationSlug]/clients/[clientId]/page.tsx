import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Users } from "lucide-react";
import { getClientById } from "@/app/actions/clients";
import { ClientProfile } from "@/components/v2/clients/client-profile";
import ClientUserNotFound from "@/components/v2/clients/client-user-not-found";
import { withOrganization } from '@/utils/withOrganization';
// import { Breadcrumbs } from "@/components/ui/breadcrumbs";

interface PageProps {
  params: {
    organizationSlug: string;
    clientId: string;
  };
  organization: any;
}

async function ClientPage({ params, organization }: PageProps) {
  const { organizationSlug, clientId } = await params;

  const clientData = await getClientById(clientId);
  if (!clientData) {
    return <ClientUserNotFound />;
  }

  const breadcrumbs = [
    { label: "Home", href: `/${organizationSlug}` },
    { label: "Clients", href: `/${organizationSlug}/clients` },
    { label: `${clientData?.firstName} ${clientData?.lastName}`, href: "#" },
  ];

  return (
    <>
      <ContentLayout 
        title={`${clientData?.firstName} ${clientData?.lastName}`} 
        icon={Users}
      //   breadcrumbs={breadcrumbs}
      > 
        <ClientProfile 
          client={clientData}
          organizationSlug={organizationSlug}
        />
      </ContentLayout>
    </>
  );
}

export default withOrganization(ClientPage); 