"use client";

import React from "react";
import { 
  FolderKanban, 
  CheckSquare, 
  Zap, 
  BellRing, 
  ShieldCheck, 
  Code2 
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerContainer, StaggerItem, FadeInUp } from "@/components/ui/MotionWrapper";

export function FeaturesSection() {
  const features = [
    {
      icon: <FolderKanban className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      bg: "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200/60 dark:border-indigo-800/40",
      title: "Project Management",
      description: "Create, structure, and organize team projects effortlessly with granular tracking and clear milestone visibility.",
    },
    {
      icon: <CheckSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      bg: "bg-purple-50 dark:bg-purple-950/60 border-purple-200/60 dark:border-purple-800/40",
      title: "Task Management",
      description: "Create, assign, prioritize, and track tasks across high-performing teams with customizable workflows.",
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      bg: "bg-amber-50 dark:bg-amber-950/60 border-amber-200/60 dark:border-amber-800/40",
      title: "Real-Time Collaboration",
      description: "Communicate instantly with your team using Socket.io real-time web-socket channels and live state sync.",
    },
    {
      icon: <BellRing className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      bg: "bg-rose-50 dark:bg-rose-950/60 border-rose-200/60 dark:border-rose-800/40",
      title: "Smart Notifications",
      description: "Receive instant updates about task assignments, comments, project status shifts, and team mentions.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      bg: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800/40",
      title: "Secure Authentication",
      description: "Protect user accounts and sensitive data with JWT authentication and bcrypt password hashing.",
    },
    {
      icon: <Code2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-50 dark:bg-blue-950/60 border-blue-200/60 dark:border-blue-800/40",
      title: "Flexible APIs",
      description: "Access and query application data seamlessly through performant REST and GraphQL API endpoints.",
    },
  ];

  return (
    <section id="features" className="py-16 lg:py-24 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <SectionHeading
            badge="Platform Architecture"
            title="Everything your team needs to"
            highlightedTitle="move faster."
            description="CollabHub unifies project management, communication, and real-time collaboration into one powerful, cohesive workspace."
            className="mb-16"
          />
        </FadeInUp>

        {/* 6 Feature Cards Grid with Stagger Animation */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => (
            <StaggerItem key={idx}>
              <div className="glass-panel rounded-2xl p-6 sm:p-8 hover-glow transition-all duration-300 group flex flex-col justify-between border border-slate-200/80 dark:border-slate-800 h-full">
                <div className="space-y-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 ${feature.bg}`}
                  >
                    {feature.icon}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore capability</span>
                  <span className="ml-1">→</span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
