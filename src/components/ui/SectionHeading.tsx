"use client";

import React from "react";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  highlightedTitle?: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  highlightedTitle,
  description,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`flex flex-col gap-3 max-w-3xl ${
        isCenter ? "mx-auto text-center items-center" : "text-left items-start"
      } ${className}`}
    >
      {badge && (
        <span className="px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-full border border-indigo-200/60 dark:border-indigo-800/40">
          {badge}
        </span>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
        {title}{" "}
        {highlightedTitle && <span className="gradient-text">{highlightedTitle}</span>}
      </h2>

      {description && (
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed mt-1">
          {description}
        </p>
      )}
    </div>
  );
}
