import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import 'server-only';

/**
 * Checks if an organization with the given slug exists and if the current user is a member of it
 * @param slug The organization slug to check
 * @returns The organization ID if found and user is a member, null otherwise
 */
export async function checkOrganizationExists(slug: string): Promise<string | null> {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  try {
    const client = await clerkClient();
    const userMemberships = await client.users.getOrganizationMembershipList({ userId });
    
    for (const membership of userMemberships.data) {
      if (membership.organization.slug === slug) {
        return membership.organization.id;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error checking organization membership:", error);
    return null;
  }
}