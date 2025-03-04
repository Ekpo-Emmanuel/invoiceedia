'use server'

import { db } from '@/db'
import { Customers, Invoices } from '@/db/schema'
import { eq, inArray, desc } from 'drizzle-orm'

interface ClientStats {
    totalClients: number;
    activeClients: number;
}

export async function getClientStats(organizationId: string): Promise<ClientStats> {
    try {
        const clients = await db.select().from(Customers)
            .where(eq(Customers.organizationId, organizationId))

        return {
            totalClients: clients.length,
            activeClients: clients.length // For now, assuming all clients are active
        }
    } catch (error) {
        console.error('Error fetching client stats:', error)
        return {
            totalClients: 0,
            activeClients: 0,
        }
    }
}

export async function getClientList(organizationId: string) {
    try {
        const clients = await db.query.Customers.findMany({
            where: eq(Customers.organizationId, organizationId),
            orderBy: desc(Customers.createTs),
            with: {
                invoices: true
            }
        })

        return clients
    } catch (error) {
        console.error('Error fetching clients:', error)
        return []
    }
}

export async function deleteClients(clientIds: string[]) {
    try {
        // Start a transaction to ensure all operations succeed or fail together
        return await db.transaction(async (tx) => {
            // await tx.delete(Payments)
            //     .where(inArray(Payments.invoiceId, 
            //         tx.select({ id: Invoices.id })
            //             .from(Invoices)
            //             .where(inArray(Invoices.customerId, clientIds))
            //     ))

            // await tx.delete(ClientNotes)
            //     .where(inArray(ClientNotes.clientId, clientIds))

            // First delete all invoices associated with these clients
            await tx.delete(Invoices)
                .where(inArray(Invoices.customerId, clientIds))

            // Then delete the clients
            await tx.delete(Customers)
                .where(inArray(Customers.id, clientIds))

            return { success: true }
        })
    } catch (error) {
        console.error('Error deleting clients and their data:', error)
        throw new Error('Failed to delete clients and their associated data')
    }
}

export async function archiveClients(clientIds: string[]) {
    // Implement archive logic here
    // You might need to add an 'archived' column to your Customers table
    throw new Error('Archive functionality not implemented yet')
}

// Add other client-related actions here
export async function getClientById(clientId: string) {
    try {
        const client = await db.query.Customers.findFirst({
            where: eq(Customers.id, clientId),
            with: {
                invoices: true
            }
        });

        if (!client) {
            return null;
        }

        // Transform invoice number fields from strings to numbers
        return {
            ...client,
            invoices: client.invoices.map(invoice => ({
                ...invoice,
                taxRate: invoice.taxRate ? Number(invoice.taxRate) : null,
                taxAmount: invoice.taxAmount ? Number(invoice.taxAmount) : null,
                subtotal: Number(invoice.subtotal),
                total: Number(invoice.total)
            }))
        };
    } catch (error) {
        console.error('Error fetching client:', error);
        return null;
    }
}

export async function updateClient(clientId: string, data: Partial<typeof Customers.$inferInsert>) {
    try {
        const updated = await db.update(Customers)
            .set(data)
            .where(eq(Customers.id, clientId))
            .returning()

        return updated[0]
    } catch (error) {
        console.error('Error updating client:', error)
        throw new Error('Failed to update client')
    }
}

export async function createClient(data: typeof Customers.$inferInsert) {
    try {
        const created = await db.insert(Customers)
            .values(data)
            .returning()

        return created[0]
    } catch (error) {
        console.error('Error creating client:', error)
        throw new Error('Failed to create client')
    }
}

export async function getClients(organizationId: string) {
    try {
        const clients = await db.query.Customers.findMany({
            where: eq(Customers.organizationId, organizationId),
            orderBy: [desc(Customers.createTs)],
            with: {
                invoices: true
            }
        })
        return clients
    } catch (error) {
        console.error("Error fetching clients:", error)
        throw new Error("Failed to fetch clients")
    }
} 