"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Activity,
  Layers,
  CheckSquare,
  LayoutDashboard,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSession } from "@/lib/auth-client";

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden pt-16 sm:pt-2 md:pt-4 lg:pt-6 pb-10 md:pb-12 lg:pb-16 min-h-0 lg:min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
      {/* Background Decor Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/15 dark:bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-purple-500/10 dark:bg-purple-600/15 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 dark:opacity-40 -z-10 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center space-y-5 md:space-y-6 max-w-4xl lg:max-w-[1440px] mx-auto w-full"
        >
          {/* Main Headline (2 lines on medium & large devices) */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] max-w-4xl lg:max-w-[1440px] mx-auto">
            <span className="inline-block">Collaborate. Communicate.</span>{" "}
            <br className="hidden sm:inline" />
            <span className="gradient-text inline-block">Get Things Done.</span>
          </h1>

          {/* Supporting text */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl md:max-w-3xl mx-auto">
            A modern workspace for teams to manage projects, track tasks, and collaborate in real time with effortless synchronization.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2 w-full sm:w-auto">
            {!mounted || isPending ? (
              /* Skeleton Loading State for CTA Button */
              <div className="w-[75%] max-w-[240px] sm:w-52 h-9 sm:h-11 rounded-full bg-slate-200/80 dark:bg-slate-800/80 animate-pulse border border-slate-300/40 dark:border-slate-700/40" />
            ) : session?.user ? (
              /* Authenticated Logged In CTA */
              <Button
                href={(session.user as any)?.role === "admin" ? "/dashboard/admin" : "/dashboard/teammember"}
                variant="primary"
                size="md"
                className="w-[75%] max-w-[240px] sm:w-auto py-2 sm:py-2.5 text-xs sm:text-sm"
                rightIcon={<LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              >
                {(session.user as any)?.role === "admin" ? "Continue to Admin Console" : "Continue to Dashboard"}
              </Button>
            ) : (
              /* Guest Logged Out CTA */
              <Button
                href="/register"
                variant="primary"
                size="md"
                className="w-[75%] max-w-[240px] sm:w-auto py-2 sm:py-2.5 text-xs sm:text-sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              >
                Get Started
              </Button>
            )}

            <Button
              href="/features"
              variant="outline"
              size="md"
              className="w-[75%] max-w-[240px] sm:w-auto py-2 sm:py-2.5 text-xs sm:text-sm"
              leftIcon={<Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />}
            >
              Explore Features
            </Button>
          </div>

          {/* Feature Highlights Pill Bar */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Socket.io Real-time Sync
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> JWT Security & RBAC
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> REST & GraphQL APIs
            </span>
          </div>
        </motion.div>

        {/* Hero Visual SaaS Dashboard Snippet */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-8 md:mt-10 lg:mt-14 relative mx-auto max-w-[1440px] w-full"
        >
          <div className="relative rounded-2xl glass-panel p-2.5 sm:p-4 shadow-2xl shadow-indigo-900/10 dark:shadow-indigo-950/40 hover-glow">
            {/* Window Bar Header */}
            <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-200/60 dark:border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] text-slate-400">app.collabhub.io/dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Connected
                </span>
              </div>
            </div>

            {/* Dashboard Content Teaser Grid */}
            <div className="grid grid-cols-12 gap-3 pt-3">
              {/* Mini Sidebar (visible on md screens & up) */}
              <div className="hidden md:block col-span-3 glass-panel rounded-xl p-3 space-y-3 text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                  <Layers className="w-4 h-4 text-indigo-600" /> Project Workspace
                </div>
                <div className="space-y-1">
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium">
                    ⚡ Authentication Refactor
                  </div>
                  <div className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400">
                    📊 Analytics Dashboard
                  </div>
                  <div className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400">
                    💬 Realtime Chat Engine
                  </div>
                </div>
              </div>

              {/* Main Preview Cards Area */}
              <div className="col-span-12 md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Task Progress Stat */}
                <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-indigo-500" /> Sprint Progress
                    </span>
                    <span className="text-indigo-600 font-bold">84%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full w-[84%]" />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                    <span>21 Tasks Completed</span>
                    <span>4 Pending</span>
                  </div>
                </div>

                {/* Team Members Online Stat */}
                <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-500" /> Active Teammates
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">6 Online</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex -space-x-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white dark:ring-slate-900">A</div>
                      <div className="w-7 h-7 rounded-full bg-purple-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white dark:ring-slate-900">R</div>
                      <div className="w-7 h-7 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white dark:ring-slate-900">S</div>
                      <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white dark:ring-slate-900">M</div>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">+2 collaborating</span>
                  </div>
                </div>

                {/* Activity Feed Feed */}
                <div className="col-span-1 sm:col-span-2 p-3.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-500 font-medium border-b border-slate-100 dark:border-slate-800 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-purple-500" /> Recent Activity
                    </span>
                    <span className="text-[10px] text-slate-400">Just now</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <strong>Amit</strong> completed <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">auth-module.tsx</code>
                      </span>
                      <span className="text-[10px] text-slate-400">2m ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
