"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { getProfileCompletion } from "@/lib/profile-completion";
import { BrandLogo } from "@/components/ui/brand-logo";
import {
  Menu,
  X,
  Home,
  FileText,
  LogOut,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "My Biodata", href: "/dashboard/biodata", icon: FileText },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { profile, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const displayName =
    profile?.profileName || profile?.firstName || user?.displayName || "User";
  const photoURL = profile?.photoURL || user?.photoURL;
  const completion = profile ? getProfileCompletion(profile) : 0;

  // Close on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Top bar */}
      <header
        className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--color-dark-08)] px-4 md:hidden"
        style={{ backgroundColor: "var(--foreground)" }}
      >
        <BrandLogo className="h-6 w-auto" tone="light" />
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2"
          style={{ color: "var(--background)" }}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-[280px] transform overflow-y-auto transition-transform duration-300 md:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
        style={{ backgroundColor: "var(--foreground)" }}
      >
        {/* User card */}
        <div className="border-b border-[rgba(240,244,248,0.1)] p-5 pt-6">
          <div className="flex items-center gap-3">
            <div
              className="relative size-10 shrink-0 overflow-hidden rounded-full"
              style={{ backgroundColor: "var(--background)" }}
            >
              {photoURL ? (
                <Image src={photoURL} alt={displayName} fill className="object-cover" sizes="40px" />
              ) : (
                <span className="flex size-full items-center justify-center text-[14px] font-bold" style={{ color: "var(--foreground)" }}>
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold" style={{ color: "var(--color-light)" }}>
                {displayName}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-[rgba(240,244,248,0.15)]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${completion}%`,
                      background: "linear-gradient(90deg, var(--button-gold-light), var(--button-gold-dark))",
                    }}
                  />
                </div>
                <span className="shrink-0 text-[11px] font-medium" style={{ color: "var(--color-light-72)" }}>
                  {completion}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="space-y-1 p-3">
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
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium transition-all",
                  isActive ? "shadow-sm" : "hover:bg-[rgba(240,244,248,0.1)]"
                )}
                style={
                  isActive
                    ? { backgroundColor: "var(--background)", color: "var(--foreground)" }
                    : { color: "var(--color-light-72)" }
                }
              >
                <Icon className="size-5" strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="flex-1">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin + Sign out */}
        {profile?.isAdmin && (
          <div className="border-t border-[rgba(240,244,248,0.1)] p-3">
            <Link
              href="/dashboard/admin"
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium",
                pathname.startsWith("/dashboard/admin")
                  ? "shadow-sm"
                  : "hover:bg-[rgba(240,244,248,0.1)]"
              )}
              style={
                pathname.startsWith("/dashboard/admin")
                  ? { backgroundColor: "var(--background)", color: "var(--foreground)" }
                  : { color: "rgb(251,191,36)" }
              }
            >
              <ShieldCheck className="size-5" />
              Admin Dashboard
            </Link>
          </div>
        )}
        <div className="border-t border-[rgba(240,244,248,0.1)] p-3">
          <button
            onClick={() => { logout(); setOpen(false); }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium text-red-300 hover:bg-[rgba(240,244,248,0.1)]"
          >
            <LogOut className="size-5" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
