"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { goldButtonClass } from "@/components/ui/button-styles";

export default function LoginPage() {
  const { signInWithEmail } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in";
      setError(message);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2>Welcome Back</h2>
          <p className="mt-4 text-[var(--color-dark-72)]">
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-5">
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
            <div className="mt-2 text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-[var(--color-dark-72)] underline underline-offset-2"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              goldButtonClass,
              "w-full rounded-lg py-3 text-sm font-semibold disabled:opacity-50"
            )}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>


        <p className="text-center text-sm text-[var(--color-dark-72)]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[var(--foreground)] underline underline-offset-2"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
