"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { goldButtonClass } from "@/components/ui/button-styles";
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MapPin,
  GraduationCap,
  Briefcase,
  Moon,
  RotateCcw,
  Send,
} from "lucide-react";
import {
  MARITAL_STATUS_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  SECT_OPTIONS,
  PRAYER_ROUTINE_OPTIONS,
  COMPLEXION_OPTIONS,
  DIET_OPTIONS,
  SMOKING_OPTIONS,
  MODESTY_OPTIONS,
  HEIGHT_OPTIONS,
  COUNTRY_OPTIONS,
} from "@/lib/constants/biodata-options";

/* ─── Types ─── */

interface SearchProfile {
  _id: string;
  profileName: string;
  photoURL?: string;
  biodata: {
    personal: {
      dateOfBirth: string;
      gender: string;
      maritalStatus: string;
      height: string;
      complexion: string;
      city: string;
      country: string;
    };
    education: {
      educationLevel: string;
      occupation: string;
    };
    religious: {
      sect: string;
      prayerRoutine: string;
    };
    aboutMe: string;
  };
}

interface Filters {
  maritalStatus: string;
  ageMin: string;
  ageMax: string;
  heightMin: string;
  heightMax: string;
  complexion: string;
  country: string;
  city: string;
  educationLevel: string;
  sect: string;
  prayerRoutine: string;
  modesty: string;
  diet: string;
  smoking: string;
}

const EMPTY_FILTERS: Filters = {
  maritalStatus: "",
  ageMin: "",
  ageMax: "",
  heightMin: "",
  heightMax: "",
  complexion: "",
  country: "",
  city: "",
  educationLevel: "",
  sect: "",
  prayerRoutine: "",
  modesty: "",
  diet: "",
  smoking: "",
};

