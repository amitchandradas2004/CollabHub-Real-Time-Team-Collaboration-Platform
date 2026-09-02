"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  LogIn,
  AlertCircle,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface UserProfile {
  _id?: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  role?: string;
}

function ProfileSkeleton() {
  return (
    <div className="py-1 sm:py-2 px-4 sm:px-6 max-w-xl mx-auto flex justify-center">
      <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6 relative overflow-hidden animate-pulse">
        {/* Top Decorative Gradient Blur Skeleton */}
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header & Avatar Skeleton */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-200 dark:bg-slate-800/80 shrink-0" />

          <div className="text-center sm:text-left space-y-3 w-full flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>
            <div className="h-4 w-56 bg-slate-200 dark:bg-slate-800/70 rounded-lg mx-auto sm:mx-0" />
          </div>
        </div>

        {/* User Properties List Skeleton */}
        <div className="space-y-3.5">
          <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4" />

          {/* Full Name Skeleton */}
          <div className="h-16 w-full bg-slate-100 dark:bg-slate-900/60 rounded-2xl border border-slate-200/40 dark:border-slate-800/50 p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          </div>

          {/* Email Skeleton */}
          <div className="h-16 w-full bg-slate-100 dark:bg-slate-900/60 rounded-2xl border border-slate-200/40 dark:border-slate-800/50 p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          </div>

          {/* Email Verified Skeleton */}
          <div className="h-16 w-full bg-slate-100 dark:bg-slate-900/60 rounded-2xl border border-slate-200/40 dark:border-slate-800/50 p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="space-y-1.5">
                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-3.5 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            </div>
            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
          </div>

          {/* Role Skeleton */}
          <div className="h-16 w-full bg-slate-100 dark:bg-slate-900/60 rounded-2xl border border-slate-200/40 dark:border-slate-800/50 p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="space-y-1.5">
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            </div>
            <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
          </div>

          {/* Timestamps Skeleton Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="h-14 w-full bg-slate-100 dark:bg-slate-900/60 rounded-2xl border border-slate-200/40 dark:border-slate-800/50 p-3 space-y-1.5">
              <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-3.5 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>

            <div className="h-14 w-full bg-slate-100 dark:bg-slate-900/60 rounded-2xl border border-slate-200/40 dark:border-slate-800/50 p-3 space-y-1.5">
              <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-3.5 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, isPending: isSessionPending } = useSession();
  const [apiUser, setApiUser] = useState<UserProfile | null>(null);
  const [isApiLoading, setIsApiLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const response = await fetch(`${backendUrl}/api/users/profile`);
        if (response.ok) {
          const result = await response.json();
          if (result?.success && result?.data) {
            setApiUser(result.data);
          }
        }
      } catch {
        // Backend API unreachable or unauthenticated
      } finally {
        setIsApiLoading(false);
      }
    }
    fetchUserProfile();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionUser = session?.user as any;

  // Resolve user profile exclusively from authenticated session or backend API
  const user: UserProfile | null = sessionUser
    ? {
      _id: sessionUser._id || sessionUser.id,
      name: sessionUser.name || "User",
      email: sessionUser.email || "",
      emailVerified: Boolean(sessionUser.emailVerified),
      image: sessionUser.image || undefined,
      createdAt: sessionUser.createdAt ? String(sessionUser.createdAt) : undefined,
      updatedAt: sessionUser.updatedAt ? String(sessionUser.updatedAt) : undefined,
      role: sessionUser.role || "teamMember",
    }
    : apiUser;

  const isLoading = isSessionPending && isApiLoading;

  const formatDate = (isoString?: string) => {
    if (!isoString) return "N/A";
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return isoString;
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <div className="py-1 sm:py-2 px-4 max-w-md mx-auto flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full glass-panel rounded-3xl p-8 text-center space-y-6 border border-slate-200/80 dark:border-slate-800 shadow-xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900/50 flex items-center justify-center text-amber-500 mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Profile Not Available</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Please sign in to access your workspace account profile information.
            </p>
          </div>
          <Button href="/login" variant="primary" size="md" leftIcon={<LogIn className="w-4 h-4" />}>
            Sign In to Account
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-1 sm:py-2 px-4 sm:px-6 max-w-xl mx-auto flex justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6 relative overflow-hidden"
      >
        {/* Top Decorative Gradient Blur */}
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header & Avatar */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 shadow-lg ring-2 ring-indigo-500/20 overflow-hidden">
              {!imageError && user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-extrabold">
                  {user.name
                    ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                    : "U"}
                </div>
              )}
            </div>
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>

          <div className="text-center sm:text-left space-y-1.5 min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white truncate">
                {user.name}
              </h1>
              {user.role && (
                <Badge variant="primary" size="sm">
                  {user.role}
                </Badge>
              )}
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 truncate">
              <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        {/* User Properties List inside Card */}
        <div className="space-y-3.5">
          <h2 className="text-xs font-extrabold tracking-wider uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            User Profile Information
          </h2>

          {/* Full Name Property */}
          <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Full Name</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
            </div>
          </div>

          {/* Email Property */}
          <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Email Address</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.email}</p>
            </div>
          </div>

          {/* Email Verified Property */}
          <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                {user.emailVerified ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Email Verified</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {user.emailVerified ? "true" : "false"}
                </p>
              </div>
            </div>
            {user.emailVerified ? (
              <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                Verified
              </Badge>
            ) : (
              <Badge variant="warning" size="sm" icon={<XCircle className="w-3 h-3" />}>
                Unverified
              </Badge>
            )}
          </div>

          {/* Role Property */}
          {user.role && (
            <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">Role</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{user.role}</p>
                </div>
              </div>
              <Badge variant="primary" size="sm">
                {user.role}
              </Badge>
            </div>
          )}

          {/* Created & Updated Timestamps */}
          {(user.createdAt || user.updatedAt) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {user.createdAt && (
                <div className="p-3 rounded-2xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-0.5">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-indigo-500" />
                    Created At
                  </p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{formatDate(user.createdAt)}</p>
                </div>
              )}

              {user.updatedAt && (
                <div className="p-3 rounded-2xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-0.5">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-500" />
                    Updated At
                  </p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{formatDate(user.updatedAt)}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
