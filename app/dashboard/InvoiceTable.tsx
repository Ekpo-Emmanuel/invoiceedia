'use client'

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
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowUpRight, Plus, Search } from 'lucide-react';
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
    open: "bg-blue-100 text-blue-700 hover:bg-blue-100/80",
    paid: "bg-green-100 text-green-700 hover:bg-green-100/80",
    void: "bg-gray-100 text-gray-700 hover:bg-gray-100/80",
    uncollectible: "bg-red-100 text-red-700 hover:bg-red-100/80",
    canceled: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80",
    pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80",
    failed: "bg-red-100 text-red-700 hover:bg-red-100/80",
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      search.toLowerCase() === "" ||
      invoice.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      invoice.customer.email.toLowerCase().includes(search.toLowerCase()) ||
      `INV${invoice.id}`.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = 
      statusFilter === "all" || 
      invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  // Calculate total amount of filtered invoices
  const totalAmount = filteredInvoices.reduce((acc, invoice) => acc + invoice.value, 0);
  const formattedTotalAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(totalAmount / 100);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Invoices</h1>
            <p className="text-sm text-muted-foreground">
              Manage and track your {filteredInvoices.length} invoice{filteredInvoices.length === 1 ? '' : 's'}
            </p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 text-white transition-all">
            <Link href="/dashboard/invoices/new" className="inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Invoice
            </Link>
          </Button>
        </div>

        <Card className="overflow-hidden border-none">
          <CardHeader className="border-b border-gray-200 p-4 bg-gray-50/50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 bg-white" />
                <Input
                  placeholder="Search invoices..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="sm:w-[180px] bg-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="void">Void</SelectItem>
                  <SelectItem value="uncollectible">Uncollectible</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-gray-200 bg-gray-50/50">
                  <TableHead className="w-[100px] font-medium">Invoice</TableHead>
                  <TableHead className="w-[100px] font-medium">Status</TableHead>
                  <TableHead className="font-medium">Customer</TableHead>
                  <TableHead className="hidden md:table-cell font-medium">Email</TableHead>
                  <TableHead className="hidden sm:table-cell w-[100px] font-medium">Date</TableHead>
                  <TableHead className="text-right font-medium">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInvoices.map((invoice) => (
                  <TableRow 
                    key={invoice.id}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell>
                      <Link
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        INV{invoice.id}
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </TableCell>
                    <TableCell>
                    <Link
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="block font-medium text-primary hover:text-primary/80"
                      >
                        <Badge
                            className={cn(
                                "h-6 px-2 inline-flex items-center rounded-full font-medium transition-colors",
                                statusColors[invoice.status as keyof typeof statusColors]
                            )}
                        >
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="block font-medium text-primary hover:text-primary/80"
                      >
                        {invoice.customer.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      <Link
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="block text-primary hover:text-primary/80"
                      >
                        {invoice.customer.email}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      <Link
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="block text-primary hover:text-primary/80"
                      >
                        {new Date(invoice.createTs).toLocaleDateString()}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      <Link
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="block text-primary hover:text-primary/80"
                      >
                        ${(invoice.value / 100).toFixed(2)}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {filteredInvoices.length === 0 && (
                  <TableBody>
                    <TableCell colSpan={6} className="text-base text-center py-5">
                            No invoice found
                    </TableCell>
                  </TableBody>
              )}
              <TableFooter>
                <TableRow className="hover:bg-transparent border-t border-gray-200">
                  <TableCell colSpan={3} className="text-sm">Total Amount</TableCell>
                  <TableCell colSpan={3} className="text-right text-sm font-semibold">
                    {formattedTotalAmount}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

