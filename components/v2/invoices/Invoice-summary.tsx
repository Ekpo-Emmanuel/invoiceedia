"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/utils/animation-variants';
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, DollarSign, Clock, LucideIcon, Bird } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { formatCurrency } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  type?: 'currency' | 'number';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  value, 
  icon: Icon,
  type = 'currency' 
}) => {
    const displayValue = type === 'currency' ? formatCurrency(value as number) : value;
  
    return (
      <motion.div variants={itemVariants}>
        <Card className="dark:bg-muted/30 border dark:border-primary/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <p className="text-2xl font-bold leading-none">{displayValue}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
};

interface InvoiceSummaryProps {
  hasInvoices: boolean;
  stats: {
    totalReceivables: number;
    paidAmount: number;
    unpaidAmount: number;
    overdueCount: number;
  };
}

const NewUserView: React.FC = () => (
  <motion.div variants={itemVariants} initial="hidden" animate="visible">
    <Card className="dark:bg-muted/30 h-[300px] max-h-[300px] flex items-center justify-center border dark:border-primary/10 p-6">
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <Bird size={33} />
        <div className="flex flex-col gap-1 text-center">
          <h3 className="text-lg font-semibold leading-none">Welcome to Invoicedia</h3>
          <p className="text-sm text-muted-foreground leading-tight max-w-sm">
            You have no invoices yet. Start by creating your first invoice to see your financial summary.
          </p>
        </div>
        <Button className='bg-blue-500 hover:bg-blue-600 text-white font-medium'>
          Create Your First Invoice
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ hasInvoices, stats }) => {
  if (!hasInvoices) {
    return <NewUserView />;
  }

  const summaryData = [
    {
      title: "Total Receivables",
      value: stats.totalReceivables / 100,
      icon: DollarSign,
      type: 'currency' as const
    },
    {
      title: "Paid Invoices",
      value: stats.paidAmount / 100,
      icon: DollarSign,
      type: 'currency' as const
    },
    {
      title: "Unpaid Invoices",
      value: stats.unpaidAmount / 100,
      icon: DollarSign,
      type: 'currency' as const
    },
    {
      title: "Overdue Invoices",
      value: stats.overdueCount,
      icon: Clock,
      type: 'number' as const
    },
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {summaryData.map((data, index) => (
        <SummaryCard key={index} {...data} />
      ))}
    </motion.div>
  );
};

export default InvoiceSummary;