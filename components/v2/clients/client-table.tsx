"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
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
import { MoreHorizontal, Archive, Trash2, FileText, ArrowUpRight } from "lucide-react"
import { toast } from "sonner"
import { Client } from "@/types/client"
import { deleteClients } from "@/app/actions/clients"
import { DeleteClientsDialog } from "./delete-clients-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import clsx from "clsx"

interface ClientTableProps {
    clients: Client[]
    organizationSlug: string
    onClientsDeleted: (clientIds: string[]) => void
}

export default function ClientTable({ clients, organizationSlug, onClientsDeleted }: ClientTableProps) {
    const [selectedClients, setSelectedClients] = useState<string[]>([])
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // console.log(clients)
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedClients(clients.map(client => client.id))
        } else {
            setSelectedClients([])
        }
    }

    const handleSelectClient = (checked: boolean, clientId: string) => {
        if (checked) {
            setSelectedClients(prev => [...prev, clientId])
        } else {
            setSelectedClients(prev => prev.filter(id => id !== clientId))
        }
    }

    const handleBulkDelete = async (clientIds: string[]) => {
        setIsLoading(true)
        try {
            await deleteClients(clientIds)
            onClientsDeleted(clientIds)
            setSelectedClients([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleBulkArchive = async () => {
        if (!selectedClients.length) return

        setIsLoading(true)
        try {
            // Implement your archive action here
            // await archiveClients(selectedClients)
            toast.success(`${selectedClients.length} clients archived successfully`)
            setSelectedClients([])
        } catch (error) {
            toast.error("Failed to archive clients")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            {selectedClients.length > 0 && (
                <div className="flex items-center gap-2">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        disabled={isLoading}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Selected
                    </Button>
                </div>
            )}
            
            <DeleteClientsDialog 
                selectedClients={selectedClients}
                onDelete={handleBulkDelete}
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            />

            <div className="rounded-md border">
                <div className="relative w-full">
                    {/* Table Header */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40px]">
                                    <Checkbox 
                                        checked={selectedClients.length === clients.length}
                                        onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                    />
                                </TableHead>
                                <TableHead className="md:w-[200px]">Name</TableHead>
                                <TableHead className="w-[150px]">Company</TableHead>
                                <TableHead className="hidden sm:table-cell w-[200px]">Email</TableHead>
                                <TableHead className="hidden sm:table-cell w-[120px]">Phone</TableHead>
                                <TableHead className="w-[80px]">Invoices</TableHead>
                                <TableHead className="hidden sm:table-cell w-[100px]">Revenue</TableHead>
                                <TableHead className="hidden sm:table-cell w-[100px]">Created</TableHead>
                                <TableHead className="w-[60px] sticky right-0 bg-background">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                    </Table>

                    {/* Table Body */}
                    <ScrollArea className={clsx(
                        clients.length > 0 ? "h-fit" : "h-[calc(100vh-200px)]",
                        clients.length === 0 && "h-fit",
                        "w-full"
                    )}>
                        <Table>
                            <TableBody>
                                {clients.map((client) => (
                                    <TableRow key={client.id}>
                                        <TableCell className="w-[40px]">
                                            <Checkbox 
                                                checked={selectedClients.includes(client.id)}
                                                onCheckedChange={(checked) => 
                                                    handleSelectClient(checked as boolean, client.id)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="md:w-[200px] font-medium text-primary">
                                            <div className="flex items-center gap-3">
                                                <Link
                                                    href={`/${organizationSlug}/clients/${client.id}`}
                                                    className="group hover:underline transition-colors"
                                                >
                                                    <span className="hidden sm:inline text-sm font-medim">{client.firstName} {client.lastName}</span>
                                                    <span className="inline sm:hidden text-sm font-medim">{client.firstName[0]}{client.lastName[0]}</span>
                                                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all inline-block ml-1" />
                                                </Link>
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-[150px]">{client.companyName || '-'}</TableCell>
                                        <TableCell className="hidden sm:table-cell w-[200px] text-sm">{client.email}</TableCell>
                                        <TableCell className="hidden sm:table-cell w-[120px] text-sm">{client.phone || '-'}</TableCell>
                                        <TableCell className="w-[80px]">
                                            <Link 
                                                href={`/${organizationSlug}/clients/${client.id}/invoices`}
                                                className="flex items-center gap-1 hover:underline"
                                            >
                                                <FileText className="h-4 w-4" />
                                                {client.invoices?.length || 0}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell w-[100px]">
                                            {formatCurrency(client.invoices?.reduce((sum, invoice) => (sum + invoice.total) / 100, 0) || 0)}
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell w-[100px]">
                                            {formatDate(client.createTs)}
                                        </TableCell>
                                        <TableCell className="w-[60px] sticky right-0 bg-background">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Link 
                                                            href={`/${organizationSlug}/clients/${client.id}`}
                                                            className="flex items-center"
                                                        >
                                                            View Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Link 
                                                            href={`/${organizationSlug}/clients/${client.id}/invoices/new`}
                                                            className="flex items-center"
                                                        >
                                                            Create Invoice
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleSelectClient(true, client.id)}>
                                                        Archive
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        className="text-red-600"
                                                        onClick={() => handleSelectClient(true, client.id)}
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>

                    {/* No clients found */}
                    <Table>
                        <TableBody>
                            {clients.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center text-muted-foreground py-24">
                                        <p className="font-bold tracking-tight text-sm">No clients found</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
} 