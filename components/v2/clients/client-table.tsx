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

interface ClientTableProps {
    clients: Client[]
    organizationSlug: string
    onClientsDeleted: (clientIds: string[]) => void
}

export default function ClientTable({ clients, organizationSlug, onClientsDeleted }: ClientTableProps) {
    const [selectedClients, setSelectedClients] = useState<string[]>([])
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

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
                    {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkArchive}
                        disabled={isLoading}
                    >
                        <Archive className="h-4 w-4 mr-2" />
                        Archive Selected
                    </Button> */}
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
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox 
                                    checked={selectedClients.length === clients.length}
                                    onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead className="hidden sm:table-cell">Email</TableHead>
                            <TableHead className="hidden sm:table-cell">Phone</TableHead>
                            <TableHead>Invoices</TableHead>
                            <TableHead className="hidden sm:table-cell ">Revenue</TableHead>
                            <TableHead className="hidden sm:table-cell ">Created</TableHead>
                            <TableHead className="w-12">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell>
                                    <Checkbox 
                                        checked={selectedClients.includes(client.id)}
                                        onCheckedChange={(checked) => 
                                            handleSelectClient(checked as boolean, client.id)
                                        }
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8 hidden sm:table-cell">
                                            <AvatarFallback>
                                                {client.firstName[0]}
                                                {client.lastName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Link
                                            href={`/${organizationSlug}/clients/${client.id}`}
                                            className="hover:underline transition-colors"
                                        >
                                            <span className="hidden sm:table-cell">{client.firstName} {client.lastName}</span>
                                            <span className="table-cell sm:hidden">{client.firstName[0]}{client.lastName[0]}</span>
                                            <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                        </Link>
                                    </div>
                                </TableCell>
                                <TableCell>{client.companyName || '-'}</TableCell>
                                <TableCell className="hidden sm:table-cell">{client.email}</TableCell>
                                <TableCell className="hidden sm:table-cell">{client.phone || '-'}</TableCell>
                                <TableCell>
                                    <Link 
                                        href={`/${organizationSlug}/clients/${client.id}/invoices`}
                                        className="flex items-center gap-1 hover:underline"
                                    >
                                        <FileText className="h-4 w-4" />
                                        {client.invoices?.length || 0}
                                    </Link>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">{formatCurrency(client.invoices?.reduce((sum, invoice) => sum + invoice.value, 0) || 0)}</TableCell>
                                <TableCell className="hidden sm:table-cell">{formatDate(client.createTs)}</TableCell>
                                <TableCell>
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
                        {clients.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center text-muted-foreground">
                                    No clients found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
} 