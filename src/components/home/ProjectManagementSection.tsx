"use client";

import React from "react";
import { CheckSquare, Clock, AlertCircle, Plus, MoreHorizontal } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";

export function ProjectManagementSection() {
  const kanbanColumns = [
    {
      title: "To Do",
      count: 3,
      badgeColor: "neutral" as const,
      cards: [
        {
          id: "CH-101",
          title: "Database Setup",
          desc: "Configure MongoDB Atlas schemas & index patterns",
          priority: "High",
          priorityVariant: "danger" as const,
          progress: 15,
          assignee: "AC",
        },
        {
          id: "CH-102",
          title: "GraphQL Schema Mutations",
          desc: "Write mutations for task status updates",
          priority: "Medium",
          priorityVariant: "warning" as const,
          progress: 0,
          assignee: "RA",
        },
      ],
    },
    {
      title: "In Progress",
      count: 4,
      badgeColor: "primary" as const,
      cards: [
        {
          id: "CH-103",
          title: "Dashboard UI",
          desc: "Build responsive Kanban components & layout",
          priority: "High",
          priorityVariant: "danger" as const,
          progress: 75,
          assignee: "AC",
        },
        {
          id: "CH-104",
          title: "API Integration",
          desc: "Connect frontend controllers to REST endpoints",
          priority: "Medium",
          priorityVariant: "warning" as const,
          progress: 50,
          assignee: "SJ",
        },
      ],
    },
    {
      title: "Completed",
      count: 8,
      badgeColor: "success" as const,
      cards: [
        {
          id: "CH-100",
          title: "Authentication",
          desc: "JWT Auth strategy and bcrypt password hashing",
          priority: "High",
          priorityVariant: "success" as const,
          progress: 100,
          assignee: "AC",
        },
      ],
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-slate-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Kanban Workflows"
          title="Intuitive task tracking for"
          highlightedTitle="every sprint."
          description="Organize work into structured boards, set task priorities, monitor real-time completion progress, and meet deadlines with clarity."
          className="mb-16"
        />

        {/* Kanban Board Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1440px] mx-auto">
          {kanbanColumns.map((col) => (
            <div
              key={col.title}
              className="glass-panel rounded-2xl p-4 space-y-4 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{col.title}</h3>
                  <Badge variant={col.badgeColor} size="sm">
                    {col.count}
                  </Badge>
                </div>
                <button type="button" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Task Cards List */}
              <div className="space-y-3 flex-1">
                {col.cards.map((card) => (
                  <div
                    key={card.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover-glow cursor-pointer transition-all space-y-3 group"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-slate-400 font-medium">{card.id}</span>
                      <Badge variant={card.priorityVariant} size="sm">
                        {card.priority} Priority
                      </Badge>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {card.desc}
                      </p>
                    </div>

                    {/* Progress indicator bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Completion</span>
                        <span className="font-mono">{card.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            card.progress === 100
                              ? "bg-emerald-500"
                              : card.progress > 50
                              ? "bg-indigo-600"
                              : "bg-amber-500"
                          }`}
                          style={{ width: `${card.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 2 days left
                      </span>
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">
                        {card.assignee}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
