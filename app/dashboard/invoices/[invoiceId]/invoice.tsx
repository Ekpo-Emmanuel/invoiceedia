"use client";

import React, { useRef, useState } from "react";
import { Invoices, Customers } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner'
import {
  ChevronDown,
  Download,
  FileImage,
  MoreHorizontal,
  Receipt,
  Trash2,
  ChevronRight,
  Share2,
  Check,
  Copy,
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
import { toPng } from 'html-to-image';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import clsx from "clsx"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface InvooiceProps {
  invoice: typeof Invoices.$inferSelect & {
    customer: typeof Customers.$inferSelect;
  };
}

export default function Invoice({ invoice }: InvooiceProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isCopied, setIsCopied] = useState(false)
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

  async function htmlToImageConvert() {
    // try {
    //   const node = contentRef.current;
    //   const currentDate = new Date().toISOString().split('T')[0];
    
    //   if (node) {
    //     const dataUrl = await toPng(node, { cacheBust: false });
    //     const link = document.createElement("a");
    //     link.download = `Invoice_INV${invoice.id}_${invoice.customer.name}_${currentDate}.png`;
    //     link.href = dataUrl;
    //     link.click();
    //   }
    // } catch(err) {
    //   console.error("Error generating image:", err);
    // }
  }


  const downloadAsPDF = async () => {
    const content = contentRef.current;
    const currentDate = new Date().toISOString().split('T')[0];

  
    // if (content) {
    //   try {
    //     const canvas = await html2canvas(content, {
    //       scale: 2,
    //       useCORS: true,
    //       logging: true,
    //       scrollY: -window.scrollY,
    //     });
  
    //     const imgData = canvas.toDataURL("image/png");
    //     const pdf = new jsPDF("p", "mm", "a4");
    //     const imgWidth = 210;
    //     const pageHeight = 297;
    //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
    //     let position = 0;
    //     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  
    //     if (imgHeight > pageHeight) {
    //       let remainingHeight = imgHeight;
    //       position = 0;
  
    //       while (remainingHeight > 0) {
    //         position += pageHeight;
    //         pdf.addPage();
    //         pdf.addImage(
    //           imgData,
    //           "PNG",
    //           0,
    //           -position,
    //           imgWidth,
    //           imgHeight
    //         );
    //         remainingHeight -= pageHeight;
    //       }
    //     }
  
    //     pdf.save(`Invoice_INV${invoice.id}_${invoice.customer.name}_${currentDate}.pdf`);
    //   } catch (error) {
    //     console.error("Error generating PDF:", error);
    //   }
    // }
  };

  const shareInvoice = () => {
    const shareUrl = `${window.location.origin}/dashboard/invoices/${invoice.id}/payment`
    // if (navigator.share) {
    //   navigator.share({
    //     title: `Invoice #${invoice.id}`,
    //     text: `Check out this invoice for ${invoice.customer.name}`,
    //     url: shareUrl,
    //   }).catch(console.error)
    // } else {
    //   copyToClipboard(shareUrl)
    // }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true)
      toast.message('Link copied to clipboard', {
        description: 'You can now share this invoice link',
      })
      setTimeout(() => setIsCopied(false), 2000)
    }).catch(console.error)
  }

  return (
    <>
    <div className="px-4 md:px-6 lg:px-8 space-y-4 mx-auto max-w-7xl w-full">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3 me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              Dashboard
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="w-3 h-3 text-gray-400 mx-1" />
              <Link
                href="/dashboard/invoices"
                className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
              >
                Invoices
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRight className="w-3 h-3 text-gray-400 mx-1" />
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                INV{invoice.id}
              </span>
            </div>
          </li>
        </ol>
      </nav>
      <Card ref={contentRef} className="">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="space-y-1.5">
            <CardTitle className="text-3xl font-bold">Invoice #{invoice.id}</CardTitle>
            <CardDescription className="text-lg">
              {invoice.description}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Badge
                    className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${statusColors[invoice.status]}`}
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
                      <button className="w-full text-left">{status.label}</button>
                    </form>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={shareInvoice}
                  >
                    <Share2 className="h-3 w-3" />
                    <span className="sr-only">Share Invoice</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share Invoice</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => copyToClipboard(`${window.location.origin}/dashboard/invoices/${invoice.id}/payment`)}
                  >
                    {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span className="sr-only">Copy Invoice Link</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isCopied ? 'Copied!' : 'Copy Invoice Link'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer" 
                    onClick={downloadAsPDF} 
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer" 
                    onClick={htmlToImageConvert}
                  >
                    <FileImage className="mr-2 h-4 w-4" />
                    Save as Image
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DialogTrigger asChild>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Invoice
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Invoice?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your invoice and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start">
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
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-baseline justify-between">
            <div className="text-sm font-medium text-muted-foreground">
              Amount Due
            </div>
            <div className="text-4xl font-bold">
              ${(invoice.total / 100).toFixed(2)}
            </div>
          </div>
          <Separator className="my-4" />
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Billing Details</h3>
            <div className="grid gap-4 text-sm md:grid-cols-2">
              <div className="space-y-2">
                <div className="font-medium text-muted-foreground">
                  Invoice Date
                </div>
                <div className="font-semibold">{new Date(invoice.createTs).toLocaleDateString()}</div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-muted-foreground">
                  Invoice ID
                </div>
                <div className="font-semibold">{invoice.id}</div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-muted-foreground">
                  Billed To
                </div>
                {/* <div className="font-semibold">{invoice.customer.name}</div> */}
                <div>{invoice.customer.email}</div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 sm:flex-row sm:justify-end">
          {invoice.status === "paid" && (
            <Button variant="outline" className="w-full sm:w-auto" onClick={downloadAsPDF}>
              <Receipt className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
          )}
          <Link
            href={`/dashboard/invoices/${invoice.id}/payment`}
            className="w-full sm:w-auto"
          >
            <Button
              className={clsx( 
                "w-full sm:w-auto", 
                invoice.status === "paid" && "bg-green-600 hover:bg-green-600/80 text-white font-medium",
              )}
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
