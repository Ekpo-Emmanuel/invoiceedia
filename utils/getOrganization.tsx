import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Organization } from "@clerk/nextjs/server";
import OrganizationNotFound from "@/components/v2/organization/organization-not-found";
import { ReactElement } from "react";

export async function getOrganization(organizationSlug: string): Promise<Organization | ReactElement> {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }
  
  const clerk = await clerkClient();
  const userMemberships = await clerk.users.getOrganizationMembershipList({ userId });
  
  const userOrgs = await Promise.all(
    userMemberships.data.map(async (membership) => {
      return await clerk.organizations.getOrganization({ organizationId: membership.organization.id });
    })
  );
  
  const organization = userOrgs.find(org => org.slug === organizationSlug);
  
  if (!organization) {
    return <OrganizationNotFound />;
  }
  
  return organization;
} 