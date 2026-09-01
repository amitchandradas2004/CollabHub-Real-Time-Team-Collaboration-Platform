"use client";

import React from "react";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FadeInUp } from "@/components/ui/MotionWrapper";

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="relative rounded-3xl overflow-hidden glass-panel p-8 sm:p-14 text-center border border-indigo-200/80 dark:border-indigo-500/30 shadow-xl shadow-indigo-500/10 dark:shadow-2xl dark:shadow-indigo-950/40 bg-indigo-50/70 dark:bg-slate-900/95 text-slate-900 dark:text-white">
            {/* Ambient Accent Glows */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-500/25 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 right-10 w-72 h-72 bg-indigo-600/10 dark:bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              {/* Badge Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 backdrop-blur-md text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Elevate Team Execution Today</span>
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Ready to bring your <br className="hidden sm:inline" />
                <span className="text-indigo-600 dark:text-indigo-400">team together?</span>
              </h2>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-xl mx-auto">
                Plan projects, manage tasks, and collaborate in real time from one powerful, modern workspace.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Button
                  href="/login"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Get Started
                </Button>
                <Button
                  href="/about"
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </div>

              {/* Bottom Feature Trust Highlights */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free 14-Day Team Trial
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> JWT & RBAC Protected
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" /> Instant Socket.io Setup
                </span>
              </div>
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
