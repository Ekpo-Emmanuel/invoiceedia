import { clerkClient } from "@clerk/nextjs/server";
import 'server-only';

export async function checkOrganizationExists(slug: string): Promise<boolean> {
  try {
    const client = await clerkClient();
    const organizations = await client.organizations.getOrganizationList();
    return organizations.data.some(org => org.slug === slug);
  } catch (error) {
    console.error("Error checking organization existence:", error);
    return false;
  }
}
