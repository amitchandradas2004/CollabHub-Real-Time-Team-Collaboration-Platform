"use client";

import React from "react";
import { Server, Database, ArrowDown, Code2, Layers, Cpu } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";

export function ApiArchitectureSection() {
  return (
    <section className="py-16 lg:py-24 bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-slate-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Developer First APIs"
          title="Dual REST & GraphQL"
          highlightedTitle="API Engine."
          description="Build, extend, and integrate custom microservices or mobile apps using familiar REST routes or precise GraphQL schemas."
          className="mb-16"
        />

        {/* REST & GraphQL Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1440px] mx-auto mb-16">
          {/* REST Card */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-4 hover-glow">
            <div className="flex items-center justify-between">
              <Badge variant="primary" size="md">
                RESTful Endpoints
              </Badge>
              <span className="font-mono text-xs text-slate-400">JSON Payload</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">REST API</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Simple, predictable, and familiar endpoints for application resources like projects, tasks, comments, and user profiles.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
              <code>GET /api/projects/:id/tasks</code>
            </div>
          </div>

          {/* GraphQL Card */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-4 hover-glow">
            <div className="flex items-center justify-between">
              <Badge variant="success" size="md">
                GraphQL Schema
              </Badge>
              <span className="font-mono text-xs text-slate-400">Typed Queries</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">GraphQL API</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Flexible queries and mutations for efficient data access without over-fetching or multiple round-trip requests.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
              <code>query {'{ project(id: "1") { tasks { title } } }'}</code>
            </div>
          </div>
        </div>

        {/* Visual Architecture Flow Diagram */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 max-w-[1440px] mx-auto border border-slate-200/80 dark:border-slate-800 space-y-6 text-center">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Full-Stack Technology Pipeline Flow
          </h4>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-semibold">
            {/* Frontend */}
            <div className="px-5 py-3 rounded-xl bg-indigo-600 text-white shadow-md flex items-center gap-2 w-full sm:w-auto justify-center">
              <Layers className="w-4 h-4" /> Next.js & React Frontend
            </div>

            <ArrowDown className="w-5 h-5 text-slate-400 sm:-rotate-90 shrink-0" />

            {/* API Layer */}
            <div className="px-5 py-3 rounded-xl bg-purple-600 text-white shadow-md flex items-center gap-2 w-full sm:w-auto justify-center">
              <Code2 className="w-4 h-4" /> REST / GraphQL Layer
            </div>

            <ArrowDown className="w-5 h-5 text-slate-400 sm:-rotate-90 shrink-0" />

            {/* Express Server */}
            <div className="px-5 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md flex items-center gap-2 w-full sm:w-auto justify-center">
              <Server className="w-4 h-4" /> Express + Node.js
            </div>

            <ArrowDown className="w-5 h-5 text-slate-400 sm:-rotate-90 shrink-0" />

            {/* MongoDB */}
            <div className="px-5 py-3 rounded-xl bg-emerald-600 text-white shadow-md flex items-center gap-2 w-full sm:w-auto justify-center">
              <Database className="w-4 h-4" /> MongoDB Database
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
