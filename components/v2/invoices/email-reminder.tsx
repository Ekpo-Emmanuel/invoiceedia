'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Send, Bell } from 'lucide-react';
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import { Invoice } from "@/types/invoice";
import { formatCurrency } from "@/lib/utils";
import { useMediaQuery } from '@/hooks/use-media-query';

interface EmailReminderProps {
  invoice: Invoice;
  onSendEmail: (emailData: EmailData) => Promise<void>;
  onScheduleReminder: (reminderData: ReminderData) => Promise<void>;
  organizationName: string;
  userName: string;
}

interface EmailData {
  subject: string;
  body: string;
  attachPdf: boolean;
}

interface ReminderData {
  type: 'before_due' | 'on_due' | 'after_due';
  days: number;
  emailTemplate: string;
}

const DEFAULT_TEMPLATES = {
  initial: `Dear [Client Name],

I hope this email finds you well. Please find attached Invoice #[Invoice Number] for [Total Amount].

Invoice Details:
- Issue Date: [Issue Date]
- Due Date: [Due Date]
- Payment Terms: [Payment Terms]

You can view and pay the invoice online via the link below:
[Invoice Link]

If you have any questions, please don't hesitate to reach out.

Thank you for your business!

Best regards,
[Your Name]`,

  reminder: `Dear [Client Name],

This is a friendly reminder that Invoice #[Invoice Number] for [Total Amount] is due on [Due Date].

Invoice Summary:
- Total Amount: [Total Amount]
- Due Date: [Due Date]
- Days Until Due: [Days Until Due]

If you have already made the payment, please disregard this message.

You can view and pay the invoice online via the link below:
[Invoice Link]

Thank you for your prompt attention to this matter.

Best regards,
[Your Name]`,

  overdue: `Dear [Client Name],

This is a reminder that Invoice #[Invoice Number] for [Total Amount] was due on [Due Date] and is currently overdue.

Invoice Details:
- Invoice Number: #[Invoice Number]
- Total Amount: [Total Amount]
- Due Date: [Due Date]
- Days Overdue: [Days Overdue]

Please arrange for payment at your earliest convenience.

You can view and pay the invoice online via the link below:
[Invoice Link]

If you have any questions or concerns, please don't hesitate to contact us.

Best regards,
[Your Name]`
};

