"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FolderKanban,
  CheckSquare,
  Clock,
  CheckCircle2,
  ArrowRight,
  Bell,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AdminOverviewSkeleton } from "@/components/ui/Skeleton";

interface ProjectItem {
  _id: string;
  name: string;
  description: string;
  members: any[];
  taskCount?: number;
  progress?: number;
}

interface TaskItem {
  _id: string;
  title: string;
  project?: { name: string };
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  assignedTo?: { name: string };
  dueDate?: string;
}

interface NotificationItem {
  _id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function TeamMemberDashboardPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const headers = {
          "x-user-id": (session?.user as any)?._id || session?.user?.id || "",
          "x-user-email": session?.user?.email || "",
          "x-user-role": (session?.user as any)?.role || "teamMember",
        };

        const [resProjects, resTasks, resNotifs] = await Promise.all([
          fetch(`${backendUrl}/api/projects`, { headers }),
          fetch(`${backendUrl}/api/tasks`, { headers }),
          fetch(`${backendUrl}/api/notifications`, { headers }),
        ]);

        if (resProjects.ok) {
          const data = await resProjects.json();
          setProjects(data.data || []);
        }

        if (resTasks.ok) {
          const data = await resTasks.json();
          setTasks(data.data || []);
        }

        if (resNotifs.ok) {
          const data = await resNotifs.json();
          setNotifications(data.data || []);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [session]);

  const userName = session?.user?.name || "Team Member";

  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;

  return (
    <DashboardLayout allowedRoles={["teamMember", "admin"]}>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl relative overflow-hidden bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-indigo-800/10"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Workspace Dashboard
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Here is an overview of your active projects, tasks, and recent notifications.
              </p>
            </div>
            <Button href="/dashboard/teammember/projects" variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View Projects
            </Button>
          </div>
        </motion.div>

        {/* 4 Simple Statistic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Projects</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <FolderKanban className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalProjects}</p>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tasks</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <CheckSquare className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalTasks}</p>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Tasks</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{completedTasks}</p>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{inProgressTasks}</p>
          </div>
        </div>

        {loading ? (
          <AdminOverviewSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Projects */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-indigo-500" /> Recent Projects
                  </h2>
                  <Link href="/dashboard/teammember/projects" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    View All
                  </Link>
                </div>

                {projects.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No active projects assigned yet.</p>
                ) : (
                  <div className="space-y-3">
                    {projects.slice(0, 4).map((proj) => (
                      <div
                        key={proj._id}
                        className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{proj.name}</h3>
                          <p className="text-xs text-slate-500 line-clamp-1">{proj.description || "No description provided."}</p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                            <span>Members: {proj.members?.length || 0}</span>
                            <span>•</span>
                            <span>Tasks: {proj.taskCount || 0}</span>
                          </div>
                        </div>
                        <Button href={`/dashboard/teammember/projects/${proj._id}`} variant="outline" size="sm" className="shrink-0 text-xs">
                          View Project
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Tasks */}
              <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-purple-500" /> Recent Tasks
                  </h2>
                  <Link href="/dashboard/teammember/tasks" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    View All
                  </Link>
                </div>

                {tasks.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No tasks assigned yet.</p>
                ) : (
                  <div className="space-y-3">
                    {tasks.slice(0, 4).map((task) => (
                      <div
                        key={task._id}
                        className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 space-y-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{task.title}</p>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            {task.project?.name && <span className="text-indigo-500 font-semibold">{task.project.name}</span>}
                            {task.assignedTo?.name && (
                              <span className="flex items-center gap-1">
                                <UserIcon className="w-3 h-3" /> {task.assignedTo.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge
                            variant={
                              task.status === "Completed"
                                ? "success"
                                : task.status === "In Progress"
                                  ? "warning"
                                  : "neutral"
                            }
                            size="sm"
                          >
                            {task.status}
                          </Badge>
                          <Badge
                            variant={
                              task.priority === "High"
                                ? "danger"
                                : task.priority === "Medium"
                                  ? "primary"
                                  : "neutral"
                            }
                            size="sm"
                          >
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Notifications Preview */}
            <div className="space-y-6">
              <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-500" /> Notifications
                  </h2>
                  <Link href="/dashboard/teammember/notifications" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    All Notifications
                  </Link>
                </div>

                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No recent notifications.</p>
                ) : (
                  <div className="space-y-3">
                    {notifications.slice(0, 5).map((notif) => (
                      <div
                        key={notif._id}
                        className={`p-3 rounded-2xl border text-xs space-y-1 ${notif.read
                            ? "bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 text-slate-600 dark:text-slate-400"
                            : "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200/80 dark:border-indigo-900/50 font-medium text-slate-900 dark:text-white"
                          }`}
                      >
                        <p>{notif.message}</p>
                        <span className="text-[10px] text-slate-400 block">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
