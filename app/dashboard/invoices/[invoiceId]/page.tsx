import React from 'react'

import { db } from "@/db"
import { Invoices } from '@/db/schema'
import { eq } from 'drizzle-orm';


export default async function InvoicePage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const invoiceId  = (await params).invoiceId;
  const invoiceIdNumber = parseInt(invoiceId);

  const [result] = await db.select()
    .from(Invoices)
    .where(eq(Invoices.id, invoiceIdNumber));

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-semibold'>Invoices {invoiceIdNumber}</h2>
      </div>
    </div>
  )
}