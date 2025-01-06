import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ArrowDown } from 'lucide-react'

const invoices = [
  { id: 'INV001', client: 'Acme Corp', amount: 1234.56, status: 'Paid', dueDate: '2023-07-15' },
  { id: 'INV002', client: 'Globex', amount: 2345.67, status: 'Pending', dueDate: '2023-07-20' },
  { id: 'INV003', client: 'Initech', amount: 3456.78, status: 'Overdue', dueDate: '2023-07-10' },
  { id: 'INV004', client: 'Umbrella Corp', amount: 4567.89, status: 'Paid', dueDate: '2023-07-25' },
  { id: 'INV005', client: 'Hooli', amount: 5678.90, status: 'Pending', dueDate: '2023-07-30' },
]

export default function InvoiceList() {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6 flex justify-between items-center border-b">
        <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
        <Button variant="outline" size="sm">
          Export <ArrowDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{invoice.client}</TableCell>
              <TableCell>${invoice.amount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>{invoice.dueDate}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="p-4 border-t">
        <Button variant="link" className="text-indigo-600 hover:text-indigo-800">View all invoices</Button>
      </div>
    </div>
  )
}

