"use client"

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Plus, Users, BarChart3 } from 'lucide-react';
import { containerVariants, itemVariants } from '@/utils/animation-variants';

export default function DashboardHomeHeader() {
  return (
    <motion.div 
      className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        variants={itemVariants}
        className="flex flex-col gap-2 text-primary"
      >
        <h1 className="text-2xl font-bold leading-none">Welcome, John Doe!</h1>
        <p className="text-sm leading-none">Let's get those invoices sorted!</p>
      </motion.div>
      <motion.div 
        className="grid gap-2 grid-cols-2"
        variants={itemVariants}
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create
        </Button>
        <Button variant="outline">
          <Users className="mr-2 h-4 w-4" />
          Clients
        </Button>
      </motion.div>
    </motion.div>
  );
}
