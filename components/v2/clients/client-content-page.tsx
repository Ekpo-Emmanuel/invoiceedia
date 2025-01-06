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
import { Pagination } from '@/components/ui/pagination'
import { PageSizeSelector } from './page-size-selector'

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
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [stats, setStats] = useState<ClientStats>(initialStats)

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

  // Memoize pagination calculations
  const { paginatedClients, totalPages } = useMemo(() => {
    const total = Math.ceil(filteredClients.length / itemsPerPage)
    const paginated = filteredClients.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
    return {
      paginatedClients: paginated,
      totalPages: total
    }
  }, [filteredClients, currentPage, itemsPerPage])

  // Reset to first page when searching or changing page size
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, itemsPerPage])

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
        <div className="mt-6">
          <div className="sticky top-12 bg-background z-10">
            <div className="flex items-center space-x-4 mb-4">
              <h2 className="text-lg font-medium">Client List</h2>
            </div>
            <div className="flex items-center justify-between">
              <ViewToggle view={view} onViewChange={setView} />
              <div className="w-72 relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4 mt-4">
            {view === "table" ? (
              <ClientTable 
                clients={paginatedClients} 
                organizationSlug={organizationSlug}
                onClientsDeleted={handleClientsDeleted}
              />
            ) : (
              <ClientList 
                clients={paginatedClients} 
                organizationSlug={organizationSlug}
                onClientsDeleted={handleClientsDeleted}
              />
            )}
            
            <div className="flex items-center justify-between">
              <PageSizeSelector
                pageSize={itemsPerPage}
                onPageSizeChange={(size) => {
                  setItemsPerPage(size)
                  setCurrentPage(1)
                }}
              />
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
