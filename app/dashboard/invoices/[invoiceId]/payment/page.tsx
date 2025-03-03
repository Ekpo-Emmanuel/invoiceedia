import { Invoices, Customers } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import PaymentDisplay from "./PaymentDisplay";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

  // const [result] = await db.select({
  //   id: Invoices.id,
  //   status: Invoices.status,
  //   createTs: Invoices.createTs,
  //   description: Invoices.description,
  //   value: Invoices.value,
  //   name: Customers.name,
  //   email: Customers.email
  // })
  //   .from(Invoices)
  //   .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
  //   .where(eq(Invoices.id, invoiceIdNumber));

  // if (!result) {
  //   notFound();
  // }

  // const invoice = {
  //   ...result,
  //   customer: {
  //     name: result.name,
  //     email: result.email 
  //   }
  // }


  // const isSuccess = Boolean(sessionId && status === 'success');
  // const isCanceled = status === 'canceled';
  // let isError = Boolean(!sessionId && isSuccess);
  // let paymentStatus = '';

  // if (isSuccess) {
  //   const session = await stripe.checkout.sessions.retrieve(sessionId);
  //   paymentStatus = session.payment_status;
  //   if (paymentStatus !== 'paid') {
  //     isError = true;
  //   }
  // }


  return (
    <>
      {/* <PaymentDisplay
        invoice={invoice}
        isSuccess={isSuccess}
        isError={isError}
        isCanceled={isCanceled}
        sessionId={sessionId}
        token={token}
        paymentStatus={paymentStatus}
      /> */}
    </>
  );
}
