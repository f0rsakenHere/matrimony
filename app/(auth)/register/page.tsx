"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { goldButtonClass } from "@/components/ui/button-styles";

export default function RegisterPage() {
  const { signUpWithEmail } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(email, password, name);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create account";
      setError(message);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2>Create Account</h2>
          <p className="mt-4 text-[var(--color-dark-72)]">
            Join BanglaNikahCanada today
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-dark-56)] focus:ring-1 focus:ring-[var(--color-dark-28)]"
              placeholder="Your full name"
            />
          </div>

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

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-dark-56)] focus:ring-1 focus:ring-[var(--color-dark-28)]"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-dark-56)] focus:ring-1 focus:ring-[var(--color-dark-28)]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              goldButtonClass,
              "w-full rounded-lg py-3 text-sm font-semibold disabled:opacity-50"
            )}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>


        <p className="text-center text-sm text-[var(--color-dark-72)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--foreground)] underline underline-offset-2"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
