'use client'

import React, { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createPayment, updateStatusAction } from "@/app/actions";
import { AlertCircle, Check, CreditCard, Receipt, ChevronRight, Loader2, Share2, Copy } from 'lucide-react';
import { cn } from "@/lib/utils";
import Link from "next/link";
import PaymentSuccessHandler from "./PaymentSuccessHandler";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from 'sonner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface paymentDisplayProps {
  invoice: any;
  isSuccess: boolean;
  isError: boolean;
  isCanceled: boolean;
  sessionId: string;
  token?: string;
  paymentStatus: string;
}

export default function PaymentDisplay({
  invoice,
  isSuccess,
  isError,
  isCanceled,
  sessionId,
  token,
  paymentStatus,
}: paymentDisplayProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false)

  const statusColors = {
    open: "bg-blue-100 text-blue-700 hover:bg-blue-100/80",
    paid: "bg-green-100 text-green-700 hover:bg-green-100/80",
    void: "bg-gray-100 text-gray-700 hover:bg-gray-100/80",
    uncollectible: "bg-red-100 text-red-700 hover:bg-red-100/80",
    canceled: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80",
    pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80",
    failed: "bg-red-100 text-red-700 hover:bg-red-100/80",
  };

  const downloadAsPDF = async () => {
    const content = contentRef.current;
    const currentDate = new Date().toISOString().split('T')[0];

    if (content) {
      try {
        const canvas = await html2canvas(content, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let position = 0;
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

        if (imgHeight > pageHeight) {
          let remainingHeight = imgHeight;
          position = 0;

          while (remainingHeight > 0) {
            position += pageHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, -position, imgWidth, imgHeight);
            remainingHeight -= pageHeight;
          }
        }

        pdf.save(`Invoice_INV${invoice.id}_${invoice.customer.name}_${currentDate}.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    }
  };

  const shareInvoice = () => {
    const shareUrl = `${window.location.origin}/dashboard/invoices/${invoice.id}/payment`
    if (navigator.share) {
      navigator.share({
        title: `Invoice #${invoice.id}`,
        text: `Check out this invoice for ${invoice.customer.name}`,
        url: shareUrl,
      }).catch(console.error)
    } else {
      copyToClipboard(shareUrl)
    }
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
          <div className="p-4 md:p-6 lg:p-8 mx-auto max-w-7xl w-full">
            <div className="space-y-4">
              <nav className="flex justify-between items-center" aria-label="Breadcrumb">
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
                <div className="flex items-center gap-2">
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
                </div>
              </nav>
              {isSuccess && sessionId && (
                <PaymentSuccessHandler 
                  sessionId={sessionId}
                  invoiceId={invoice.id}
                  token={token}
                  currentStatus={invoice.status}
                  paymentStatus={paymentStatus}
                />
              )}
              {isError && (
                <Alert variant="destructive">
                  <AlertDescription className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Something went wrong. Please try again.
                  </AlertDescription>
                </Alert>
              )}
              
              {isCanceled && (
                <Alert className=" border-yellow-500 text-yellow-800 bg-yellow-50">
                  <AlertDescription className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-800" />
                    Payment was canceled.
                  </AlertDescription>
                </Alert>
              )}
    
              <Card ref={contentRef}>
                <CardHeader className="sm:flex-row sm:items-center sm:justify-between space-y-3 pb-8">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-2xl">Invoice #{invoice.id}</CardTitle>
                      <Badge className={cn("rounded-full capitalize", statusColors[invoice.status as keyof typeof statusColors])}>
                        {invoice.status}
                      </Badge>
                    </div>
                    <CardDescription>{invoice.description}</CardDescription>
                  </div>
                  <div className="text-3xl font-bold">${(invoice.total / 100).toFixed(2)}</div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg bg-gray-50 p-6">
                    <h3 className="text-lg font-semibold mb-4">Billing Details</h3>
                    <div className="grid gap-4 text-sm md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="font-medium text-muted-foreground">Invoice Date</div>
                        <div>{new Date(invoice.createTs).toLocaleDateString()}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="font-medium text-muted-foreground">Invoice ID</div>
                        <div>{invoice.id}</div>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <div className="font-medium text-muted-foreground">Billed To</div>
                        <div>{invoice.customer.name}</div>
                        <div>{invoice.customer.email}</div>
                      </div>
                    </div>
                  </div>
    
                  <Separator />
    
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Payment Options</h3>
                    {invoice.status === "open" ? (
                      <form action={createPayment} className="space-y-4">
                        <input type="hidden" value={invoice.id} name="id" />
                        {token && <input type="hidden" value={token} name="token"/>}
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold" size="lg">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay ${(invoice.total / 100).toFixed(2)}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                          Secure payment powered by Stripe
                        </p>
                      </form>
                    ) : (
                      <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 p-4 text-green-700">
                        <Check className="h-5 w-5" />
                        <span className="font-medium">Invoice Paid</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
    
              {invoice.status === "paid" && (
                <div  className="flex justify-center">
                  <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={downloadAsPDF}>
                    <Receipt className="mr-2 h-4 w-4" />
                    Download Receipt
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      );
}
