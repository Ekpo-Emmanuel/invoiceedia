
import React from "react";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import Invoice from "./invoice";


export default async function InvoicePage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) return;

  const invoiceId = (await params).invoiceId;
  const invoiceIdNumber = parseInt(invoiceId);

  // if(isNaN(invoiceId)) {
  //   throw new Error('Invalid Invoice ID')
  // }
  const [result] = await db
    .select()
    .from(Invoices)
    .where(and(eq(Invoices.id, invoiceIdNumber), eq(Invoices.userId, userId)));

  if (!result) {
    notFound();
  }
  return (
    <Invoice invoice={result}/>
  );
}
