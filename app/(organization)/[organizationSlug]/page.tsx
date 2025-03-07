import { ContentLayout } from '@/components/admin-panel/content-layout'
import DashboardHomePage from '@/components/v2/home/home-content-page';
import { withOrganization } from '@/utils/withOrganization';

interface PageProps {
  params: { organizationSlug: string };
  organization: any;
}

async function Page({ organization }: PageProps) {
  return (
    <ContentLayout title="Home">
      <DashboardHomePage />
    </ContentLayout>
  )
}

export default withOrganization(Page);


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
