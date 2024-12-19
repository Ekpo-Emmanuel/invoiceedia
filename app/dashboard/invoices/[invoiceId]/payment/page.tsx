import React from "react";
import { Invoices, Customers } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { ChevronDown, CreditCard, Ellipsis, Trash2, Check } from "lucide-react";
import { createPayment, updateStatusAction } from "@/app/actions";
import { db } from "@/db";
import { and, eq, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Stripe from "stripe";

const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));

interface InvoicePageProps {
  params: Promise<{ invoiceId: string }>;
  searchParams: Promise<{ 
    status: string,
    session_id: string;
    token?: string;
  }>
}

export default async function payment({ params, searchParams }: InvoicePageProps){
  const invoiceId = (await params).invoiceId;
  const invoiceIdNumber = parseInt(invoiceId);

  const sessionId = (await searchParams).session_id;
  const status = (await searchParams).status;
  const token = (await searchParams).token;

  const isSuccess = sessionId && status === 'success';
  const isCanceled = status === 'canceled';
  let isError = (!sessionId && isSuccess);

  if (isSuccess) {
    try {
        const { payment_status } = await stripe.checkout.sessions.retrieve(sessionId);
        if(payment_status !== 'paid') {
          isError = true;
        } else {
          const formData = new FormData();
          formData.append('id', String(invoiceId));
          formData.append('status', 'paid');
          if (token) {
            formData.append('token', token);  
          }
  
          await updateStatusAction(formData);
        }

    } catch (error) {
        console.error('Error updating invoice status:', error);
        isError = true;
    }
}


  const [result] = await db.select({
    id: Invoices.id,
    status: Invoices.status,
    createTs: Invoices.createTs,
    description: Invoices.description,
    value: Invoices.value,
    name: Customers.name
  })
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(eq(Invoices.id, invoiceIdNumber));

  if (!result) {
    notFound();
  }

  const invoice = {
    ...result,
    customer: {
      name: result.name,
    }
  }

  return (
    <div className="p-4 max-w-7xl mx-auto w-full space-y-10">
      {isError && (
        <p className="text-red-500 rounded-md text-center text-sm p-1.5 bg-red-100 border border-red-500">Something Went wrong please try again :(</p>
      )}
      {isCanceled && (
        <p className="text-center text-sm p-1.5 border border-text-yellow-800 text-yellow-800 rounded-lg bg-yellow-50">Payment was canceled.</p>
      )}
      <div className="grid grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold flex items-center gap-2 mb-3">
              Invoices {invoice.id}
              <Badge
                className={clsx(
                  "rounded-full h-fit capitalize",
                  invoice.status === "open" && "bg-blue-500",
                  invoice.status === "paid" && "bg-green-500",
                  invoice.status === "void" && "bg-zinc-700",
                  invoice.status === "uncollectible" && "bg-red-600",
                  invoice.status === "canceled" && "bg-yellow-500",
                  invoice.status === "pending" && "bg-orange-500",
                  invoice.status === "failed" && "bg-purple-500"
                )}
              >
                {invoice.status}
              </Badge>
            </h2>
          </div>
          <p className="text-4xl mb-3">${(invoice.value / 100).toFixed(2)}</p>
          <p>{invoice.description}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Manage Invoice</h2>
          {invoice.status === "open" && (
            <form action={createPayment}>
              <input type="hidden" value={invoice.id} name="id" />
              {token && <input type="hidden" value={token} name="token"/>}
              <Button className="bg-green-700 font-medium">
                <CreditCard className="mr-2 w-4 h-auto" />
                Pay Invoice
              </Button>
            </form>
          )}
          {invoice.status === "paid" && (
            <p className="flex items-center gap-2"><Check className="w-6 h-auto bg-green-500 rounded-full text-white p-1"/>Invoice Paid</p>
          )}
        </div>
      </div>

      <div className="">
        <h3>Billing Details</h3>
        <ul className="grid gap-2">
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice ID
            </strong>
            <div>{invoice.id}</div>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice Date
            </strong>
            <div>{new Date(invoice.createTs).toLocaleDateString()}</div>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Billing Name
            </strong>
            <div>{invoice.customer.name}</div>
          </li>
        </ul>
      </div>
    </div>
  );
}
