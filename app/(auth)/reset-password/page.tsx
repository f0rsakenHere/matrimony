"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { goldButtonClass } from "@/components/ui/button-styles";

const inputClass =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-dark-56)] focus:ring-1 focus:ring-[var(--color-dark-28)]";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const linkError = params.get("error");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token || linkError) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
        This reset link is invalid or has expired.{" "}
        <Link href="/forgot-password" className="font-semibold underline">
          Request a new one
        </Link>
        .
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setLoading(true);
    const { error: err } = await authClient.resetPassword({ newPassword: password, token: token! });
    setLoading(false);
    if (err) {
      setError(err.message || "Could not reset password. The link may have expired.");
      return;
    }
    router.push("/login?reset=1");
  }

  return (
    <>
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1.5">
            New password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="confirm" className="block text-sm font-medium mb-1.5">
            Confirm new password
          </label>
          <input
            id="confirm"
            type="password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={cn(goldButtonClass, "w-full rounded-lg py-3 text-sm font-semibold disabled:opacity-50")}
        >
          {loading ? "Saving..." : "Set New Password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2>Choose a New Password</h2>
        </div>
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
