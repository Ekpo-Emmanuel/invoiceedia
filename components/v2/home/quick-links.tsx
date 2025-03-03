"use client"

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User2, FileText } from 'lucide-react'
import { containerVariants, itemVariants } from '@/utils/animation-variants'

const quickAccessClients = [
  { name: "Acme Inc.", id: "client-001" },
  { name: "Globex Corp.", id: "client-002" },
  { name: "Soylent Corp.", id: "client-003" },
]

const savedTemplates = [
  { name: "Standard Invoice", id: "template-001" },
  { name: "Detailed Invoice", id: "template-002" },
]

export default function QuickLinks() {
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
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
        </motion.div>
        <CardContent>
          <div className="space-y-4">
            <motion.div variants={itemVariants}>
              <h3 className="mb-2 font-semibold">Quick Access Clients</h3>
              <div className="flex flex-wrap gap-2">
                {quickAccessClients.map((client, index) => (
                  <motion.div key={client.id} variants={itemVariants} custom={index}>
                    <Button variant="outline" size="sm">
                      <User2 className="mr-2 h-4 w-4" />
                      {client.name}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <h3 className="mb-2 font-semibold">Saved Templates</h3>
              <div className="flex flex-wrap gap-2">
                {savedTemplates.map((template, index) => (
                  <motion.div key={template.id} variants={itemVariants} custom={index}>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      {template.name}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}