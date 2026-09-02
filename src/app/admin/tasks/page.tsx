"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Filter, Trash2, Edit3, User as UserIcon } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface ProjectItem {
  _id: string;
  name: string;
}

interface TaskItem {
  _id: string;
  title: string;
  description: string;
  project?: ProjectItem;
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  assignedTo?: { name: string; email: string };
  dueDate?: string;
  createdAt: string;
}

export default function AdminTasksPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterProject, setFilterProject] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterPriority, setFilterPriority] = useState<string>("All");

  const currentUserId = (session?.user as any)?._id || session?.user?.id;

  useEffect(() => {
    async function fetchData() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const headers = {
          "x-user-id": currentUserId || "",
          "x-user-role": "admin",
        };

        const [resTasks, resProj] = await Promise.all([
          fetch(`${backendUrl}/api/tasks`, { headers }),
          fetch(`${backendUrl}/api/projects`, { headers }),
        ]);

        if (resTasks.ok) {
          const data = await resTasks.json();
          setTasks(data.data || []);
        }

        if (resProj.ok) {
          const data = await resProj.json();
          setProjects(data.data || []);
        }
      } catch (err) {
        console.error("Admin tasks fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentUserId]);

  // Handle Quick Status Change
  const handleStatusChange = async (taskId: string, newStatus: "To Do" | "In Progress" | "Completed") => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUserId || "",
          "x-user-role": "admin",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete task "${title}"?`)) return;

    try {
      const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": currentUserId || "",
          "x-user-role": "admin",
        },
      });

      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
      }
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  // Apply Filters
  const filteredTasks = tasks.filter((task) => {
    if (filterProject !== "All" && task.project?._id !== filterProject) return false;
    if (filterStatus !== "All" && task.status !== filterStatus) return false;
    if (filterPriority !== "All" && task.priority !== filterPriority) return false;
    return true;
  });

  return (
    <DashboardLayout allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <CheckSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" /> Admin Tasks Oversight
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Global overview of all tasks across workspace projects with status & priority controls.
            </p>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-500" /> Filters:
          </span>

          {/* Project Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Project:</span>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
            >
              <option value="All">All Projects</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center space-y-3 border border-slate-200/80 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-900/50 flex items-center justify-center text-purple-500 mx-auto">
              <CheckSquare className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">No Tasks Match Filters</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try resetting filters to view all workspace tasks.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3 hover-glow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {task.title}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                      {task.project?.name || "Global Project"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
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

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {task.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <UserIcon className="w-3.5 h-3.5 text-indigo-500" />
                    {task.assignedTo?.name || "Unassigned"}
                  </span>

                  <div className="flex items-center gap-2">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value as any)}
                      className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 focus:outline-none"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      onClick={() => handleDeleteTask(task._id, task.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
