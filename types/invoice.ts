import { Client } from "./client";

export type InvoiceStatus = 'open' | 'paid' | 'void' | 'uncollectible' | 'canceled' | 'pending' | 'failed';

export interface Invoice {
    id: string;
    status: InvoiceStatus;
    userId: string;
    organizationId: string;
    createTs: Date | string;
    description: string;
    customerId: string;
    issueDate: Date | string | null;
    dueDate: Date | string | null;
    paymentDate: Date | string | null;
    paymentTerms: 'due_on_receipt' | 'net_15' | 'net_30' | 'net_60';
    notes: string | null;
    lineItems: Array<{
        description: string;
        quantity: number;
        rate: number;
    }>;
    subtotal: number;
    taxRate: number | null;
    taxAmount: number | null;
    total: number;
    customer?: Client;
}

export interface InvoiceStats {
    totalInvoices: number;
    totalPaid: number;
    totalOverdue: number;
    totalAmount: number;
    paidAmount: number;
    overdueAmount: number;
} 
