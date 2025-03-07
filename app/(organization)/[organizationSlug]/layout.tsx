import { checkOrganizationExists } from '@/utils/serverUtils';
import OrganizationNotFound from "@/components/v2/organization/organization-not-found";
import ClientLayout from './client-layout';

export default async function OrganisationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { organizationSlug: string };
}) {
  const { organizationSlug } = await params;
  const organizationId = await checkOrganizationExists(organizationSlug);

  if (!organizationId) {
    return <OrganizationNotFound />;
  }

  return <ClientLayout organizationId={organizationId}>{children}</ClientLayout>;
}