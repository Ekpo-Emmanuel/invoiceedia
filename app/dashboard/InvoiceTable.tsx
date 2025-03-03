"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { ArrowUpRight, Plus, Search, ListFilter, Bird, Rabbit } from "lucide-react";
import { cn } from "@/lib/utils";
import Pagination from "./Pagination";

interface Invoice {
  id: number;
  status: string;
  value: number;
  createTs: Date;
  customer: {
    name: string;
    email: string;
  };
}

interface InvoicesPageProps {
  invoices: Invoice[];
}

export default function InvoiceTable({ invoices }: InvoicesPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const itemsPerPage = 10;

  const statusColors = {
    open: "bg-blue-100 text-blue-700 dark:bg-blue-800  dark:text-blue-300",
    paid: "bg-green-100 text-green-700 dark:bg-green-900  dark:text-green-400",
    void: "bg-gray-100 text-gray-700 dark:bg-gray-900  dark:text-gray-400",
    uncollectible: "bg-red-100 text-red-700 dark:bg-red-900  dark:text-red-400",
    canceled:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900  dark:text-yellow-400",
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900  dark:text-yellow-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-900  dark:text-red-400",
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      search.toLowerCase() === "" ||
      invoice.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      invoice.customer.email.toLowerCase().includes(search.toLowerCase()) ||
      `INV${invoice.id}`.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calculate total amount of filtered invoices
  const totalAmount = filteredInvoices.reduce(
    (acc, invoice) => acc + invoice.value,
    0
  );
  const formattedTotalAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalAmount / 100);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track your {invoices.length} invoice
            {invoices.length === 1 ? "" : "s"}
          </p>
        </div>
        {/* <Button asChild className="transition-all">
            <Link href="/dashboard/invoices/new" className="inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Invoice
            </Link>
          </Button> */}
      </div>

      <div className="space-y-4">
        <Card className="overflow-hidden">
          <CardHeader className="p-4 bg-muted rounded-t-lg overflow-hidden">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Search invoices..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-transparent border dark:border-primary/10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-primary/5 hover:bg-primary/10"
                  >
                    <ListFilter size={18} strokeWidth={2.3} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setStatusFilter("all")}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setStatusFilter("open")}>
                    Open
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setStatusFilter("paid")}>
                    Paid
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setStatusFilter("void")}>
                    Void
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setStatusFilter("uncollectible")}>
                    Uncollectible
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setStatusFilter("canceled")}>
                    Canceled
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setStatusFilter("pending")}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setStatusFilter("failed")}>
                    Failed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="icon" asChild>
                <Link href="/dashboard/invoices/new" className="">
                  <Plus size={18} strokeWidth={2.3} />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="border-0">
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent cursor-default">
                  <TableHead className="w-[100px] font-medium">
                    Invoice
                  </TableHead>
                  <TableHead className="w-[100px] font-medium">
                    Status
                  </TableHead>
                  <TableHead className="font-medium">Customer</TableHead>
                  <TableHead className="hidden md:table-cell font-medium">
                    Email
                  </TableHead>
                  <TableHead className="hidden sm:table-cell w-[100px] font-medium">
                    Date
                  </TableHead>
                  <TableHead className="text-right font-medium">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              {invoices.length === 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-base text-center py-5 bg-background"
                    >
                      <div className="text-primary/80 flex flex-col items-center justify-center py-8 text-center">
                        <Bird 
                          className="h-8 w-8 mb-4 transition-transform duration-300 ease-in-out hover:scale-x-[-1]"  
                          size={50} 
                        />
                        <h3 className="text-lg font-medium mb-2">You currently have no Invoice</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Create your first Invoice to get started
                        </p>
                        <Button asChild  className="">
                          <Link href="#">
                            <Plus className="mr-2" size={18}/>
                            Create Invoice
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : filteredInvoices.length === 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-base text-center py-5 bg-background"
                    >
                     <div className="text-primary/80 flex flex-col items-center justify-center py-8 text-center">
                        <Rabbit 
                          className="h-8 w-8 mb-4 transition-transform duration-300 ease-in-out hover:scale-x-[-1]"  
                          size={50} 
                        />
                        <h3 className="text-lg font-medium mb-2">No invoice found</h3>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (  
                <TableBody>
                  {paginatedInvoices
                    .slice()
                    .reverse()
                    .map((invoice) => (
                      <TableRow
                        key={invoice.id}
                        className="group bg-background hover:bg-muted transition-colors"
                      >
                        <TableCell>
                          <Link
                            href={`#`}
                            className="inline-flex items-center gap-1 font-medium text-primary/80 transition-colors"
                          >
                            INV{invoice.id}
                            <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link href={`#`} className="block font-medium ">
                            <Badge
                              className={cn(
                                statusColors[
                                  invoice.status as keyof typeof statusColors
                                ]
                              )}
                            >
                              {invoice.status.charAt(0).toUpperCase() +
                                invoice.status.slice(1)}
                            </Badge>
                          </Link>
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link
                            href={`#`}
                            className="block font-medium text-muted-foreground"
                          >
                            {invoice.customer.name}
                          </Link>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          <Link href={`#`} className="block ">
                            {invoice.customer.email}
                          </Link>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          <Link href={`#`} className="block ">
                            {new Date(invoice.createTs).toLocaleDateString()}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right tabular-nums font-medium">
                          <Link href={`#`} className="block ">
                            ${(invoice.value / 100).toFixed(2)}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              )}
              <TableFooter>
                <TableRow className="">
                  <TableCell
                    colSpan={3}
                    className="text-sm text-muted-foreground"
                  >
                    Total
                  </TableCell>
                  <TableCell
                    colSpan={3}
                    className="text-right text-sm font-extrabold"
                  >
                    {formattedTotalAmount}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
