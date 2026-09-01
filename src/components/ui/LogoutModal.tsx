"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  userName?: string | null;
}

export function LogoutModal({ isOpen, onClose, onConfirm, userName }: LogoutModalProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Modal Content Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[350px] glass-panel rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xl bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white z-10 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              type="button"
              aria-label="Close dialog"
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Modal Body */}
            <div className="flex flex-col items-center text-center space-y-3 pt-1">
              {/* Icon Container */}
              <div className="w-11 h-11 rounded-xl bg-rose-100 dark:bg-rose-950/70 border border-rose-200/80 dark:border-rose-800/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-sm shadow-rose-500/10">
                <LogOut className="w-5 h-5 ml-0.5" />
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  Confirm Logout
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-[260px] mx-auto">
                  Are you sure you want to log out{userName ? `, ${userName}` : ""}?
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 w-full">
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="sm"
                  disabled={isLoggingOut}
                  className="w-full text-xs font-semibold py-1.5"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  variant="danger"
                  size="sm"
                  isLoading={isLoggingOut}
                  className="w-full text-xs font-semibold py-1.5"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