function calculateAge(dob: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

/* ─── Page ─── */

export default function SearchPage() {
  const { user, profile: myProfile } = useAuth();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [profiles, setProfiles] = useState<SearchProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const invitesLeft = myProfile?.invitesRemaining ?? 0;

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Reset page on filter/search change
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, filters]);

  const fetchResults = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const p = new URLSearchParams();
      p.set("uid", user.uid);
      p.set("page", String(page));
      p.set("limit", "12");
      if (debouncedQuery) p.set("q", debouncedQuery);
      Object.entries(filters).forEach(([k, v]) => {
        if (v) p.set(k, v);
      });

      const res = await fetch(`/api/profiles/search?${p.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProfiles(data.profiles ?? []);
        setTotalPages(data.totalPages ?? 1);
        setTotal(data.total ?? 0);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  }, [user, page, debouncedQuery, filters]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const activeFilterCount = Object.values(filters).filter((v) => v !== "").length;

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-10">
      <h2 className="text-[var(--foreground)]">Search Profiles</h2>
      <p className="mt-1 text-[14px] text-[var(--color-dark-56)]">
        Find your ideal match with detailed filters
      </p>

      {/* Search + Filters card */}
      <div className="mt-6 rounded-2xl border border-[var(--color-dark-12)] bg-[var(--background)] p-3 sm:p-5">
        {/* Search bar */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--color-dark-28)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, city, country, or occupation..."
            className="w-full rounded-2xl border border-[var(--color-dark-14)] bg-[var(--color-dark-04,rgba(30,58,95,0.04))] py-3.5 pl-12 pr-10 text-[15px] text-[var(--foreground)] outline-none transition-colors focus:border-[var(--foreground)] focus:ring-2 focus:ring-[var(--color-dark-08)] placeholder:text-[var(--color-dark-28)]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[var(--color-dark-56)] transition-colors hover:bg-[var(--color-dark-08)] hover:text-[var(--foreground)]"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Quick filter chips — always visible */}
        <div className="mt-4 flex flex-wrap gap-2">
          <QuickChipGroup
            label="Marital Status"
            options={MARITAL_STATUS_OPTIONS}
            value={filters.maritalStatus}
            onChange={(v) => setFilters((f) => ({ ...f, maritalStatus: v }))}
          />
          <span className="mx-1 self-center text-[var(--color-dark-12)]">|</span>
          <QuickChipGroup
            label="Sect"
            options={SECT_OPTIONS}
            value={filters.sect}
            onChange={(v) => setFilters((f) => ({ ...f, sect: v }))}
          />
        </div>

        {/* Advanced filters toggle */}
        <div className="mt-4 flex items-center gap-3 border-t border-[var(--color-dark-08)] pt-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-all",
              showFilters
                ? "shadow-sm"
                : "border border-[var(--color-dark-14)] text-[var(--color-dark-56)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
            )}
            style={
              showFilters
                ? { backgroundColor: "var(--foreground)", color: "var(--background)" }
                : undefined
            }
          >
            <SlidersHorizontal className="size-3.5" />
            Advanced Filters
            {activeFilterCount > 0 && (
              <span
                className="flex size-5 items-center justify-center rounded-full text-[11px] font-bold"
                style={
                  showFilters
                    ? { backgroundColor: "var(--background)", color: "var(--foreground)" }
                    : { backgroundColor: "var(--foreground)", color: "var(--background)" }
                }
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-[12px] font-medium text-[var(--color-dark-56)] transition-colors hover:text-[var(--foreground)]"
            >
              <RotateCcw className="size-3" />
              Clear all
            </button>
          )}

          {/* Invite balance */}
          <span className="ml-auto text-[13px] font-medium text-[var(--color-dark-56)]">
            <Send className="mr-1 inline size-3.5" />
            {invitesLeft} invite{invitesLeft !== 1 ? "s" : ""} left
          </span>
        </div>

        {/* Advanced filters panel */}
        {showFilters && (
          <div className="mt-4 space-y-5 rounded-2xl bg-[var(--color-dark-04,rgba(30,58,95,0.04))] p-3 sm:p-5">
            <FilterRow label="Location">
              <FilterSelect label="Country" value={filters.country} onChange={(v) => setFilters((f) => ({ ...f, country: v }))} options={COUNTRY_OPTIONS} />
              <FilterInput label="City" value={filters.city} onChange={(v) => setFilters((f) => ({ ...f, city: v }))} placeholder="e.g. Toronto" />
            </FilterRow>

            <FilterRow label="Age & Physical">
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[var(--color-dark-56)]">Age Range</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={filters.ageMin} onChange={(e) => setFilters((f) => ({ ...f, ageMin: e.target.value }))} placeholder="Min" min={16} max={80} className="w-full rounded-lg border border-[var(--color-dark-14)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--foreground)] placeholder:text-[var(--color-dark-28)]" />
                  <span className="shrink-0 text-[12px] text-[var(--color-dark-28)]">to</span>
                  <input type="number" value={filters.ageMax} onChange={(e) => setFilters((f) => ({ ...f, ageMax: e.target.value }))} placeholder="Max" min={16} max={80} className="w-full rounded-lg border border-[var(--color-dark-14)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--foreground)] placeholder:text-[var(--color-dark-28)]" />
                </div>
              </div>
              <FilterSelect label="Complexion" value={filters.complexion} onChange={(v) => setFilters((f) => ({ ...f, complexion: v }))} options={COMPLEXION_OPTIONS} />
              <FilterSelect label="Height (min)" value={filters.heightMin} onChange={(v) => setFilters((f) => ({ ...f, heightMin: v }))} options={HEIGHT_OPTIONS} placeholder="No min" />
              <FilterSelect label="Height (max)" value={filters.heightMax} onChange={(v) => setFilters((f) => ({ ...f, heightMax: v }))} options={HEIGHT_OPTIONS} placeholder="No max" />
            </FilterRow>

            <FilterRow label="Education">
              <FilterSelect label="Education Level" value={filters.educationLevel} onChange={(v) => setFilters((f) => ({ ...f, educationLevel: v }))} options={EDUCATION_LEVEL_OPTIONS} />
            </FilterRow>

            <FilterRow label="Religious & Lifestyle">
              <FilterSelect label="Prayer Routine" value={filters.prayerRoutine} onChange={(v) => setFilters((f) => ({ ...f, prayerRoutine: v }))} options={PRAYER_ROUTINE_OPTIONS} />
              <FilterSelect label="Modesty" value={filters.modesty} onChange={(v) => setFilters((f) => ({ ...f, modesty: v }))} options={MODESTY_OPTIONS} />
              <FilterSelect label="Diet" value={filters.diet} onChange={(v) => setFilters((f) => ({ ...f, diet: v }))} options={DIET_OPTIONS} />
              <FilterSelect label="Smoking" value={filters.smoking} onChange={(v) => setFilters((f) => ({ ...f, smoking: v }))} options={SMOKING_OPTIONS} />
            </FilterRow>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mt-5 flex items-center justify-between">
        <p className="text-[13px] font-medium text-[var(--color-dark-56)]">
          {loading ? "Searching..." : `${total} profile${total !== 1 ? "s" : ""} found`}
        </p>
      </div>

      {/* Results grid */}
      {loading ? (
        <div className="mt-10 flex justify-center">
          <div className="size-7 animate-spin rounded-full border-2 border-[var(--foreground)] border-t-transparent" />
        </div>
      ) : profiles.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-[16px] font-medium text-[var(--color-dark-56)]">
            No profiles match your criteria
          </p>
          <p className="mt-1 text-[14px] text-[var(--color-dark-28)]">
            Try adjusting your filters or search term
          </p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {profiles.map((p) => (
            <ProfileCard key={p._id} profile={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <p className="text-[13px] text-[var(--color-dark-56)]">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex size-9 items-center justify-center rounded-xl border border-[var(--color-dark-18)] text-[var(--foreground)] transition-colors hover:bg-[var(--color-dark-08)] disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex size-9 items-center justify-center rounded-xl border border-[var(--color-dark-18)] text-[var(--foreground)] transition-colors hover:bg-[var(--color-dark-08)] disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Filter helpers ─── */

function QuickChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <>
      <span className="self-center text-[11px] font-semibold uppercase tracking-wider text-[var(--color-dark-28)]">
        {label}:
      </span>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(value === opt ? "" : opt)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all",
            value === opt
              ? "shadow-sm"
              : "border border-[var(--color-dark-14)] text-[var(--color-dark-56)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
          )}
          style={
            value === opt
              ? { backgroundColor: "var(--foreground)", color: "var(--background)" }
              : undefined
          }
        >
          {opt}
        </button>
      ))}
    </>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-[var(--color-dark-56)]">
        {label}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {children}
      </div>
    </div>
  );
}

function FilterInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[12px] font-semibold text-[var(--color-dark-56)]">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--color-dark-14)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--foreground)] placeholder:text-[var(--color-dark-28)]"
      />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "All",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[12px] font-semibold text-[var(--color-dark-56)]">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[var(--color-dark-14)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--foreground)]"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

/* ─── Profile card ─── */

function ProfileCard({
  profile,
}: {
  profile: SearchProfile;
}) {
  const { personal, education, religious, aboutMe } = profile.biodata;
  const age = calculateAge(personal.dateOfBirth);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-white transition-shadow hover:shadow-[0_8px_24px_rgb(30_58_95_/_0.08)]">
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{ backgroundColor: "var(--foreground)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-semibold"
            style={{ backgroundColor: "rgba(240,244,248,0.18)", color: "var(--color-light)" }}
          >
            {profile.profileName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p
              className="truncate text-[16px] font-semibold"
              style={{ color: "var(--color-light)" }}
            >
              {profile.profileName}
            </p>
            <p style={{ color: "var(--color-light-72)" }} className="text-[13px]">
              {[age ? `${age} yrs` : null, personal.height, personal.maritalStatus]
                .filter(Boolean)
                .join(" · ") || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-5 py-4">
        <div className="space-y-2.5">
          {(personal.city || personal.country) && (
            <InfoRow icon={MapPin}>
              {[personal.city, personal.country].filter(Boolean).join(", ")}
            </InfoRow>
          )}
          {education.educationLevel && (
            <InfoRow icon={GraduationCap}>{education.educationLevel}</InfoRow>
          )}
          {education.occupation && (
            <InfoRow icon={Briefcase}>{education.occupation}</InfoRow>
          )}
          {religious.prayerRoutine && (
            <InfoRow icon={Moon}>{religious.prayerRoutine}</InfoRow>
          )}
        </div>

        {aboutMe && (
          <p className="mt-4 line-clamp-2 text-[13px] leading-relaxed text-[var(--color-dark-56)]">
            {aboutMe}
          </p>
        )}

        <div className="mt-auto pt-4">
          <Link
            href={`/dashboard/profile/${profile._id}`}
            className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-[var(--color-dark-18)] text-[13px] font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--color-dark-08)]"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-[var(--color-dark-72)]">
      <Icon className="size-3.5 shrink-0 text-[var(--color-dark-56)]" />
      <span className="truncate">{children}</span>
    </div>
  );
}
