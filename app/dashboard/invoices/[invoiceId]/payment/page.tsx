import React from "react";
import { Invoices, Customers } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createPayment, updateStatusAction } from "@/app/actions";
import { db } from "@/db";
import { and, eq, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AlertCircle, Check, CreditCard, Receipt, ChevronRight, Loader2 } from 'lucide-react';
import Stripe from "stripe";
import { cn } from "@/lib/utils";
import Link from "next/link";
import PaymentSuccessHandler from "./PaymentSuccessHandler";

const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));

interface InvoicePageProps {
  params: Promise<{ invoiceId: string }>;
  searchParams: Promise<{ 
    status: string,
    session_id: string;
    token?: string;
  }>
}

export default async function Payment({ params, searchParams }: InvoicePageProps) {
  const invoiceId = (await params).invoiceId;
  const invoiceIdNumber = parseInt(invoiceId);

  const sessionId = (await searchParams).session_id;
  const status = (await searchParams).status;
  const token = (await searchParams).token;

  const [result] = await db.select({
    id: Invoices.id,
    status: Invoices.status,
    createTs: Invoices.createTs,
    description: Invoices.description,
    value: Invoices.value,
    name: Customers.name,
    email: Customers.email
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
      email: result.email 
    }
  }

  const isSuccess = sessionId && status === 'success';
  const isCanceled = status === 'canceled';
  let isError = (!sessionId && isSuccess);
  let paymentStatus = '';

  if (isSuccess) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    paymentStatus = session.payment_status;
    if(paymentStatus !== 'paid') {
      isError = true;
    }
  }
  

  const statusColors = {
    open: "bg-blue-100 text-blue-700 hover:bg-blue-100/80",
    paid: "bg-green-100 text-green-700 hover:bg-green-100/80",
    void: "bg-gray-100 text-gray-700 hover:bg-gray-100/80",
    uncollectible: "bg-red-100 text-red-700 hover:bg-red-100/80",
    canceled: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80",
    pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80",
    failed: "bg-red-100 text-red-700 hover:bg-red-100/80",
  };
  

  return (
    <>
      <div className="p-4 md:p-6 lg:p-8 mx-auto max-w-7xl w-full">
        <div className="space-y-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                </Link>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                  <span className="ms-1 text-sm font-medium text-gray-700 md:ms-2">
                    <Link href={`/dashboard/invoices/${invoice.id}`}>INV{invoice.id}</Link>
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          {isSuccess && sessionId && (
            <PaymentSuccessHandler 
              sessionId={sessionId}
              invoiceId={invoiceId}
              token={token}
              currentStatus={invoice.status}
              paymentStatus={paymentStatus}
            />
          )}
          {isError && (
            <Alert variant="destructive">
              <AlertDescription className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Something went wrong. Please try again.
              </AlertDescription>
            </Alert>
          )}
          
          {isCanceled && (
            <Alert className=" border-yellow-500 text-yellow-800 bg-yellow-50">
              <AlertDescription className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-800" />
                Payment was canceled.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-8">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-2xl">Invoice #{invoice.id}</CardTitle>
                  <Badge className={cn("rounded-full capitalize", statusColors[invoice.status as keyof typeof statusColors])}>
                    {invoice.status}
                  </Badge>
                </div>
                <CardDescription>{invoice.description}</CardDescription>
              </div>
              <div className="text-3xl font-bold">${(invoice.value / 100).toFixed(2)}</div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="text-lg font-semibold mb-4">Billing Details</h3>
                <div className="grid gap-4 text-sm md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="font-medium text-muted-foreground">Invoice Date</div>
                    <div>{new Date(invoice.createTs).toLocaleDateString()}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-muted-foreground">Invoice ID</div>
                    <div>{invoice.id}</div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <div className="font-medium text-muted-foreground">Billed To</div>
                    <div>{invoice.customer.name}</div>
                    <div>{invoice.customer.email}</div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Options</h3>
                {invoice.status === "open" ? (
                  <form action={createPayment} className="space-y-4">
                    <input type="hidden" value={invoice.id} name="id" />
                    {token && <input type="hidden" value={token} name="token"/>}
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold" size="lg">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay ${(invoice.value / 100).toFixed(2)}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                      Secure payment powered by Stripe
                    </p>
                  </form>
                ) : (
                  <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 p-4 text-green-700">
                    <Check className="h-5 w-5" />
                    <span className="font-medium">Invoice Paid</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Receipt className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

