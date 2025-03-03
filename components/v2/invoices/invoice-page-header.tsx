import { Button } from "@/components/ui/button"
import { PlusCircle} from 'lucide-react'

interface InvoicePageHeaderProps {
  hasInvoices: boolean;
}

export default function InvoicePageHeader({ hasInvoices }: InvoicePageHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold ">Invoices</h1>
          <p className="text-sm">Manage and process incoming invoices</p>
        </div>
        {hasInvoices && (
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
            <Button className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Invoice
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

