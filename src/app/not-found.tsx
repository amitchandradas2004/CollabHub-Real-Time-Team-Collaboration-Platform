"use client";

import React from "react";
import { motion } from "framer-motion";
import { Home, LogIn, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[300px] bg-indigo-500/15 dark:bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute bottom-6 right-6 w-[200px] sm:w-[300px] h-[200px] bg-purple-500/10 dark:bg-purple-600/15 blur-[90px] rounded-full pointer-events-none -z-10" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 dark:opacity-40 -z-10 pointer-events-none" />

      <div className="max-w-xl w-full mx-auto text-center flex flex-col items-center justify-center">
        {/* Animated 404 Icon & Number Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-3 sm:mb-4 flex items-center justify-center"
        >
          {/* Floating Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-2 border-dashed border-indigo-400/40 dark:border-indigo-500/30 flex items-center justify-center"
          />

          {/* Center Glass Card with 404 Badge */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 m-auto w-18 h-18 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-2xl sm:rounded-3xl glass-panel bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center p-2 sm:p-3"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-0.5">
              <Compass className="w-4 h-4 sm:w-4.5 sm:h-4.5 animate-pulse" />
            </div>
            <span className="font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
              404
            </span>
          </motion.div>
        </motion.div>

        {/* Content Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
          className="space-y-2 max-w-lg mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
            Lost in Space
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Page Not <span className="gradient-text">Found</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            The page you are looking for might have been removed, renamed, or is temporarily unavailable. Let&apos;s get you back on track!
          </p>
        </motion.div>

        {/* Action Buttons: Back to Home & Login */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22, ease: "easeOut" }}
          className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full sm:w-auto"
        >
          <Button
            href="/"
            variant="primary"
            size="md"
            className="w-[75%] max-w-[240px] sm:w-auto py-2 sm:py-2.5 px-5 text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/20"
            leftIcon={<Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          >
            Back to Home
          </Button>

          <Button
            href="/login"
            variant="outline"
            size="md"
            className="w-[75%] max-w-[240px] sm:w-auto py-2 sm:py-2.5 px-5 text-xs sm:text-sm font-semibold"
            leftIcon={<LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />}
          >
            Login
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
