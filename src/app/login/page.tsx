"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layers, Mail, Lock, ArrowRight, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { AuthInput } from "@/components/ui/AuthInput";
import { Button } from "@/components/ui/Button";

import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email.trim(),
        password: formData.password,
      });


      if (error) {
        setErrors({ general: error.message || "Invalid credentials. Please try again." });
        setIsLoading(false);
      } else {
        setIsSuccess(true);
        const userRole = (data?.user as any)?.role || "teamMember";
        const redirectPath = userRole === "admin" ? "/dashboard/admin" : "/dashboard/teammember";
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 1000);
      }
    } catch (err: any) {
      // console.error("Login Exception:", err);
      setErrors({ general: err?.message || "Invalid credentials. Please try again." });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-6 lg:py-8 flex items-center justify-center relative overflow-hidden">
      {/* Background Decor Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-indigo-500/15 dark:bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-purple-500/10 dark:bg-purple-600/15 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-center">
        <div className="w-full max-w-md">
          {/* Glass Card Container */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-2xl bg-white/80 dark:bg-slate-900/90 text-slate-900 dark:text-white relative overflow-hidden">
            {/* Top Brand Header */}
            <div className="flex flex-col items-center text-center space-y-2 mb-5">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
                  <Layers className="w-4.5 h-4.5" />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                  Collab<span className="gradient-text">Hub</span>
                </span>
              </Link>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white pt-0.5">
                Welcome back
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Sign in to your team workspace to continue collaborating
              </p>
            </div>

            {/* General Error Banner */}
            {errors.general && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2.5 text-xs font-medium text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Success Banner */}
            {isSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>Login successful! Redirecting to workspace...</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <AuthInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="name@company.com"
                required
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <AuthInput
                label="Password"
                name="password"
                isPassword
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                leftIcon={<Lock className="w-4 h-4" />}
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                disabled={isSuccess}
                className="w-full mt-1.5 py-2.5"
                rightIcon={!isLoading && <ArrowRight className="w-4 h-4" />}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Bottom Footer Link */}
            <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400">
              <span>Don't have an account? </span>
              <Link
                href="/register"
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
