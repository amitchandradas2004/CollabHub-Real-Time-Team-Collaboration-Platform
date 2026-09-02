"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Bell,
  Users,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Layers,
  Sun,
  Moon,
  Home,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { useTheme } from "@/components/theme/ThemeProvider";
import { LogoutModal } from "@/components/ui/LogoutModal";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session?.user as any)?.role || "teamMember";
  const isAdmin = userRole === "admin";

  // Dashboard routes
  const teamMemberNav = [
    { name: "Dashboard", href: "/dashboard/teammember", icon: LayoutDashboard },
    { name: "Projects", href: "/dashboard/teammember/projects", icon: FolderKanban },
    { name: "My Tasks", href: "/dashboard/teammember/tasks", icon: CheckSquare },
    { name: "Notifications", href: "/dashboard/teammember/notifications", icon: Bell },
  ];

  const adminNav = [
    { name: "Admin Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "User Management", href: "/dashboard/admin/users", icon: Users },
    { name: "Project Management", href: "/dashboard/admin/projects", icon: FolderKanban },
    { name: "Task Management", href: "/dashboard/admin/tasks", icon: CheckSquare },
  ];

  const navLinks = isAdmin ? adminNav : teamMemberNav;

  const handleConfirmLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <>
      {/* 1. SMALL, TABLET & MEDIUM DEVICES DASHBOARD MENU TRIGGER BAR (< lg) */}
      <div className="lg:hidden w-full px-4 pt-4 pb-2 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all active:scale-95"
          >
            <Menu className="w-4 h-4" />
            <span>Dashboard Menu</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              CollabHub
            </span>
          </div>
        </div>

        {/* Quick Theme Toggle on Mobile Header */}
        <button
          onClick={toggleTheme}
          type="button"
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Dark/Light Theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      {/* 2. LARGE DEVICES FULL-HEIGHT SIDEBAR AT THE VERY LEFT EDGE (lg:flex) */}
      <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between border-r border-slate-200/80 dark:border-slate-800 p-4 min-h-screen h-screen sticky top-0 left-0 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl rounded-none border-l-0 overflow-hidden">
        <div className="space-y-5 flex-1 flex flex-col min-h-0">
          {/* Brand Header */}
          <div className="space-y-3 shrink-0 pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
                  CollabHub
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Workspace Platform</span>
              </div>
            </Link>

            {/* Role Header Badge */}
            <div className="px-3 py-1.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                  {isAdmin ? "Admin Console" : "Team Workspace"}
                </span>
              </div>
              <Link href="/" title="Go to Website Home" className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                <Home className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Scrollable Navigation Items Container */}
          <nav className="space-y-1.5 flex-1 overflow-y-auto custom-scrollbar pr-1">
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 px-2 block mb-1">
              Menu Navigation
            </span>
            {navLinks.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard/teammember" &&
                  item.href !== "/dashboard/admin" &&
                  pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 group ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? "text-white"
                          : "text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                      isActive ? "opacity-100 text-white" : "text-slate-400"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Essentials Footer */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 space-y-2.5 shrink-0">
          {/* Dark / Light Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors border border-slate-200/60 dark:border-slate-800"
          >
            <div className="flex items-center gap-2">
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-mono">{theme}</span>
          </button>

          {/* User Profile Card */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0 shadow-sm">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                (session?.user?.name?.[0] || "U").toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {session?.user?.name || "User"}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={() => setShowLogoutModal(true)}
            type="button"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors border border-rose-200/60 dark:border-rose-900/50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 3. MOBILE, TABLET & MEDIUM DEVICES SIDEBAR DRAWER (< lg) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileDrawerOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setMobileDrawerOpen(false)}
                  className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[9998]"
                />

                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 260 }}
                  className="lg:hidden fixed inset-y-0 left-0 h-[100dvh] w-[285px] max-w-[85vw] z-[9999] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800 shadow-2xl p-4 flex flex-col justify-between overflow-hidden"
                >
                  {/* Drawer Header */}
                  <div className="shrink-0 flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
                    <Link href="/" onClick={() => setMobileDrawerOpen(false)} className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          CollabHub
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {isAdmin ? "Admin Console" : "Team Workspace"}
                        </span>
                      </div>
                    </Link>

                    <button
                      onClick={() => setMobileDrawerOpen(false)}
                      type="button"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Drawer Navigation Links */}
                  <div className="flex-1 overflow-y-auto py-3 space-y-1.5 my-1 custom-scrollbar">
                    <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 px-2 block mb-1">
                      Dashboard Navigation
                    </span>
                    {navLinks.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/dashboard/teammember" &&
                          item.href !== "/dashboard/admin" &&
                          pathname.startsWith(item.href));
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileDrawerOpen(false)}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                            isActive
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                              : "text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4" />
                            <span>{item.name}</span>
                          </div>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                        </Link>
                      );
                    })}
                  </div>

                  {/* Drawer Footer Essentials */}
                  <div className="shrink-0 pt-3 border-t border-slate-200/80 dark:border-slate-800 space-y-2.5">
                    {/* Dark/Light Theme Toggle */}
                    <button
                      onClick={toggleTheme}
                      type="button"
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors border border-slate-200/60 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                        <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">{theme}</span>
                    </button>

                    <div className="flex items-center gap-2.5 px-1">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                        {session?.user?.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (session?.user?.name?.[0] || "U").toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {session?.user?.name || "User"}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">{session?.user?.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        setShowLogoutModal(true);
                      }}
                      type="button"
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors shadow-sm"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        userName={session?.user?.name}
      />
    </>
  );
}
