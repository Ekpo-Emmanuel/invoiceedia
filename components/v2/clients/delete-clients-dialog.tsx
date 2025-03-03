"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

interface DeleteClientsDialogProps {
    selectedClients: string[]
    onDelete: (clientIds: string[]) => Promise<void>
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function DeleteClientsDialog({ 
    selectedClients, 
    onDelete, 
    isOpen, 
    onOpenChange 
}: DeleteClientsDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await onDelete(selectedClients)
            toast.success(`Successfully deleted ${selectedClients.length} client(s)`)
            onOpenChange(false)
        } catch (error) {
            toast.error("Failed to delete clients")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Clients</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete {selectedClients.length} client{selectedClients.length === 1 ? '' : 's'}? 
                        This action cannot be undone and will delete all associated data including invoices.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 