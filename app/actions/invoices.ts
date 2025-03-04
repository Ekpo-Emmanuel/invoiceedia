"use server"

import { db } from "@/db"
import { Invoices, Customers } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { eq, inArray, sql, desc, and, lte, gte } from "drizzle-orm"
import { cache } from 'react'
import { generateInvoicePdf } from '@/lib/pdf'
import { SQL } from "drizzle-orm"

interface LineItem {
    description: string
    quantity: string
    rate: string
}
  
interface CreateInvoiceParams {
    value: number
    description: string
    customerId: string
    organizationId: string
    organizationSlug: string
    issueDate: string
    dueDate: string
    paymentTerms: "due_on_receipt" | "net_15" | "net_30" | "net_60"
    notes?: string
    lineItems: LineItem[]
    taxRate: number | null
    status: "pending"
}

export async function createInvoice(params: CreateInvoiceParams) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    const lineItems = params.lineItems.map(item => ({
      description: item.description,
      quantity: parseFloat(item.quantity),
      rate: parseFloat(item.rate)
    }))

    const subtotal = lineItems.reduce((sum, item) => 
      sum + (item.quantity * item.rate), 0)

    const taxAmount = params.taxRate 
      ? Math.round(subtotal * (params.taxRate / 100))
      : 0

    const total = subtotal + taxAmount

    const [invoice] = await db.insert(Invoices).values({
      issueDate: sql`${params.issueDate}::date`,
      dueDate: sql`${params.dueDate}::date`,
      paymentTerms: params.paymentTerms,
      notes: params.notes,
      lineItems: lineItems,
      subtotal: Math.round(subtotal),
      taxRate: sql`${params.taxRate}::decimal`,
      taxAmount: taxAmount,
      total: Math.round(total),
      description: params.description,
      customerId: params.customerId,
      organizationId: params.organizationId,
      userId: userId,
      status: params.status,
      paymentDate: null
    }).returning()

    revalidatePath(`/${params.organizationSlug}/clients/${params.customerId}`)
    return invoice
  } catch (error) {
    console.error("Error creating invoice:", error)
    throw new Error("Failed to create invoice")
  }
}

export async function deleteInvoices(invoiceIds: string[], organizationSlug: string, customerId: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    try {
        // Delete the invoices
        await db.delete(Invoices)
            .where(inArray(Invoices.id, invoiceIds))
            .execute()

        // Revalidate the client page to update the UI
        revalidatePath(`/${organizationSlug}/clients/${customerId}`)
        return { success: true }
    } catch (error) {
        console.error("Error deleting invoices:", error)
        throw new Error("Failed to delete invoices")
    }
} 

interface GetInvoicesOptions {
    organizationId: string;
    status?: string;
    customerId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

// Cache the getInvoices function
export const getInvoices = cache(async ({
    organizationId,
    status,
    customerId,
    startDate,
    endDate,
    page = 1,
    limit = 50
}: GetInvoicesOptions) => {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    try {
        // Build the where clause with explicit type
        let whereClause: SQL<unknown> = eq(Invoices.organizationId, organizationId);
        
        // Add status filter if provided
        if (status) {
            // Special case for "overdue" status
            if (status === 'overdue') {
                whereClause = and(
                    whereClause,
                    and(
                        lte(Invoices.dueDate, sql`CURRENT_DATE`),
                        sql`${Invoices.status} != 'paid'`
                    )
                ) as SQL<unknown>;
            } else {
                whereClause = and(whereClause, eq(Invoices.status, status as any)) as SQL<unknown>;
            }
        }
        
        // Add customer filter if provided
        if (customerId) {
            whereClause = and(whereClause, eq(Invoices.customerId, customerId)) as SQL<unknown>;
        }
        
        // Add date range filters if provided
        if (startDate) {
            whereClause = and(whereClause, gte(Invoices.issueDate, sql`${startDate}::date`)) as SQL<unknown>;
        }
        
        if (endDate) {
            whereClause = and(whereClause, lte(Invoices.issueDate, sql`${endDate}::date`)) as SQL<unknown>;
        }

        const [countResult, invoices, statsResult] = await Promise.all([
            // Get total count
            db.select({ count: sql<number>`count(*)` })
                .from(Invoices)
                .where(whereClause),

            // Get paginated invoices
            db.query.Invoices.findMany({
                where: whereClause,
                with: {
                    customer: true
                },
                orderBy: [desc(Invoices.createTs)],
                offset: (page - 1) * limit,
                limit
            }),

            // Get stats
            db.select({
                totalReceivables: sql<number>`sum(${Invoices.total})`,
                paidAmount: sql<number>`sum(case when status = 'paid' then ${Invoices.total} else 0 end)`,
                unpaidAmount: sql<number>`sum(case when status != 'paid' then ${Invoices.total} else 0 end)`,
                overdueCount: sql<number>`count(*) filter (where ${Invoices.dueDate} < current_date and status != 'paid')`
            })
            .from(Invoices)
            .where(eq(Invoices.organizationId, organizationId))
        ])

        return {
            invoices,
            stats: statsResult[0],
            total: Number(countResult[0].count)
        }
    } catch (error) {
        console.error("Error fetching invoices:", error)
        throw new Error("Failed to fetch invoices")
    }
})

export async function getInvoiceById(invoiceId: string, organizationId: string) {
    try {
        const invoice = await db.query.Invoices.findFirst({
            where: and(
              eq(Invoices.id, invoiceId),
              eq(Invoices.organizationId, organizationId)
            ),
            with: {
              customer: true
            }
        });

        if (!invoice) {
            return null;
        }

        // Transform invoice number fields from strings to numbers
        return {
            ...invoice,
            taxRate: invoice.taxRate ? Number(invoice.taxRate) : null,
            taxAmount: invoice.taxAmount ? Number(invoice.taxAmount) : null,
            subtotal: Number(invoice.subtotal),
            total: Number(invoice.total)
        };
    } catch (error) {
        console.error('Error fetching invoice:', error);
        return null;
    }
}



export async function downloadInvoicePdf(invoiceId: string) {
  try {
    const pdfContent = await generateInvoicePdf(invoiceId);
    return { success: true, content: pdfContent };
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    throw new Error(error.message || 'Failed to generate PDF');
  }
}