export function EmailReminder({ 
  invoice, 
  onSendEmail, 
  onScheduleReminder,
  organizationName,
  userName 
}: EmailReminderProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [emailData, setEmailData] = useState<EmailData>({
    subject: `Invoice #${invoice.id} for Review`,
    body: '',
    attachPdf: true
  });
  const [reminderData, setReminderData] = useState<ReminderData>({
    type: 'before_due',
    days: 3,
    emailTemplate: ''
  });

  const replaceTemplateVariables = (template: string) => {
    const daysUntilDue = invoice.dueDate ? differenceInDays(new Date(invoice.dueDate), new Date()) : 0;
    const daysOverdue = invoice.dueDate ? differenceInDays(new Date(), new Date(invoice.dueDate)) : 0;
    const clientName = invoice.customer?.companyName || 
      `${invoice.customer?.firstName} ${invoice.customer?.lastName}`;
    const signature = `${organizationName} | ${userName}`;

    return template
      .replace(/\[Client Name\]/g, clientName)
      .replace(/\[Invoice Number\]/g, invoice.id.split('-')[0])
      .replace(/\[Total Amount\]/g, formatCurrency(invoice.total))
      .replace(/\[Issue Date\]/g, invoice.issueDate ? format(new Date(invoice.issueDate), "MMM d, yyyy") : 'Not set')
      .replace(/\[Due Date\]/g, invoice.dueDate ? format(new Date(invoice.dueDate), "MMM d, yyyy") : 'Not set')
      .replace(/\[Payment Terms\]/g, invoice.paymentTerms.replace('_', ' '))
      .replace(/\[Days Until Due\]/g, String(Math.max(0, daysUntilDue)))
      .replace(/\[Days Overdue\]/g, String(Math.max(0, daysOverdue)))
      .replace(/\[Invoice Link\]/g, `${window.location.origin}/invoices/${invoice.id}`)
      .replace(/\[Your Name\]/g, signature);
  };

  useEffect(() => {
    setEmailData(prev => ({
      ...prev,
      body: replaceTemplateVariables(DEFAULT_TEMPLATES.initial)
    }));
    setReminderData(prev => ({
      ...prev,
      emailTemplate: replaceTemplateVariables(DEFAULT_TEMPLATES.reminder)
    }));
  }, [invoice]);

  const handleTemplateChange = (template: string) => {
    setEmailData(prev => ({
      ...prev,
      body: replaceTemplateVariables(template)
    }));
  };

  const handleReminderTemplateChange = (template: string) => {
    setReminderData(prev => ({
      ...prev,
      emailTemplate: replaceTemplateVariables(template)
    }));
  };

  const handleSendEmail = async () => {
    try {
      await onSendEmail(emailData);
      setIsEmailOpen(false);
      toast.success('Email sent successfully');
    } catch (error) {
      toast.error('Failed to send email');
    }
  };

  const handleScheduleReminder = async () => {
    try {
      await onScheduleReminder(reminderData);
      setIsReminderOpen(false);
      toast.success('Reminder scheduled successfully');
    } catch (error) {
      toast.error('Failed to schedule reminder');
    }
  };

  return (
    <div className="flex items-center gap-2">
    {/* Send Email Dialog */}
    <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="font-medium">
          <Send className="h-4 w-4 mr-2"/>
          Send Email
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-muted dark:border-background border-l w-full sm:w-[600px] h-full relative">
        <DialogHeader className="text-left">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Send Invoice Email</h2>
            <p className="text-sm text-muted-foreground">Customize and send the invoice email to your client.</p>
          </div>
        </DialogHeader>
        <div className="space-y-4 mt-6">
          <div>
            <Label>Template</Label>
            <Select 
              onValueChange={(value) => handleTemplateChange(DEFAULT_TEMPLATES[value as keyof typeof DEFAULT_TEMPLATES])}
              defaultValue="initial"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="initial">Initial Invoice</SelectItem>
                <SelectItem value="reminder">Payment Reminder</SelectItem>
                <SelectItem value="overdue">Overdue Notice</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Subject</Label>
            <Input 
              value={emailData.subject}
              onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
              className="bg-inherit"
            />
          </div>
          <div>
            <Label>Message</Label>
            <Textarea 
              value={emailData.body}
              onChange={(e) => setEmailData(prev => ({ ...prev, body: e.target.value }))}
              rows={12}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="attach-pdf"
              checked={emailData.attachPdf}
              onCheckedChange={(checked) => setEmailData(prev => ({ ...prev, attachPdf: checked }))}
            />
            <Label htmlFor="attach-pdf">Attach PDF</Label>
          </div>
        </div>
        <DialogFooter className="absolute bottom-4 right-0">
          <Button variant="outline" size="sm" onClick={() => setIsEmailOpen(false)}>
            Cancel
          </Button>
          <Button  size="sm" onClick={handleSendEmail}>
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Schedule Reminder Dialog */}
    <Dialog open={isReminderOpen} onOpenChange={setIsReminderOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Bell className="h-4 w-4 mr-2"/>
          Schedule Reminder
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Payment Reminder</DialogTitle>
          <DialogDescription>
            Set up automatic email reminders for this invoice.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Reminder Type</Label>
            <Select
              value={reminderData.type}
              onValueChange={(value: ReminderData['type']) => 
                setReminderData({ ...reminderData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="before_due">Before Due Date</SelectItem>
                <SelectItem value="on_due">On Due Date</SelectItem>
                <SelectItem value="after_due">After Due Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="days">Days {reminderData.type === 'before_due' ? 'Before' : 'After'}</Label>
            <Input
              id="days"
              type="number"
              min="1"
              value={reminderData.days}
              onChange={(e) => setReminderData({ 
                ...reminderData, 
                days: parseInt(e.target.value) || 0 
              })}
              disabled={reminderData.type === 'on_due'}
              className="dark:bg-inherit"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="template">Email Template</Label>
            <Textarea
              id="template"
              value={reminderData.emailTemplate}
              onChange={(e) => setReminderData({ 
                ...reminderData, 
                emailTemplate: e.target.value 
              })}
              rows={6}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setIsReminderOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleScheduleReminder}>
            Schedule Reminder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
  )
} 