"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { goldButtonClass } from "@/components/ui/button-styles";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });
    setLoading(false);
    if (err) {
      setError(err.message || "Something went wrong. Please try again.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2>Forgot Password</h2>
          <p className="mt-4 text-[var(--color-dark-72)]">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {sent ? (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--color-dark-08)] p-4 text-sm">
            If an account exists for <strong>{email}</strong>, a reset link is on its way. Check your
            inbox (and spam folder).
          </div>
        ) : (
          <>
            {error && (
              <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-dark-56)] focus:ring-1 focus:ring-[var(--color-dark-28)]"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={cn(goldButtonClass, "w-full rounded-lg py-3 text-sm font-semibold disabled:opacity-50")}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        )}

        <p className="text-center text-sm text-[var(--color-dark-72)]">
          <Link href="/login" className="font-semibold text-[var(--foreground)] underline underline-offset-2">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
