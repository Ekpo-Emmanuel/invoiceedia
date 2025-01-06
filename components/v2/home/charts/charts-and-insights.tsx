"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RevenewInsight from "./line-chart";
import { containerVariants, itemVariants } from '@/utils/animation-variants';
import PieChartTab from './pie-chart-tab';
import BarChartTab from './bar-chart-tab';

const paymentStatus = [
  { name: "Paid", value: 70 },
  { name: "Pending", value: 20 },
  { name: "Overdue", value: 10 },
];

const topClients = [
  { name: "Acme Inc.", revenue: 0 },
  { name: "Globex Corp.", revenue: 0 },
  { name: "Soylent Corp.", revenue: 0 },
  { name: "Initech", revenue: 0 },
  { name: "Umbrella Corp.", revenue: 0 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function ChartsAndInsights() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const hasClients = topClients.some(client => client.revenue > 0);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <Card className="dark:bg-muted/30 border dark:border-primary/10">
        <motion.div variants={itemVariants}>
          <CardHeader>
            <CardTitle>Charts and Insights</CardTitle>
          </CardHeader>
        </motion.div>
        <CardContent>
          <Tabs defaultValue="revenue" className="space-y-4">
            <motion.div variants={itemVariants} className="flex items-center sm:justify-end">
              <TabsList className="bg-transparent p-0">
                <TabsTrigger value="revenue" className="text-sm tracking-tight data-[state=active]:font-medium">
                  Revenue
                </TabsTrigger>
                <TabsTrigger value="status" className="text-sm tracking-tight data-[state=active]:font-medium">
                  Status
                </TabsTrigger>
                <TabsTrigger value="clients" className="text-sm tracking-tight data-[state=active]:font-medium">
                  Clients
                </TabsTrigger>
              </TabsList>
            </motion.div>
            <motion.div variants={itemVariants}>
              <TabsContent value="revenue"> <RevenewInsight /> </TabsContent>
              <TabsContent value="status"> <PieChartTab paymentStatus={paymentStatus} COLORS={COLORS}/> </TabsContent>
              <TabsContent value="clients">
                {hasClients ? (
                  <BarChartTab topClients={topClients} />
                ) : (
                  <div className="h-[300px] max-h-[300px] flex flex-col gap-2 items-center justify-center py-10 text-muted-foreground">
                    <p className="text-sm sm:text-md font-medium text-center leading-none text-primary">You have no clients yet</p>
                    <p className="text-sm text-center">Once you gain clients, you'll be able to see insights here.</p>
                  </div>
                )}
              </TabsContent>
            </motion.div>
          </Tabs>
        </CardContent>
        {/* <motion.div variants={itemVariants}>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing insights from recent activity
            </div>
          </CardFooter>
        </motion.div> */}
      </Card>
    </motion.div>
  );
}
