"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
}

export function AuthInput({
  label,
  error,
  helperText,
  leftIcon,
  isPassword = false,
  id,
  className = "",
  type = "text",
  required,
  ...props
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      <label
        htmlFor={inputId}
        className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300 uppercase flex items-center justify-between"
      >
        <span>
          {label} {required && <span className="text-rose-500">*</span>}
        </span>
      </label>

      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          type={inputType}
          required={required}
          className={`w-full py-3 text-sm rounded-xl transition-all duration-200 border bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 ${
            leftIcon ? "pl-11" : "pl-4"
          } ${isPassword ? "pr-11" : "pr-4"} ${
            error
              ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
              : "border-slate-200 dark:border-slate-700/80 focus:border-indigo-500 focus:ring-indigo-500/20 dark:focus:border-indigo-400"
          } ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-0.5">
          <span>•</span> {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}
