import {
  Eye,
  ShieldCheck,
  ShieldOff,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateAge, formatDate } from "@/lib/date-utils";

/* ─── Types ─── */

export interface AdminUser {
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

export function getUserDisplayName(u: AdminUser) {
  return u.profileName || `${u.firstName} ${u.lastName}`.trim() || u.email;
}

/* ─── Th (table header cell) ─── */

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wider text-[var(--color-dark-56)]">
      {children}
    </th>
  );
}

/* ─── AdminUserCard (table row) ─── */

export function AdminUserCard({
  user: u,
  actionLoading,
  onViewProfile,
  onToggleAdmin,
  onDelete,
}: {
  user: AdminUser;
  actionLoading: string | null;
  onViewProfile: (userId: string) => void;
  onToggleAdmin: (userId: string, currentIsAdmin: boolean) => void;
  onDelete: (userId: string, name: string) => void;
}) {
  const age = calculateAge(u.biodata?.personal?.dateOfBirth);
  const loc = [u.biodata?.personal?.city, u.biodata?.personal?.country].filter(Boolean).join(", ");
  const hasW = !!(u.biodata?.family?.waliName && u.biodata?.family?.waliPhone);
  const isActing = actionLoading === u._id;

  return (
    <tr
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
        {formatDate(u.createdAt) || "—"}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onViewProfile(u._id)}
            className="rounded-lg p-1.5 text-[var(--color-dark-56)] transition-colors hover:bg-[var(--color-dark-12)] hover:text-[var(--foreground)]"
            title="View profile"
          >
            <Eye className="size-4" />
          </button>
          <button
            onClick={() => onToggleAdmin(u._id, u.isAdmin)}
            disabled={isActing}
            className="rounded-lg p-1.5 text-[var(--color-dark-56)] transition-colors hover:bg-[var(--color-dark-12)] hover:text-[var(--foreground)] disabled:opacity-40"
            title={u.isAdmin ? "Remove admin" : "Make admin"}
          >
            {u.isAdmin ? <ShieldOff className="size-4" /> : <ShieldCheck className="size-4" />}
          </button>
          <button
            onClick={() => onDelete(u._id, getUserDisplayName(u))}
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
}
