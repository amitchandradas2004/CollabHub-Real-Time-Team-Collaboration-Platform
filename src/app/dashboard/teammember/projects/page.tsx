"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderKanban, Users, CheckSquare, ArrowRight } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProjectsGridSkeleton } from "@/components/ui/Skeleton";

interface Project {
  _id: string;
  name: string;
  description: string;
  owner?: { name: string; email: string };
  members: any[];
  status: "active" | "completed" | "archived";
  taskCount?: number;
  progress?: number;
}

export default function TeamMemberProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const res = await fetch(`${backendUrl}/api/projects`, {
          headers: {
            "x-user-id": (session?.user as any)?._id || session?.user?.id || "",
            "x-user-role": (session?.user as any)?.role || "teamMember",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setProjects(data.data || []);
        }
      } catch (err) {
        console.error("Fetch projects error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [session]);

  return (
    <DashboardLayout allowedRoles={["teamMember", "admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <FolderKanban className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> My Projects
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Projects assigned to you across your workspace.
            </p>
          </div>
        </div>

        {loading ? (
          <ProjectsGridSkeleton />
        ) : projects.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center space-y-4 border border-slate-200/80 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-900/50 flex items-center justify-center text-indigo-500 mx-auto">
              <FolderKanban className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">No Projects Found</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You are currently not assigned to any projects. Contact your workspace Admin to get added to a team project.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 hover-glow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {project.name}
                    </h2>
                    <Badge variant={project.status === "completed" ? "success" : "primary"} size="sm">
                      {project.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {project.description || "No description provided for this project."}
                  </p>
                </div>

                <div className="space-y-4 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
                      <span className="text-[10px] text-slate-400 block uppercase">Owner</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                        {project.owner?.name || "Admin"}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
                      <span className="text-[10px] text-slate-400 block uppercase">Members</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1">
                        <Users className="w-3 h-3" /> {project.members?.length || 0}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
                      <span className="text-[10px] text-slate-400 block uppercase">Tasks</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center justify-center gap-1">
                        <CheckSquare className="w-3 h-3" /> {project.taskCount || 0}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                      <span>Completion Progress</span>
                      <span>{project.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    href={`/dashboard/teammember/projects/${project._id}`}
                    variant="primary"
                    size="sm"
                    className="w-full justify-center text-xs"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    View Project
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
