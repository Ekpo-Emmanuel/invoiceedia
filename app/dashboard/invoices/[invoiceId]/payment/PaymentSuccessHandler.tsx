'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateStatusAction } from '@/app/actions';
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface PaymentSuccessHandlerProps {
  sessionId: string;
  invoiceId: string;
  token?: string;
  currentStatus: string;
  paymentStatus: string;
}

export default function PaymentSuccessHandler({ 
  sessionId, 
  invoiceId, 
  token, 
  currentStatus,
  paymentStatus
}: PaymentSuccessHandlerProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      if (paymentStatus === 'paid' && currentStatus !== 'paid') {
        setIsUpdating(true);
        const formData = new FormData();
        formData.append('id', invoiceId);
        formData.append('status', 'paid');
        if (token) {
          formData.append('token', token);
        }

        await updateStatusAction(formData);
        router.refresh();
        setIsUpdating(false);
      }
    };

    handlePaymentSuccess();
  }, [sessionId, invoiceId, token, currentStatus, paymentStatus, router]);

  if (!isUpdating) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="p-6 flex flex-col items-center gap-4 max-w-sm mx-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <div className="text-center">
          <h3 className="font-semibold text-lg mb-2">Processing Payment</h3>
          <p className="text-sm text-muted-foreground">
            Please wait while we confirm your payment...
          </p>
        </div>
      </Card>
    </div>
  );
}