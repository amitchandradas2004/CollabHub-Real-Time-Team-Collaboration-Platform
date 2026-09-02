"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Menu,
  X,
  ArrowRight,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Sparkles,
  Zap,
  Info,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LogoutModal } from "@/components/ui/LogoutModal";
import { useSession, signOut } from "@/lib/auth-client";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  const baseNavLinks = [
    { name: "Features", href: "/features", icon: Sparkles, iconColor: "text-indigo-500" },
    { name: "How It Works", href: "/how-it-works", icon: Zap, iconColor: "text-amber-500" },
    { name: "About", href: "/about", icon: Info, iconColor: "text-blue-500" },
  ];

  // For smaller devices (< lg), include Profile and Dashboard when logged in
  const drawerNavLinks = session?.user
    ? [
        ...baseNavLinks,
        { name: "Profile", href: "/profile", icon: User, iconColor: "text-emerald-500" },
        {
          name: (session.user as any)?.role === "admin" ? "Admin Console" : "Dashboard",
          href: (session.user as any)?.role === "admin" ? "/dashboard/admin" : "/dashboard/teammember",
          icon: LayoutDashboard,
          iconColor: "text-purple-500",
        },
      ]
    : baseNavLinks;

  const handleConfirmLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? "glass-nav py-2 shadow-md shadow-slate-900/5"
            : "glass-nav py-2.5 bg-white/70 dark:bg-slate-950/70"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* LEFT: Branding */}
            <Link
              href="/"
              className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded-lg p-0.5"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                <Layers className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Collab<span className="gradient-text">Hub</span>
              </span>
            </Link>

            {/* CENTER: Desktop Navigation Links (Large devices: lg:flex) */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-full border border-slate-200/80 dark:border-slate-700/60 backdrop-blur-md shadow-sm">
              {baseNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT: Actions for Large Devices */}
            <div className="hidden lg:flex items-center gap-2.5 relative">
              <ThemeToggle className="p-1.5" />

              {session?.user ? (
                /* Logged In User Profile Dropdown Menu Trigger */
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    type="button"
                    aria-label="User profile menu"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 transition-colors focus:outline-none"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0 shadow-sm">
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        (session.user.name?.[0] || "U").toUpperCase()
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                      {session.user.name || session.user.email}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                        profileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Desktop Profile Dropdown Card */}
                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setProfileDropdownOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 8 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="absolute right-0 top-full mt-2 w-56 glass-panel rounded-2xl p-2 border border-slate-200/80 dark:border-slate-800 shadow-2xl bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white z-50 overflow-hidden"
                        >
                          <div className="px-3 py-2 border-b border-slate-200/60 dark:border-slate-800 mb-1">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {session.user.name || "User"}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {session.user.email}
                            </p>
                          </div>

                          <div className="space-y-0.5">
                            <Link
                              href="/profile"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors"
                            >
                              <User className="w-4 h-4 text-emerald-500" />
                              <span>Profile</span>
                            </Link>

                            <Link
                              href={(session?.user as any)?.role === "admin" ? "/dashboard/admin" : "/dashboard/teammember"}
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-purple-500" />
                              <span>{(session?.user as any)?.role === "admin" ? "Admin Console" : "Dashboard"}</span>
                            </Link>
                          </div>

                          <div className="pt-1.5 mt-1 border-t border-slate-200/60 dark:border-slate-800">
                            <button
                              onClick={() => {
                                setProfileDropdownOpen(false);
                                setShowLogoutModal(true);
                              }}
                              type="button"
                              className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl transition-colors shadow-sm shadow-rose-500/20"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              <span>Logout</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Logged Out Guest Controls */
                <>
                  <Link
                    href="/login"
                    className="text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-2.5 py-1.5 transition-colors"
                  >
                    Login
                  </Link>
                  <Button
                    href="/register"
                    variant="primary"
                    size="sm"
                    className="py-1 px-3 text-xs"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Controls for devices smaller than large (< lg: flex) */}
            <div className="flex lg:hidden items-center gap-1.5">
              <ThemeToggle className="p-1.5" />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                type="button"
                aria-label="Toggle menu"
                className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Portal Professional Full-Height Right Drawer for mobile/tablet (< lg) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                {/* Backdrop Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[9998]"
                />

                {/* Right Side Drawer Panel */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 260 }}
                  className="lg:hidden fixed inset-y-0 right-0 h-[100dvh] w-[270px] sm:w-[290px] max-w-[85vw] z-[9999] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200/80 dark:border-slate-800 shadow-2xl p-3.5 sm:p-5 flex flex-col justify-between overflow-hidden"
                >
                  {/* Drawer Brand Header (Fixed Top) */}
                  <div className="shrink-0 flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/25">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white leading-none">
                          Collab<span className="gradient-text">Hub</span>
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 pt-0.5">
                          Workspace Menu
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      type="button"
                      aria-label="Close menu"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-105 active:scale-95"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Navigation Route Links (Independently Scrollable Center Area - min-h-0 ensures flex container shrinking) */}
                  <div className="flex-1 min-h-0 overflow-y-auto py-2 space-y-1 my-1 pr-1 custom-scrollbar">
                    <div className="px-1 pb-1">
                      <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                        Navigation
                      </span>
                    </div>
                    <nav className="flex flex-col gap-1">
                      {drawerNavLinks.map((link, idx) => {
                        const isActive = pathname === link.href;
                        const LinkIcon = link.icon;
                        return (
                          <motion.div
                            key={link.name}
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.18, delay: idx * 0.04 }}
                          >
                            <Link
                              href={link.href}
                              className={`px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-between transition-all duration-200 group ${
                                isActive
                                  ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/20"
                                  : "text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100/90 dark:hover:bg-slate-800/70"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                                    isActive
                                      ? "bg-white/20 text-white"
                                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                                  }`}
                                >
                                  <LinkIcon className="w-3.5 h-3.5" />
                                </div>
                                <span>{link.name}</span>
                              </div>
                              {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              )}
                            </Link>
                          </motion.div>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Bottom Action Footer (Fixed Bottom) */}
                  {session?.user ? (
                    <div className="shrink-0 pt-2.5 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
                      {/* Compact User Info Glass Card */}
                      <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-2 shadow-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative shrink-0">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs overflow-hidden shadow-sm ring-2 ring-indigo-500/20">
                              {session.user.image ? (
                                <img
                                  src={session.user.image}
                                  alt={session.user.name || "User"}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                (session.user.name?.[0] || "U").toUpperCase()
                              )}
                            </div>
                            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {session.user.name || "User"}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              {session.user.email}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Prominent Red Logout Button */}
                      <Button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setShowLogoutModal(true);
                        }}
                        variant="danger"
                        size="sm"
                        className="w-full justify-center text-xs py-2 font-semibold shadow-sm shadow-rose-500/20 hover:scale-[1.01] active:scale-[0.99] transition-transform"
                        leftIcon={<LogOut className="w-3.5 h-3.5" />}
                      >
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="shrink-0 pt-2.5 border-t border-slate-200/80 dark:border-slate-800 space-y-1.5">
                      <div className="px-1 pb-0.5">
                        <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                          Account Access
                        </span>
                      </div>
                      <Button
                        href="/login"
                        variant="outline"
                        size="sm"
                        className="w-full justify-center text-xs py-1.5 font-semibold"
                        leftIcon={<LogIn className="w-3.5 h-3.5" />}
                      >
                        Login
                      </Button>
                      <Button
                        href="/register"
                        variant="primary"
                        size="sm"
                        className="w-full justify-center text-xs py-1.5 font-semibold shadow-md shadow-indigo-500/20"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Get Started
                      </Button>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        userName={session?.user?.name}
      />
    </>
  );
}
