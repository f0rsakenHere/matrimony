"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-xl font-semibold text-[var(--foreground)]">
        Something went wrong
      </h2>
      <p className="max-w-md text-[14px] text-[var(--color-dark-56)]">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        className="mt-2 rounded-full border border-[var(--color-dark-18)] px-6 py-2.5 text-[13px] font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--color-dark-08)]"
      >
        Try Again
      </button>
    </div>
  );
}
