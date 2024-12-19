"use server";

import { db } from "@/db";
import { Customers, Invoices, Status, StatusEnum } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import Stripe from 'stripe';
import { headers } from "next/headers";
import { Resend } from 'resend';
import InvoiceCreatedEmail from "./emails/invoice-created";

const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));
const resend = new Resend(process.env.RESEND_API_KEY);

export async function createAction(formData: FormData) {
    const { userId, orgId } = await auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }
    
    const rawValue = formData.get("value") as string;
    if (!rawValue || isNaN(parseFloat(rawValue))) {
        throw new Error("Invalid value provided");
    }

    const value = Math.floor(parseFloat(rawValue) * 100);
    const description = formData.get("description") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;


    const [ customer ] = await db.insert(Customers).values({
        name,
        email,
        userId,
        organizationId: orgId || null
    })
    .returning({
        id: Customers.id
    })
    
    const results = await db.insert(Invoices).values({
        value,
        description,
        userId,
        customerId: customer.id,
        organizationId: orgId || null,
        status: 'open',
    })
    .returning({
        id: Invoices.id
    })

    const { data, error } = await resend.emails.send({
        from: 'Invoicedia <onboarding@resend.dev>',
        to: [email],
        subject: 'You Have a New Invoice',
        react: InvoiceCreatedEmail({ invoiceId: results[0].id }),
      });
  
    redirect(`/dashboard/invoices/${results[0].id}`);
}

export async function updateStatusAction(formData: FormData) {
    const { userId, orgId } = await auth();
    if (!userId) {
        return
    }

    const id = formData.get('id') as string;
    const status = formData.get('status') as 'open'| 'paid'| 'void'| 'uncollectible'| 'canceled'| 'pending'| 'failed';

    let result;

    // if (orgId) {
    //     result = await db.update(Invoices)
    //         .set({ status })
    //         .where(
    //             and(
    //                 eq(Invoices.id, parseInt(id)),
    //                 eq(Invoices.organizationId, orgId)
    //             ));
    // } else if (userId) {
    //     result = await db.update(Invoices)
    //         .set({ status })
    //         .where(
    //             and(
    //                 eq(Invoices.id, parseInt(id)),
    //                 eq(Invoices.userId, userId),
    //                 isNull(Invoices.organizationId)
    //             ));
    // } else {
    //     result = await db.update(Invoices)
    //         .set({ status })
    //         .where(
    //             eq(Invoices.id, parseInt(id))
    //         );
    // }

    if(orgId) {
        result = await db.update(Invoices)
            .set({ status })
            .where(
                and(
                    eq(Invoices.id, parseInt(id)),
                    eq(Invoices.organizationId, orgId)
                ))
    } else {
        result = await db.update(Invoices)
            .set({ status })
            .where(
                and(
                    eq(Invoices.id, parseInt(id)),
                    eq(Invoices.userId, userId),
                    isNull(Invoices.organizationId)
                ))
    }

    revalidatePath(`/dashboard/invoices/${id}/payment`, 'page');
    revalidatePath(`/dashboard/invoices/${id}`, 'page');

    return { success: true };
}

export async function deleteInoviceAction(formData: FormData) {
    const { userId, orgId } = await auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }

    const id = formData.get('id') as string;

    if(orgId) {
        await db.delete(Invoices)
            .where(
                and(
                    eq(Invoices.id, parseInt(id)),
                    eq(Invoices.organizationId, orgId)
                ))
    } else {
        await db.delete(Invoices)
            .where(
                and(
                    eq(Invoices.id, parseInt(id)),
                    eq(Invoices.userId, userId),
                    isNull(Invoices.organizationId)
                ))
    }


    redirect(`/dashboard`);
}

export async function createPayment(formData: FormData) {
    const headersList = headers();
    const origin = (await headersList).get('origin');
    const id = parseInt(formData.get('id') as string);

    const [result] = await db.select({
        status: Invoices.status,
        value: Invoices.value,
    })
        .from(Invoices)
        .where(eq(Invoices.id, id))
        .limit(1);

    //create checkout session
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product: 'prod_RQMWSS3RxGWgKt',
                    unit_amount: result.value,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${origin}/dashboard/invoices/${id}/payment?status=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/dashboard/invoices/${id}/payment?status=canceled&session_id={CHECKOUT_SESSION_ID}`,
    });

    if(!session.url) {
        throw new Error("Error creating checkout session");
    }

    redirect(session.url);
}