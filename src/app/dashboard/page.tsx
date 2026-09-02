"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function DashboardRootPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/login?redirectTo=/dashboard");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (session.user as any)?.role || "teamMember";
    if (userRole === "admin") {
      router.replace("/dashboard/admin");
    } else {
      router.replace("/dashboard/teammember");
    }
  }, [session, isPending, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
