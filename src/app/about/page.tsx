"use client";

import React from "react";
import Link from "next/link";
import { Layers, ShieldCheck, Zap, Code2, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export default function AboutPage() {
  const values = [
    {
      title: "Real-Time First Architecture",
      desc: "Built around Socket.io WebSockets to eliminate refresh delays and deliver instant collaborative feedback.",
      icon: <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      title: "Developer-Centric APIS",
      desc: "Providing both REST and GraphQL interfaces for flexible resource queries and third-party integrations.",
      icon: <Code2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    },
    {
      title: "Zero-Trust Security",
      desc: "Protecting data integrity through JWT verification, bcrypt password hashing, and strict RBAC controls.",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    },
  ];

  return (
    <div className="py-12 lg:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <SectionHeading
        badge="About CollabHub"
        title="Empowering modern teams to build"
        highlightedTitle="without friction."
        description="CollabHub was created to unify project planning, task management, and real-time team communication into a single, high-performance workspace."
      />

      {/* Hero Visual Card */}
      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-xl max-w-[1440px] mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Core Mission</h2>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Modern product teams often suffer from fragmented communication—switching between chat apps, task managers, and notification feeds. CollabHub solves this by providing a unified environment powered by React, Node.js, Express, MongoDB, and Socket.io.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
          <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
            <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">99.9%</div>
            <div className="text-xs text-slate-500">Socket Uptime</div>
          </div>
          <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
            <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">&lt;30ms</div>
            <div className="text-xs text-slate-500">API Response Time</div>
          </div>
          <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">256-bit</div>
            <div className="text-xs text-slate-500">JWT Encryption</div>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1440px] mx-auto">
        {values.map((val, idx) => (
          <div key={idx} className="glass-panel rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-3 hover-glow">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50">
              {val.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{val.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{val.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="text-center pt-8">
        <Button href="/register" variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
          Start Using CollabHub
        </Button>
      </div>
    </div>
  );
}
