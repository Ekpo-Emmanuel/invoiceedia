'use client';

import React from "react";
import { Invoices } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { ChevronDown, Ellipsis } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AVAILABLE_STATUSES } from "../../(data)/invoices";
import { updateStatusAction } from "@/app/actions";
import { useOptimistic } from "react";

interface InvooiceProps {
    invoice: typeof Invoices.$inferSelect
}

export default function Invoice({invoice}: InvooiceProps) {
    const [currentStatus, setCurrentStatus] = useOptimistic(
        invoice.status, 
        (state, newStatus) => {
            return String(newStatus)
        });
    
    async function handleUpdateStatus(formData: FormData) {
        const originalStatus = currentStatus;
        setCurrentStatus(formData.get('status'))
        try {
            await updateStatusAction(formData);
        } catch (e) {
            setCurrentStatus(originalStatus)
        }
    }
  return (
    <div className="p-4 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold flex items-center gap-2 mb-3">
          Invoices {invoice.id}
          <Badge
            className={clsx(
              "rounded-full h-fit capitalize",
              invoice.status === "open" && "bg-blue-500",
              invoice.status === "paid" && "bg-green-500",
              invoice.status === "void" && "bg-zinc-700",
              invoice.status === "uncollectible" && "bg-red-600",
              invoice.status === "canceled" && "bg-yellow-500",
              invoice.status === "pending" && "bg-orange-500",
              invoice.status === "failed" && "bg-purple-500"
            )}
          >
            {invoice.status}
          </Badge>
        </h2>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">Change Status <ChevronDown className="w-4 h-4"/></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {AVAILABLE_STATUSES.map((status) => (
                <DropdownMenuItem key={status.id}>
                  <form action={handleUpdateStatus}>
                    <input type="hidden" name="id" value={invoice.id} />
                    <input type="hidden" name="status" value={status.id} />
                    <button>{status.label}</button>
                  </form>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="flex items-center gap-2">
                <Ellipsis className="w-4 h-4"/>
                <span className="sr-only">More Options</span>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {AVAILABLE_STATUSES.map((status) => (
                <DropdownMenuItem key={status.id}>
                  <form action={handleUpdateStatus}>
                    <input type="hidden" name="id" value={invoice.id} />
                    <input type="hidden" name="status" value={status.id} />
                    <button>{status.label}</button>
                  </form>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <p className="text-4xl mb-3">${(invoice.value / 100).toFixed(2)}</p>
      <p>{invoice.description}</p>

      <div className="mt-10">
        <h3>Billing Details</h3>
        <ul className="grid gap-2">
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice ID
            </strong>
            <span>{invoice.id}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice Date
            </strong>
            <span>{new Date(invoice.createTs).toLocaleDateString()}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Billing Name
            </strong>
            <span></span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Billing Email
            </strong>
            <span></span>
          </li>
        </ul>
      </div>
    </div>
  );
}
