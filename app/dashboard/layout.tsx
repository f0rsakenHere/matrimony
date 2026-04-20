"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardSidebar from "./_components/dashboard-sidebar";
import MobileNav from "./_components/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--foreground)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>
      {/* Mobile nav — hidden on desktop */}
      <MobileNav />
      <main className="min-w-0 flex-1 pt-14 md:ml-[260px] md:pt-0">
        {children}
      </main>
    </div>
  );
}
