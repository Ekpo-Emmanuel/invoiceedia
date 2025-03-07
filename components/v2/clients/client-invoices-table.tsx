"use client"

import { deleteInvoices } from "@/app/actions/invoices"
import { useState, useMemo } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { ArrowUpRight, ListFilter, MoreHorizontal, Search, Trash } from "lucide-react"
import { Invoice } from "@/types/invoice"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface ClientInvoicesTableProps {
    invoices: Invoice[]
    organizationSlug: string
    customerId: string
}

export function ClientInvoicesTable({ 
    invoices, 
    organizationSlug, 
    customerId 
}: ClientInvoicesTableProps) {
    const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [isDeleting, setIsDeleting] = useState(false)
    
    const filteredInvoices = useMemo(() => {
        const searchLower = search.toLowerCase().trim()
        
        return invoices
            .sort((a, b) => new Date(b.createTs).getTime() - new Date(a.createTs).getTime())
            .filter((invoice) => {
                if (statusFilter !== "all" && invoice.status !== statusFilter) {
                    return false
                }

                if (!searchLower) {
                    return true
                }

                const searchableText = [
                    invoice.id,
                    invoice.description,
                    invoice.notes,
                ].filter(Boolean).join(" ").toLowerCase()

                return searchableText.includes(searchLower)
            })
    }, [invoices, search, statusFilter])

    const toggleAll = () => {
        if (selectedInvoices.length === invoices.length) {
            setSelectedInvoices([])
        } else {
            setSelectedInvoices(invoices.map(invoice => invoice.id))
        }
    }

    const toggleInvoice = (invoiceId: string) => {
        if (selectedInvoices.includes(invoiceId)) {
            setSelectedInvoices(selectedInvoices.filter(id => id !== invoiceId))
        } else {
            setSelectedInvoices([...selectedInvoices, invoiceId])
        }
    }

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

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete the selected invoices? This action cannot be undone.")) {
            return
        }

        try {
            setIsDeleting(true)
            await deleteInvoices(selectedInvoices, organizationSlug, customerId)
            setSelectedInvoices([]) // Clear selection after successful deletion
        } catch (error) {
            console.error("Failed to delete invoices:", error)
            alert("Failed to delete invoices. Please try again.")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="border-b">
            <div className="relative w-full space-y-2">
                {selectedInvoices.length > 0 && (
                    <div className="">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="destructive"
                                size="sm"
                                className="gap-2"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash className="h-4 w-4" />
                                        Delete
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
                <div className="sticky top-0 z-10 bg-background">
                    <div className="flex items-center justify-between p-4 gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                            <Input
                                placeholder="Search invoices..."
                                value={search}
                                  onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 border dark:border-primary/10"
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
                    </div>
            <Table>
                <TableHeader>
                    <TableRow>
                                <TableHead className="w-[30px]">
                                    <Checkbox
                                        checked={selectedInvoices.length === invoices.length}
                                        onCheckedChange={toggleAll}
                                        aria-label="Select all"
                                    />
                                </TableHead>
                                <TableHead className="w-[120px]">Invoice</TableHead>
                                <TableHead className="hidden lg:table-cell w-[250px]">Description</TableHead>
                                <TableHead className="w-[120px] text-center">Status</TableHead>
                                <TableHead className="hidden lg:table-cell w-[120px] text-center">Issue Date</TableHead>
                                <TableHead className="hidden md:table-cell w-[120px] text-center">Due Date</TableHead>
                                <TableHead className="text-right w-[120px]">Amount</TableHead>
                                <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
            </Table>
                </div>
                <ScrollArea className="h-[calc(100vh-300px)]">
                <Table>
                    <TableBody>
                            {filteredInvoices.map((invoice) => (
                                <TableRow 
                                    key={invoice.id}
                                    className={selectedInvoices.includes(invoice.id) ? "bg-muted/50" : ""}
                                >
                                    <TableCell className="w-[30px]">
                                        <Checkbox
                                            checked={selectedInvoices.includes(invoice.id)}
                                            onCheckedChange={() => toggleInvoice(invoice.id)}
                                            aria-label={`Select invoice ${invoice.id}`}
                                        />
                                    </TableCell>
                                    <TableCell className="w-[120px] font-medium">
                                    <Link
                                        href={`/${organizationSlug}/invoices/${invoice.id}`}
                                        className="group inline-flex items-center hover:underline"
                                    >
                                        {invoice.id.slice(0, 8)}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all inline-block ml-1" />
                                    </Link>
                                </TableCell>
                                    <TableCell className="hidden lg:table-cell w-[250px]">
                                        <div className="max-w-[250px] overflow-x-auto whitespace-nowrap">
                                            {invoice.description}
                                        </div>
                                    </TableCell>
                                    <TableCell className="w-[120px]">
                                    <Badge 
                                            className={statusColors[invoice.status as keyof typeof statusColors]}
                                    >
                                        {invoice.status}
                                    </Badge>
                                </TableCell>
                                    <TableCell className="hidden md:table-cell w-[120px]">
                                        {invoice.issueDate 
                                            ? formatDate(new Date(invoice.issueDate)) 
                                            : '-'}
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell w-[120px]">
                                        {invoice.dueDate 
                                            ? formatDate(new Date(invoice.dueDate)) 
                                            : '-'}
                                    </TableCell>
                                    <TableCell className="text-right w-[120px]">
                                        {formatCurrency(invoice.total / 100)}
                                    </TableCell>
                                    <TableCell className="w-[80px]">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button 
                                                    variant="ghost" 
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Link href={`/${organizationSlug}/invoices/${invoice.id}`}>
                                                        View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                {invoice.status === 'pending' && (
                                                    <>
                                                        <DropdownMenuItem>
                                                            Mark as Paid
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            Mark as Void
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
            </div>
        </div>
    )
} 