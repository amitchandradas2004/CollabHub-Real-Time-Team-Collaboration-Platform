"use client";

import React from "react";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ProjectManagementSection } from "@/components/home/ProjectManagementSection";
import { SecuritySection } from "@/components/home/SecuritySection";
import { ApiArchitectureSection } from "@/components/home/ApiArchitectureSection";
import { CTASection } from "@/components/home/CTASection";

export default function FeaturesPage() {
  return (
    <div className="flex flex-col gap-0 w-full overflow-hidden">
      <FeaturesSection />
      <ProjectManagementSection />
      <SecuritySection />
      <ApiArchitectureSection />
      <CTASection />
    </div>
  );
}
