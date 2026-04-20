"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ShieldCheck,
  ShieldOff,
  RotateCcw,
  Users,
  UserCheck,
  UserX,
  Eye,
  Heart,
  Plus,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Link2,
  Loader2,
  StickyNote,
} from "lucide-react";
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  SECT_OPTIONS,
  COUNTRY_OPTIONS,
} from "@/lib/constants/biodata-options";

/* ─── Types ─── */

interface AdminUser {
  _id: string;
  firebaseUid: string;
  email: string;
  provider: string;
  profileName: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  onboardingComplete: boolean;
  createdAt: string;
  biodata: {
    personal: {
      dateOfBirth: string;
      gender: string;
      maritalStatus: string;
      height: string;
      city: string;
      country: string;
    };
    education: {
      educationLevel: string;
      occupation: string;
    };
    religious: {
      sect: string;
    };
    family: {
      waliName: string;
      waliPhone: string;
    };
  };
}

interface ManualMatch {
  _id: string;
  user1Id: string;
  user1Name: string;
  user2Id: string;
  user2Name: string;
  status: "matched" | "contacted" | "successful" | "unsuccessful";
  notes: string;
  createdAt: string;
}

interface MatchStats {
  matched: number;
  contacted: number;
  successful: number;
  unsuccessful: number;
}

interface Filters {
  gender: string;
  maritalStatus: string;
  educationLevel: string;
  sect: string;
  country: string;
  city: string;
  ageMin: string;
  ageMax: string;
  onboardingComplete: string;
  provider: string;
  hasWali: string;
}

const EMPTY_FILTERS: Filters = {
  gender: "",
  maritalStatus: "",
  educationLevel: "",
  sect: "",
  country: "",
  city: "",
  ageMin: "",
  ageMax: "",
  onboardingComplete: "",
  provider: "",
  hasWali: "",
};

const STATUS_CONFIG = {
  matched: { label: "Matched", color: "bg-blue-50 text-blue-700", icon: Link2 },
  contacted: { label: "Contacted", color: "bg-amber-50 text-amber-700", icon: MessageCircle },
  successful: { label: "Successful", color: "bg-green-50 text-green-700", icon: CheckCircle2 },
  unsuccessful: { label: "Unsuccessful", color: "bg-gray-100 text-gray-600", icon: XCircle },
};

function calculateAge(dob: string): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age;
}

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getUserDisplayName(u: AdminUser) {
  return u.profileName || `${u.firstName} ${u.lastName}`.trim() || u.email;
}

/* ─── Page ─── */

