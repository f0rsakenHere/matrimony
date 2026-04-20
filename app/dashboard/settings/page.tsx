"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { user, profile, refreshProfile, logout } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    profileName: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        profileName: profile.profileName,
      });
    }
  }, [profile]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/profile/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, data: form }),
      });
      if (res.ok) {
        setSaved(true);
        await refreshProfile();
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }

  const photoURL = profile?.photoURL || user?.photoURL;
  const displayName =
    profile?.profileName || profile?.firstName || user?.displayName || "User";

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h2 className="text-[var(--foreground)]">Settings</h2>
      <p className="mt-2 text-[var(--color-dark-56)]">
        Manage your account and profile settings
      </p>

      {/* Profile photo */}
      <div className="mt-10">
        <h3 className="text-[var(--foreground)]">Profile Photo</h3>
        <div className="mt-4 flex items-center gap-4">
          <div className="relative size-20 overflow-hidden rounded-full bg-[var(--color-dark-18)]">
            {photoURL ? (
              <Image
                src={photoURL}
                alt={displayName}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-2xl font-semibold text-[var(--foreground)]">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <p className="text-[14px] text-[var(--color-dark-56)]">
            Photo is synced from your{" "}
            {profile?.email?.includes("google") || user?.providerData?.[0]?.providerId === "google.com"
              ? "Google account"
              : "account"}
          </p>
        </div>
      </div>

      {/* Account info */}
      <div className="mt-10 border-t border-[var(--border-subtle)] pt-10">
        <h3 className="text-[var(--foreground)]">Account Information</h3>

        <div className="mt-6 space-y-6">
          <div>
            <label className="block text-[13px] font-medium text-[var(--color-dark-56)]">
              Email Address
            </label>
            <p className="mt-1 py-2 text-[15px] text-[var(--foreground)]">
              {profile?.email || user?.email}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-[13px] font-medium text-[var(--color-dark-56)]">
                First Name
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, firstName: e.target.value }))
                }
                className="mt-1 w-full border-b-2 border-[var(--color-dark-18)] bg-transparent py-2 text-[15px] text-[var(--foreground)] outline-none transition-colors focus:border-[var(--foreground)] placeholder:text-[var(--color-dark-28)]"
                placeholder="Your first name"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[var(--color-dark-56)]">
                Last Name
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, lastName: e.target.value }))
                }
                className="mt-1 w-full border-b-2 border-[var(--color-dark-18)] bg-transparent py-2 text-[15px] text-[var(--foreground)] outline-none transition-colors focus:border-[var(--foreground)] placeholder:text-[var(--color-dark-28)]"
                placeholder="Your last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[var(--color-dark-56)]">
              Profile Name
            </label>
            <input
              type="text"
              maxLength={15}
              value={form.profileName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, profileName: e.target.value }))
              }
              className={cn(
                "mt-1 w-full border-b-2 bg-transparent py-2 text-[15px] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--color-dark-28)]",
                /^[a-zA-Z0-9 ]*$/.test(form.profileName)
                  ? "border-[var(--color-dark-18)] focus:border-[var(--foreground)]"
                  : "border-red-500"
              )}
              placeholder="Visible to matches"
            />
            <p className="mt-1 text-[13px] text-[var(--color-dark-56)]">
              {form.profileName.length}/15 — visible to your matches
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-11 items-center justify-center bg-[var(--foreground)] px-8 text-[14px] font-semibold text-[var(--background)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              "Save Changes"
            )}
          </button>
          {saved && (
            <span className="text-sm font-medium text-[var(--color-dark-56)]">
              Saved successfully
            </span>
          )}
        </div>
      </div>

      {/* Sign out */}
      <div className="mt-10 border-t border-[var(--border-subtle)] pt-10">
        <h3 className="text-[var(--foreground)]">Account Actions</h3>
        <div className="mt-6">
          <button
            onClick={() => logout()}
            className="inline-flex h-11 items-center justify-center border border-[var(--border)] px-8 text-[14px] font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--color-dark-08)]"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
