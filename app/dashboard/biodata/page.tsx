"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getProfileCompletion } from "@/lib/profile-completion";
import BiodataForm from "./_components/biodata-form";

export default function BiodataPage() {
  const { profile } = useAuth();
  const completion = profile ? getProfileCompletion(profile) : 0;

  return (
    <div className="mx-auto max-w-4xl px-3 py-4 sm:px-6 sm:py-10">
      {/* Page header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[20px] text-[var(--foreground)] sm:text-[var(--font-size-h2-mobile)]">My Biodata</h2>
          <p className="mt-1 text-[13px] text-[var(--color-dark-56)] sm:mt-2 sm:text-[16px]">
            Complete your biodata to help families find the right match
          </p>
        </div>
        {/* Completion badge */}
        <div className="flex shrink-0 items-baseline gap-1.5 rounded-full border border-[var(--color-dark-18)] px-3.5 py-1.5 sm:px-4 sm:py-2">
          <span className="text-[15px] font-bold text-[var(--foreground)] sm:text-[16px]">
            {completion}%
          </span>
          <p className="text-[11px] font-medium text-[var(--color-dark-56)] sm:text-[12px]">
            Complete
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mt-10">
        <BiodataForm />
      </div>
    </div>
  );
}
