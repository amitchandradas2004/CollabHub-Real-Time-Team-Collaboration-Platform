"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  FolderKanban,
  CheckSquare,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AdminOverviewSkeleton } from "@/components/ui/Skeleton";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface ProjectItem {
  _id: string;
  name: string;
  owner?: { name: string };
  members: any[];
  taskCount?: number;
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [taskCount, setTaskCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentUserId = (session?.user as any)?._id || session?.user?.id;

  useEffect(() => {
    async function fetchAdminDashboard() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const headers = {
          "x-user-id": currentUserId || "",
          "x-user-role": "admin",
        };

        const [resUsers, resProj, resTasks] = await Promise.all([
          fetch(`${backendUrl}/api/users`, { headers }),
          fetch(`${backendUrl}/api/projects`, { headers }),
          fetch(`${backendUrl}/api/tasks`, { headers }),
        ]);

        if (resUsers.ok) {
          const data = await resUsers.json();
          setUsers(data.data || []);
        }

        if (resProj.ok) {
          const data = await resProj.json();
          setProjects(data.data || []);
        }

        if (resTasks.ok) {
          const data = await resTasks.json();
          setTaskCount(data.count || data.data?.length || 0);
        }
      } catch (err) {
        console.error("Admin dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminDashboard();
  }, [currentUserId]);

  return (
    <DashboardLayout allowedRoles={["admin"]}>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-blue-600/10"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Platform Admin Overview
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Admin Control Center
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Workspace management, user roles, project oversight, and system metrics.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button href="/dashboard/admin/users" variant="primary" size="sm">
                Manage Users
              </Button>
              <Button href="/dashboard/admin/projects" variant="outline" size="sm">
                Manage Projects
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Users</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{users.length}</p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Projects</span>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <FolderKanban className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{projects.length}</p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tasks</span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <CheckSquare className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{taskCount}</p>
          </div>
        </div>

        {loading ? (
          <AdminOverviewSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" /> Recent Users
                </h2>
                <Link href="/dashboard/admin/users" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                  Manage Users <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3">
                {users.slice(0, 5).map((usr) => (
                  <div
                    key={usr._id}
                    className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{usr.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{usr.email}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={usr.role === "admin" ? "primary" : "neutral"} size="sm">
                        {usr.role}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-indigo-500" /> Recent Projects
                </h2>
                <Link href="/dashboard/admin/projects" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                  Manage Projects <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3">
                {projects.slice(0, 5).map((proj) => (
                  <div
                    key={proj._id}
                    className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{proj.name}</p>
                      <p className="text-[11px] text-slate-500">
                        Owner: {proj.owner?.name || "Admin"} • Members: {proj.members?.length || 0}
                      </p>
                    </div>
                    <Badge variant="primary" size="sm">
                      {proj.taskCount || 0} Tasks
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
