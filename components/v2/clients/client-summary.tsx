"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/utils/animation-variants';
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Users, Activity, DollarSign, Calculator, LucideIcon } from 'lucide-react';

interface Stats {
  totalClients: number;
  activeClients: number;
}

interface SummaryCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, change, trend, icon: Icon }) => {
    const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : null;
    const trendColor =
        trend === 'up'
            ? 'text-green-600'
            : trend === 'down'
            ? 'text-red-600'
            : 'text-muted-foreground';
  
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
                {TrendIcon && <TrendIcon className="inline h-4 w-4" />}
                {change}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
};

interface ClientSummaryProps {
  stats: Stats;
}

const ClientSummary = ({ stats }: ClientSummaryProps) => {
  const summaryData: SummaryCardProps[] = [
    {
      title: "Total Clients",
      value: stats.totalClients.toString(),
      change: "From last month",
      trend: "up",
      icon: Users,
    },
    {
      title: "Active Clients",
      value: stats.activeClients.toString(),
      change: "Currently active",
      trend: "neutral",
      icon: Activity,
    },
    {
      title: "Total Revenue",
      value: "$0.00",
      change: "This month",
      trend: "neutral",
      icon: DollarSign,
    },
    {
      title: "Avg. Revenue/Client",
      value: "$0.00",
      change: "Per client",
      trend: "neutral",
      icon: Calculator,
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

export default ClientSummary;