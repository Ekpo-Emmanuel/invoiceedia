import { Invoice } from "./invoice"

export interface Client {
    id: string
    firstName: string
    lastName: string
    companyName: string | null
    email: string
    phone: string | null
    street: string | null
    city: string | null
    state: string | null
    zip: string | null
    country: string | null
    notes: string | null
    userId: string
    organizationId: string
    createTs: Date
    invoices?: Invoice[]
}

export interface ClientStats {
    totalClients: number
    activeClients: number
} 