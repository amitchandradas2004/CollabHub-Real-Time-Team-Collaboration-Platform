"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Filter, Trash2, Edit3, Plus, User as UserIcon, X, Calendar } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TasksGridSkeleton } from "@/components/ui/Skeleton";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { Select } from "@/components/ui/Select";

interface ProjectItem {
  _id: string;
  name: string;
}

interface UserItem {
  _id: string;
  name: string;
  email: string;
}

interface TaskItem {
  _id: string;
  title: string;
  description: string;
  project?: ProjectItem;
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  assignedTo?: UserItem;
  dueDate?: string;
  createdAt: string;
}

export default function AdminTasksPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterProject, setFilterProject] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterPriority, setFilterPriority] = useState<string>("All");

  // Modal State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskProject, setTaskProject] = useState("");
  const [taskStatus, setTaskStatus] = useState<"To Do" | "In Progress" | "Completed">("To Do");
  const [taskPriority, setTaskPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [modalTaskError, setModalTaskError] = useState("");

  const currentUserId = (session?.user as any)?._id || session?.user?.id;

  useEffect(() => {
    async function fetchData() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const headers = {
          "x-user-id": currentUserId || "",
          "x-user-role": "admin",
        };

        const [resTasks, resProj, resUsers] = await Promise.all([
          fetch(`${backendUrl}/api/tasks`, { headers }),
          fetch(`${backendUrl}/api/projects`, { headers }),
          fetch(`${backendUrl}/api/users`, { headers }),
        ]);

        if (resTasks.ok) {
          const data = await resTasks.json();
          setTasks(data.data || []);
        }

        if (resProj.ok) {
          const data = await resProj.json();
          setProjects(data.data || []);
        }

        if (resUsers.ok) {
          const data = await resUsers.json();
          setUsers(data.data || []);
        }
      } catch (err) {
        console.error("Admin tasks fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentUserId]);

  const handleOpenModal = (task?: TaskItem) => {
    setModalTaskError("");
    if (task) {
      setEditingTask(task);
      setTaskTitle(task.title);
      setTaskDesc(task.description || "");
      setTaskProject(task.project?._id || "");
      setTaskStatus(task.status);
      setTaskPriority(task.priority);
      setTaskAssignee(task.assignedTo?._id || "");
      setTaskDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
    } else {
      setEditingTask(null);
      setTaskTitle("");
      setTaskDesc("");
      setTaskProject(projects[0]?._id || "");
      setTaskStatus("To Do");
      setTaskPriority("Medium");
      setTaskAssignee("");
      setTaskDueDate("");
    }
    setShowTaskModal(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalTaskError("");

    if (!taskTitle.trim()) {
      setModalTaskError("Task title is required.");
      return;
    }

    if (!taskProject) {
      setModalTaskError("Please select a project for this task.");
      return;
    }

    setIsSavingTask(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const effectiveUserId = currentUserId || users[0]?._id || "6a96b94f05202ba99d33458e";
      const headers = {
        "Content-Type": "application/json",
        "x-user-id": effectiveUserId,
        "x-user-role": "admin",
      };

      const payload = {
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        project: taskProject,
        status: taskStatus,
        priority: taskPriority,
        assignedTo: taskAssignee || undefined,
        dueDate: taskDueDate || undefined,
      };

      if (editingTask) {
        const res = await fetch(`${backendUrl}/api/tasks/${editingTask._id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setTasks((prev) =>
            prev.map((t) => (t._id === editingTask._id ? data.data : t))
          );
          setShowTaskModal(false);
        } else {
          setModalTaskError(data.message || "Failed to update task.");
        }
      } else {
        const res = await fetch(`${backendUrl}/api/tasks`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setTasks((prev) => [data.data, ...prev]);
          setShowTaskModal(false);
        } else {
          setModalTaskError(data.message || "Failed to create task.");
        }
      }
    } catch (err) {
      console.error("Save task error:", err);
      setModalTaskError("Network error when saving task.");
    } finally {
      setIsSavingTask(false);
    }
  };

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

  const [deleteTargetTask, setDeleteTargetTask] = useState<TaskItem | null>(null);
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
          "x-user-role": "admin",
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

          <Button onClick={() => handleOpenModal()} variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Create New Task
          </Button>
        </div>

        {/* Filter Controls Row */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-500" /> Filters:
          </span>

          <div className="flex items-center gap-1.5 min-w-[170px]">
            <span className="text-slate-400 font-semibold shrink-0">Project:</span>
            <Select
              size="sm"
              value={filterProject}
              onChange={setFilterProject}
              options={[
                { value: "All", label: "All Projects" },
                ...projects.map((p) => ({ value: p._id, label: p.name })),
              ]}
            />
          </div>

          <div className="flex items-center gap-1.5 min-w-[150px]">
            <span className="text-slate-400 font-semibold shrink-0">Status:</span>
            <Select
              size="sm"
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { value: "All", label: "All Statuses" },
                { value: "To Do", label: "To Do" },
                { value: "In Progress", label: "In Progress" },
                { value: "Completed", label: "Completed" },
              ]}
            />
          </div>

          <div className="flex items-center gap-1.5 min-w-[150px]">
            <span className="text-slate-400 font-semibold shrink-0">Priority:</span>
            <Select
              size="sm"
              value={filterPriority}
              onChange={setFilterPriority}
              options={[
                { value: "All", label: "All Priorities" },
                { value: "Low", label: "Low" },
                { value: "Medium", label: "Medium" },
                { value: "High", label: "High" },
              ]}
            />
          </div>
        </div>

        {loading ? (
          <TasksGridSkeleton />
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
                className="glass-panel rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3 hover-glow flex flex-col justify-between"
              >
                <div className="space-y-2">
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
                </div>

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
                      onClick={() => handleOpenModal(task)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Task"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

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
        title="Delete Workspace Task"
        itemType="task"
        itemName={deleteTargetTask?.title}
        loading={isDeletingTask}
      />

      {/* CREATE / EDIT TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-panel max-w-lg w-full rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 bg-white dark:bg-slate-900 max-h-[90vh] overflow-y-auto relative"
          >
            <button
              onClick={() => setShowTaskModal(false)}
              type="button"
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
                <CheckSquare className="w-3 h-3" /> {editingTask ? "Edit Workspace Task" : "Create Workspace Task"}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {editingTask ? "Update Task Details" : "Create New Task"}
              </h3>
            </div>

            {modalTaskError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs font-semibold text-rose-700 dark:text-rose-300">
                {modalTaskError}
              </div>
            )}

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Implement Socket.io Chat Handler"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Project *
                </label>
                <Select
                  value={taskProject}
                  onChange={setTaskProject}
                  placeholder="Select Project..."
                  options={projects.map((p) => ({ value: p._id, label: p.name }))}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Task scope, dependencies, and requirements..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Status
                  </label>
                  <Select
                    value={taskStatus}
                    onChange={(val) => setTaskStatus(val as any)}
                    options={[
                      { value: "To Do", label: "To Do" },
                      { value: "In Progress", label: "In Progress" },
                      { value: "Completed", label: "Completed" },
                    ]}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Priority
                  </label>
                  <Select
                    value={taskPriority}
                    onChange={(val) => setTaskPriority(val as any)}
                    options={[
                      { value: "Low", label: "Low" },
                      { value: "Medium", label: "Medium" },
                      { value: "High", label: "High" },
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Assign To User
                  </label>
                  <Select
                    value={taskAssignee}
                    onChange={setTaskAssignee}
                    placeholder="Unassigned"
                    options={[
                      { value: "", label: "Unassigned" },
                      ...users.map((u) => ({ value: u._id, label: `${u.name} (${u.email})` })),
                    ]}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTaskModal(false)}
                  disabled={isSavingTask}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSavingTask}
                >
                  {isSavingTask ? "Saving Task..." : editingTask ? "Update Task" : "Create Task"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
