"use client"

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { containerVariants, itemVariants } from '@/utils/animation-variants'

const deadlines = [
  { id: "INV-001", daysOverdue: 5, amount: "$4,000", client: "John Doe" },
  { id: "INV-002", daysOverdue: 2, amount: "$2,500", client: "John Doe" },
  { id: "INV-003", dueIn: 3, amount: "$3,200", client: "John Doe" },
  { id: "INV-004", dueIn: 1, amount: "$1,800", client: "John Doe" },
  { id: "INV-005", daysOverdue: 7, amount: "$5,000", client: "John Doe" },
  { id: "INV-006", daysOverdue: 3, amount: "$2,000", client: "John Doe" },
  { id: "INV-007", daysOverdue: 1, amount: "$1,500", client: "John Doe" },
  { id: "INV-008", dueIn: 2, amount: "$3,500", client: "John Doe" },
  { id: "INV-009", dueIn: 4, amount: "$2,750", client: "John Doe" },
  { id: "INV-010", daysOverdue: 6, amount: "$4,500", client: "John Doe" },
];

export default function UpcomingDeadlines() {
  const [selectedDeadline, setSelectedDeadline] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const getUrgencyColor = (daysOverdue: number | undefined, dueIn: number | undefined) => {
    if (daysOverdue) return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
    if (dueIn && dueIn <= 2) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900  dark:text-yellow-400"
    return "bg-green-100 text-green-700 dark:bg-green-900  dark:text-green-400"
  }

  const getUrgencyPercentage = (daysOverdue: number | undefined, dueIn: number | undefined) => {
    if (daysOverdue) return 100
    if (dueIn) return Math.max(0, 100 - (dueIn * 20))
    return 0
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="space-y-4"
    >
      <motion.div variants={itemVariants} className="flex flex-col space-y-1.5">
        <div className="font-semibold leading-none tracking-tight text-primary">
          Upcoming Deadlines - {" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">
            {deadlines.length}
          </code>
        </div>
      </motion.div>
      <ScrollArea className="h-[285px] w-full rounded-md border-b order-t">
        <div className="space-y-4">
          {deadlines.map((deadline, index) => (
            <motion.div 
              key={deadline.id}
              variants={itemVariants}
              custom={index}
              className={`bg-muted/30 border dark:border-primary/10 rounded-lg p-4 shadow-sm transition-all duration-300 ease-in-out transform cursor-pointer ${
                selectedDeadline === deadline.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedDeadline(deadline.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{deadline.id}</span>
                <Badge variant="outline" className={`${getUrgencyColor(deadline.daysOverdue, deadline.dueIn)} border-none`}>
                  {deadline.daysOverdue
                    ? `${deadline.daysOverdue}d overdue`
                    : `Due in ${deadline.dueIn}d`}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{deadline.amount}</span>
                <span className="text-xs">- {deadline.client}</span>
              </div>
              <Progress 
                value={getUrgencyPercentage(deadline.daysOverdue, deadline.dueIn)} 
                className="mt-2"
              />
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  )
}

