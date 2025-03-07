import NewClientForm from "@/components/v2/clients/create-client/client-form";
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Users } from "lucide-react";
import { withOrganization } from '@/utils/withOrganization';

interface PageProps {
  params: { organizationSlug: string };
  organization: any;
}

async function CreateClientPage({ organization }: PageProps) {
  return (
    <ContentLayout title="Clients" icon={Users}> 
        <NewClientForm />
    </ContentLayout>
  )
}

export default withOrganization(CreateClientPage);