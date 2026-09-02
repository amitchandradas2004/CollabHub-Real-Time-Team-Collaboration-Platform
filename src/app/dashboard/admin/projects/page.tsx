"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderKanban, Plus, Trash2, Edit3, Search, Filter, ArrowRight } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProjectsGridSkeleton } from "@/components/ui/Skeleton";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { Select } from "@/components/ui/Select";

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
  status: "active" | "completed" | "archived";
  taskCount?: number;
  progress?: number;
  createdAt: string;
}

export default function AdminProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectOwner, setProjectOwner] = useState("");
  const [projectStatus, setProjectStatus] = useState<"active" | "completed" | "archived">("active");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState("");

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

  const handleOpenModal = (project?: ProjectItem) => {
    setModalError("");
    const defaultOwner = users[0]?._id || currentUserId || "";
    if (project) {
      setEditingProject(project);
      setProjectName(project.name);
      setProjectDesc(project.description);
      setProjectOwner(project.owner?._id || defaultOwner);
      setProjectStatus(project.status || "active");
      setSelectedMemberIds(project.members?.map((m) => m._id) || []);
    } else {
      setEditingProject(null);
      setProjectName("");
      setProjectDesc("");
      setProjectOwner(defaultOwner);
      setProjectStatus("active");
      setSelectedMemberIds(defaultOwner ? [defaultOwner] : []);
    }
    setShowModal(true);
  };

  const handleToggleMember = (userId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    if (!projectName.trim()) {
      setModalError("Project name is required.");
      return;
    }

    setIsSaving(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const effectiveUserId = currentUserId || users[0]?._id || "6a96b94f05202ba99d33458e";
      const headers = {
        "Content-Type": "application/json",
        "x-user-id": effectiveUserId,
        "x-user-role": "admin",
      };

      const ownerIdToUse = projectOwner || effectiveUserId;

      const payload = {
        name: projectName.trim(),
        description: projectDesc.trim(),
        owner: ownerIdToUse,
        status: projectStatus,
        members: selectedMemberIds,
      };

      if (editingProject) {
        const res = await fetch(`${backendUrl}/api/projects/${editingProject._id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setProjects((prev) =>
            prev.map((p) => (p._id === editingProject._id ? data.data : p))
          );
          setShowModal(false);
        } else {
          setModalError(data.message || "Failed to update project.");
        }
      } else {
        const res = await fetch(`${backendUrl}/api/projects`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setProjects((prev) => [data.data, ...prev]);
          setShowModal(false);
        } else {
          setModalError(data.message || "Failed to create project.");
        }
      }
    } catch (err) {
      console.error("Save project error:", err);
      setModalError("Network error when saving project.");
    } finally {
      setIsSaving(false);
    }
  };

  const [deleteTargetProject, setDeleteTargetProject] = useState<ProjectItem | null>(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);

  const handleConfirmDeleteProject = async () => {
    if (!deleteTargetProject) return;
    setIsDeletingProject(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/projects/${deleteTargetProject._id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": currentUserId || "",
          "x-user-role": "admin",
        },
      });

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== deleteTargetProject._id));
        setDeleteTargetProject(null);
      }
    } catch (err) {
      console.error("Delete project error:", err);
    } finally {
      setIsDeletingProject(false);
    }
  };

  // Filter projects by search and status
  const filteredProjects = projects.filter((proj) => {
    const matchesSearch =
      proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.owner?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "All" || proj.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <FolderKanban className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Admin Projects Oversight
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Create, edit, assign members, track progress, and manage all workspace projects.
            </p>
          </div>

          <Button onClick={() => handleOpenModal()} variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Create New Project
          </Button>
        </div>

        {/* Filter and Search Controls */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by title or owner..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-indigo-500" /> Status:
            </span>
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {["All", "active", "completed", "archived"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    filterStatus === status
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <ProjectsGridSkeleton />
        ) : filteredProjects.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center space-y-3 border border-slate-200/80 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-900/50 flex items-center justify-center text-indigo-500 mx-auto">
              <FolderKanban className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">No Projects Found</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No projects match your search or status filter criterion.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((proj) => (
              <motion.div
                key={proj._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm hover-glow flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{proj.name}</h2>
                    <Badge variant={proj.status === "completed" ? "success" : "primary"} size="sm">
                      {proj.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {proj.description || "No description provided."}
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

                  <div className="flex items-center justify-between pt-2 gap-2">
                    <Button href={`/dashboard/admin/projects/${proj._id}`} variant="primary" size="sm" className="text-xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      View Details
                    </Button>

                    <div className="flex items-center gap-1.5">
                      <Button onClick={() => handleOpenModal(proj)} variant="outline" size="sm" leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
                        Edit
                      </Button>
                      <button
                        onClick={() => setDeleteTargetProject(proj)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={!!deleteTargetProject}
        onClose={() => setDeleteTargetProject(null)}
        onConfirm={handleConfirmDeleteProject}
        title="Delete Project & Associated Data"
        itemType="project and all tasks"
        itemName={deleteTargetProject?.name}
        loading={isDeletingProject}
      />

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
              {modalError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <span>{modalError}</span>
                </div>
              )}

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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Project Owner
                  </label>
                  <Select
                    value={projectOwner}
                    onChange={setProjectOwner}
                    options={users.map((u) => ({ value: u._id, label: `${u.name} (${u.email})` }))}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Status
                  </label>
                  <Select
                    value={projectStatus}
                    onChange={(val) => setProjectStatus(val as any)}
                    options={[
                      { value: "active", label: "Active" },
                      { value: "completed", label: "Completed" },
                      { value: "archived", label: "Archived" },
                    ]}
                  />
                </div>
              </div>

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
                <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isSaving}>
                  {isSaving ? "Saving..." : editingProject ? "Update Project" : "Create Project"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
