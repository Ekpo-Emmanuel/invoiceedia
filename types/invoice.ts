export type InvoiceStatus = 'open' | 'paid' | 'void' | 'uncollectible' | 'canceled' | 'pending' | 'failed';

export interface Invoice {
    id: string;
    value: number;
    status: InvoiceStatus;
    userId: string;
    organizationId: string | null;
    createTs: Date;
    description: string;
    customerId: string;
}

export interface InvoiceStats {
    totalInvoices: number;
    totalPaid: number;
    totalOverdue: number;
    totalAmount: number;
    paidAmount: number;
    overdueAmount: number;
} 