import { clerkClient } from "@clerk/nextjs/server";
import 'server-only';

export async function checkOrganizationExists(slug: string): Promise<boolean> {
  try {
    const client = await clerkClient();
    const organizations = await client.organizations.getOrganizationList();
    const exists = organizations.data.some(org => org.slug === slug);
    return exists;
  } catch (error) {
    return false;
  }
}