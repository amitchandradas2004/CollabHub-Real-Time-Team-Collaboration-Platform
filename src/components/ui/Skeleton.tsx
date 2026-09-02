"use client";

import React from "react";

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-slate-200/80 dark:bg-slate-800/70 animate-pulse rounded-xl ${className}`}
    />
  );
}

// 1. Admin Overview Dashboard Skeleton
export function AdminOverviewSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-40 rounded-3xl bg-slate-200/70 dark:bg-slate-800/60 p-8 flex flex-col justify-between" />

      {/* 3 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-200/70 dark:bg-slate-800/60 p-6 space-y-3" />
        ))}
      </div>

      {/* 2 Recent Lists Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="h-72 rounded-3xl bg-slate-200/70 dark:bg-slate-800/60 p-6 space-y-4" />
        ))}
      </div>
    </div>
  );
}

// 2. Users Table Skeleton (/dashboard/admin/users)
export function UsersTableSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200/60 dark:border-slate-800">
        <div className="space-y-2">
          <SkeletonBlock className="h-7 w-48" />
          <SkeletonBlock className="h-4 w-72" />
        </div>
        <SkeletonBlock className="h-7 w-24" />
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800">
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center gap-3">
                <SkeletonBlock className="w-9 h-9 rounded-full" />
                <div className="space-y-1.5">
                  <SkeletonBlock className="h-4 w-32" />
                  <SkeletonBlock className="h-3 w-44" />
                </div>
              </div>
              <SkeletonBlock className="h-6 w-20" />
              <SkeletonBlock className="h-8 w-28" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3. Projects Grid Skeleton (/dashboard/admin/projects & /dashboard/teammember/projects)
export function ProjectsGridSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200/60 dark:border-slate-800">
        <div className="space-y-2">
          <SkeletonBlock className="h-7 w-48" />
          <SkeletonBlock className="h-4 w-64" />
        </div>
        <SkeletonBlock className="h-9 w-36" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4 h-56 flex flex-col justify-between">
            <div className="space-y-2">
              <SkeletonBlock className="h-6 w-3/4" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-2/3" />
            </div>
            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex justify-between items-center">
              <SkeletonBlock className="h-6 w-24" />
              <SkeletonBlock className="h-8 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Tasks Grid Skeleton (/dashboard/admin/tasks & /dashboard/teammember/tasks)
export function TasksGridSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200/60 dark:border-slate-800">
        <div className="space-y-2">
          <SkeletonBlock className="h-7 w-48" />
          <SkeletonBlock className="h-4 w-64" />
        </div>
        <SkeletonBlock className="h-8 w-48" />
      </div>

      <div className="h-14 rounded-2xl bg-slate-200/70 dark:bg-slate-800/60 p-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-panel rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3 h-44 flex flex-col justify-between">
            <div className="space-y-2">
              <SkeletonBlock className="h-5 w-2/3" />
              <SkeletonBlock className="h-3.5 w-1/3" />
              <SkeletonBlock className="h-4 w-full" />
            </div>
            <div className="flex justify-between items-center pt-2">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-7 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
