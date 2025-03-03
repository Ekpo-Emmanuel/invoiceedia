"use client"

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from 'lucide-react'
import { containerVariants, itemVariants } from '@/utils/animation-variants'
import { Button } from '@/components/ui/button'

const notifications = [
  { message: "Invoice #5678 was paid.", timestamp: "2 hours ago" },
  { message: "Reminder: Invoice #9101 is due tomorrow.", timestamp: "5 hours ago" },
  { message: "New client 'XYZ Corp' added.", timestamp: "1 day ago" },
]

export default function NotificationsPanel() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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
            <CardTitle>Notifications </CardTitle>
          </CardHeader>
        </motion.div>
        <CardContent>
          <ul className="space-y-4">
            {notifications.map((notification, index) => (
              <motion.li 
                key={index} 
                className=""
                variants={itemVariants}
                custom={index}
              >
                <div className="flex flex-col gap-2 text-sm">
                  <p className="font-medium leading-none">{notification.message}</p>
                  <p className="leading-none text-muted-foreground">{notification.timestamp}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}
