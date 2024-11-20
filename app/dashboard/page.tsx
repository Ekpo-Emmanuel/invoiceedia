import React from 'react'

import { db } from "@/db"
import { Invoices } from '@/db/schema'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import Link from "next/link";
import { CirclePlus } from 'lucide-react';

  

export default async function page() {
    const results = await db.select().from(Invoices);
  return (
    <div className="p-4 max-w-7xl mx-auto">
        <div className='flex items-center justify-between'>
            <h2 className='text-3xl font-semibold'>Invoices</h2>
            <Button asChild >
                <Link href="/dashboard/invoices/new" className='flex items-center gap-2'>
                    <CirclePlus className='w-4 h-4'  /> 
                    Add Invoice
                </Link>
            </Button>
        </div>
      <Table className='mt-4'>
        <TableCaption>A list of your recent invoices.</TableCaption>
        {/* Table Header */}
        <TableHeader>
            <TableRow>
            <TableHead className="w-[100px]">
                Date
            </TableHead>
            <TableHead className=''>
                Customer
            </TableHead>
            <TableHead>
                Email
            </TableHead>
            <TableHead className="w-[100px]">
                Status
            </TableHead>
            <TableHead className="text-right">
                Value
            </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {/* Single Table Row */}
            {results.map((invoice) => (
                <TableRow key={invoice.id}>
                    <TableCell className="p-0">
                        <Link href={`/dashboard/invoices/${invoice.id}`} className='font-semibold py-4 block'>
                            {new Date(invoice.createTs).toLocaleDateString()}
                        </Link>
                    </TableCell>
                    <TableCell className="p-0">
                        <Link href={`/dashboard/invoices/${invoice.id}`} className='font-semibold py-4 block'>
                            {/* {invoice.name} */}
                            John Doe
                        </Link>
                    </TableCell>
                    <TableCell className='p-0'>
                        <Link href={`/dashboard/invoices/${invoice.id}`} className='py-4 block'>
                            {/* {invoice.email} */}
                            johndoe.email.com
                        </Link>
                    </TableCell>
                    <TableCell className="p-0">
                        <Link href={`/dashboard/invoices/${invoice.id}`} className='py-4 block'>
                            <Badge className='rounded-full'>{invoice.status}</Badge>
                        </Link>
                    </TableCell>
                    <TableCell className="text-right p-0">
                        <Link href={`/dashboard/invoices/${invoice.id}`} className='font-semibold'>
                            ${(invoice.value / 100).toFixed(2)}
                        </Link>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
        </Table>
    </div>
  )
}
