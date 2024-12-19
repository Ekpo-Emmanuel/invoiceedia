"use client";

import React from "react";
import { Invoices, Customers } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  Download,
  FileImage,
  MoreHorizontal,
  Receipt,
  Trash2,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AVAILABLE_STATUSES } from "../../(data)/invoices";
import { updateStatusAction, deleteInoviceAction } from "@/app/actions";
import { useOptimistic } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

interface InvooiceProps {
  invoice: typeof Invoices.$inferSelect & {
    customer: typeof Customers.$inferSelect;
  };
}

export default function Invoice({ invoice }: InvooiceProps) {
  const [currentStatus, setCurrentStatus] = useOptimistic(
    invoice.status,
    (state, newStatus) => {
      return newStatus as
        | "open"
        | "paid"
        | "void"
        | "uncollectible"
        | "canceled"
        | "pending"
        | "failed";
    }
  );

  const statusColors = {
    open: "bg-blue-100 text-blue-700 hover:bg-blue-100/80",
    paid: "bg-green-100 text-green-700 hover:bg-green-100/80",
    void: "bg-gray-100 text-gray-700 hover:bg-gray-100/80",
    uncollectible: "bg-red-100 text-red-700 hover:bg-red-100/80",
    canceled: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80",
    pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80",
    failed: "bg-red-100 text-red-700 hover:bg-red-100/80",
  };
  

  async function handleUpdateStatus(formData: FormData) {
    const originalStatus = currentStatus;
    setCurrentStatus(formData.get("status"));
    try {
      await updateStatusAction(formData);
    } catch (e) {
      setCurrentStatus(originalStatus);
    }
  }

  return (
    <>
      <div className="px-4 md:px-6 lg:px-8 space-y-2 mx-auto max-w-7xl w-full">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li className="inline-flex items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
              </Link>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                <span className="ms-1 text-sm font-medium text-gray-700 md:ms-2">
                  <Link href={`/dashboard/invoices/${invoice.id}`}>INV{invoice.id}</Link>
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <Card className="">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1.5">
              <CardTitle className="text-2xl">Invoice #{invoice.id}</CardTitle>
              <CardDescription>
                Description: {invoice.description}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Badge
                      className={`rounded-full h-fit capitalize ${statusColors[invoice.status]}`}
                    >
                      {invoice.status}
                    </Badge>
                    <ChevronDown className="w-4 h-4" />
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
              <Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileImage className="mr-2 h-4 w-4" />
                      Save as Image
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Invoice
                      </DropdownMenuItem>
                    </DialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent>
                  <DialogHeader className="gap-4">
                    <DialogTitle>Delete Invoice?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your invoice and remove your data from our servers.
                    </DialogDescription>
                    <DialogFooter>
                      <form
                        className="flex justify-center gap-2"
                        action={deleteInoviceAction}
                      >
                        <input type="hidden" name="id" value={invoice.id} />
                        <Button className="font-semibold" variant="destructive">
                          Delete Invoice <Trash2 className="ml-2 w-4 h-4" />
                        </Button>
                      </form>
                      <DialogClose asChild>
                        <div>
                          <Button variant="secondary" type="button">
                            Cancel
                          </Button>
                        </div>
                      </DialogClose>
                    </DialogFooter>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-baseline justify-between">
              <div className="text-sm font-medium text-muted-foreground">
                Amount Due
              </div>
              <div className="text-3xl font-bold">
                ${(invoice.value / 100).toFixed(2)}
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Billing Details</h3>
              <div className="grid gap-4 text-sm md:grid-cols-2">
                <div className="space-y-2">
                  <div className="font-medium text-muted-foreground">
                    Invoice Date
                  </div>
                  <div>{new Date(invoice.createTs).toLocaleDateString()}</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-muted-foreground">
                    Invoice ID
                  </div>
                  <div>{invoice.id}</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-muted-foreground">
                    Billed To
                  </div>
                  <div>{invoice.customer.name}</div>
                  <div>{invoice.customer.email}</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 sm:flex-row sm:justify-end">
            <Button variant="outline" className="w-full sm:w-auto">
              <Receipt className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
            <Link
              href={`/dashboard/invoices/${invoice.id}/payment`}
              className="w-full sm:w-auto"
            >
              <Button
                className="w-full sm:w-auto"
                disabled={invoice.status !== "open"}
              >
                {invoice.status === "open"
                  ? "Pay Now"
                  : "Payment " +
                    invoice.status.charAt(0).toUpperCase() +
                    invoice.status.slice(1)}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
