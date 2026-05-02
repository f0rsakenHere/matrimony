"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, FileText } from "lucide-react";

export function AuthButtons() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="hidden items-center gap-3 min-[900px]:flex">
        <div className="h-12 w-24 animate-pulse rounded bg-[var(--color-dark-08)]" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="hidden items-center gap-3 min-[900px]:flex">
        <Link
          href="/dashboard"
          aria-label="Go to dashboard"
          className="inline-flex size-12 items-center justify-center border border-[var(--border)] text-[var(--foreground)] transition-colors hover:bg-[var(--color-dark-08)] lg:size-14"
        >
          <LayoutDashboard className="size-5" />
        </Link>
        <button
          onClick={() => logout()}
          className="h-12 items-center justify-center border border-[var(--border)] px-5 text-[14px] font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--color-dark-08)] inline-flex lg:h-14 lg:px-6 lg:text-[15px]"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-3 min-[900px]:flex">
      <Link
        href="/start"
        className="h-12 items-center justify-center gap-2 rounded-lg bg-[var(--foreground)] px-6 text-[14px] font-semibold whitespace-nowrap inline-flex shadow-[0_4px_14px_rgb(75_45_127_/_0.3)] transition-all hover:shadow-[0_6px_20px_rgb(75_45_127_/_0.4)] lg:h-14 lg:px-7 lg:text-[15px]"
        style={{ color: "#fff" }}
      >
        <FileText className="size-4" />
        Submit Biodata
      </Link>
    </div>
  );
}

export function MobileAuthButtons() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div className="mt-3 h-12 w-full animate-pulse rounded bg-[var(--color-dark-08)]" />;
  }

  if (user) {
    return (
      <div className="mt-3 grid gap-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-3 text-[15px] font-semibold text-[var(--foreground)] hover:bg-[var(--color-dark-08)]"
        >
          <LayoutDashboard className="size-4" />
          Dashboard
        </Link>
        <button
          onClick={() => logout()}
          className="px-3 py-3 text-left text-[15px] font-semibold text-[var(--foreground)] hover:bg-[var(--color-dark-08)]"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3 grid gap-1">
      <Link
        href="/start"
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--foreground)] text-[14px] font-semibold"
        style={{ color: "#fff" }}
      >
        <FileText className="size-4" />
        Submit Biodata
      </Link>
    </div>
  );
}
