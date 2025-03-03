import { NextResponse } from 'next/server'
import { db } from '@/db'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { Customers } from '@/db/schema'
import { checkOrganizationExists } from '@/utils/serverUtils'

export async function POST(req: Request) {
    try {
        const { userId } = await auth()
        const client = await clerkClient();
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { orgSlug, ...clientData } = body

        // Verify organization exists
        const orgExists = await checkOrganizationExists(orgSlug)
        if (!orgExists) {
            return new NextResponse("Organization not found", { status: 404 })
        }

        // Get organization ID from slug
        const org = await client.organizations.getOrganization({
            slug: orgSlug
        })

        const customer = await db.insert(Customers).values({
            firstName: clientData.firstName,
            lastName: clientData.lastName,
            companyName: clientData.companyName || null,
            email: clientData.email,
            phone: clientData.phone || null,
            street: clientData.street || null,
            city: clientData.city || null,
            zip: clientData.zip || null,
            state: clientData.state || null,
            country: clientData.country || null,
            notes: clientData.notes || null,
            userId: userId,
            organizationId: org.id,
        }).returning()

        return NextResponse.json({ message: 'Client created successfully' })
    } catch (error) {
        console.error('[CLIENTS_POST]', error)
        return new NextResponse("Internal Error", { status: 500 })
    }
} 