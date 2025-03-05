"use client"

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDownToLine, ArrowUpRight } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils';
import StatusFilter from './recent-invoices/status-filter';
import { Invoice } from '@/types/invoice';
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { FilterValues } from './advanced-filters';
import clsx from "clsx";
import { useRouter } from 'next/navigation';

const statusColors = {
  open: "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300",
  paid: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400",
  void: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-400",
  uncollectible: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
  canceled: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
};

interface RecentInvoicesProps {
  invoices: Invoice[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onFilterChange: (filters: FilterValues) => void;
  organizationSlug: string;
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between animate-pulse">
        <div className="h-6 w-32 bg-muted"></div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 bg-muted rounded"></div>
          <div className="h-9 w-24 bg-muted rounded"></div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]"><div className="h-4 w-20 bg-muted rounded" /></TableHead>
            <TableHead className="w-[200px]"><div className="h-4 w-32 bg-muted rounded" /></TableHead>
            <TableHead className="w-[120px]"><div className="h-4 w-20 bg-muted rounded" /></TableHead>
            <TableHead className="w-[120px]"><div className="h-4 w-24 bg-muted rounded" /></TableHead>
            <TableHead className="hidden sm:table-cell w-[120px]"><div className="h-4 w-24 bg-muted rounded" /></TableHead>
            <TableHead className="hidden sm:table-cell w-[120px]"><div className="h-4 w-24 bg-muted rounded" /></TableHead>
            <TableHead className="w-[80px]"><div className="h-4 w-16 bg-muted rounded" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><div className="h-4 w-16 bg-muted rounded" /></TableCell>
              <TableCell><div className="h-4 w-28 bg-muted rounded" /></TableCell>
              <TableCell><div className="h-4 w-20 bg-muted rounded" /></TableCell>
              <TableCell><div className="h-6 w-16 bg-muted rounded" /></TableCell>
              <TableCell className="hidden sm:table-cell"><div className="h-4 w-20 bg-muted rounded" /></TableCell>
              <TableCell className="hidden sm:table-cell"><div className="h-4 w-20 bg-muted rounded" /></TableCell>
              <TableCell><div className="h-8 w-8 bg-muted rounded" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function RecentInvoices({ 
  invoices, 
  loading, 
  page,
  totalPages,
  onPageChange,
  onFilterChange,
  organizationSlug
}: RecentInvoicesProps) {
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(invoices);
  const [activeFilters, setActiveFilters] = useState<FilterValues>({});
  const router = useRouter();

  // Update filtered invoices when the original invoices change
  useEffect(() => {
    applyFilters(activeFilters);
  }, [invoices]);

  // Get unique clients for the filter dropdown
  const clients = Array.from(
    new Set(
      invoices
        .filter(invoice => invoice.customer)
        .map(invoice => JSON.stringify({
          id: invoice.customer?.id,
          name: `${invoice.customer?.firstName} ${invoice.customer?.lastName}`
        }))
    )
  ).map(str => JSON.parse(str));

  const applyFilters = (filters: FilterValues) => {
    setActiveFilters(filters);
    
    let filtered = [...invoices];
    
    // Apply client filter
    if (filters.clientId) {
      filtered = filtered.filter(invoice => 
        invoice.customer?.id === filters.clientId
      );
    }
    
    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(invoice => {
        // Handle "overdue" special case
        if (filters.status === 'overdue') {
          const now = new Date();
          const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : null;
          return dueDate && now > dueDate && invoice.status !== 'paid';
        }
        return invoice.status === filters.status;
      });
    }
    
    // Apply amount range filter
    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(invoice => 
        (invoice.total / 100) >= filters.minAmount!
      );
    }
    
    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(invoice => 
        (invoice.total / 100) <= filters.maxAmount!
      );
    }
    
    // Apply date range filter
    if (filters.dateRange?.from) {
      filtered = filtered.filter(invoice => {
        const issueDate = invoice.issueDate ? new Date(invoice.issueDate) : null;
        return issueDate && issueDate >= filters.dateRange!.from!;
      });
    }
    
    if (filters.dateRange?.to) {
      filtered = filtered.filter(invoice => {
        const issueDate = invoice.issueDate ? new Date(invoice.issueDate) : null;
        return issueDate && issueDate <= filters.dateRange!.to!;
      });
    }
    
    setFilteredInvoices(filtered);
  };

  const handleFilterChange = (filters: FilterValues) => {
    applyFilters(filters);
  };

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
  
    if (loading) {
      return <TableSkeleton />
    }

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 0.5,
              ease: "easeOut"
            }
          }
        }}
        className="space-y-4 bg-background"
      >
        <div className="flex items-end justify-between">
          <div className="mb-4 font-semibold leading-none tracking-tight text-primary">
            All Invoices
          </div>
          <div className='flex items-center gap-2'>
          <StatusFilter 
            clients={clients}
            onFilterChange={handleFilterChange}
          />
            <Button size="sm" className="w-full sm:w-auto">
              <ArrowDownToLine className="mr-2 h-3 w-3" /> Export
            </Button>
          </div>
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow className="cursor-default bg-muted/50 dark:border-primary/10">
              <TableHead className="hidden sm:table-cell w-[120px] font-medium">Invoice</TableHead>
                <TableHead className="w-[200px]">Client</TableHead>
                <TableHead className="w-[120px] text-right">Amount</TableHead>
              <TableHead className="w-[120px] text-center">Status</TableHead>
              <TableHead className="hidden lg:table-cell w-[120px]">Issue Date</TableHead>
              <TableHead className="hidden md:table-cell w-[120px]">Due Date</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableBody className="border-b dark:border-primary/10 rounded-lg rounded-t-none overflow-hidden">
              {filteredInvoices.map((invoice, index) => {
                // Determine if invoice is overdue
                const now = new Date();
                const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : null;
                const isOverdue = dueDate && now > dueDate && invoice.status !== 'paid';
                
                // Get display status (as a separate variable for UI only)
                const displayStatus = isOverdue ? 'overdue' : invoice.status;
                
                return (
                  <TableRow 
                    key={invoice.id} 
                    onClick={() => router.push(`/${organizationSlug}/invoices/${invoice.id}`)}
                    className="border-b cursor-pointer dark:border-primary/10 hover:bg-muted/50 group" 
                  >
                    {/* Invoice ID */}
                    <TableCell className="hidden sm:table-cell w-[120px] font-medium">
                      <div className="flex items-center ">
                        <span>{invoice.id.slice(0, 8)}</span>
                        <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </TableCell>

                    {/* Client */}
                    <TableCell className="w-[200px]">
                      {invoice.customer?.companyName || 
                      `${invoice.customer?.firstName} ${invoice.customer?.lastName}`}
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="w-[120px] text-right text-primary font-medium">
                      {formatCurrency(invoice.total / 100)}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="w-[120px]">
                      <Badge
                        className={clsx(
                          "w-full text-center flex items-center justify-center",
                          statusColors[
                            displayStatus as keyof typeof statusColors
                          ] || statusColors.pending
                        )}
                      >
                        {displayStatus}
                      </Badge>
                    </TableCell>

                    {/* Issue Date */}
                    <TableCell className="hidden lg:table-cell w-[120px]">
                      {invoice.issueDate ? formatDate(new Date(invoice.issueDate)) : '-'}
                    </TableCell>

                    {/* Due Date */}
                    <TableCell className="hidden md:table-cell w-[120px]">
                      {invoice.dueDate ? formatDate(new Date(invoice.dueDate)) : '-'}
                    </TableCell>
                  </TableRow>
                );
              })}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {page > 1 ? (
                  <PaginationPrevious onClick={() => onPageChange(page - 1)} />
                ) : (
                  <PaginationPrevious className="pointer-events-none opacity-50" />
                )}
              </PaginationItem>
              
              {/* First page */}
              {page > 2 && (
                <PaginationItem>
                  <PaginationLink onClick={() => onPageChange(1)}>
                    1
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Ellipsis */}
              {page > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Previous page */}
              {page > 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => onPageChange(page - 1)}>
                    {page - 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Current page */}
              <PaginationItem>
                <PaginationLink isActive>
                  {page}
                </PaginationLink>
              </PaginationItem>

              {/* Next page */}
              {page < totalPages && (
                <PaginationItem>
                  <PaginationLink onClick={() => onPageChange(page + 1)}>
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Ellipsis */}
              {page < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Last page */}
              {page < totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => onPageChange(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                {page < totalPages ? (
                <PaginationNext className="cursor-pointer" onClick={() => onPageChange(page + 1)} />
                ) : (
                  <PaginationNext className="pointer-events-none opacity-50" />
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </motion.div>
    )
}


