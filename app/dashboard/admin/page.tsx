"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Users,
  UserCheck,
  UserX,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { StatCard } from "./_components/admin-stats";
import { AdminUserFilters, EMPTY_FILTERS } from "./_components/admin-user-filters";
import { AdminUserCard, Th, getUserDisplayName } from "./_components/admin-user-card";
import { AdminMatchPanel } from "./_components/admin-match-panel";

import type { Filters } from "./_components/admin-user-filters";
import type { AdminUser } from "./_components/admin-user-card";
import type { ManualMatch, MatchStats } from "./_components/admin-match-card";

/* ─── Page ─── */

export default function AdminPage() {
  const { user, profile, getAuthHeaders } = useAuth();
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
      p.set("page", String(page));
      p.set("limit", "20");
      if (debouncedQuery) p.set("q", debouncedQuery);
      Object.entries(filters).forEach(([k, v]) => {
        if (v) p.set(k, v);
      });

      const authHeaders = await getAuthHeaders();
      const res = await fetch(`/api/admin/users?${p.toString()}`, {
        headers: authHeaders,
      });
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
  }, [user, page, debouncedQuery, filters, getAuthHeaders]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchMatches = useCallback(async () => {
    if (!user) return;
    setMatchesLoading(true);
    try {
      const p = new URLSearchParams();
      p.set("page", String(matchPage));
      p.set("limit", "20");
      if (matchFilter) p.set("status", matchFilter);

      const authHeaders = await getAuthHeaders();
      const res = await fetch(`/api/admin/matches?${p.toString()}`, {
        headers: authHeaders,
      });
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
  }, [user, matchPage, matchFilter, getAuthHeaders]);

  useEffect(() => {
    if (activeTab === "matches") fetchMatches();
  }, [activeTab, fetchMatches]);

  async function deleteUser(userId: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setActionLoading(userId);
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
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
      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
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
      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/admin/matches", {
        method: "PATCH",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, status }),
      });
      if (res.ok) fetchMatches();
    } catch (err) {
      console.error("Update match failed:", err);
    }
  }

  async function updateMatchNotes(matchId: string, notes: string) {
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/admin/matches", {
        method: "PATCH",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, notes }),
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
      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/admin/matches", {
        method: "DELETE",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ matchId }),
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

          {/* Filters */}
          <AdminUserFilters
            query={query}
            setQuery={setQuery}
            filters={filters}
            setFilters={setFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            activeFilterCount={activeFilterCount}
          />

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
                  users.map((u) => (
                    <AdminUserCard
                      key={u._id}
                      user={u}
                      actionLoading={actionLoading}
                      onViewProfile={(id) => router.push(`/dashboard/profile/${id}`)}
                      onToggleAdmin={toggleAdmin}
                      onDelete={deleteUser}
                    />
                  ))
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
        <AdminMatchPanel
          matches={matches}
          matchStats={matchStats}
          matchesLoading={matchesLoading}
          matchPage={matchPage}
          setMatchPage={setMatchPage}
          matchTotalPages={matchTotalPages}
          matchFilter={matchFilter}
          setMatchFilter={setMatchFilter}
          showCreateMatch={showCreateMatch}
          setShowCreateMatch={setShowCreateMatch}
          onStatusChange={updateMatchStatus}
          onNotesChange={updateMatchNotes}
          onDelete={deleteMatch}
          onViewProfile={(id) => router.push(`/dashboard/profile/${id}`)}
          onCreated={() => { setShowCreateMatch(false); fetchMatches(); }}
        />
      )}
    </div>
  );
}
