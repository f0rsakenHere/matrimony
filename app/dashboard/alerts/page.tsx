"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Bell,
  Eye,
  Users,
  Info,
  PartyPopper,
  AlertCircle,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Notification {
  _id: string;
  type: "profile_view" | "new_match" | "system" | "welcome" | "profile_incomplete";
  title: string;
  message: string;
  read: boolean;
  actorName?: string;
  actorProfileId?: string;
  createdAt: string;
}

const TYPE_CONFIG: Record<
  Notification["type"],
  { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  profile_view: { icon: Eye, color: "text-blue-700", bg: "bg-blue-50" },
  new_match: { icon: Users, color: "text-green-700", bg: "bg-green-50" },
  system: { icon: Info, color: "text-gray-700", bg: "bg-gray-100" },
  welcome: { icon: PartyPopper, color: "text-amber-700", bg: "bg-amber-50" },
  profile_incomplete: { icon: AlertCircle, color: "text-orange-700", bg: "bg-orange-50" },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function AlertsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const p = new URLSearchParams();
      p.set("uid", user.uid);
      p.set("page", String(page));
      p.set("limit", "15");
      if (filter === "unread") p.set("unreadOnly", "true");

      const res = await fetch(`/api/notifications?${p.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications ?? []);
        setUnreadCount(data.unreadCount ?? 0);
        setTotalPages(data.totalPages ?? 1);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [user, page, filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  async function markAsRead(notificationId: string) {
    if (!user) return;
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, notificationId }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Mark read failed:", err);
    }
  }

  async function markAllRead() {
    if (!user) return;
    setMarkingAll(true);
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Mark all read failed:", err);
    } finally {
      setMarkingAll(false);
    }
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[var(--foreground)]">Alerts</h2>
          <p className="mt-1 text-[14px] text-[var(--color-dark-56)]">
            Stay updated on profile views and activity
          </p>
        </div>
        {unreadCount > 0 && (
          <span
            className="shrink-0 rounded-full px-3 py-1 text-[13px] font-bold"
            style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
          >
            {unreadCount} new
          </span>
        )}
      </div>

      {/* Filter tabs + Mark all read */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-full px-4 py-2 text-[13px] font-semibold transition-colors",
              filter === "all"
                ? "shadow-sm"
                : "text-[var(--color-dark-56)] hover:bg-[var(--color-dark-08)]"
            )}
            style={
              filter === "all"
                ? { backgroundColor: "var(--foreground)", color: "var(--background)" }
                : undefined
            }
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={cn(
              "rounded-full px-4 py-2 text-[13px] font-semibold transition-colors",
              filter === "unread"
                ? "shadow-sm"
                : "text-[var(--color-dark-56)] hover:bg-[var(--color-dark-08)]"
            )}
            style={
              filter === "unread"
                ? { backgroundColor: "var(--foreground)", color: "var(--background)" }
                : undefined
            }
          >
            Unread
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            disabled={markingAll}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-dark-18)] px-4 py-2 text-[13px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--color-dark-08)] disabled:opacity-50"
          >
            <CheckCheck className="size-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div className="mt-5">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="size-6 animate-spin rounded-full border-2 border-[var(--foreground)] border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border border-[var(--color-dark-12)] bg-[var(--background)] py-16 text-center">
            <Bell className="mx-auto size-10 text-[var(--color-dark-28)]" />
            <p className="mt-3 text-[16px] font-medium text-[var(--color-dark-56)]">
              {filter === "unread" ? "No unread alerts" : "No alerts yet"}
            </p>
            <p className="mt-1 text-[14px] text-[var(--color-dark-28)]">
              {filter === "unread"
                ? "You're all caught up"
                : "When someone views your profile, you'll be notified here"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => {
              const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
              const Icon = config.icon;
              const isClickable = n.type === "profile_view" && n.actorProfileId;

              const content = (
                <div
                  className={cn(
                    "flex items-start gap-4 rounded-2xl border p-4 transition-colors",
                    n.read
                      ? "border-[var(--color-dark-08)] bg-[var(--background)]"
                      : "border-[var(--color-dark-12)] bg-[var(--color-dark-04,rgba(30,58,95,0.04))]",
                    isClickable && "cursor-pointer hover:bg-[var(--color-dark-08)]"
                  )}
                  onClick={() => {
                    if (!n.read) markAsRead(n._id);
                  }}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full",
                      config.bg
                    )}
                  >
                    <Icon className={cn("size-5", config.color)} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className={cn(
                            "text-[14px] text-[var(--foreground)]",
                            !n.read && "font-semibold"
                          )}
                        >
                          {n.title}
                        </p>
                        <p className="mt-0.5 text-[14px] text-[var(--color-dark-56)]">
                          {n.message}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-[12px] text-[var(--color-dark-28)]">
                          {timeAgo(n.createdAt)}
                        </span>
                        {!n.read && (
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: "var(--foreground)" }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );

              if (isClickable) {
                return (
                  <Link
                    key={n._id}
                    href={`/dashboard/profile/${n.actorProfileId}`}
                    onClick={() => {
                      if (!n.read) markAsRead(n._id);
                    }}
                  >
                    {content}
                  </Link>
                );
              }

              return <div key={n._id}>{content}</div>;
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
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
