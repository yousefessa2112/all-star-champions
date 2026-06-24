"use client";

import { motion } from "framer-motion";

export function PageShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`mx-auto w-full max-w-7xl px-4 py-10 lg:px-8 ${className}`}
    >
      {children}
    </motion.main>
  );
}
