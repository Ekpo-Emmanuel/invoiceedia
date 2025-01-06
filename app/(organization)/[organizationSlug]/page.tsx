import { ContentLayout } from '@/components/admin-panel/content-layout'
import DashboardHomePage from '@/components/v2/home/home-content-page';
import OrganizationNotFound from "@/components/v2/organization/organization-not-found";
import { clerkClient } from "@clerk/nextjs/server";
import { checkOrganizationExists } from '@/utils/serverUtils';

export default async function Page({ params }: { params: Promise<{ organizationSlug: string }> }) {
  const { organizationSlug } = await params;
  const client = await clerkClient();

  const organizationExists = await checkOrganizationExists(organizationSlug);

  if (!organizationExists) {
    return <OrganizationNotFound />;
  }

  const organization = await client.organizations.getOrganization({ slug: organizationSlug });

  return (
    <ContentLayout title="Home">
      <DashboardHomePage />
    </ContentLayout>
  )
}



// export default async function page() {
//   const { userId, orgId } = await auth();
//   if (!userId) return null;

//   let results;

//   if (orgId) {
//     results = await db
//       .select()
//       .from(Invoices)
//       .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
//       .where(eq(Invoices.organizationId, orgId));
//   } else {
//     results = await db
//       .select()
//       .from(Invoices)
//       .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
//       .where(and(eq(Invoices.userId, userId), isNull(Invoices.organizationId)));
//   }
  
//   const invoices = results?.map(({ invoices, customers }) => ({
//     ...invoices,
//     customer: {
//       name: customers.name,
//       email: customers.email,
//     },
//   }));

//   return (
//       <ContentLayout title="Organization">
//         <DashboardHomePage /> 
//         {/* <InvoiceTable invoices={invoices} /> */}
//       </ContentLayout>
//   )
// }
