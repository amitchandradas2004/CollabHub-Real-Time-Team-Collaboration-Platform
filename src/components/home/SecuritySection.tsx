"use client";

import React from "react";
import { ShieldCheck, Lock, Key, FileCode, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SecuritySection() {
  const securityFeatures = [
    {
      title: "JWT Authentication",
      desc: "Stateless JSON Web Tokens with encrypted payload exchange for authenticated sessions.",
      icon: <Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      title: "bcrypt Password Hashing",
      desc: "Industry-standard cryptographic password hashing algorithm with salt rounds protection.",
      icon: <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    },
    {
      title: "Protected Navigation Routes",
      desc: "Client & server middleware guarding private dashboards against unauthorized access.",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      title: "Role-Based Access Control (RBAC)",
      desc: "Distinct permissions separating Admin oversight from Team Member operational privileges.",
      icon: <FileCode className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Enterprise Grade Safety"
          title="Built with security"
          highlightedTitle="in mind."
          description="Protect user credentials, team messages, and sensitive project artifacts with modern cryptographic defenses."
          className="mb-16"
        />

        {/* Security Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-[1440px] mx-auto">
          {/* Security Features Left Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {securityFeatures.map((item, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3 hover-glow"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Security Card Graphic Right */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4 text-center bg-indigo-50/50 dark:bg-indigo-950/40">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-indigo-600/25">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Zero-Trust Standard</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                All requests verified via Bearer tokens & MongoDB sanitized queries.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/80 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Password Salt Rounds
                </span>
                <span className="font-mono text-[11px] text-slate-400">10 Cost Factor</span>
              </div>
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Token Expiry Window
                </span>
                <span className="font-mono text-[11px] text-slate-400">7 Days (Refreshable)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
