"use client";

import React from "react";
import { UserPlus, Layout, Zap, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Create Your Account",
      description: "Create a secure CollabHub account with instant JWT credentials and access your personal organization dashboard.",
      icon: <UserPlus className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      step: "02",
      title: "Build Your Workspace",
      description: "Create projects, invite team members, assign priority tasks, and set up your sprint boards in minutes.",
      icon: <Layout className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
    },
    {
      step: "03",
      title: "Collaborate in Real Time",
      description: "Communicate via Socket.io chat, track status updates live, receive smart notifications, and deliver faster.",
      icon: <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-slate-800 relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Simple Onboarding"
          title="Get started in three"
          highlightedTitle="effortless steps."
          description="Transform the way your engineering and product teams organize projects and collaborate in real time."
          className="mb-16"
        />

        {/* 3 Step Timeline Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 bg-indigo-500/30 -translate-y-12 -z-10" />

          {steps.map((item, index) => (
            <div
              key={item.step}
              className="glass-panel rounded-2xl p-8 hover-glow transition-all duration-300 relative group flex flex-col items-center text-center space-y-4 border border-slate-200/80 dark:border-slate-800"
            >
              {/* Step Number Tag */}
              <div className="absolute -top-4 px-3 py-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold font-mono shadow-md">
                STEP {item.step}
              </div>

              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-lg shadow-indigo-500/5 group-hover:scale-110 transition-transform duration-300 mt-2">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {item.title}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
