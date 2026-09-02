"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function LegacyTasksPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/teammember/tasks");
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
