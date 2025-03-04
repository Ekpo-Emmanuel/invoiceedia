import { clerkClient } from "@clerk/nextjs/server";
import { checkOrganizationExists } from './serverUtils';
import OrganizationNotFound from "@/components/v2/organization/organization-not-found";

type PageProps = {
  params: Promise<{ organizationSlug: string; [key: string]: any }>;
};

export function withOrganization<T extends PageProps>(
  WrappedComponent: React.ComponentType<T & { organization: any }>
) {
  return async function WithOrganizationWrapper(props: T) {
    const { organizationSlug } = await props.params;
    const client = await clerkClient();

    const organizationExists = await checkOrganizationExists(organizationSlug);

    if (!organizationExists) {
      return <OrganizationNotFound />;
    }

    const organization = await client.organizations.getOrganization({ slug: organizationSlug });

    return <WrappedComponent {...props} organization={organization} />;
  };
} 