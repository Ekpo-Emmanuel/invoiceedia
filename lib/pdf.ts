import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { Invoices } from "@/db/schema";

export async function generateInvoicePdf(invoiceId: string): Promise<string> {
  // Fetch invoice with customer details
  const invoice = await db.query.Invoices.findFirst({
    where: eq(Invoices.id, invoiceId),
    with: {
      customer: true
    }
  });

  if (!invoice) {
    throw new Error('Invoice not found');
  }

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { height } = page.getSize();
  
  // Get the font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  // Add content to the PDF
  page.drawText('INVOICE', {
    x: 50,
    y: height - 50,
    size: 24,
    font,
  });

  // Add invoice details
  let y = height - 100;
  const lineHeight = 20;

  page.drawText(`Invoice #: ${invoice.id}`, { x: 50, y: y -= lineHeight, size: 12, font });
  page.drawText(`Date: ${format(new Date(invoice.issueDate), 'MMM d, yyyy')}`, { x: 50, y: y -= lineHeight, size: 12, font });
  page.drawText(`Due Date: ${format(new Date(invoice.dueDate), 'MMM d, yyyy')}`, { x: 50, y: y -= lineHeight, size: 12, font });

  // Add client details
  y -= lineHeight * 2;
  page.drawText('Bill To:', { x: 50, y, size: 14, font });
  y -= lineHeight;
  page.drawText(`${invoice.customer.firstName} ${invoice.customer.lastName}`, { x: 50, y: y -= lineHeight, size: 12, font });
  if (invoice.customer.companyName) {
    page.drawText(invoice.customer.companyName, { x: 50, y: y -= lineHeight, size: 12, font });
  }
  page.drawText(invoice.customer.email, { x: 50, y: y -= lineHeight, size: 12, font });

  // Add line items
  y -= lineHeight * 2;
  page.drawText('Description', { x: 50, y, size: 12, font });
  page.drawText('Qty', { x: 300, y, size: 12, font });
  page.drawText('Rate', { x: 400, y, size: 12, font });
  page.drawText('Amount', { x: 500, y, size: 12, font });

  y -= lineHeight;
  for (const item of invoice.lineItems) {
    page.drawText(item.description, { x: 50, y, size: 10, font });
    page.drawText(item.quantity.toString(), { x: 300, y, size: 10, font });
    page.drawText(formatCurrency(item.rate), { x: 400, y, size: 10, font });
    page.drawText(formatCurrency(item.quantity * item.rate), { x: 500, y, size: 10, font });
    y -= lineHeight;
  }

  // Add totals
  y -= lineHeight;
  page.drawText(`Subtotal: ${formatCurrency(invoice.subtotal)}`, { x: 400, y: y -= lineHeight, size: 12, font });
  if (invoice.taxRate) {
    page.drawText(`Tax (${invoice.taxRate}%): ${formatCurrency(invoice.taxAmount || 0)}`, { x: 400, y: y -= lineHeight, size: 12, font });
  }
  page.drawText(`Total: ${formatCurrency(invoice.total)}`, { x: 400, y: y -= lineHeight, size: 12, font, color: rgb(0, 0, 0.8) });

  // Convert the PDF to base64
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes).toString('base64');
} 