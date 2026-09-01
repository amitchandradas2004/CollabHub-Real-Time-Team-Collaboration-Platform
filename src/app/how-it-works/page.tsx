"use client";

import React from "react";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CollaborationSection } from "@/components/home/CollaborationSection";
import { RolesSection } from "@/components/home/RolesSection";
import { CTASection } from "@/components/home/CTASection";

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col gap-0 w-full overflow-hidden">
      <HowItWorksSection />
      <CollaborationSection />
      <RolesSection />
      <CTASection />
    </div>
  );
}
