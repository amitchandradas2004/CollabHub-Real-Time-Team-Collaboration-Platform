"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCheck, Clock } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { getSocket } from "@/lib/socket-client";

interface NotificationItem {
  _id: string;
  message: string;
  type: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export default function TeamMemberNotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = (session?.user as any)?._id || session?.user?.id;
  const currentUserRole = (session?.user as any)?.role || "teamMember";

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const res = await fetch(`${backendUrl}/api/notifications`, {
          headers: {
            "x-user-id": currentUserId || "",
            "x-user-role": currentUserRole,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.data || []);
        }
      } catch (err) {
        console.error("Notifications fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [currentUserId, currentUserRole]);

  // Real-time Socket.io Notification Listener
  useEffect(() => {
    if (!currentUserId) return;

    const socket = getSocket();
    socket.emit("join-user", currentUserId);

    const handleNewNotification = (newNotif: NotificationItem) => {
      if (newNotif) {
        setNotifications((prev) => [newNotif, ...prev]);
      }
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [currentUserId]);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUserId || "",
          "x-user-role": currentUserRole,
        },
        body: JSON.stringify({ read: !currentRead }),
      });

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: !currentRead } : n))
        );
      }
    } catch (err) {
      console.error("Toggle read error:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/notifications/read-all`, {
        method: "PATCH",
        headers: {
          "x-user-id": currentUserId || "",
          "x-user-role": currentUserRole,
        },
      });

      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout allowedRoles={["teamMember", "admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                <Bell className="w-6 h-6 text-amber-500" /> Notifications
              </h1>
              {unreadCount > 0 && (
                <Badge variant="warning" size="sm">
                  {unreadCount} Unread
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Real-time activity alerts and workspace updates.
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllRead}
              variant="outline"
              size="sm"
              leftIcon={<CheckCheck className="w-4 h-4" />}
            >
              Mark All as Read
            </Button>
          )}
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center space-y-3 border border-slate-200/80 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900/50 flex items-center justify-center text-amber-500 mx-auto">
              <Bell className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">No Notifications</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You are all caught up! New project activity and task assignments will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-w-3xl">
            {notifications.map((notif) => (
              <motion.div
                key={notif._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border flex items-start justify-between gap-4 transition-colors ${
                  notif.read
                    ? "glass-panel opacity-80 border-slate-200/60 dark:border-slate-800/60"
                    : "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/50 shadow-sm"
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant={notif.read ? "neutral" : "primary"} size="sm">
                      {notif.type.replace("_", " ")}
                    </Badge>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(notif.createdAt).toLocaleDateString()} •{" "}
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleRead(notif._id, notif.read)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl shrink-0 transition-colors ${
                    notif.read
                      ? "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                      : "bg-indigo-600 text-white hover:bg-indigo-500"
                  }`}
                >
                  {notif.read ? "Mark Unread" : "Mark Read"}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
