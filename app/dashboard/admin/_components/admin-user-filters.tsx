"use client";

import {
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  SECT_OPTIONS,
  COUNTRY_OPTIONS,
} from "@/lib/constants/biodata-options";

/* ─── Types ─── */

export interface Filters {
  gender: string;
  maritalStatus: string;
  educationLevel: string;
  sect: string;
  beard: string;
  country: string;
  city: string;
  ageMin: string;
  ageMax: string;
  onboardingComplete: string;
  provider: string;
  hasWali: string;
}

export const EMPTY_FILTERS: Filters = {
  gender: "",
  maritalStatus: "",
  educationLevel: "",
  sect: "",
  beard: "",
  country: "",
  city: "",
  ageMin: "",
  ageMax: "",
  onboardingComplete: "",
  provider: "",
  hasWali: "",
};

/* ─── FilterSelect ─── */

function FilterSelect({
  label,
  value,
  onChange,
  options,
  labels,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  labels?: string[];
}) {
  return (
    <div>
      <label className="mb-1 block text-[12px] font-semibold text-[var(--color-dark-56)]">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[var(--color-dark-14)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--foreground)]"
      >
        <option value="">All</option>
        {options.map((opt, i) => (
          <option key={opt} value={opt}>{labels ? labels[i] : opt}</option>
        ))}
      </select>
    </div>
  );
}

/* ─── AdminUserFilters ─── */

export function AdminUserFilters({
  query,
  setQuery,
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  activeFilterCount,
}: {
  query: string;
  setQuery: (v: string) => void;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  activeFilterCount: number;
}) {
  return (
    <>
      {/* Search + Filters toggle */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--color-dark-56)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, city, country, or occupation..."
            className="w-full rounded-xl border border-[var(--color-dark-14)] bg-[var(--background)] py-3 pl-11 pr-10 text-[14px] text-[var(--foreground)] outline-none transition-colors focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)] placeholder:text-[var(--color-dark-28)]"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--color-dark-56)] hover:bg-[var(--color-dark-08)]">
              <X className="size-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-3 text-[14px] font-medium transition-colors",
            showFilters || activeFilterCount > 0
              ? "border-[var(--foreground)]"
              : "border-[var(--color-dark-18)] text-[var(--foreground)] hover:border-[var(--foreground)]"
          )}
          style={showFilters || activeFilterCount > 0 ? { backgroundColor: "var(--foreground)", color: "var(--background)" } : undefined}
        >
          <SlidersHorizontal className="size-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full text-[11px] font-bold" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="mt-3 rounded-2xl border border-[var(--color-dark-12)] bg-[var(--color-dark-04,rgba(30,58,95,0.04))] px-4 py-4 sm:px-5">
          <div className="grid gap-x-3 gap-y-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            <FilterSelect label="Gender" value={filters.gender} onChange={(v) => setFilters((f) => ({ ...f, gender: v }))} options={GENDER_OPTIONS} />
            <FilterSelect label="Marital Status" value={filters.maritalStatus} onChange={(v) => setFilters((f) => ({ ...f, maritalStatus: v }))} options={MARITAL_STATUS_OPTIONS} />
            <FilterSelect label="Education" value={filters.educationLevel} onChange={(v) => setFilters((f) => ({ ...f, educationLevel: v }))} options={EDUCATION_LEVEL_OPTIONS} />
            <FilterSelect label="Sect" value={filters.sect} onChange={(v) => setFilters((f) => ({ ...f, sect: v }))} options={SECT_OPTIONS} />
            <FilterSelect label="Beard" value={filters.beard} onChange={(v) => setFilters((f) => ({ ...f, beard: v }))} options={["Yes", "No"]} />
            <FilterSelect label="Country" value={filters.country} onChange={(v) => setFilters((f) => ({ ...f, country: v }))} options={COUNTRY_OPTIONS} />
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[var(--color-dark-56)]">City</label>
              <input type="text" value={filters.city} onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))} placeholder="e.g. Toronto" className="w-full rounded-lg border border-[var(--color-dark-14)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--foreground)] placeholder:text-[var(--color-dark-28)]" />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[var(--color-dark-56)]">Age Range</label>
              <div className="flex items-center gap-1.5">
                <input type="number" value={filters.ageMin} onChange={(e) => setFilters((f) => ({ ...f, ageMin: e.target.value }))} placeholder="Min" min={16} max={80} className="w-full rounded-lg border border-[var(--color-dark-14)] bg-[var(--background)] px-2.5 py-2 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--foreground)] placeholder:text-[var(--color-dark-28)]" />
                <span className="text-[var(--color-dark-28)]">–</span>
                <input type="number" value={filters.ageMax} onChange={(e) => setFilters((f) => ({ ...f, ageMax: e.target.value }))} placeholder="Max" min={16} max={80} className="w-full rounded-lg border border-[var(--color-dark-14)] bg-[var(--background)] px-2.5 py-2 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--foreground)] placeholder:text-[var(--color-dark-28)]" />
              </div>
            </div>
            <FilterSelect label="Onboarding" value={filters.onboardingComplete} onChange={(v) => setFilters((f) => ({ ...f, onboardingComplete: v }))} options={["true", "false"]} labels={["Complete", "Incomplete"]} />
            <FilterSelect label="Provider" value={filters.provider} onChange={(v) => setFilters((f) => ({ ...f, provider: v }))} options={["email", "google"]} labels={["Email", "Google"]} />
            <FilterSelect label="Has Wali" value={filters.hasWali} onChange={(v) => setFilters((f) => ({ ...f, hasWali: v }))} options={["true", "false"]} labels={["Yes", "No"]} />
          </div>

          {activeFilterCount > 0 && (
            <button onClick={() => setFilters(EMPTY_FILTERS)} className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--foreground)] hover:opacity-80">
              <RotateCcw className="size-3" />
              Clear all filters
            </button>
          )}
        </div>
      )}
    </>
  );
}
