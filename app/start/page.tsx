"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import PublicBiodataForm from "./_components/public-biodata-form";

// Public, anonymous biodata submission page — open to everyone, signed in or not.
export default function StartPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--color-dark-12)] bg-[var(--brand-cream)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" aria-label="BanglaNikahCanada home">
            <BrandLogo className="w-[180px] sm:w-[230px]" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-dark-18)] px-3.5 py-2 text-[14px] font-semibold !text-[var(--brand-green)] transition-colors hover:bg-[var(--brand-green)] hover:!text-white sm:px-4 sm:text-[15px]"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span className="sm:hidden">Home</span>
            <span className="hidden sm:inline">Back to home</span>
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-12">
        <PublicBiodataForm />
      </div>
    </div>
  );
}
