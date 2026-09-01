"use client";

import React, { useState } from "react";
import { 
  Layers, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  MessageSquare, 
  Bell, 
  Search, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  Radio,
  Send
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";

export function ProductPreviewSection() {
  const [activeTab, setActiveTab] = useState<"projects" | "tasks" | "activity">("projects");

  return (
    <section className="py-16 lg:py-24 bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-slate-800 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Product Workspace Teaser"
          title="Designed for high-output teams"
          highlightedTitle="every single day."
          description="Experience a seamless dashboard environment unifying task assignment, real-time messaging, project tracking, and automated updates."
          className="mb-12"
        />

        {/* Full SaaS Dashboard Mockup Frame */}
        <div className="glass-panel rounded-2xl p-3 sm:p-6 shadow-2xl shadow-slate-900/10 dark:shadow-indigo-950/20 max-w-[1440px] mx-auto border border-slate-200/80 dark:border-slate-800">
          {/* Mock Topbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">CollabHub Workspace</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Engineering & Product Org</p>
                </div>
              </div>
              <Badge variant="success" size="sm" icon={<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}>
                Socket Live
              </Badge>
            </div>

            {/* Topbar Search & Notification */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="relative hidden md:block">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  readOnly
                  placeholder="Search projects, tasks, members..."
                  className="pl-8 pr-4 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 w-64 focus:outline-none"
                />
              </div>

              <div className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600 cursor-pointer">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600" />
              </div>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center">
                  AC
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 hidden sm:inline">
                  Amit Chandra
                </span>
              </div>
            </div>
          </div>

          {/* Main Dashboard Layout Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar Navigation */}
            <div className="col-span-12 lg:col-span-3 space-y-4">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("projects")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    activeTab === "projects"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <FolderKanban className="w-4 h-4" /> Projects Overview
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/20">4</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("tasks")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    activeTab === "tasks"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <CheckSquare className="w-4 h-4" /> My Tasks
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    12
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("activity")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    activeTab === "activity"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4" /> Team Live Stream
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </button>
              </div>

              {/* Active Teammates Mini List */}
              <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-500" /> Team Online
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">5 active</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Rahim Ahmed</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Frontend</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Sarah Jenkins</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Lead Tech</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Michael Chen</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Away</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Content Display */}
            <div className="col-span-12 lg:col-span-9 space-y-6">
              {/* Task Statistics Summary Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Projects</span>
                  <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>8 Active</span>
                    <FolderKanban className="w-4 h-4 text-indigo-500" />
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Completed Tasks</span>
                  <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>142</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Socket Velocity</span>
                  <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>99.4%</span>
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">API Response</span>
                  <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>24ms</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                </div>
              </div>

              {/* Dynamic View Tab Panel */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 overflow-x-auto">
                {activeTab === "projects" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active Projects & Sprint Milestones</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Current progress tracked across active teams</p>
                      </div>
                      <Badge variant="primary" size="sm">Q3 Release Cycle</Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center">AUTH</div>
                          <div>
                            <h5 className="text-xs font-semibold text-slate-900 dark:text-white">JWT & bcrypt Auth Security Engine</h5>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Backend token verification & role authorization</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs justify-between sm:justify-end">
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">92%</span>
                            <div className="w-24 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-0.5">
                              <div className="h-full bg-indigo-600 rounded-full w-[92%]" />
                            </div>
                          </div>
                          <Badge variant="success" size="sm">In Review</Badge>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center justify-center">CHAT</div>
                          <div>
                            <h5 className="text-xs font-semibold text-slate-900 dark:text-white">Socket.io Channel Broadcasts</h5>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Real-time room events and instant notifications</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs justify-between sm:justify-end">
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">78%</span>
                            <div className="w-24 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-0.5">
                              <div className="h-full bg-purple-600 rounded-full w-[78%]" />
                            </div>
                          </div>
                          <Badge variant="warning" size="sm">In Progress</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "tasks" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Assigned Sprint Tasks</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Personal queue for current iteration</p>
                      </div>
                      <Badge variant="warning" size="sm">12 Tasks Open</Badge>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                          <span className="font-semibold text-slate-900 dark:text-white">Refactor Auth Middleware for JWT Bearer Tokens</span>
                        </div>
                        <Badge variant="danger" size="sm">High</Badge>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="font-semibold text-slate-900 dark:text-white">Write GraphQL Mutations for Task Status Updates</span>
                        </div>
                        <Badge variant="warning" size="sm">Medium</Badge>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "activity" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Socket Live Event Stream</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Broadcast events received in real time</p>
                      </div>
                      <Badge variant="success" size="sm" icon={<Radio className="w-3 h-3 text-emerald-500 fill-emerald-500" />}>Live</Badge>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300">
                          <strong>Rahim Ahmed</strong> pushed code to <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-[11px]">feature/socket-rooms</code>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">1m ago</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300">
                          <strong>Amit Chandra</strong> assigned task <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-[11px]">CH-104</code> to Sarah Jenkins
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">5m ago</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
