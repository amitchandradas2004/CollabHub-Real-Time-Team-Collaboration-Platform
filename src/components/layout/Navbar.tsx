"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Features", href: "/features" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "About", href: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
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
            {navLinks.map((link) => {
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

          {/* RIGHT: Actions for Large Devices (Theme Toggle, Login, Get Started) */}
          <div className="hidden lg:flex items-center gap-2.5">
            <ThemeToggle className="p-1.5" />
            <Link
              href="/login"
              className="text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-2.5 py-1.5 transition-colors"
            >
              Login
            </Link>
            <Button
              href="/login"
              variant="primary"
              size="sm"
              className="py-1 px-3 text-xs"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Get Started
            </Button>
          </div>

          {/* Controls for devices smaller than large (< lg: flex) */}
          <div className="flex lg:hidden items-center gap-1.5">
            <ThemeToggle className="p-1.5" />
            <button
              onClick={() => setMobileMenuOpen(true)}
              type="button"
              aria-label="Open menu"
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Animated Full-Height Right-Side Drawer Menu for devices smaller than large (< lg) */}
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
              className="lg:hidden fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-40"
            />

            {/* Right Side Drawer Panel - Full Height */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 h-screen w-[280px] sm:w-[340px] z-50 bg-white/95 dark:bg-slate-900/95 border-l border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto backdrop-blur-xl"
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
                      <Layers className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                      Collab<span className="gradient-text">Hub</span>
                    </span>
                  </div>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    type="button"
                    aria-label="Close menu"
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link, idx) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          className={`px-4 py-3 text-base font-semibold rounded-xl flex items-center justify-between transition-colors ${
                            isActive
                              ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400"
                              : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                          }`}
                        >
                          <span>{link.name}</span>
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Action Buttons */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
                <Button href="/login" variant="outline" size="lg" className="w-full justify-center text-sm py-3">
                  Login
                </Button>
                <Button href="/login" variant="primary" size="lg" className="w-full justify-center text-sm py-3">
                  Get Started
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
