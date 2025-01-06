"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/utils/animation-variants';
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, DollarSign, Clock, LucideIcon, Bird } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface SummaryCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, change, trend, icon: Icon }) => {
    const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight;
    const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  
    return (
      <motion.div variants={itemVariants}>
        <Card className="dark:bg-muted/30 border dark:border-primary/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <p className="text-2xl font-bold leading-none">{value}</p>
              <p className={`text-xs leading-none font-medium ${trendColor}`}>
                <TrendIcon className="inline h-4 w-4" />
                {change}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
};

const SUMMARY_DATA: SummaryCardProps[] = [
  {
    title: "Total Receivables",
    value: "$24,780",
    change: "+2.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Paid Invoices",
    value: "$18,260",
    change: "+1.8%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Unpaid Invoices",
    value: "$6,520",
    change: "+0.6%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Overdue Invoices",
    value: "4",
    change: "-2",
    trend: "down",
    icon: Clock,
  },
];

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
          <Button className='bg-blue-500 hover:bg-blue-600 text-white font-medium'>Create Your First Invoice</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
  
  interface InvoiceSummaryProps {
    hasInvoices: boolean;
  }
  
  const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ hasInvoices }) => {
    if (!hasInvoices) {
      return <NewUserView />;
    }
  
    return (
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {SUMMARY_DATA.map((data, index) => (
          <SummaryCard key={index} {...data} />
        ))}
      </motion.div>
    );
  };
  
  export default InvoiceSummary;