"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderKanban, Plus, Trash2, Edit3, Users, UserPlus, UserMinus } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface UserItem {
  _id: string;
  name: string;
  email: string;
}

interface ProjectItem {
  _id: string;
  name: string;
  description: string;
  owner?: UserItem;
  members: UserItem[];
  status: string;
  taskCount?: number;
  createdAt: string;
}

export default function AdminProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectOwner, setProjectOwner] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const currentUserId = (session?.user as any)?._id || session?.user?.id;

  useEffect(() => {
    async function fetchData() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const headers = {
          "x-user-id": currentUserId || "",
          "x-user-role": "admin",
        };

        const [resProj, resUsers] = await Promise.all([
          fetch(`${backendUrl}/api/projects`, { headers }),
          fetch(`${backendUrl}/api/users`, { headers }),
        ]);

        if (resProj.ok) {
          const data = await resProj.json();
          setProjects(data.data || []);
        }

        if (resUsers.ok) {
          const data = await resUsers.json();
          setUsers(data.data || []);
        }
      } catch (err) {
        console.error("Admin projects fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentUserId]);

  // Open Create/Edit Modal
  const handleOpenModal = (project?: ProjectItem) => {
    if (project) {
      setEditingProject(project);
      setProjectName(project.name);
      setProjectDesc(project.description);
      setProjectOwner(project.owner?._id || currentUserId);
      setSelectedMemberIds(project.members?.map((m) => m._id) || []);
    } else {
      setEditingProject(null);
      setProjectName("");
      setProjectDesc("");
      setProjectOwner(currentUserId);
      setSelectedMemberIds([currentUserId]);
    }
    setShowModal(true);
  };

  // Toggle member checkbox selection
  const handleToggleMember = (userId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Save Project (Create / Update)
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    try {
      const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const headers = {
        "Content-Type": "application/json",
        "x-user-id": currentUserId || "",
        "x-user-role": "admin",
      };

      const payload = {
        name: projectName.trim(),
        description: projectDesc.trim(),
        owner: projectOwner || currentUserId,
        members: selectedMemberIds,
      };

      if (editingProject) {
        const res = await fetch(`${backendUrl}/api/projects/${editingProject._id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          setProjects((prev) =>
            prev.map((p) => (p._id === editingProject._id ? data.data : p))
          );
        }
      } else {
        const res = await fetch(`${backendUrl}/api/projects`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          setProjects((prev) => [data.data, ...prev]);
        }
      }

      setShowModal(false);
    } catch (err) {
      console.error("Save project error:", err);
    }
  };

  // Delete Project
  const handleDeleteProject = async (projectId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete project "${name}" and all its tasks?`)) return;

    try {
      const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": currentUserId || "",
          "x-user-role": "admin",
        },
      });

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== projectId));
      }
    } catch (err) {
      console.error("Delete project error:", err);
    }
  };

  return (
    <DashboardLayout allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <FolderKanban className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Admin Projects Oversight
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Create, edit, assign members, and manage all workspace projects.
            </p>
          </div>

          <Button onClick={() => handleOpenModal()} variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Create New Project
          </Button>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div
                key={proj._id}
                className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm hover-glow flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{proj.name}</h2>
                    <Badge variant="primary" size="sm">
                      {proj.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {proj.description || "No description."}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Owner</span>
                      <span className="font-bold truncate block">{proj.owner?.name || "Admin"}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Members</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{proj.members?.length || 0}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Tasks</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">{proj.taskCount || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button onClick={() => handleOpenModal(proj)} variant="outline" size="sm" leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
                      Edit / Members
                    </Button>
                    <button
                      onClick={() => handleDeleteProject(proj._id, proj.name)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT PROJECT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel max-w-lg w-full rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 bg-white dark:bg-slate-900 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editingProject ? "Edit Project" : "Create New Project"}
            </h3>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Mobile App Redesign"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Project goal and scope..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Project Owner
                </label>
                <select
                  value={projectOwner}
                  onChange={(e) => setProjectOwner(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Members Selection List */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Select Team Members ({selectedMemberIds.length} selected)
                </label>
                <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  {users.map((u) => {
                    const isChecked = selectedMemberIds.includes(u._id);
                    return (
                      <label
                        key={u._id}
                        className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 cursor-pointer text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleMember(u._id)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="font-medium text-slate-800 dark:text-slate-200">{u.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{u.email}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingProject ? "Update Project" : "Create Project"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
