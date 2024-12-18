"use server";

import { db } from "@/db";
import { Invoices, Status } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export async function createAction(formData: FormData) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }
    
    const rawValue = formData.get("value") as string;
    if (!rawValue || isNaN(parseFloat(rawValue))) {
        throw new Error("Invalid value provided");
    }
    const value = Math.floor(parseFloat(rawValue) * 100);
    const description = formData.get("description") as string;

    const results = await db.insert(Invoices).values({
        value,
        description,
        userId,
        status: 'open'
    })
    .returning({
        id: Invoices.id
    })

    redirect(`/dashboard/invoices/${results[0].id}`);
}

export async function updateStatusAction(formData: FormData) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }

    const id = formData.get('id') as string;
    const status = formData.get('status') as Status;

    const results = await db.update(Invoices)
        .set({ status })
        .where(
            and(
                eq(Invoices.id, parseInt(id)),
                eq(Invoices.userId, userId)
            ))

    revalidatePath(`/invoices/${id}`, 'page');
}