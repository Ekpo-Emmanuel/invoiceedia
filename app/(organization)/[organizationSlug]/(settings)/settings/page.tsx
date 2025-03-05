import { ContentLayout } from '@/components/admin-panel/content-layout';
import { Settings } from 'lucide-react';
import { withOrganization } from '@/utils/withOrganization';
import SettingsContent from '@/components/v2/settings/settings-content';

type PageProps = {
  params: { organizationSlug: string; [key: string]: any };
  organization: any;
};

async function SettingsPage({ params, organization }: PageProps) {
  const { organizationSlug } = params;
  
  const serializedOrg = {
    id: organization.id,
    name: organization.name,
    email: organization.email,
    phone: organization.phone,
    logoUrl: organization.imageUrl,
    invoicePrefix: organization.publicMetadata?.invoicePrefix || "INV-",
    paymentTerms: organization.publicMetadata?.paymentTerms || "net_30",
    currency: organization.publicMetadata?.currency || "USD",
    enableTax: organization.publicMetadata?.enableTax || false,
    enableDiscount: organization.publicMetadata?.enableDiscount || false,
    defaultTaxRate: organization.publicMetadata?.defaultTaxRate || "",
    invoiceTemplates: organization.publicMetadata?.invoiceTemplates || [],
  };
  
  return (
    <ContentLayout 
      title="Settings" 
      icon={Settings} 
      breadcrumbs={[
        {
          label: 'Home',
          href: `/${organizationSlug}`
        },
        {
          label: 'Settings',
          href: `/${organizationSlug}/settings`
        }
      ]}
    >
      <SettingsContent 
        organization={serializedOrg}
        organizationSlug={organizationSlug}
      />
    </ContentLayout>
  );
}

export default withOrganization(SettingsPage);