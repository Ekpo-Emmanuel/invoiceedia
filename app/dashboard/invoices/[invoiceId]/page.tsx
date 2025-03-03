
import React from "react";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import Invoice from "./invoice";


export default async function InvoicePage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { userId, orgId } = await auth();
  if (!userId) return;

  // const invoiceId = (await params).invoiceId;
  // const invoiceIdNumber = parseInt(invoiceId);

  // let result;

  // if(orgId) {
  //   [result] = await db
  //     .select()
  //     .from(Invoices)
  //     .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
  //     .where(and(
  //       eq(Invoices.id, invoiceIdNumber), 
  //       eq(Invoices.organizationId, orgId)
  //     ));
  // } else {
  //   [result] = await db
  //   .select()
  //   .from(Invoices)
  //   .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
  //   .where(and(
  //     eq(Invoices.id, invoiceIdNumber), 
  //     eq(Invoices.userId, userId),
  //     isNull(Invoices.organizationId)
  //   ));
  // }

  // if (!result) {
  //   notFound();
  // }

  // const invoice = {
  //   ...result.invoices,
  //   customer: result.customers
  // }
  return (
    <>
    {/* <Invoice invoice={invoice}/> */}
    </>
  );
}
