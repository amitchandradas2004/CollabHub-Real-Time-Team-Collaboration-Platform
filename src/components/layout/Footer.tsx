"use client";

import React from "react";
import Link from "next/link";
import { Layers, Globe, Code, Share2 } from "lucide-react";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="w-full pt-4 pb-3 sm:pt-8 sm:pb-4 lg:pt-10 lg:pb-6 bg-transparent transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Card Format Container */}
        <div className="glass-panel rounded-2xl p-5 sm:p-8 lg:p-12 border border-slate-200/80 dark:border-slate-800 shadow-xl bg-white/80 dark:bg-slate-900/90 text-slate-900 dark:text-white relative overflow-hidden">
          {/* Ambient Decor Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/15 blur-[100px] rounded-full pointer-events-none -z-10" />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-5 sm:gap-8 lg:gap-12 relative z-10">
            {/* Brand Col */}
            <div className="col-span-2 flex flex-col gap-2.5 sm:gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  Collab<span className="gradient-text">Hub</span>
                </span>
              </Link>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
                A modern workspace for teams to manage projects, track tasks, and collaborate seamlessly with Socket.io.
              </p>

              <div className="flex items-center gap-2 pt-1 sm:pt-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                  className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div className="flex flex-col gap-2 sm:gap-3">
              <h3 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Product
              </h3>
              <ul className="flex flex-col gap-1.5 sm:gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/features#projects" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/features#tasks" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    Tasks
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="flex flex-col gap-2 sm:gap-3">
              <h3 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Company
              </h3>
              <ul className="flex flex-col gap-1.5 sm:gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/about#contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources & Legal */}
            <div className="flex flex-col gap-2 sm:gap-3">
              <h3 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Resources
              </h3>
              <ul className="flex flex-col gap-1.5 sm:gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    Docs
                  </Link>
                </li>
                <li>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 relative z-10">
            <p>© {currentYear} CollabHub. All rights reserved.</p>
            <div>
              <span>Built with precision for modern teams</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
