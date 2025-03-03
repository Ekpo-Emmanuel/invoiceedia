import React from 'react';
import { motion } from 'framer-motion';
import LogoSvg from "@/components/logo-svg";

export default function AnimatedLoader() {
  return (
    <div className="h-[100svh] bg-background">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed inset-0 flex items-center justify-center"
      >
        <LogoSvg fill="currentColor" className="h-16 w-16" />
      </motion.div>
    </div>
  );
}
