"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Inbox,
  CheckCircle2,
  XCircle,
  Ban,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
  User as UserIcon,
} from "lucide-react";
import type { BiodataSection } from "@/lib/types/biodata";

type Status = "pending" | "approved" | "rejected" | "spam";

type Submission = {
  _id: string;
  biodata: BiodataSection;
  moderationStatus: Status;
  moderationNote?: string;
  moderatedByUid?: string;
  moderatedAt?: string;
  createdAt: string;
  updatedAt: string;
};

const STATUS_TABS: { id: Status; label: string; icon: typeof Inbox }[] = [
  { id: "pending", label: "Pending", icon: Inbox },
  { id: "approved", label: "Approved", icon: CheckCircle2 },
  { id: "rejected", label: "Rejected", icon: XCircle },
  { id: "spam", label: "Spam", icon: Ban },
];

export default function AdminSubmissionsPage() {
  const { user, profile, getAuthHeaders } = useAuth();
  const router = useRouter();

  const [activeStatus, setActiveStatus] = useState<Status>("pending");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<Status, number>>({
    pending: 0,
    approved: 0,
    rejected: 0,
    spam: 0,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  // Gate: redirect non-admins
  useEffect(() => {
    if (profile && !profile.isAdmin) {
      router.push("/dashboard");
    }
  }, [profile, router]);

  useEffect(() => {
    setPage(1);
  }, [activeStatus]);

  const fetchSubmissions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const p = new URLSearchParams();
      p.set("status", activeStatus);
      p.set("page", String(page));
      p.set("limit", "20");

      const headers = await getAuthHeaders();
      const res = await fetch(`/api/admin/submissions?${p.toString()}`, {
        headers,
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions ?? []);
        setTotalPages(data.totalPages ?? 1);
        setTotal(data.total ?? 0);
        setStatusCounts(data.statusCounts ?? {
          pending: 0,
          approved: 0,
          rejected: 0,
          spam: 0,
        });
      }
    } catch (err) {
      console.error("Submissions fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, [user, activeStatus, page, getAuthHeaders]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  async function setStatus(id: string, status: Status) {
    setActionId(id);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchSubmissions();
    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setActionId(null);
    }
  }

  async function deleteSubmission(id: string) {
    if (!confirm("Permanently delete this submission? This cannot be undone.")) return;
    setActionId(id);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) fetchSubmissions();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setActionId(null);
    }
  }

  if (profile && !profile.isAdmin) return null;

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-[var(--foreground)]">Public Submissions</h2>
          <p className="mt-1 text-[14px] text-[var(--color-dark-56)]">
            Anonymous biodata submissions from <code className="rounded bg-[var(--color-dark-08)] px-1 py-0.5 text-[12px]">/start</code>. Approve to publish, reject or mark as spam.
          </p>
        </div>
        <a
          href="/dashboard/admin"
          className="text-[13px] font-semibold text-[var(--color-dark-56)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
        >
          ← Back to admin
        </a>
      </div>

      {/* Status tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_TABS.map(({ id, label, icon: Icon }) => {
          const count = statusCounts[id] ?? 0;
          const isActive = activeStatus === id;
          return (
            <button
              key={id}
              onClick={() => setActiveStatus(id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors",
                isActive
                  ? "shadow-sm"
                  : "text-[var(--color-dark-56)] hover:bg-[var(--color-dark-08)]"
              )}
              style={
                isActive
                  ? { backgroundColor: "var(--foreground)", color: "var(--background)" }
                  : undefined
              }
            >
              <Icon className="size-4" />
              {label}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-bold",
                  isActive
                    ? "bg-[var(--background)]/20"
                    : "bg-[var(--color-dark-12)]"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-[13px] font-medium text-[var(--color-dark-56)]">
        {loading
          ? "Loading..."
          : `${total} ${activeStatus} submission${total !== 1 ? "s" : ""}`}
      </p>

      {/* List */}
      <div className="mt-3 space-y-3">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-6 animate-spin text-[var(--color-dark-56)]" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-dark-18)] py-16 text-center text-[var(--color-dark-56)]">
            No {activeStatus} submissions.
          </div>
        ) : (
          submissions.map((s) => (
            <SubmissionCard
              key={s._id}
              submission={s}
              actionInProgress={actionId === s._id}
              onApprove={() => setStatus(s._id, "approved")}
              onReject={() => setStatus(s._id, "rejected")}
              onSpam={() => setStatus(s._id, "spam")}
              onRestore={() => setStatus(s._id, "pending")}
              onDelete={() => deleteSubmission(s._id)}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between">
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

function calcAge(dob: string): number | null {
  if (!dob || dob.startsWith("0000")) return null;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;
  const diff = Date.now() - d.getTime();
  const age = Math.floor(diff / (365.25 * 24 * 3600 * 1000));
  return age >= 0 && age < 120 ? age : null;
}

function SubmissionCard({
  submission,
  actionInProgress,
  onApprove,
  onReject,
  onSpam,
  onRestore,
  onDelete,
}: {
  submission: Submission;
  actionInProgress: boolean;
  onApprove: () => void;
  onReject: () => void;
  onSpam: () => void;
  onRestore: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const b = submission.biodata;
  const age = calcAge(b.personal.dateOfBirth);
  const isPending = submission.moderationStatus === "pending";

  const submittedAt = new Date(submission.createdAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="rounded-2xl border border-[var(--color-dark-12)] bg-[var(--background)] p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <UserIcon className="size-4 text-[var(--color-dark-56)]" />
            <span className="text-[15px] font-semibold text-[var(--foreground)]">
              {b.personal.gender || "—"}
              {age !== null && `, ${age}`}
              {b.personal.maritalStatus && ` · ${b.personal.maritalStatus}`}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[var(--color-dark-56)]">
            {(b.personal.city || b.personal.country) && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" />
                {[b.personal.city, b.personal.country].filter(Boolean).join(", ")}
              </span>
            )}
            <span>Submitted {submittedAt}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {isPending ? (
            <>
              <ActionButton
                onClick={onApprove}
                disabled={actionInProgress}
                title="Approve"
                className="text-green-700 hover:bg-green-50"
              >
                <CheckCircle2 className="size-4" />
              </ActionButton>
              <ActionButton
                onClick={onReject}
                disabled={actionInProgress}
                title="Reject"
                className="text-red-600 hover:bg-red-50"
              >
                <XCircle className="size-4" />
              </ActionButton>
              <ActionButton
                onClick={onSpam}
                disabled={actionInProgress}
                title="Mark as spam"
                className="text-amber-700 hover:bg-amber-50"
              >
                <Ban className="size-4" />
              </ActionButton>
            </>
          ) : (
            <ActionButton
              onClick={onRestore}
              disabled={actionInProgress}
              title="Move back to pending"
              className="text-[var(--color-dark-56)] hover:bg-[var(--color-dark-08)] hover:text-[var(--foreground)]"
            >
              Restore
            </ActionButton>
          )}
          <ActionButton
            onClick={onDelete}
            disabled={actionInProgress}
            title="Delete permanently"
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="size-4" />
          </ActionButton>
        </div>
      </div>

      {/* Wali contact — always visible since this is the primary contact */}
      <div className="mt-3 grid gap-2 rounded-xl border border-[var(--color-dark-08)] bg-[var(--color-dark-04,rgba(30,58,95,0.04))] p-3 text-[13px] sm:grid-cols-2">
        <div>
          <span className="font-semibold text-[var(--foreground)]">Wali: </span>
          <span className="text-[var(--color-dark-56)]">
            {b.family.waliName || "—"}
            {b.family.waliRelationship && ` (${b.family.waliRelationship})`}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {b.family.waliPhone && (
            <span className="inline-flex items-center gap-1 text-[var(--foreground)]">
              <Phone className="size-3.5" />
              <a href={`tel:${b.family.waliPhone}`} className="hover:underline">
                {b.family.waliPhone}
              </a>
            </span>
          )}
          {b.family.waliEmail && (
            <span className="inline-flex items-center gap-1 text-[var(--color-dark-56)]">
              <Mail className="size-3.5" />
              <a href={`mailto:${b.family.waliEmail}`} className="hover:underline">
                {b.family.waliEmail}
              </a>
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--color-dark-56)] hover:text-[var(--foreground)]"
      >
        {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        {expanded ? "Hide details" : "View full biodata"}
      </button>

      {expanded && <ExpandedDetails biodata={b} />}
    </div>
  );
}

function ActionButton({
  onClick,
  disabled,
  title,
  children,
  className,
}: {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[12px] font-semibold transition-colors disabled:opacity-40",
        className
      )}
    >
      {children}
    </button>
  );
}

function ExpandedDetails({ biodata: b }: { biodata: BiodataSection }) {
  return (
    <div className="mt-4 grid gap-4 border-t border-[var(--color-dark-08)] pt-4 text-[13px] sm:grid-cols-2">
      <DetailGroup
        title="Personal"
        rows={[
          ["Date of birth", b.personal.dateOfBirth],
          ["Height", b.personal.height],
          ["Weight", b.personal.weight],
          ["Complexion", b.personal.complexion],
          ["Blood group", b.personal.bloodGroup],
          ["Nationality", b.personal.nationality],
          ["Origin (Bangladesh)", b.personal.bangladeshDistrict],
        ]}
      />
      <DetailGroup
        title="Education & Career"
        rows={[
          ["Education", b.education.educationLevel],
          ["Institution", b.education.institution],
          ["Field of study", b.education.fieldOfStudy],
          ["Occupation", b.education.occupation],
          ["Employer", b.education.employer],
          ["Income", b.education.income],
        ]}
      />
      <DetailGroup
        title="Family"
        rows={[
          ["Father", b.family.fatherName],
          ["Father's occupation", b.family.fatherOccupation],
          ["Mother", b.family.motherName],
          ["Mother's occupation", b.family.motherOccupation],
          ["Siblings", b.family.siblings],
          ["Family type", b.family.familyType],
          ["Family status", b.family.familyStatus],
        ]}
      />
      <DetailGroup
        title="Religious"
        rows={[
          ["History", b.religious.religiousHistory],
          ["Sect", b.religious.sect],
          ["Prayer routine", b.religious.prayerRoutine],
          ["Modesty", b.religious.modesty],
          ["Beard", b.religious.beard],
          ["Quran reading", b.religious.quranReading],
          ["Islamic education", b.religious.islamicEducation],
        ]}
      />
      <DetailGroup
        title="Lifestyle"
        rows={[
          ["Diet", b.lifestyle.diet],
          ["Smoking", b.lifestyle.smoking],
          ["Hobbies", b.lifestyle.hobbies],
          ["Languages", b.lifestyle.languages],
        ]}
      />
      {b.aboutMe && (
        <div className="sm:col-span-2">
          <h4 className="text-[13px] font-semibold text-[var(--foreground)]">About Me</h4>
          <p className="mt-1 whitespace-pre-wrap text-[13px] text-[var(--color-dark-56)]">
            {b.aboutMe}
          </p>
        </div>
      )}
    </div>
  );
}

function DetailGroup({
  title,
  rows,
}: {
  title: string;
  rows: [string, string][];
}) {
  const filled = rows.filter(([, v]) => v && v.trim() !== "");
  if (filled.length === 0) return null;
  return (
    <div>
      <h4 className="text-[13px] font-semibold text-[var(--foreground)]">{title}</h4>
      <dl className="mt-1 space-y-0.5">
        {filled.map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <dt className="shrink-0 text-[var(--color-dark-56)]">{k}:</dt>
            <dd className="text-[var(--foreground)]">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
