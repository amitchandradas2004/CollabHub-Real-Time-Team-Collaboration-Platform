"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Shield, Trash2, UserCheck, AlertTriangle } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "teamMember";
  createdAt: string;
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const currentUserId = (session?.user as any)?._id || session?.user?.id;

  useEffect(() => {
    async function fetchUsers() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const res = await fetch(`${backendUrl}/api/users`, {
          headers: {
            "x-user-id": currentUserId || "",
            "x-user-role": "admin",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data.data || []);
        }
      } catch (err) {
        console.error("Fetch users error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [currentUserId]);

  // Handle Role Toggle
  const handleRoleToggle = async (userId: string, currentRole: "admin" | "teamMember") => {
    const newRole = currentRole === "admin" ? "teamMember" : "admin";
    setErrorMsg("");

    try {
      const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUserId || "",
          "x-user-role": "admin",
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      } else {
        setErrorMsg(data.message || "Failed to update user role.");
      }
    } catch (err) {
      console.error("Role update error:", err);
      setErrorMsg("Network error when updating role.");
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }
    setErrorMsg("");

    try {
      const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": currentUserId || "",
          "x-user-role": "admin",
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } else {
        setErrorMsg(data.message || "Failed to delete user.");
      }
    } catch (err) {
      console.error("Delete user error:", err);
      setErrorMsg("Network error when deleting user.");
    }
  };

  return (
    <DashboardLayout allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" /> User Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage platform registered users, assign roles, and control access permissions.
            </p>
          </div>
          <Badge variant="primary" size="md">
            {users.length} Total Registered
          </Badge>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    <th className="py-3.5 px-6">User Name</th>
                    <th className="py-3.5 px-6">Email Address</th>
                    <th className="py-3.5 px-6">Role</th>
                    <th className="py-3.5 px-6">Joined Date</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-xs">
                  {users.map((usr) => (
                    <tr key={usr._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                            {(usr.name?.[0] || "U").toUpperCase()}
                          </div>
                          <span>{usr.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400 font-mono">{usr.email}</td>
                      <td className="py-4 px-6">
                        <Badge variant={usr.role === "admin" ? "primary" : "neutral"} size="sm">
                          {usr.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {new Date(usr.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            onClick={() => handleRoleToggle(usr._id, usr.role)}
                            variant="outline"
                            size="sm"
                            className="text-xs py-1 px-2.5"
                          >
                            Set {usr.role === "admin" ? "Team Member" : "Admin"}
                          </Button>
                          <button
                            onClick={() => handleDeleteUser(usr._id, usr.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