export default function AdminPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"users" | "matches">(() => {
    if (typeof window !== "undefined" && window.location.hash === "#matches") return "matches";
    return "users";
  });

  function switchTab(tab: "users" | "matches") {
    setActiveTab(tab);
    window.history.replaceState(null, "", tab === "matches" ? "#matches" : "#users");
  }

  // ─── Users state ───
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ─── Matches state ───
  const [matches, setMatches] = useState<ManualMatch[]>([]);
  const [matchStats, setMatchStats] = useState<MatchStats>({ matched: 0, contacted: 0, successful: 0, unsuccessful: 0 });
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchPage, setMatchPage] = useState(1);
  const [matchTotalPages, setMatchTotalPages] = useState(1);
  const [matchFilter, setMatchFilter] = useState("");
  const [showCreateMatch, setShowCreateMatch] = useState(false);

  // Gate: redirect non-admins
  useEffect(() => {
    if (profile && !profile.isAdmin) {
      router.push("/dashboard");
    }
  }, [profile, router]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, filters]);

  const fetchUsers = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const p = new URLSearchParams();
      p.set("adminUid", user.uid);
      p.set("page", String(page));
      p.set("limit", "20");
      if (debouncedQuery) p.set("q", debouncedQuery);
      Object.entries(filters).forEach(([k, v]) => {
        if (v) p.set(k, v);
      });

      const res = await fetch(`/api/admin/users?${p.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users ?? []);
        setTotalPages(data.totalPages ?? 1);
        setTotal(data.total ?? 0);
      }
    } catch (err) {
      console.error("Admin fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, [user, page, debouncedQuery, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchMatches = useCallback(async () => {
    if (!user) return;
    setMatchesLoading(true);
    try {
      const p = new URLSearchParams();
      p.set("adminUid", user.uid);
      p.set("page", String(matchPage));
      p.set("limit", "20");
      if (matchFilter) p.set("status", matchFilter);

      const res = await fetch(`/api/admin/matches?${p.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches ?? []);
        setMatchTotalPages(data.totalPages ?? 1);
        setMatchStats(data.stats ?? { matched: 0, contacted: 0, successful: 0, unsuccessful: 0 });
      }
    } catch (err) {
      console.error("Matches fetch failed:", err);
    } finally {
      setMatchesLoading(false);
    }
  }, [user, matchPage, matchFilter]);

  useEffect(() => {
    if (activeTab === "matches") fetchMatches();
  }, [activeTab, fetchMatches]);

  async function deleteUser(userId: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setActionLoading(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminUid: user!.uid, userId }),
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setActionLoading(null);
    }
  }

  async function toggleAdmin(userId: string, current: boolean) {
    const action = current ? "remove admin from" : "make admin";
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    setActionLoading(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminUid: user!.uid,
          userId,
          updates: { isAdmin: !current },
        }),
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error("Toggle admin failed:", err);
    } finally {
      setActionLoading(null);
    }
  }

  async function updateMatchStatus(matchId: string, status: string) {
    try {
      const res = await fetch("/api/admin/matches", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminUid: user!.uid, matchId, status }),
      });
      if (res.ok) fetchMatches();
    } catch (err) {
      console.error("Update match failed:", err);
    }
  }

  async function updateMatchNotes(matchId: string, notes: string) {
    try {
      const res = await fetch("/api/admin/matches", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminUid: user!.uid, matchId, notes }),
      });
      if (res.ok) {
        setMatches((prev) => prev.map((m) => m._id === matchId ? { ...m, notes } : m));
      }
    } catch (err) {
      console.error("Update notes failed:", err);
    }
  }

  async function deleteMatch(matchId: string) {
    if (!confirm("Delete this match?")) return;
    try {
      const res = await fetch("/api/admin/matches", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminUid: user!.uid, matchId }),
      });
      if (res.ok) fetchMatches();
    } catch (err) {
      console.error("Delete match failed:", err);
    }
  }

  const activeFilterCount = Object.values(filters).filter((v) => v !== "").length;

  // Stats
  const maleCount = users.filter((u) => u.biodata?.personal?.gender === "Male").length;
  const femaleCount = users.filter((u) => u.biodata?.personal?.gender === "Female").length;
  const completeCount = users.filter((u) => u.onboardingComplete).length;

  if (profile && !profile.isAdmin) return null;

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-10">
      <h2 className="text-[var(--foreground)]">Admin Dashboard</h2>
      <p className="mt-1 text-[14px] text-[var(--color-dark-56)]">
        Manage users and matchmaking
      </p>

      {/* Tabs */}
      <div className="mt-6 flex gap-2">
        <button
          onClick={() => switchTab("users")}
          className={cn(
            "rounded-full px-5 py-2 text-[13px] font-semibold transition-colors",
            activeTab === "users"
              ? "shadow-sm"
              : "text-[var(--color-dark-56)] hover:bg-[var(--color-dark-08)]"
          )}
          style={
            activeTab === "users"
              ? { backgroundColor: "var(--foreground)", color: "var(--background)" }
              : undefined
          }
        >
          <span className="flex items-center gap-2">
            <Users className="size-4" />
            Users
          </span>
        </button>
        <button
          onClick={() => switchTab("matches")}
          className={cn(
            "rounded-full px-5 py-2 text-[13px] font-semibold transition-colors",
            activeTab === "matches"
              ? "shadow-sm"
              : "text-[var(--color-dark-56)] hover:bg-[var(--color-dark-08)]"
          )}
          style={
            activeTab === "matches"
              ? { backgroundColor: "var(--foreground)", color: "var(--background)" }
              : undefined
          }
        >
          <span className="flex items-center gap-2">
            <Heart className="size-4" />
            Matches
          </span>
        </button>
      </div>

      {/* ═══════════ USERS TAB ═══════════ */}
      {activeTab === "users" && (
        <>
          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard icon={Users} label="Total Users" value={total} />
            <StatCard icon={UserCheck} label="Complete" value={completeCount} color="text-green-700" />
            <StatCard icon={UserX} label="Male" value={maleCount} color="text-blue-700" />
            <StatCard icon={UserCheck} label="Female" value={femaleCount} color="text-pink-700" />
          </div>

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
            <div className="mt-3 rounded-2xl border border-[var(--color-dark-12)] bg-[var(--color-dark-04,rgba(30,58,95,0.04))] p-5">
              <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-[var(--color-dark-56)]">Profile</p>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <FilterSelect label="Gender" value={filters.gender} onChange={(v) => setFilters((f) => ({ ...f, gender: v }))} options={GENDER_OPTIONS} />
                <FilterSelect label="Marital Status" value={filters.maritalStatus} onChange={(v) => setFilters((f) => ({ ...f, maritalStatus: v }))} options={MARITAL_STATUS_OPTIONS} />
                <FilterSelect label="Education" value={filters.educationLevel} onChange={(v) => setFilters((f) => ({ ...f, educationLevel: v }))} options={EDUCATION_LEVEL_OPTIONS} />
                <FilterSelect label="Sect" value={filters.sect} onChange={(v) => setFilters((f) => ({ ...f, sect: v }))} options={SECT_OPTIONS} />
              </div>

              <p className="mb-3 mt-5 text-[12px] font-semibold uppercase tracking-wider text-[var(--color-dark-56)]">Location & Age</p>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <FilterSelect label="Country" value={filters.country} onChange={(v) => setFilters((f) => ({ ...f, country: v }))} options={COUNTRY_OPTIONS} />
                <div>
                  <label className="mb-1 block text-[12px] font-semibold text-[var(--color-dark-56)]">City</label>
                  <input type="text" value={filters.city} onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))} placeholder="e.g. Toronto" className="w-full rounded-lg border border-[var(--color-dark-14)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--foreground)] placeholder:text-[var(--color-dark-28)]" />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-semibold text-[var(--color-dark-56)]">Age Range</label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={filters.ageMin} onChange={(e) => setFilters((f) => ({ ...f, ageMin: e.target.value }))} placeholder="Min" min={16} max={80} className="w-full rounded-lg border border-[var(--color-dark-14)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--foreground)] placeholder:text-[var(--color-dark-28)]" />
                    <span className="text-[var(--color-dark-28)]">–</span>
                    <input type="number" value={filters.ageMax} onChange={(e) => setFilters((f) => ({ ...f, ageMax: e.target.value }))} placeholder="Max" min={16} max={80} className="w-full rounded-lg border border-[var(--color-dark-14)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--foreground)] placeholder:text-[var(--color-dark-28)]" />
                  </div>
                </div>
              </div>

              <p className="mb-3 mt-5 text-[12px] font-semibold uppercase tracking-wider text-[var(--color-dark-56)]">Account Status</p>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <FilterSelect label="Onboarding" value={filters.onboardingComplete} onChange={(v) => setFilters((f) => ({ ...f, onboardingComplete: v }))} options={["true", "false"]} labels={["Complete", "Incomplete"]} />
                <FilterSelect label="Auth Provider" value={filters.provider} onChange={(v) => setFilters((f) => ({ ...f, provider: v }))} options={["email", "google"]} labels={["Email", "Google"]} />
                <FilterSelect label="Has Wali Info" value={filters.hasWali} onChange={(v) => setFilters((f) => ({ ...f, hasWali: v }))} options={["true", "false"]} labels={["Yes", "No"]} />
              </div>

              {activeFilterCount > 0 && (
                <button onClick={() => setFilters(EMPTY_FILTERS)} className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--foreground)] hover:opacity-80">
                  <RotateCcw className="size-3.5" />
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Results count */}
          <p className="mt-5 text-[13px] font-medium text-[var(--color-dark-56)]">
            {loading ? "Loading..." : `${total} user${total !== 1 ? "s" : ""}`}
          </p>

          {/* Table */}
          <div className="-mx-4 mt-3 overflow-x-auto sm:mx-0 sm:rounded-2xl sm:border sm:border-[var(--color-dark-12)]">
            <table className="w-full min-w-[800px] text-left text-[14px]">
              <thead>
                <tr className="border-b border-[var(--color-dark-12)] bg-[var(--color-dark-08)]">
                  <Th>User</Th>
                  <Th>Email</Th>
                  <Th>Gender</Th>
                  <Th>Age</Th>
                  <Th>Location</Th>
                  <Th>Wali</Th>
                  <Th>Status</Th>
                  <Th>Joined</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center">
                      <div className="inline-flex size-6 animate-spin rounded-full border-2 border-[var(--foreground)] border-t-transparent" />
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-[var(--color-dark-56)]">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const age = calculateAge(u.biodata?.personal?.dateOfBirth);
                    const loc = [u.biodata?.personal?.city, u.biodata?.personal?.country].filter(Boolean).join(", ");
                    const hasW = !!(u.biodata?.family?.waliName && u.biodata?.family?.waliPhone);
                    const isActing = actionLoading === u._id;

                    return (
                      <tr
                        key={u._id}
                        className="border-b border-[var(--color-dark-08)] bg-[var(--background)] transition-colors last:border-b-0 hover:bg-[var(--color-dark-08)]"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex size-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
                              style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
                            >
                              {(u.profileName || u.firstName || "?").charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-[14px] font-medium text-[var(--foreground)]">
                                {getUserDisplayName(u)}
                              </p>
                              {u.isAdmin && (
                                <span className="text-[11px] font-semibold text-amber-600">Admin</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-[var(--color-dark-72)]">
                          {u.email}
                        </td>
                        <td className="px-4 py-3">
                          {u.biodata?.personal?.gender ? (
                            <span className={cn(
                              "inline-flex rounded-full px-2.5 py-0.5 text-[12px] font-semibold",
                              u.biodata.personal.gender === "Male" ? "bg-blue-50 text-blue-700" : "bg-pink-50 text-pink-700"
                            )}>
                              {u.biodata.personal.gender}
                            </span>
                          ) : (
                            <span className="text-[13px] text-[var(--color-dark-28)]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-[var(--color-dark-72)]">
                          {age ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-[var(--color-dark-72)]">
                          {loc || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-[12px] font-semibold",
                            hasW ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"
                          )}>
                            {hasW ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-[12px] font-semibold",
                            u.onboardingComplete ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                          )}>
                            {u.onboardingComplete ? "Complete" : "Incomplete"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-[var(--color-dark-72)]">
                          {formatDate(u.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => router.push(`/dashboard/profile/${u._id}`)}
                              className="rounded-lg p-1.5 text-[var(--color-dark-56)] transition-colors hover:bg-[var(--color-dark-12)] hover:text-[var(--foreground)]"
                              title="View profile"
                            >
                              <Eye className="size-4" />
                            </button>
                            <button
                              onClick={() => toggleAdmin(u._id, u.isAdmin)}
                              disabled={isActing}
                              className="rounded-lg p-1.5 text-[var(--color-dark-56)] transition-colors hover:bg-[var(--color-dark-12)] hover:text-[var(--foreground)] disabled:opacity-40"
                              title={u.isAdmin ? "Remove admin" : "Make admin"}
                            >
                              {u.isAdmin ? <ShieldOff className="size-4" /> : <ShieldCheck className="size-4" />}
                            </button>
                            <button
                              onClick={() => deleteUser(u._id, getUserDisplayName(u))}
                              disabled={isActing}
                              className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
                              title="Delete user"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-[13px] text-[var(--color-dark-56)]">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="inline-flex size-9 items-center justify-center rounded-xl border border-[var(--color-dark-18)] text-[var(--foreground)] transition-colors hover:bg-[var(--color-dark-08)] disabled:opacity-40">
                  <ChevronLeft className="size-4" />
                </button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="inline-flex size-9 items-center justify-center rounded-xl border border-[var(--color-dark-18)] text-[var(--foreground)] transition-colors hover:bg-[var(--color-dark-08)] disabled:opacity-40">
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══════════ MATCHES TAB ═══════════ */}
      {activeTab === "matches" && (
        <>
          {/* Stats as clickable filter cards */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <button
              onClick={() => { setMatchFilter(""); setMatchPage(1); }}
              className={cn(
                "rounded-2xl border p-4 text-left transition-all",
                matchFilter === ""
                  ? "border-[var(--foreground)] shadow-sm"
                  : "border-[var(--color-dark-12)] hover:border-[var(--color-dark-18)]"
              )}
            >
              <p className="text-[24px] font-bold text-[var(--foreground)]">
                {matchStats.matched + matchStats.contacted + matchStats.successful + matchStats.unsuccessful}
              </p>
              <p className="text-[12px] font-medium text-[var(--color-dark-56)]">All Matches</p>
            </button>
            {(["matched", "contacted", "successful", "unsuccessful"] as const).map((s) => {
              const c = STATUS_CONFIG[s];
              const Icon = c.icon;
              return (
                <button
                  key={s}
                  onClick={() => { setMatchFilter(matchFilter === s ? "" : s); setMatchPage(1); }}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-all",
                    matchFilter === s
                      ? "border-[var(--foreground)] shadow-sm"
                      : "border-[var(--color-dark-12)] hover:border-[var(--color-dark-18)]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[24px] font-bold text-[var(--foreground)]">{matchStats[s]}</p>
                    <div className={cn("flex size-8 items-center justify-center rounded-full", c.color.split(" ")[0])}>
                      <Icon className={cn("size-4", c.color.split(" ")[1])} />
                    </div>
                  </div>
                  <p className="mt-1 text-[12px] font-medium text-[var(--color-dark-56)]">{c.label}</p>
                </button>
              );
            })}
          </div>

          {/* Create button */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-[13px] font-medium text-[var(--color-dark-56)]">
              {matchFilter ? `Showing ${STATUS_CONFIG[matchFilter as keyof typeof STATUS_CONFIG]?.label.toLowerCase()} matches` : "Showing all matches"}
            </p>
            <button
              onClick={() => setShowCreateMatch(true)}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold shadow-sm transition-colors"
              style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
            >
              <Plus className="size-4" />
              Create Match
            </button>
          </div>

          {/* Create match modal */}
          {showCreateMatch && (
            <CreateMatchModal
              adminUid={user!.uid}
              onClose={() => setShowCreateMatch(false)}
              onCreated={() => { setShowCreateMatch(false); fetchMatches(); }}
            />
          )}

          {/* Matches list */}
          <div className="mt-5 space-y-3">
            {matchesLoading ? (
              <div className="flex justify-center py-16">
                <div className="size-6 animate-spin rounded-full border-2 border-[var(--foreground)] border-t-transparent" />
              </div>
            ) : matches.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--color-dark-18)] bg-white py-16 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--color-dark-08)]">
                  <Heart className="size-6 text-[var(--color-dark-28)]" />
                </div>
                <p className="mt-4 text-[16px] font-semibold text-[var(--foreground)]">
                  {matchFilter ? "No matches with this status" : "No matches yet"}
                </p>
                <p className="mt-1 text-[14px] text-[var(--color-dark-56)]">
                  {matchFilter ? "Try a different filter or create a new match" : "Pair two users together to start matchmaking"}
                </p>
                <button
                  onClick={() => setShowCreateMatch(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold transition-colors"
                  style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
                >
                  <Plus className="size-4" />
                  Create Match
                </button>
              </div>
            ) : (
              matches.map((m) => (
                <MatchCard
                  key={m._id}
                  match={m}
                  onStatusChange={(status) => updateMatchStatus(m._id, status)}
                  onNotesChange={(notes) => updateMatchNotes(m._id, notes)}
                  onDelete={() => deleteMatch(m._id)}
                  onViewProfile={(id) => router.push(`/dashboard/profile/${id}`)}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {matchTotalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-[13px] text-[var(--color-dark-56)]">
                Page {matchPage} of {matchTotalPages}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setMatchPage((p) => Math.max(1, p - 1))} disabled={matchPage <= 1} className="inline-flex size-9 items-center justify-center rounded-xl border border-[var(--color-dark-18)] text-[var(--foreground)] transition-colors hover:bg-[var(--color-dark-08)] disabled:opacity-40">
                  <ChevronLeft className="size-4" />
                </button>
                <button onClick={() => setMatchPage((p) => Math.min(matchTotalPages, p + 1))} disabled={matchPage >= matchTotalPages} className="inline-flex size-9 items-center justify-center rounded-xl border border-[var(--color-dark-18)] text-[var(--foreground)] transition-colors hover:bg-[var(--color-dark-08)] disabled:opacity-40">
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── Create Match Modal ─── */

function CreateMatchModal({
  adminUid,
  onClose,
  onCreated,
}: {
  adminUid: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [results1, setResults1] = useState<AdminUser[]>([]);
  const [results2, setResults2] = useState<AdminUser[]>([]);
  const [selected1, setSelected1] = useState<AdminUser | null>(null);
  const [selected2, setSelected2] = useState<AdminUser | null>(null);
  const [notes, setNotes] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [searching1, setSearching1] = useState(false);
  const [searching2, setSearching2] = useState(false);
  const timeout1 = useRef<NodeJS.Timeout>(null);
  const timeout2 = useRef<NodeJS.Timeout>(null);

  function searchUsers(q: string, setter: (u: AdminUser[]) => void, loadingSetter: (v: boolean) => void) {
    if (q.length < 2) { setter([]); return; }
    loadingSetter(true);
    const p = new URLSearchParams();
    p.set("adminUid", adminUid);
    p.set("q", q);
    p.set("limit", "6");
    fetch(`/api/admin/users?${p.toString()}`)
      .then((r) => r.json())
      .then((d) => setter(d.users ?? []))
      .catch(() => setter([]))
      .finally(() => loadingSetter(false));
  }

  function handleSearch1(v: string) {
    setSearch1(v);
    if (timeout1.current) clearTimeout(timeout1.current);
    timeout1.current = setTimeout(() => searchUsers(v, setResults1, setSearching1), 300);
  }

  function handleSearch2(v: string) {
    setSearch2(v);
    if (timeout2.current) clearTimeout(timeout2.current);
    timeout2.current = setTimeout(() => searchUsers(v, setResults2, setSearching2), 300);
  }

  async function handleCreate() {
    if (!selected1 || !selected2) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/admin/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminUid,
          user1Id: selected1._id,
          user2Id: selected2._id,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create match");
        return;
      }
      onCreated();
    } catch {
      setError("Something went wrong");
    } finally {
      setCreating(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
        <div
          className="w-full max-w-lg rounded-2xl bg-[var(--background)] shadow-[0_24px_64px_rgba(0,0,0,0.2)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-[var(--color-dark-12)] px-6 py-4">
            <h3 className="text-[var(--foreground)]">Create Match</h3>
            <button onClick={onClose} className="rounded-lg p-1.5 text-[var(--color-dark-56)] hover:bg-[var(--color-dark-08)]">
              <X className="size-5" />
            </button>
          </div>

          <div className="space-y-5 p-6">
            {/* Person 1 */}
            <UserSearchField
              label="Person 1"
              value={search1}
              onChange={handleSearch1}
              results={results1}
              selected={selected1}
              searching={searching1}
              onSelect={(u) => { setSelected1(u); setSearch1(""); setResults1([]); }}
              onClear={() => setSelected1(null)}
              excludeId={selected2?._id}
            />

            <div className="flex items-center justify-center">
              <div className="flex size-10 items-center justify-center rounded-full border border-[var(--color-dark-12)]">
                <Heart className="size-4 text-[var(--color-dark-56)]" />
              </div>
            </div>

            {/* Person 2 */}
            <UserSearchField
              label="Person 2"
              value={search2}
              onChange={handleSearch2}
              results={results2}
              selected={selected2}
              searching={searching2}
              onSelect={(u) => { setSelected2(u); setSearch2(""); setResults2([]); }}
              onClear={() => setSelected2(null)}
              excludeId={selected1?._id}
            />

            {/* Notes */}
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[var(--color-dark-56)]">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any notes about this match..."
                rows={2}
                className="w-full rounded-xl border border-[var(--color-dark-14)] bg-[var(--background)] px-4 py-3 text-[14px] text-[var(--foreground)] outline-none focus:border-[var(--foreground)] placeholder:text-[var(--color-dark-28)]"
              />
            </div>

            {error && (
              <p className="text-[13px] font-medium text-red-600">{error}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[var(--color-dark-12)] px-6 py-4">
            <button
              onClick={onClose}
              className="rounded-xl border border-[var(--color-dark-18)] px-5 py-2.5 text-[13px] font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--color-dark-08)]"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!selected1 || !selected2 || creating}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold transition-colors disabled:opacity-40"
              style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
            >
              {creating && <Loader2 className="size-4 animate-spin" />}
              Create Match
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── User Search Field ─── */

function UserSearchField({
  label,
  value,
  onChange,
  results,
  selected,
  searching,
  onSelect,
  onClear,
  excludeId,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  results: AdminUser[];
  selected: AdminUser | null;
  searching: boolean;
  onSelect: (u: AdminUser) => void;
  onClear: () => void;
  excludeId?: string;
}) {
  const filtered = results.filter((u) => u._id !== excludeId);

  if (selected) {
    const age = calculateAge(selected.biodata?.personal?.dateOfBirth);
    return (
      <div>
        <label className="mb-1.5 block text-[12px] font-semibold text-[var(--color-dark-56)]">{label}</label>
        <div className="flex items-center justify-between rounded-xl border border-[var(--color-dark-12)] bg-[var(--color-dark-08)] px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              className="flex size-8 items-center justify-center rounded-full text-[12px] font-bold"
              style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
            >
              {getUserDisplayName(selected).charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[14px] font-medium text-[var(--foreground)]">{getUserDisplayName(selected)}</p>
              <p className="text-[12px] text-[var(--color-dark-56)]">
                {[
                  selected.biodata?.personal?.gender,
                  age ? `${age} yrs` : null,
                  selected.biodata?.personal?.city,
                ].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>
          <button onClick={onClear} className="rounded-lg p-1.5 text-[var(--color-dark-56)] hover:bg-[var(--color-dark-12)]">
            <X className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <label className="mb-1.5 block text-[12px] font-semibold text-[var(--color-dark-56)]">{label}</label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-dark-28)]" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full rounded-xl border border-[var(--color-dark-14)] bg-[var(--background)] py-3 pl-10 pr-4 text-[14px] text-[var(--foreground)] outline-none focus:border-[var(--foreground)] placeholder:text-[var(--color-dark-28)]"
        />
        {searching && <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-[var(--color-dark-28)]" />}
      </div>
      {filtered.length > 0 && (
        <div className="absolute inset-x-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-xl border border-[var(--color-dark-12)] bg-[var(--background)] shadow-lg">
          {filtered.map((u) => {
            const age = calculateAge(u.biodata?.personal?.dateOfBirth);
            return (
              <button
                key={u._id}
                onClick={() => onSelect(u)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[var(--color-dark-08)]"
              >
                <div
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                  style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
                >
                  {getUserDisplayName(u).charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-[var(--foreground)]">{getUserDisplayName(u)}</p>
                  <p className="truncate text-[12px] text-[var(--color-dark-56)]">
                    {[
                      u.biodata?.personal?.gender,
                      age ? `${age} yrs` : null,
                      u.biodata?.personal?.city,
                      u.email,
                    ].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Match Card ─── */

function MatchCard({
  match,
  onStatusChange,
  onNotesChange,
  onDelete,
  onViewProfile,
}: {
  match: ManualMatch;
  onStatusChange: (status: string) => void;
  onNotesChange: (notes: string) => void;
  onDelete: () => void;
  onViewProfile: (id: string) => void;
}) {
  const config = STATUS_CONFIG[match.status];
  const StatusIcon = config.icon;
  const [editingNotes, setEditingNotes] = useState(false);
  const [localNotes, setLocalNotes] = useState(match.notes);

  function saveNotes() {
    onNotesChange(localNotes);
    setEditingNotes(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-dark-12)] bg-white">
      <div className="p-5 sm:p-6">
        {/* Main row: people + status */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* People pairing */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Person 1 */}
            <button
              onClick={() => onViewProfile(match.user1Id)}
              className="group flex items-center gap-2.5 rounded-xl border border-[var(--color-dark-08)] bg-[var(--color-dark-04,rgba(30,58,95,0.04))] px-3 py-2.5 transition-all hover:border-[var(--color-dark-18)] hover:shadow-sm"
            >
              <div
                className="flex size-9 items-center justify-center rounded-full text-[13px] font-bold"
                style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
              >
                {match.user1Name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-[14px] font-semibold text-[var(--foreground)]">{match.user1Name}</p>
                <p className="text-[11px] text-[var(--color-dark-56)]">View profile</p>
              </div>
            </button>

            {/* Connector */}
            <div className="h-px w-8 bg-[var(--color-dark-14)] sm:w-10" />

            {/* Person 2 */}
            <button
              onClick={() => onViewProfile(match.user2Id)}
              className="group flex items-center gap-2.5 rounded-xl border border-[var(--color-dark-08)] bg-[var(--color-dark-04,rgba(30,58,95,0.04))] px-3 py-2.5 transition-all hover:border-[var(--color-dark-18)] hover:shadow-sm"
            >
              <div
                className="flex size-9 items-center justify-center rounded-full text-[13px] font-bold"
                style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
              >
                {match.user2Name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-[14px] font-semibold text-[var(--foreground)]">{match.user2Name}</p>
                <p className="text-[11px] text-[var(--color-dark-56)]">View profile</p>
              </div>
            </button>
          </div>

          {/* Right side: status + date */}
          <div className="flex items-center gap-3">
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold", config.color)}>
              <StatusIcon className="size-3.5" />
              {config.label}
            </span>
            <span className="text-[12px] font-medium text-[var(--color-dark-56)]">{formatDate(match.createdAt)}</span>
          </div>
        </div>

        {/* Notes section */}
        {(match.notes || editingNotes) && (
          <div className="mt-4 rounded-xl bg-[var(--color-dark-04,rgba(30,58,95,0.04))] px-4 py-3">
            {editingNotes ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={localNotes}
                  onChange={(e) => setLocalNotes(e.target.value)}
                  className="flex-1 rounded-lg border border-[var(--color-dark-14)] bg-white px-3 py-2 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--foreground)]"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter") saveNotes(); if (e.key === "Escape") setEditingNotes(false); }}
                />
                <button onClick={saveNotes} className="rounded-lg px-4 py-2 text-[12px] font-semibold transition-colors" style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}>Save</button>
                <button onClick={() => setEditingNotes(false)} className="rounded-lg px-3 py-2 text-[12px] font-medium text-[var(--color-dark-56)] hover:bg-[var(--color-dark-08)]">Cancel</button>
              </div>
            ) : (
              <p className="flex items-start gap-2 text-[13px] text-[var(--color-dark-72)]">
                <StickyNote className="mt-0.5 size-3.5 shrink-0 text-[var(--color-dark-28)]" />
                {match.notes}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <select
            value={match.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-lg border border-[var(--color-dark-14)] bg-white px-3 py-2 text-[13px] font-medium text-[var(--foreground)] outline-none focus:border-[var(--foreground)]"
          >
            <option value="matched">Matched</option>
            <option value="contacted">Contacted</option>
            <option value="successful">Successful</option>
            <option value="unsuccessful">Unsuccessful</option>
          </select>

          <div className="h-5 w-px bg-[var(--color-dark-12)]" />

          <button
            onClick={() => { setLocalNotes(match.notes); setEditingNotes(true); }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium text-[var(--color-dark-56)] transition-colors hover:bg-[var(--color-dark-08)] hover:text-[var(--foreground)]"
          >
            <StickyNote className="size-3.5" />
            {match.notes ? "Edit notes" : "Add notes"}
          </button>

          <div className="ml-auto">
            <button
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="size-3.5" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wider text-[var(--color-dark-56)]">
      {children}
    </th>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-dark-12)] bg-[var(--background)] p-4">
      <div className="flex items-center gap-3">
        <Icon className={cn("size-5", color || "text-[var(--foreground)]")} />
        <div>
          <p className="text-[22px] font-bold text-[var(--foreground)]">{value}</p>
          <p className="text-[12px] text-[var(--color-dark-56)]">{label}</p>
        </div>
      </div>
    </div>
  );
}

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
