import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { Invoices, Customers } from "@/db/schema";
import { eq, isNull, and } from "drizzle-orm";
import InvoiceTable from "./InvoiceTable";


export default async function Page() {
  const { userId, orgId } = await auth();
  if (!userId) return null;

  let results;

  if (orgId) {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(eq(Invoices.organizationId, orgId));
  } else {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(and(eq(Invoices.userId, userId), isNull(Invoices.organizationId)));
  }
  
  const invoices = results?.map(({ invoices, customers }) => ({
    ...invoices,
    customer: {
      name: customers.name,
      email: customers.email,
    },
  }));

  return <InvoiceTable invoices={invoices} />;
}

