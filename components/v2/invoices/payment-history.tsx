'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, CreditCard, Building2, Receipt } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";

interface Payment {
  id: string;
  date: Date;
  amount: number;
  method: 'credit_card' | 'bank_transfer' | 'other';
}

interface PaymentHistoryProps {
  payments: Payment[];
  outstandingAmount: number;
  onRecordPayment: (payment: Omit<Payment, 'id'>) => Promise<void>;
}

export function PaymentHistory({ payments, outstandingAmount, onRecordPayment }: PaymentHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<Payment['method']>('credit_card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getMethodIcon = (method: Payment['method']) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'bank_transfer':
        return <Building2 className="h-4 w-4" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };

  const handleSubmit = async () => {
    if (!amount || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onRecordPayment({
        date: new Date(),
        amount: parseFloat(amount),
        method,
      });
      setIsOpen(false);
      setAmount('');
      setMethod('credit_card');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Payment History</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
              <DialogDescription>
                Enter the payment details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="amount">Amount</label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter payment amount"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="method">Payment Method</label>
                <Select value={method} onValueChange={(value: Payment['method']) => setMethod(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!amount || isSubmitting}>
                Record Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {payments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No payments recorded yet
          </p>
        ) : (
          <>
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getMethodIcon(payment.method)}
                  <div>
                    <p className="text-sm font-medium">
                      ${payment.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(payment.date)}
                    </p>
                  </div>
                </div>
                <span className="text-sm capitalize">
                  {payment.method.replace('_', ' ')}
                </span>
              </div>
            ))}
          </>
        )}

        <Separator />
        
        <div className="flex justify-between font-medium">
          <span>Outstanding Amount</span>
          <span>${outstandingAmount.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
} 