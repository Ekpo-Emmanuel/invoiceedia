import React from "react";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { Invoices, Customers } from "@/db/schema";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import clsx from "clsx";
import { eq, isNull, and } from "drizzle-orm";

export default async function page() {
  const { userId, orgId } = await auth();
  if (!userId) return;

  let results;

  if (orgId) {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(eq(Invoices.organizationId, orgId));
  } else {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(and(eq(Invoices.userId, userId), isNull(Invoices.organizationId)));
  }
  const invoices = results?.map(({ invoices, customers }) => ({
    ...invoices,
    customer: customers,
  }));

  const totalAmount = invoices.reduce((acc, invoice) => {
    return acc + invoice.value;
  }, 0);
  
  const formattedTotalAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(totalAmount / 100);
  

  return (
    <div className="p-4 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-end gap-2">
          <h2 className="text-3xl font-semibold">Invoices</h2>
          <span className="text-slate-300">/</span>
          <span className="text-sm">{invoices.length}</span>
        </div>
        <Button asChild>
        </Button>
        <button className="relative text-sm font-medium flex items-center justify-center transition-all duration-200 focus:ring-2 focus:outline-none text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/50 h-10 px-6 py-3 rounded-lg">
          <Link
            href="/dashboard/invoices/new"
            className="flex items-center gap-2"
          >
            Add Invoice
            <Plus className="w-4 h-4" />
          </Link>
        </button>
      </div>
      <Table className="mt-4 w-full">
        <TableCaption>A list of your recent invoices.</TableCaption>
        {/* Table Header */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Single Table Row */}
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/dashboard/invoices/${invoice.id}`}
                  className="block"
                >
                  INV{invoice.id}
                </Link>
              </TableCell>
              <TableCell className="p-0">
                <Link
                  href={`/dashboard/invoices/${invoice.id}`}
                  className="py-3 block"
                >
                  <Badge
                    className={clsx(
                      "rounded-full h-fit capitalize",
                      invoice.status === "open" && "bg-blue-500",
                      invoice.status === "paid" && "bg-green-500",
                      invoice.status === "void" && "bg-zinc-700",
                      invoice.status === "uncollectible" && "bg-red-600"
                    )}
                  >
                    {invoice.status}
                  </Badge>
                </Link>
              </TableCell>
              <TableCell className="p-0">
                <Link
                  href={`/dashboard/invoices/${invoice.id}`}
                  className="font-semibold py-3 block"
                >
                  {invoice.customer.name}
                </Link>
              </TableCell>
              <TableCell className="p-0">
                <Link
                  href={`/dashboard/invoices/${invoice.id}`}
                  className="py-3 block"
                >
                  {invoice.customer.email}
                </Link>
              </TableCell>
              <TableCell className="p-0">
                <Link
                  href={`/dashboard/invoices/${invoice.id}`}
                  className="py-3 block"
                >
                  {new Date(invoice.createTs).toLocaleDateString()}
                </Link>
              </TableCell>
              <TableCell className="text-right p-0">
                <Link href={`/dashboard/invoices/${invoice.id}`}>
                  ${(invoice.value / 100).toFixed(2)}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell colSpan={6} className="text-right font-semibold">
              {formattedTotalAmount}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
