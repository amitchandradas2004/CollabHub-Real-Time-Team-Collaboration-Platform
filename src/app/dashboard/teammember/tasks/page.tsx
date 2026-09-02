"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Trash2, User as UserIcon } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { TasksGridSkeleton } from "@/components/ui/Skeleton";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { Select } from "@/components/ui/Select";

interface Task {
  _id: string;
  title: string;
  description: string;
  project?: { _id: string; name: string };
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  assignedTo?: { _id: string; name: string; email: string };
  dueDate?: string;
  createdAt: string;
}

export default function TeamMemberTasksPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const currentUserId = (session?.user as any)?._id || session?.user?.id;
  const currentUserRole = (session?.user as any)?.role || "teamMember";

  useEffect(() => {
    async function fetchTasks() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const res = await fetch(`${backendUrl}/api/tasks`, {
          headers: {
            "x-user-id": currentUserId || "",
            "x-user-role": currentUserRole,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setTasks(data.data || []);
        }
      } catch (err) {
        console.error("Tasks fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [currentUserId, currentUserRole]);

  // Quick Status Update
  const handleStatusChange = async (taskId: string, newStatus: "To Do" | "In Progress" | "Completed") => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUserId || "",
          "x-user-role": currentUserRole,
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

  const [deleteTargetTask, setDeleteTargetTask] = useState<Task | null>(null);
  const [isDeletingTask, setIsDeletingTask] = useState(false);

  const handleConfirmDeleteTask = async () => {
    if (!deleteTargetTask) return;
    setIsDeletingTask(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/tasks/${deleteTargetTask._id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": currentUserId || "",
          "x-user-role": currentUserRole,
        },
      });

      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t._id !== deleteTargetTask._id));
        setDeleteTargetTask(null);
      }
    } catch (err) {
      console.error("Delete task error:", err);
    } finally {
      setIsDeletingTask(false);
    }
  };

  const filteredTasks =
    filterStatus === "All"
      ? tasks
      : tasks.filter((t) => t.status === filterStatus);

  return (
    <DashboardLayout allowedRoles={["teamMember", "admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <CheckSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" /> My Tasks
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              View and manage tasks assigned to you or belonging to your workspace projects.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shrink-0">
            {["All", "To Do", "In Progress", "Completed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterStatus === status
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <TasksGridSkeleton />
        ) : filteredTasks.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center space-y-3 border border-slate-200/80 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-900/50 flex items-center justify-center text-purple-500 mx-auto">
              <CheckSquare className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">No Tasks Found</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No tasks match the selected filter criterion (&quot;{filterStatus}&quot;).
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3.5 hover-glow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug truncate">
                      {task.title}
                    </h3>
                    {task.project?.name && (
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block">
                        Project: {task.project.name}
                      </span>
                    )}
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
                  {task.description || "No task description provided."}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <UserIcon className="w-3.5 h-3.5 text-indigo-500" />
                    {task.assignedTo?.name || "Unassigned"}
                  </span>

                  <div className="flex items-center gap-2">
                    <div className="w-32">
                      <Select
                        size="sm"
                        value={task.status}
                        onChange={(val) => handleStatusChange(task._id, val as any)}
                        options={[
                          { value: "To Do", label: "To Do" },
                          { value: "In Progress", label: "In Progress" },
                          { value: "Completed", label: "Completed" },
                        ]}
                      />
                    </div>

                    <button
                      onClick={() => setDeleteTargetTask(task)}
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

      <DeleteModal
        isOpen={!!deleteTargetTask}
        onClose={() => setDeleteTargetTask(null)}
        onConfirm={handleConfirmDeleteTask}
        title="Delete Assigned Task"
        itemType="task"
        itemName={deleteTargetTask?.title}
        loading={isDeletingTask}
      />
    </DashboardLayout>
  );
}
