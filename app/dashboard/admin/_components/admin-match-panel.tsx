"use client";

import { useState, useRef } from "react";
import {
  Search,
  X,
  Heart,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { calculateAge } from "@/lib/date-utils";
import { MatchCard, STATUS_CONFIG } from "./admin-match-card";
import type { ManualMatch, MatchStats } from "./admin-match-card";
import { getUserDisplayName } from "./admin-user-card";
import type { AdminUser } from "./admin-user-card";

/* ─── CreateMatchModal ─── */

function CreateMatchModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { getAuthHeaders } = useAuth();
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

  async function searchUsers(q: string, setter: (u: AdminUser[]) => void, loadingSetter: (v: boolean) => void) {
    if (q.length < 2) { setter([]); return; }
    loadingSetter(true);
    const p = new URLSearchParams();
    p.set("q", q);
    p.set("limit", "6");
    const authHeaders = await getAuthHeaders();
    fetch(`/api/admin/users?${p.toString()}`, { headers: authHeaders })
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
      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/admin/matches", {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
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

/* ─── UserSearchField ─── */

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

/* ─── AdminMatchPanel ─── */

export function AdminMatchPanel({
  matches,
  matchStats,
  matchesLoading,
  matchPage,
  setMatchPage,
  matchTotalPages,
  matchFilter,
  setMatchFilter,
  showCreateMatch,
  setShowCreateMatch,
  onStatusChange,
  onNotesChange,
  onDelete,
  onViewProfile,
  onCreated,
}: {
  matches: ManualMatch[];
  matchStats: MatchStats;
  matchesLoading: boolean;
  matchPage: number;
  setMatchPage: React.Dispatch<React.SetStateAction<number>>;
  matchTotalPages: number;
  matchFilter: string;
  setMatchFilter: (v: string) => void;
  showCreateMatch: boolean;
  setShowCreateMatch: (v: boolean) => void;
  onStatusChange: (matchId: string, status: string) => void;
  onNotesChange: (matchId: string, notes: string) => void;
  onDelete: (matchId: string) => void;
  onViewProfile: (userId: string) => void;
  onCreated: () => void;
}) {
  return (
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
          onClose={() => setShowCreateMatch(false)}
          onCreated={onCreated}
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
              onStatusChange={(status) => onStatusChange(m._id, status)}
              onNotesChange={(notes) => onNotesChange(m._id, notes)}
              onDelete={() => onDelete(m._id)}
              onViewProfile={onViewProfile}
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
  );
}
