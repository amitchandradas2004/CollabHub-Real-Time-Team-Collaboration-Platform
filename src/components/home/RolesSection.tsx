"use client";

import React from "react";
import { ShieldAlert, UserCheck, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";

export function RolesSection() {
  const adminPermissions = [
    "Manage platform users & global permissions",
    "Create, archive, and delete team projects",
    "Assign and reallocate high-priority tasks",
    "Manage organization team members",
    "Access real-time platform metrics & audit logs",
  ];

  const memberPermissions = [
    "View assigned projects & sprint boards",
    "Create and update permitted task cards",
    "Transition task status across Kanban columns",
    "Communicate instantly via Socket.io chat",
    "Receive instant project notifications & alerts",
    "Collaborate live with teammates in real time",
  ];

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Role-Based Access Control"
          title="Tailored workspace experiences for"
          highlightedTitle="every team role."
          description="Enforce security and clarity with distinct permissions for System Administrators and Team Members."
          className="mb-16"
        />

        {/* 2 Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1440px] mx-auto">
          {/* ADMIN CARD */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-indigo-200/80 dark:border-indigo-900/60 hover-glow space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <Badge variant="primary" size="md">
                Admin Role
              </Badge>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Administrator</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Full organizational control, user governance, project oversight, and analytics visibility.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Capabilities & Privileges
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {adminPermissions.map((perm, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* TEAM MEMBER CARD */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-emerald-200/80 dark:border-emerald-900/60 hover-glow space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                <UserCheck className="w-6 h-6" />
              </div>
              <Badge variant="success" size="md">
                Team Member Role
              </Badge>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Team Member</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Focused operational execution, real-time messaging, task updating, and active collaboration.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Capabilities & Privileges
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {memberPermissions.map((perm, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
