"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Client } from "@/types/client"

interface ClientListProps {
  clients: Client[]
  organizationSlug: string
  onClientsDeleted: (deletedClientIds: string[]) => void
}

export function ClientList({ clients, organizationSlug, onClientsDeleted }: ClientListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map((client) => (
        <Card key={client.id}>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {client.firstName[0]}
                  {client.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <Link 
                  href={`/${organizationSlug}/clients/${client.id}`}
                  className="font-medium hover:underline block"
                >
                  {client.firstName} {client.lastName}
                </Link>
                {client.companyName && (
                  <p className="text-sm text-muted-foreground">{client.companyName}</p>
                )}
                <p className="text-sm text-muted-foreground">{client.email}</p>
                <p className="text-xs text-muted-foreground">
                  Added {formatDate(client.createTs)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {clients.length === 0 && (
        <div className="col-span-full text-center text-muted-foreground py-8">
          No clients found
        </div>
      )}
    </div>
  )
} 