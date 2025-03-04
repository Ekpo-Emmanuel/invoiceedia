import { NextResponse } from 'next/server';
import { processScheduledReminders } from '@/app/actions/emails';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // Verify the request is from the cron job service
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await processScheduledReminders();
    return new NextResponse('Reminders processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing reminders:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 