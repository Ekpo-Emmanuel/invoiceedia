"use client"

import { Client } from "@/types/client"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDate, formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { MoreHorizontal, FileText, ArrowUpRight, Building2, Mail, Phone } from 'lucide-react'
import { motion } from "framer-motion"

interface ClientListProps {
  clients: Client[]
  organizationSlug: string
  onClientsDeleted: (clientIds: string[]) => void
}

export function ClientList({ clients, organizationSlug, onClientsDeleted }: ClientListProps) {
  return (
    <>
    <ScrollArea className="h-[calc(100vh-150px)] rounded">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="group relative overflow-hidden rounded-lg border bg-white dark:bg-muted/30 p-6 transition-all duration-300 hover:shadow-md">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Link
                    href={`/${organizationSlug}/clients/${client.id}`}
                    className="group inline-flex items-center space-x-1  font-semibold tracking-tight"
                  >
                    <span className="transition-all duration-300 ease-out text-primary">
                      {client.firstName} {client.lastName}
                    </span>
                    <ArrowUpRight className="h-4 w-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
                  </Link>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{client.companyName || '-'}</span>
                    </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4">
                  <Link
                    href={`/${organizationSlug}/clients/${client.id}/invoices`}
                    className="inline-flex items-center space-x-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    <FileText className="h-4 w-4" />
                    <span>{client.invoices?.length || 0} Invoices</span>
                  </Link>
                  <span className="text-sm font-medium text-right">
                    {formatCurrency(client.invoices?.reduce((sum, invoice) => sum + invoice.value, 0) || 0)}
                  </span>
                </div>
              </div>
              <div className="absolute right-4 top-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/${organizationSlug}/clients/${client.id}`}>
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/${organizationSlug}/clients/${client.id}/invoices/new`}>
                        Create Invoice
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                Created {formatDate(client.createTs)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {clients.length === 0 && (
        <div className="flex h-[400px] items-center justify-center border rounded">
          <p className="text-center text-muted-foreground font-bold tracking-tight text-sm">No clients found</p>
        </div>
      )}
    </ScrollArea>
    </>
  )
}

