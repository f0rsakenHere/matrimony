"use client";

import { useState } from "react";
import {
  Trash2,
  StickyNote,
  Link2,
  MessageCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";

/* ─── Types ─── */

export interface ManualMatch {
  _id: string;
  user1Id: string;
  user1Name: string;
  user2Id: string;
  user2Name: string;
  status: "matched" | "contacted" | "successful" | "unsuccessful";
  notes: string;
  createdAt: string;
}

export interface MatchStats {
  matched: number;
  contacted: number;
  successful: number;
  unsuccessful: number;
}

export const STATUS_CONFIG = {
  matched: { label: "Matched", color: "bg-blue-50 text-blue-700", icon: Link2 },
  contacted: { label: "Contacted", color: "bg-amber-50 text-amber-700", icon: MessageCircle },
  successful: { label: "Successful", color: "bg-green-50 text-green-700", icon: CheckCircle2 },
  unsuccessful: { label: "Unsuccessful", color: "bg-gray-100 text-gray-600", icon: XCircle },
};

/* ─── MatchCard ─── */

export function MatchCard({
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
            <span className="text-[12px] font-medium text-[var(--color-dark-56)]">{formatDate(match.createdAt) || "—"}</span>
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
