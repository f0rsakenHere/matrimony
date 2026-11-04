"use client";

import PublicBiodataForm from "./_components/public-biodata-form";

// Public, anonymous biodata submission page — open to everyone, signed in or not.
export default function StartPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-4xl px-3 py-6 sm:px-6 sm:py-12">
        <PublicBiodataForm />
      </div>
    </div>
  );
}
