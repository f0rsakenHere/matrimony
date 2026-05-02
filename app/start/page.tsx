"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PublicBiodataForm from "./_components/public-biodata-form";

export default function StartPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Logged-in users belong on the dashboard biodata page where edits persist
  // to their account, not in the anonymous funnel.
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard/biodata");
    }
  }, [loading, user, router]);

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--foreground)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-4xl px-3 py-6 sm:px-6 sm:py-12">
        <PublicBiodataForm />
      </div>
    </div>
  );
}
