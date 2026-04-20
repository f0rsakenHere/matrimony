"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getProfileCompletion } from "@/lib/profile-completion";
import BiodataForm from "./_components/biodata-form";

export default function BiodataPage() {
  const { profile } = useAuth();
  const completion = profile ? getProfileCompletion(profile) : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h2 className="text-[var(--foreground)]">My Biodata</h2>
          <p className="mt-2 text-[var(--color-dark-56)]">
            Complete your marriage biodata to help families find the right match
          </p>
        </div>
        {/* Completion badge */}
        <div className="shrink-0 rounded-full border border-[var(--color-dark-18)] px-4 py-2 text-center">
          <span className="text-[20px] font-bold text-[var(--foreground)]">
            {completion}%
          </span>
          <p className="text-[11px] font-medium text-[var(--color-dark-56)]">
            Complete
          </p>
        </div>
      </div>

      <div className="mt-10">
        <BiodataForm />
      </div>
    </div>
  );
}
