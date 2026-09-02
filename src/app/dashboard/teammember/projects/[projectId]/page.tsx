"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckSquare,
  Users,
  MessageSquare,
  Plus,
  Send,
  Trash2,
  Edit3,
  User as UserIcon,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { Select } from "@/components/ui/Select";
import { getSocket } from "@/lib/socket-client";

interface Member {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  owner?: Member;
  members: Member[];
  status: string;
  taskCount?: number;
  progress?: number;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  assignedTo?: Member;
  dueDate?: string;
}

interface Message {
  _id: string;
  sender: Member;
  content: string;
  createdAt: string;
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const { data: session } = useSession();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"tasks" | "team" | "chat">("tasks");

  // Task creation/edit state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskStatus, setTaskStatus] = useState<"To Do" | "In Progress" | "Completed">("To Do");
  const [taskPriority, setTaskPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Chat message state
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = session?.user;
  const currentUserId = (currentUser as any)?._id || currentUser?.id;
  const currentUserRole = (currentUser as any)?.role || "teamMember";

  useEffect(() => {
    if (!projectId) return;

    async function fetchProjectData() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const headers = {
          "x-user-id": currentUserId || "",
          "x-user-role": currentUserRole,
        };

        const [resProj, resTasks, resMsg] = await Promise.all([
          fetch(`${backendUrl}/api/projects/${projectId}`, { headers }),
          fetch(`${backendUrl}/api/tasks/project/${projectId}`, { headers }),
          fetch(`${backendUrl}/api/messages/project/${projectId}`, { headers }),
        ]);

        if (resProj.ok) {
          const data = await resProj.json();
          setProject(data.data);
        }

        if (resTasks.ok) {
          const data = await resTasks.json();
          setTasks(data.data || []);
        }

        if (resMsg.ok) {
          const data = await resMsg.json();
          setMessages(data.data || []);
        }
      } catch (err) {
        console.error("Project details fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjectData();
  }, [projectId, currentUserId, currentUserRole]);

  // Socket.io Real-Time Chat Listener
  useEffect(() => {
    if (!projectId) return;

    const socket = getSocket();
    socket.emit("join-project", projectId);

    const handleNewMessage = (newMsg: Message) => {
      if (newMsg && String((newMsg as any).project) === projectId || newMsg?._id) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === newMsg._id)) return prev;
          return [...prev, newMsg];
        });
      }
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.emit("leave-project", projectId);
    };
  }, [projectId]);

  useEffect(() => {
    if (activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  // Handle Send Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !projectId || !currentUserId) return;

    const socket = getSocket();
    socket.emit("send-message", {
      project: projectId,
      sender: currentUserId,
      content: chatInput.trim(),
    });

    setChatInput("");
  };

  // Create or Update Task
  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !projectId) return;

    try {
      const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const headers = {
        "Content-Type": "application/json",
        "x-user-id": currentUserId || "",
        "x-user-role": currentUserRole,
      };

      if (editingTask) {
        const res = await fetch(`${backendUrl}/api/tasks/${editingTask._id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({
            title: taskTitle.trim(),
            description: taskDesc.trim(),
            status: taskStatus,
            priority: taskPriority,
            assignedTo: taskAssignee || undefined,
          }),
        });

        if (res.ok) {
          const updatedData = await res.json();
          setTasks((prev) =>
            prev.map((t) => (t._id === editingTask._id ? updatedData.data : t))
          );
        }
      } else {
        const res = await fetch(`${backendUrl}/api/tasks`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            title: taskTitle.trim(),
            description: taskDesc.trim(),
            project: projectId,
            status: taskStatus,
            priority: taskPriority,
            assignedTo: taskAssignee || undefined,
          }),
        });

        if (res.ok) {
          const newDoc = await res.json();
          setTasks((prev) => [newDoc.data, ...prev]);
        }
      }

      setShowTaskModal(false);
      setEditingTask(null);
      setTaskTitle("");
      setTaskDesc("");
    } catch (err) {
      console.error("Save task error:", err);
    }
  };

  // Quick Task Status Change
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

  if (loading) {
    return (
      <DashboardLayout allowedRoles={["teamMember", "admin"]}>
        <div className="py-20 text-center">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout allowedRoles={["teamMember", "admin"]}>
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
          <h2 className="text-xl font-bold">Project Not Found</h2>
          <Button href="/dashboard/teammember/projects" variant="primary" size="sm">
            Back to Projects
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={["teamMember", "admin"]}>
      <div className="space-y-6">
        {/* Project Header Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-indigo-800/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="primary" size="sm">
                  {project.status}
                </Badge>
                <span className="text-xs text-slate-400 font-semibold">
                  Owner: {project.owner?.name || "Admin"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {project.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                {project.description || "No project description provided."}
              </p>
            </div>

            <Button
              onClick={() => {
                setEditingTask(null);
                setTaskTitle("");
                setTaskDesc("");
                setShowTaskModal(true);
              }}
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Task
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Total Tasks: <strong className="text-indigo-600 dark:text-indigo-400">{tasks.length}</strong>
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Completed: <strong className="text-emerald-600 dark:text-emerald-400">{tasks.filter((t) => t.status === "Completed").length}</strong>
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Team Members: <strong className="text-purple-600 dark:text-purple-400">{project.members?.length || 0}</strong>
            </span>
          </div>
        </div>

        {/* Tabs Row */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all ${
              activeTab === "tasks"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Tasks ({tasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("team")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all ${
              activeTab === "team"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Team Members ({project.members?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all ${
              activeTab === "chat"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Project Chat ({messages.length})</span>
          </button>
        </div>

        {/* TAB 1: TASKS */}
        {activeTab === "tasks" && (
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="glass-panel rounded-3xl p-8 text-center space-y-3 border border-slate-200/80 dark:border-slate-800">
                <p className="text-xs text-slate-500">No tasks created for this project yet.</p>
                <Button
                  onClick={() => setShowTaskModal(true)}
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Create First Task
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="glass-panel rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3 hover-glow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {task.title}
                      </h3>
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
                      {task.description || "No task description."}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                      <span className="text-slate-500 flex items-center gap-1">
                        <UserIcon className="w-3 h-3 text-indigo-500" />
                        {task.assignedTo?.name || "Unassigned"}
                      </span>

                      <div className="flex items-center gap-1">
                        <div className="w-28">
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
                          onClick={() => {
                            setEditingTask(task);
                            setTaskTitle(task.title);
                            setTaskDesc(task.description);
                            setTaskStatus(task.status);
                            setTaskPriority(task.priority);
                            setTaskAssignee(task.assignedTo?._id || "");
                            setShowTaskModal(true);
                          }}
                          className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteTargetTask(task)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      <DeleteModal
        isOpen={!!deleteTargetTask}
        onClose={() => setDeleteTargetTask(null)}
        onConfirm={handleConfirmDeleteTask}
        title="Delete Project Task"
        itemType="task"
        itemName={deleteTargetTask?.title}
        loading={isDeletingTask}
      />

        {/* TAB 2: TEAM */}
        {activeTab === "team" && (
          <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Project Team Roster
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.members?.map((mem) => (
                <div
                  key={mem._id}
                  className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                    {mem.image ? (
                      <img src={mem.image} alt={mem.name} className="w-full h-full object-cover" />
                    ) : (
                      (mem.name?.[0] || "U").toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{mem.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{mem.email}</p>
                    <span className="text-[10px] font-semibold text-indigo-500 uppercase mt-0.5 block">
                      {mem.role || "teamMember"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CHAT */}
        {activeTab === "chat" && (
          <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" /> Real-Time Project Channel
              </h2>
              <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Socket Connected
              </span>
            </div>

            <div className="h-80 overflow-y-auto space-y-3 p-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              {messages.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-16">
                  No messages in channel yet. Start the conversation!
                </p>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender?._id === currentUserId;
                  return (
                    <div
                      key={msg._id}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <span className="text-[10px] text-slate-400 mb-0.5 px-1">
                        {msg.sender?.name || "Member"} •{" "}
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <div
                        className={`max-w-md px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? "bg-indigo-600 text-white rounded-br-none"
                            : "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-bl-none shadow-xs"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <Button type="submit" variant="primary" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>
                Send
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* CREATE/EDIT TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel max-w-md w-full rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 bg-white dark:bg-slate-900"
          >
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editingTask ? "Edit Task" : "Create New Task"}
            </h3>

            <form onSubmit={handleSaveTask} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Enter task title..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Task description..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Assign To Member
                </label>
                <Select
                  value={taskAssignee}
                  onChange={setTaskAssignee}
                  placeholder="Unassigned"
                  options={[
                    { value: "", label: "Unassigned" },
                    ...(project.members?.map((m) => ({ value: m._id, label: `${m.name} (${m.email})` })) || []),
                  ]}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTaskModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingTask ? "Update Task" : "Create Task"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
