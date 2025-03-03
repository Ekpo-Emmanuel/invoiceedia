"use client"

import React, { useState, useMemo } from 'react'
import ClientPageHeader from './cllent-page-header'
import ClientSummary from './client-summary'
import ClientTable from './client-table'
import { ClientList } from './client-list'
import { ViewToggle } from './view-toggle'
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Client, ClientStats } from "@/types/client"
import { ClientTableSkeleton } from './client-table-skeleton'
import { ClientListSkeleton } from './client-list-skeleton'

interface ClientContentPageProps {
  title: string;
  organizationId: string;
  organizationSlug: string;
  initialClients: Client[];
  initialStats: ClientStats;
}

export default function ClientContentPage({ 
  title, 
  organizationId,
  organizationSlug,
  initialClients,
  initialStats
}: ClientContentPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<"table" | "list">("table")
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [stats, setStats] = useState<ClientStats>(initialStats)
  const [isLoading, setIsLoading] = useState(true)

  // Memoize filtered clients
  const filteredClients = useMemo(() => {
    const searchTerm = searchQuery.toLowerCase()
    return clients.filter(client => 
      client.firstName.toLowerCase().includes(searchTerm) ||
      client.lastName.toLowerCase().includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm) ||
      (client.companyName && client.companyName.toLowerCase().includes(searchTerm))
    )
  }, [clients, searchQuery])

  // Simulate loading on mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleClientsDeleted = (deletedClientIds: string[]) => {
    setClients(prevClients => 
      prevClients.filter(client => !deletedClientIds.includes(client.id))
    )
    
    setStats(prevStats => ({
      ...prevStats,
      totalClients: prevStats.totalClients - deletedClientIds.length,
      activeClients: prevStats.activeClients - deletedClientIds.length
    }))
  }

  return (
    <div>
      <main className="space-y-6">
        <ClientPageHeader title={title}/>
        <ClientSummary stats={stats} />
        <div className="space-y-4">
          <div className="">
            <div className="flex items-center justify-between">
              <div className="w-72 relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  className="pl-8 font-medium dark:bg-muted/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <ViewToggle view={view} onViewChange={setView} />
            </div>
          </div>
          
          <div className="space-y-4">
            {view === "table" ? (
              <>
                {isLoading ? (
                  <ClientTableSkeleton />
                ) : (
                  <ClientTable 
                    clients={filteredClients} 
                    organizationSlug={organizationSlug}
                    onClientsDeleted={handleClientsDeleted}
                  />
                )}
              </>
            ) : (
              <>
                {isLoading ? (
                  <ClientListSkeleton />
                ) : (
                  <ClientList 
                    clients={filteredClients} 
                    organizationSlug={organizationSlug}
                    onClientsDeleted={handleClientsDeleted}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
