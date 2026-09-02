"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "teamMember")[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isPending) return;

    // 1. Unauthenticated users redirect to login
    if (!session?.user) {
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (session.user as any).role || "teamMember";

    // 2. Role restriction check
    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(userRole as "admin" | "teamMember")) {
        if (userRole === "admin") {
          router.replace("/dashboard/admin");
        } else {
          router.replace("/dashboard/teammember");
        }
      }
    }
  }, [session, isPending, allowedRoles, router, pathname]);

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session.user as any).role || "teamMember";
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole as "admin" | "teamMember")) {
    return null;
  }

  return <>{children}</>;
}
