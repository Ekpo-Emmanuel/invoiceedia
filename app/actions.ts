"use server";

import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { redirect } from "next/navigation";


export async function createAction(formData: FormData) {
    const rawValue = formData.get("value") as string;
    if (!rawValue || isNaN(parseFloat(rawValue))) {
        throw new Error("Invalid value provided");
    }
    const value = Math.floor(parseFloat(rawValue) * 100);
    const description = formData.get("description") as string;

    const results = await db.insert(Invoices).values({
        value,
        description,
        status: 'open'
    })
    .returning({
        id: Invoices.id
    })

    redirect(`/dashboard/invoices/${results[0].id}`);
}