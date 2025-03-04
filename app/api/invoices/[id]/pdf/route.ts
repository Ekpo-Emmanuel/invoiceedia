import { NextRequest, NextResponse } from 'next/server';
import { generateInvoicePdf } from '@/lib/pdf';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { Invoices } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const invoiceId = params.id;
    
    // Verify the invoice exists and belongs to the user's organization
    const invoice = await db.query.Invoices.findFirst({
      where: and(
        eq(Invoices.id, invoiceId),
        eq(Invoices.organizationId, orgId || '')
      )
    });

    if (!invoice) {
      return new NextResponse('Invoice not found', { status: 404 });
    }

    // Generate the PDF
    const pdfContent = await generateInvoicePdf(invoiceId);
    
    // Return the PDF content
    return new NextResponse(JSON.stringify({ 
      success: true, 
      content: pdfContent 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to generate PDF' 
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 