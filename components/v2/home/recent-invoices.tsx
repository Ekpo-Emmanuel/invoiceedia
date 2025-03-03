"use client"

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Receipt } from "lucide-react";
import { containerVariants, itemVariants } from '@/utils/animation-variants';
  
const invoices: any[] = [
  // {
  //   id: "INV-001",
  //   client: "Acme Inc.",
  //   amount: "$1,000",
  //   status: "paid",
  //   date: "2023-04-01",
  // },
  // {
  //   id: "INV-002",
  //   client: "Globex Corp.",
  //   amount: "$2,500",
  //   status: "pending",
  //   date: "2023-04-05",
  // },
  // {
  //   id: "INV-003",
  //   client: "Soylent Corp.",
  //   amount: "$750",
  //   status: "failed",
  //   date: "2023-03-28",
  // },
  // {
  //   id: "INV-004",
  //   client: "Initech",
  //   amount: "$1,500",
  //   status: "paid",
  //   date: "2023-04-10",
  // },
  // {
  //   id: "INV-005",
  //   client: "Umbrella Corp.",
  //   amount: "$3,000",
  //   status: "pending",
  //   date: "2023-04-15",
  // },
]

const statusColors = {
  open: "bg-blue-100 text-blue-700 dark:bg-blue-800  dark:text-blue-300",
  paid: "bg-green-100 text-green-700 dark:bg-green-900  dark:text-green-400",
  void: "bg-gray-100 text-gray-700 dark:bg-gray-900  dark:text-gray-400",
  uncollectible: "bg-red-100 text-red-700 dark:bg-red-900  dark:text-red-200",
  canceled:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900  dark:text-yellow-400",
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900  dark:text-yellow-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900  dark:text-red-200",
};

export default function RecentInvoices() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="mb-4 font-semibold leading-none tracking-tight text-primary">Recent Invoices</div>
      <Table className="rounded-lg overflow-hidden">
        <TableHeader className="">
          <TableRow className="cursor-default bg-muted/50 dark:border-primary/10">
            <TableHead className="font-medium">Invoice</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Date</TableHead>
            <TableHead className="hidden sm:table-cell">Action</TableHead>
          </TableRow>
        </TableHeader>
        {invoices.length === 0 ? (
          <TableBody className="dark:bg-muted/30">
            <TableRow>
              <TableCell colSpan={6} className="text-base text-center py-5">
                <motion.div 
                  className="flex items-center justify-center py-8 text-center"
                  variants={itemVariants}
                >
                  <h3 className="text-sm sm:text-md font-medium text-center leading-none text-primary">Your recent invoices will appear here </h3>
                </motion.div>
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody className="border-b dark:border-primary/10 rounded-lg rounded-t-none overflow-hidden">
            {invoices?.map((invoice, index) => (
              <motion.tr
                key={invoice?.id}
                variants={itemVariants}
                custom={index}
                className="border-b"
              >
                <TableCell>{invoice?.id}</TableCell>
                <TableCell>{invoice?.client}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      statusColors[
                        invoice?.status as keyof typeof statusColors
                      ]
                    }
                  >
                    {invoice?.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{invoice?.date}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        )}
      </Table>
    </motion.div>
  )
}