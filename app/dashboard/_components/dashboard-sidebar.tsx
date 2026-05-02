"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { getProfileCompletion } from "@/lib/profile-completion";
import { BrandLogo } from "@/components/ui/brand-logo";

// Close menus on user interaction (event handlers below) rather than via a
// pathname useEffect — React 19's set-state-in-effect lint discourages it.
import {
  Home,
  ChevronUp,
  FileText,
  LogOut,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "My Biodata", href: "/dashboard/biodata", icon: FileText },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { profile, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName =
    profile?.profileName || profile?.firstName || user?.displayName || "User";
  const photoURL = profile?.photoURL || user?.photoURL;
  const completion = profile ? getProfileCompletion(profile) : 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]);

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 flex w-[260px] flex-col"
      style={{ backgroundColor: "var(--foreground)" }}
    >
      {/* Logo */}
      <div className="px-5 pt-7 pb-2">
        <BrandLogo className="h-8 w-auto" tone="light" />
      </div>

      {/* Section label */}
      <p
        className="mt-6 px-6 text-[11px] font-semibold uppercase tracking-[0.08em]"
        style={{ color: "var(--color-light-72)" }}
      >
        Menu
      </p>

      {/* Navigation */}
      <nav className="mt-2 flex-1 space-y-0.5 px-3">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-[14px] font-medium transition-all",
                isActive
                  ? "shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                  : "hover:bg-[rgba(240,244,248,0.1)]"
              )}
              style={
                isActive
                  ? { backgroundColor: "var(--background)", color: "var(--foreground)" }
                  : { color: "var(--color-light-72)" }
              }
            >
              <Icon
                className="size-[18px] transition-transform group-hover:scale-105"
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span className="flex-1">{label}</span>
            </Link>
          );
        })}

      </nav>

      {/* User profile card + dropdown */}
      <div className="relative px-3 pb-4" ref={menuRef}>
        {/* Dropdown menu */}
        {menuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 overflow-hidden rounded-xl border border-[var(--color-dark-12)] bg-[var(--background)] shadow-[0_12px_32px_rgba(0,0,0,0.2)]">
            {profile?.isAdmin && (
              <div className="p-1.5">
                <Link
                  href="/dashboard/admin"
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors",
                    pathname.startsWith("/dashboard/admin")
                      ? "bg-[var(--color-dark-08)] text-[var(--foreground)]"
                      : "text-amber-600 hover:bg-amber-50"
                  )}
                >
                  <ShieldCheck className="size-4" />
                  Admin Dashboard
                </Link>
              </div>
            )}
            <div className={cn("p-1.5", profile?.isAdmin && "border-t border-[var(--color-dark-08)]")}>
              <button
                onClick={() => logout()}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="size-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border px-3 py-3 transition-all",
            menuOpen
              ? "border-[rgba(240,244,248,0.2)] bg-[rgba(240,244,248,0.1)]"
              : "border-transparent hover:bg-[rgba(240,244,248,0.1)]"
          )}
        >
          {/* Avatar */}
          <div
            className="relative size-9 shrink-0 overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--background)" }}
          >
            {photoURL ? (
              <Image
                src={photoURL}
                alt={displayName}
                fill
                className="object-cover"
                sizes="36px"
              />
            ) : (
              <span
                className="flex size-full items-center justify-center text-[13px] font-bold"
                style={{ color: "var(--foreground)" }}
              >
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Name + progress */}
          <div className="min-w-0 flex-1 text-left">
            <p
              className="truncate text-[13px] font-semibold"
              style={{ color: "var(--color-light)" }}
            >
              {displayName}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-[rgba(240,244,248,0.15)]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${completion}%`,
                    background:
                      completion === 100
                        ? "var(--color-light)"
                        : "linear-gradient(90deg, var(--button-gold-light), var(--button-gold-dark))",
                  }}
                />
              </div>
              <span
                className="shrink-0 text-[11px] font-medium"
                style={{ color: "var(--color-light-72)" }}
              >
                {completion}%
              </span>
            </div>
          </div>

          {/* Chevron */}
          <ChevronUp
            className={cn(
              "size-4 shrink-0 transition-transform",
              !menuOpen && "rotate-180"
            )}
            style={{ color: "var(--color-light-72)" }}
          />
        </button>
      </div>
    </aside>
  );
}
