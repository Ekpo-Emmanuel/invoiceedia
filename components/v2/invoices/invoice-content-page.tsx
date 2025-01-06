"use client"

import React, { Suspense, useState } from 'react'
import InvoicePageHeader from './invoice-page-header'
import InvoiceList from './invoice-list'
import InvoiceSummary from './Invoice-summary'
import AdvancedFilters from './advanced-filters'
import RecentInvoices from './recent-invoices'
import clsx from "clsx"


export default function DashboardInvoicePage() {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters((prev) => !prev); 
  };

  return (
    <div>
      <main className="space-y-6">
        <InvoicePageHeader hasInvoices={false} />
        <div className="space-y-6">
          <InvoiceSummary hasInvoices={false} />
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
            <div
              className={clsx(
                "lg:col-span-2",
                showAdvancedFilters ? "lg:col-span-2" : "lg:col-span-3"
              )}
            >
              <Suspense fallback={<div>Loading...</div>}>
                <RecentInvoices toggleAdvancedFilters={toggleAdvancedFilters} />
              </Suspense>
            </div>

            {showAdvancedFilters && (
              <div className="lg:col-span-1">
                <AdvancedFilters />
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
