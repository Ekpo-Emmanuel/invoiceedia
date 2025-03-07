"use client"

import React, { useState, useEffect, useCallback, useTransition } from 'react'
import InvoicePageHeader from './invoice-page-header'
import InvoiceList from './invoice-list'
import InvoiceSummary from './Invoice-summary'
import RecentInvoices from './recent-invoices'
import clsx from "clsx"
import { getInvoices } from '@/app/actions/invoices'
import { Invoice } from '@/types/invoice'
import { FilterValues } from './advanced-filters'

export default function DashboardInvoicePage({ 
  organizationId,
  organizationSlug
}: { 
  organizationId: string;
  organizationSlug: string;
}) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [cachedData, setCachedData] = useState<Record<number, Invoice[]>>({})
  const [stats, setStats] = useState({
    totalReceivables: 0,
    paidAmount: 0,
    unpaidAmount: 0,
    overdueCount: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [activeFilters, setActiveFilters] = useState<FilterValues>({})

  const ITEMS_PER_PAGE = 50

  const loadInvoices = useCallback(async (pageNum: number, filters?: FilterValues) => {
    if (cachedData[pageNum] && !filters && Object.keys(activeFilters).length === 0) {
      setInvoices(cachedData[pageNum])
      return
    }

    setIsLoading(true)
    try {
      // Prepare filter parameters
      const queryParams: any = { 
        organizationId,
        page: pageNum,
        limit: ITEMS_PER_PAGE
      }
      
      // Add filters if they exist
      if (filters?.status) {
        queryParams.status = filters.status
      }
      
      if (filters?.clientId) {
        queryParams.customerId = filters.clientId
      }
      
      if (filters?.dateRange?.from) {
        queryParams.startDate = filters.dateRange.from.toISOString().split('T')[0]
      }
      
      if (filters?.dateRange?.to) {
        queryParams.endDate = filters.dateRange.to.toISOString().split('T')[0]
      }
      
      const data = await getInvoices(queryParams)
      
      // Only cache results if no filters are applied
      if (!filters && Object.keys(activeFilters).length === 0) {
        setCachedData(prev => ({
          ...prev,
          [pageNum]: data.invoices as Invoice[]
        }))
      }
      
      setInvoices(data.invoices as Invoice[])
      setStats(data.stats)
      setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE))

      // Only prefetch if no filters are applied
      if (!filters && Object.keys(activeFilters).length === 0) {
        if (pageNum < totalPages) prefetchPage(pageNum + 1)
        if (pageNum > 1) prefetchPage(pageNum - 1)
      }
    } catch (error) {
      console.error("Failed to load invoices:", error)
    } finally {
      setIsLoading(false)
      setIsFirstLoad(false)
    }
  }, [organizationId, totalPages, activeFilters, cachedData])

  const prefetchPage = useCallback(async (pageNum: number) => {
    if (cachedData[pageNum] || Object.keys(activeFilters).length > 0) return

    try {
      const data = await getInvoices({ 
        organizationId,
        page: pageNum,
        limit: ITEMS_PER_PAGE
      })
      
      setCachedData(prev => ({
        ...prev,
        [pageNum]: data.invoices as Invoice[]
      }))
    } catch (error) {
      console.error("Failed to prefetch page:", error)
    }
  }, [organizationId, activeFilters, cachedData])

  useEffect(() => {
    loadInvoices(page, activeFilters)
  }, [loadInvoices, page, activeFilters])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleFilterChange = (filters: FilterValues) => {
    // Reset to page 1 when filters change
    setPage(1)
    setActiveFilters(filters)
    
    // Client-side filtering for amount range
    // These filters will be applied in the RecentInvoices component
  }

  return (
    <div>
      <main className="space-y-6">
        <InvoicePageHeader hasInvoices={invoices.length > 0} />
        <div className="space-y-6">
          <InvoiceSummary 
            hasInvoices={invoices.length > 0}
            stats={stats}
          />
          <div className="">
            <RecentInvoices 
              invoices={invoices}
              loading={isFirstLoad && isLoading}
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onFilterChange={handleFilterChange}
              organizationSlug={organizationSlug}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
