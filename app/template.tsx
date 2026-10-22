"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-full"
    >
      {children}
    </motion.div>
  );
}
