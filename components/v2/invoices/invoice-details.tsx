'use client';

import { useState } from 'react';
import { Invoice } from "@/types/invoice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import { 
  FileText, Send, Download, Pencil, Trash2, 
  MoreVertical, Clock, CheckCircle2, AlertCircle, CheckCheck 
} from "lucide-react";
import Link from "next/link";
import { PaymentHistory } from './payment-history';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { EmailReminder } from './email-reminder';
import { sendInvoiceEmail, scheduleInvoiceReminder } from '@/app/actions/emails';
import { EmailData, ReminderData } from '@/types/email';
import { downloadInvoicePdf } from '@/app/actions/invoices';

interface InvoiceDetailsProps {
  invoice: Invoice;
  organizationSlug: string;
  organizationName: string;
  userName: string;
}

export function InvoiceDetails({ 
  invoice, 
  organizationSlug,
  organizationName,
  userName 
}: InvoiceDetailsProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isReminderAllowed = (status: string) => {
    const disallowedStatuses = ['paid', 'canceled', 'void', 'failed'];
    return !disallowedStatuses.includes(status.toLowerCase());
  };

  const getStatusDetails = (status: string, dueDate: string | Date | null) => {
    const now = new Date();
    const due = dueDate ? new Date(dueDate) : null;
    const isOverdue = due && now > due && status !== 'paid';

    switch (status) {
      case 'paid':
        return {
          label: 'Paid',
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle2 className="h-4 w-4" />
        };
      case 'overdue':
      case status && isOverdue:
        return {
          label: 'Overdue',
          color: 'bg-red-100 text-red-800',
          icon: <AlertCircle className="h-4 w-4" />
        };
      default:
        return {
          label: 'Pending',
          color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-400',
          icon: <Clock className="h-4 w-4" />
        };
    }
  };

  const statusDetails = getStatusDetails(invoice.status, invoice.dueDate);

  const subtotal = invoice.lineItems.reduce((sum, item) => 
    sum + (item.quantity * item.rate), 0
  );

  const taxAmount = invoice.taxRate ? subtotal * (Number(invoice.taxRate) / 100) : 0;

  const formatDateSafe = (date: string | Date | null) => {
    if (!date) return 'Not set';
    return formatDate(new Date(date));
  };

  // Calculate payment progress
  const totalPaid = 0; // Replace with actual total paid amount from payments
  const paymentProgress = (totalPaid / invoice.total) * 100;

  const handleMarkAsPaid = async () => {
    toast.promise(
      // Replace with your actual API call
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Updating invoice status...',
        success: 'Invoice marked as paid',
        error: 'Failed to update invoice status',
      }
    );
  };

  const handleSendReminder = async () => {
    toast.promise(
      // Replace with your actual API call
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Sending reminder...',
        success: 'Reminder sent successfully',
        error: 'Failed to send reminder',
      }
    );
  };

  const handleDownloadPDF = async () => {
    toast.promise(
      (async () => {
        try {
          const { content } = await downloadInvoicePdf(invoice.id);
          
          // Convert base64 to Blob
          const binaryData = atob(content);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: 'application/pdf' });
          
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `invoice-${invoice.id}.pdf`;
          document.body.appendChild(link);
          link.click();
          
          // Cleanup
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error: any) {
          throw new Error(error.message || 'Failed to download PDF');
        }
      })(),
      {
        loading: 'Generating PDF...',
        success: 'PDF downloaded successfully',
        error: (error) => error.message || 'Failed to generate PDF',
      }
    );
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Replace with your actual delete API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Invoice deleted successfully');
      router.push(`/${organizationSlug}/invoices`);
    } catch (error) {
      toast.error('Failed to delete invoice');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleRecordPayment = async (payment: any) => {
    toast.promise(
      // Replace with your actual payment recording logic
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Recording payment...',
        success: 'Payment recorded successfully',
        error: 'Failed to record payment',
      }
    );
  };

  const handleSendEmail = async (emailData: EmailData) => {
    if (!invoice.customer?.email) {
      toast.error('Customer email is required');
      return;
    }

    try {
      await sendInvoiceEmail({
        to: invoice.customer.email,
        subject: emailData.subject,
        body: emailData.body,
        attachPdf: emailData.attachPdf,
        invoiceId: invoice.id
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send email');
    }
  };

  const handleScheduleReminder = async (reminderData: ReminderData) => {
    try {
      await scheduleInvoiceReminder({
        invoiceId: invoice.id,
        type: reminderData.type,
        days: reminderData.days,
        emailTemplate: reminderData.emailTemplate
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to schedule reminder');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 md:gap-2">
          <Badge className={statusDetails.color}>
            <span className="flex items-center gap-1 text-xs">
              {statusDetails.label}
            </span>
          </Badge>
          <span className="text-sm text-muted-foreground">
            Invoice <b>#{invoice.id}</b>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isReminderAllowed(invoice.status) && (
            <EmailReminder
              invoice={invoice}
              onSendEmail={handleSendEmail}
              onScheduleReminder={handleScheduleReminder}
              organizationName={organizationName}
              userName={userName}
            />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="my-1">
                <DropdownMenuItem>
                    <Link href={`/${organizationSlug}/invoices/${invoice.id}/edit`} className="flex items-center gap-2">
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleMarkAsPaid}>
                    <CheckCheck className="h-4 w-4" />
                    Mark as Paid
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadPDF}>
                    <Download className="h-4 w-4" />
                    Download PDF
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <div className="mt-1">
                <DropdownMenuItem
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-destructive dark:text-red-400"
                >
                    <Trash2 className="h-3 w-3" />
                    Delete Invoice
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Payment Progress */}
      {/* <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Payment Progress</h3>
            <span className="text-sm text-muted-foreground">
              ${totalPaid.toFixed(2)} of ${invoice.total.toFixed(2)}
            </span>
          </div>
          <Progress value={paymentProgress} className="h-2" />
        </div>
      </Card> */}

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Client Information */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Client Information</h3>
          <div className="space-y-2">
            <p>{invoice.customer?.firstName} {invoice.customer?.lastName}</p>
            <p className="text-sm text-muted-foreground">{invoice.customer?.email}</p>
            <p className="text-sm text-muted-foreground">{invoice.customer?.phone}</p>
          </div>
        </Card>

        {/* Invoice Details */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Invoice Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Issue Date</span>
              <span>{formatDateSafe(invoice.issueDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Due Date</span>
              <span>{formatDateSafe(invoice.dueDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Payment Terms</span>
              <span>{invoice.paymentTerms.replace('_', ' ').toUpperCase()}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Line Items */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Line Items</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-12 text-sm text-muted-foreground">
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-right">Quantity</div>
            <div className="col-span-2 text-right">Rate</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>
          <Separator />
          {invoice.lineItems.map((item, index) => (
            <div key={index} className="grid grid-cols-12">
              <div className="col-span-6">{item.description}</div>
              <div className="col-span-2 text-right">{item.quantity}</div>
              <div className="col-span-2 text-right">${item.rate.toFixed(2)}</div>
              <div className="col-span-2 text-right">${(item.quantity * item.rate).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {invoice.taxRate && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Tax ({invoice.taxRate}%)</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${(invoice.total / 100).toFixed(2)}</span>
          </div>
        </div>
      </Card>

      {/* Payment History */}
      <PaymentHistory
        payments={[]} // Replace with actual payments
        outstandingAmount={invoice.total / 100} // Replace with actual outstanding amount
        onRecordPayment={handleRecordPayment}
      />

      {/* Notes */}
      {invoice.notes && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Notes</h3>
          <p className="text-sm text-muted-foreground">{invoice.notes}</p>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the invoice
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}  