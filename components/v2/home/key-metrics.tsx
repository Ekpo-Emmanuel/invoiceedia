"use client"

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt, AlertCircle, Activity, User } from 'lucide-react'
import { containerVariants, itemVariants } from '@/utils/animation-variants';

const metrics = [
  {
    title: "Total Revenue",
    value: "",
    description: "this month",
    icon: Receipt,
  },
  {
    title: "Pending Payments",
    value: "",
    description: "overdue",
    icon: AlertCircle,
  },
  {
    title: "Recent Activity",
    value: "",
    description: "invoices sent",
    icon: Activity,
  },
  {
    title: "Top Client",
    value: "",
    description: "$- revenue",
    icon: User,
  },
]

export default function KeyMetrics() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full"
    >
      {metrics.map((metric, index) => (
        <motion.div key={index} variants={itemVariants}>
          <Card className="dark:bg-muted/30 border dark:border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon 
                strokeWidth={2.3}
                className="h-5 w-5 transition-transform ease-in-out duration-700 text-muted-foreground"  
              />
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <div className="text-2xl font-bold leading-none">
                {metric.value ? metric.value : "-"}
              </div>
              <p className="text-muted-foreground text-xs leading-none">
                {metric.description ? metric.description : "-"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
