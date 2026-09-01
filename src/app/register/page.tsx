"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Layers,
  User,
  Mail,
  Lock,
  Image as ImageIcon,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { AuthInput } from "@/components/ui/AuthInput";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    imageURL: "",
    role: "teamMember", // Default role as specified
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    imageURL?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "imageURL") {
      setImgError(false);
    }
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string; imageURL?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

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

    if (formData.imageURL.trim() && !/^https?:\/\/.+/i.test(formData.imageURL.trim())) {
      newErrors.imageURL = "Image URL must start with http:// or https://";
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
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        image: formData.imageURL.trim() || undefined,
        role: "teamMember",
      };


      const { data, error } = await authClient.signUp.email({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        image: payload.image,
      });


      if (error) {
        setErrors({ general: error.message || "Failed to create account" });
        setIsLoading(false);
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (err: any) {
      // console.error("Registration Exception:", err);
      setErrors({ general: err?.message || "Failed to create account. Please try again." });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-6 lg:py-8 flex items-center justify-center relative overflow-hidden">
      {/* Background Decor Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] bg-indigo-500/15 dark:bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-10 right-10 w-[320px] h-[320px] bg-purple-500/10 dark:bg-purple-600/15 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-center">
        <div className="w-full max-w-lg">
          {/* Glass Card Container */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-2xl bg-white/80 dark:bg-slate-900/90 text-slate-900 dark:text-white relative overflow-hidden">
            {/* Header */}
            <div className="flex flex-col items-center text-center space-y-2 mb-4">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
                  <Layers className="w-4.5 h-4.5" />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                  Collab<span className="gradient-text">Hub</span>
                </span>
              </Link>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white pt-0.5">
                Create your account
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Join CollabHub to start collaborating with your team in real time
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
                <span>Account created successfully! Redirecting to login...</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Full Name */}
              <AuthInput
                label="Full Name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                leftIcon={<User className="w-4 h-4" />}
              />

              {/* Email Address */}
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

              {/* Password */}
              <AuthInput
                label="Password"
                name="password"
                isPassword
                placeholder="At least 6 characters"
                required
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                leftIcon={<Lock className="w-4 h-4" />}
              />

              {/* Image URL & Avatar Preview */}
              <div className="space-y-2">
                <AuthInput
                  label="Profile Image URL"
                  name="imageURL"
                  type="url"
                  placeholder="https://example.com/avatar.jpg (Optional)"
                  value={formData.imageURL}
                  onChange={handleChange}
                  error={errors.imageURL}
                  helperText="Paste a direct image link to display your avatar"
                  leftIcon={<ImageIcon className="w-4 h-4" />}
                />

                {/* Live Image Avatar Preview */}
                {formData.imageURL.trim() && !errors.imageURL && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-300 dark:border-slate-600 flex items-center justify-center">
                      {!imgError ? (
                        <img
                          src={formData.imageURL.trim()}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                          onError={() => setImgError(true)}
                        />
                      ) : (
                        <User className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold text-slate-900 dark:text-white block">
                        Avatar Preview
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {!imgError ? "Valid image link detected" : "Failed to load image link"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                disabled={isSuccess}
                className="w-full mt-2 py-2.5"
                rightIcon={!isLoading && <ArrowRight className="w-4 h-4" />}
              >
                {isLoading ? "Creating account..." : "Register Account"}
              </Button>
            </form>

            {/* Bottom Footer Link */}
            <div className="mt-4 pt-3.5 border-t border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400">
              <span>Already have an account? </span>
              <Link
                href="/login"
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
