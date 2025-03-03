import { checkOrganizationExists } from "@/utils/serverUtils";
import OrganizationNotFound from "@/components/v2/organization/organization-not-found";

export default async function OrganizationCheck({ slug, children }: { slug: string, children: React.ReactNode }) {
  const organizationExists = await checkOrganizationExists(slug);

  if (!organizationExists) {
    return <OrganizationNotFound />;
  }

  return <>{children}</>;
}
