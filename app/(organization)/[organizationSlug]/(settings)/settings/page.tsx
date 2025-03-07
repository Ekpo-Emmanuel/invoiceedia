import { ContentLayout } from '@/components/admin-panel/content-layout';
import { Settings } from 'lucide-react';
import SettingsContent from '@/components/v2/settings/settings-content';
import { checkOrganizationExists } from '@/utils/serverUtils';
import { clerkClient } from '@clerk/nextjs/server';

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  const organizationId = await checkOrganizationExists(organizationSlug);
  
  if (!organizationId) {
    throw new Error("Organization not found - this should be handled by layout");
  }
  
  const client = await clerkClient();
  const organization = await client.organizations.getOrganization({ organizationId });
  
  const serializedOrg = {
    id: organization.id,
    name: organization.name,
    email: '',
    phone: '',
    logoUrl: organization.imageUrl || '',
    invoicePrefix: (organization.publicMetadata as Record<string, any>)?.invoicePrefix || "INV-",
    paymentTerms: (organization.publicMetadata as Record<string, any>)?.paymentTerms || "net_30",
    currency: (organization.publicMetadata as Record<string, any>)?.currency || "USD",
    enableTax: (organization.publicMetadata as Record<string, any>)?.enableTax || false,
    enableDiscount: (organization.publicMetadata as Record<string, any>)?.enableDiscount || false,
    defaultTaxRate: (organization.publicMetadata as Record<string, any>)?.defaultTaxRate || "",
    invoiceTemplates: (organization.publicMetadata as Record<string, any>)?.invoiceTemplates || [],
  };
  
  return (
    <ContentLayout title="Settings" icon={Settings}>
      <SettingsContent 
        organization={serializedOrg} 
        organizationSlug={organizationSlug} 
      />
    </ContentLayout>
  );
}