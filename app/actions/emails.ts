'use server';

import { Resend } from 'resend';
import { db } from "@/db";
import { EmailReminders, Invoices, Customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateInvoicePdf } from '@/lib/pdf';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
  attachPdf?: boolean;
  invoiceId: string;
}

interface ScheduleReminderParams {
  invoiceId: string;
  type: 'before_due' | 'on_due' | 'after_due';
  days: number;
  emailTemplate: string;
}

export async function sendInvoiceEmail({
  to,
  subject,
  body,
  attachPdf = false,
  invoiceId,
}: SendEmailParams) {
  try {
    // Generate PDF if requested
    let attachments = undefined;
    if (attachPdf) {
      const pdfContent = await generateInvoicePdf(invoiceId);
      attachments = [{
        content: pdfContent,
        filename: `invoice-${invoiceId}.pdf`,
      }];
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_SENDER_ADDRESS!,
    //   to: [to],
      to: 'ekpoemmanuelsg@gmail.com',
      subject: subject,
      html: body.replace(/\n/g, '<br>'),
      replyTo: 'support@emmanuelekpo.xyz',
      attachments
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, messageId: data?.id };
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw new Error(error.message || 'Failed to send email');
  }
}

export async function scheduleInvoiceReminder({
  invoiceId,
  type,
  days,
  emailTemplate
}: ScheduleReminderParams) {
  try {
    // Get the invoice details to calculate the reminder date
    const invoice = await db.query.Invoices.findFirst({
      where: eq(Invoices.id, invoiceId),
      with: {
        customer: true
      }
    });

    if (!invoice || !invoice.dueDate) {
      throw new Error('Invoice not found or missing due date');
    }

    // Calculate the reminder date based on the type and days
    const dueDate = new Date(invoice.dueDate);
    let reminderDate = new Date(dueDate);

    switch (type) {
      case 'before_due':
        reminderDate.setDate(dueDate.getDate() - days);
        break;
      case 'on_due':
        // Keep the due date
        break;
      case 'after_due':
        reminderDate.setDate(dueDate.getDate() + days);
        break;
    }

    // Don't schedule if the reminder date is in the past
    if (reminderDate < new Date()) {
      throw new Error('Cannot schedule reminders for past dates');
    }

    // Store the reminder in the database
    await db.insert(EmailReminders).values({
      invoiceId,
      type,
      days,
      emailTemplate,
      scheduledDate: reminderDate,
      status: 'scheduled'
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error scheduling reminder:', error);
    throw new Error(error.message || 'Failed to schedule reminder');
  }
}

// Function to process scheduled reminders (to be called by a cron job)
export async function processScheduledReminders() {
  try {
    const now = new Date();
    
    // Add explicit type for the query result
    type ReminderWithInvoice = typeof EmailReminders.$inferSelect & {
      invoice: (typeof Invoices.$inferSelect & {
        customer: typeof Customers.$inferSelect | null
      }) | null
    };
    
    const pendingReminders = await db.query.EmailReminders.findMany({
      where: eq(EmailReminders.status, 'scheduled'),
      with: {
        invoice: {
          with: {
            customer: true
          }
        }
      }
    }) as ReminderWithInvoice[];

    for (const reminder of pendingReminders) {
      const scheduledDate = new Date(reminder.scheduledDate);
      const invoice = reminder.invoice;
      
      // Check if it's time to send the reminder and we have a valid invoice with customer
      if (scheduledDate <= now && invoice && invoice.customer && invoice.customer.email) {
        // Send the email
        await sendInvoiceEmail({
          to: invoice.customer.email,
          subject: `Invoice Reminder: #${invoice.id}`,
          body: reminder.emailTemplate,
          invoiceId: invoice.id
        });

        // Update reminder status
        await db.update(EmailReminders)
          .set({ status: 'sent', sentDate: now })
          .where(eq(EmailReminders.id, reminder.id));
      }
    }
  } catch (error) {
    console.error('Error processing reminders:', error);
  }
} 