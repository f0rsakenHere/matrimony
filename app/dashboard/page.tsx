"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getProfileCompletion } from "@/lib/profile-completion";
import { goldButtonClass } from "@/components/ui/button-styles";
import {
  ArrowRight,
  FileText,
  CheckCircle2,
  Users,
  Shield,
} from "lucide-react";

export default function DashboardPage() {
  const { profile, user } = useAuth();

  const displayName =
    profile?.profileName || profile?.firstName || user?.displayName || "there";
  const completion = profile ? getProfileCompletion(profile) : 0;

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-10">
      <h2 className="text-[var(--foreground)]">
        Assalamu Alaikum, {displayName}
      </h2>
      <p className="mt-2 text-[14px] text-[var(--color-dark-56)]">
        Welcome to BdCan Nikah — your trusted Islamic marriage biodata platform.
      </p>

      {/* Biodata completion card */}
      <div className="mt-8 rounded-2xl border border-[var(--border-subtle)] bg-white p-5 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[var(--foreground)]">
              {completion === 100 ? "Your biodata is complete" : "Complete your biodata"}
            </h3>
            <p className="mt-2 text-[14px] text-[var(--color-dark-56)]">
              {completion === 100
                ? "JazakAllahu Khairan! Your biodata is ready. Our team will review and start finding suitable matches for you."
                : "A complete biodata helps families find the right match for you. Fill in all your details so our team can start matching."}
            </p>
          </div>
          <span className="shrink-0 text-[22px] font-bold text-[var(--foreground)] sm:text-[28px]">
            {completion}%
          </span>
        </div>

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[var(--color-dark-12)]">
          <div
            className="h-full rounded-full bg-[var(--foreground)] transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>

        <Link
          href="/dashboard/biodata"
          className={`${goldButtonClass} mt-6 inline-flex h-11 items-center gap-2 rounded-full px-6 text-[14px] font-semibold`}
        >
          {completion === 100 ? "Review Biodata" : "Complete Biodata"}
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* How it works */}
      <div className="mt-10">
        <h3 className="text-[var(--foreground)]">How it works</h3>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StepCard
            icon={FileText}
            step="1"
            title="Complete your biodata"
            description="Fill in your personal, education, family, and religious details so families can learn about you."
          />
          <StepCard
            icon={Users}
            step="2"
            title="We find your match"
            description="Our team personally reviews profiles and connects you with compatible matches based on your criteria."
          />
          <StepCard
            icon={Shield}
            step="3"
            title="Connect through Wali"
            description="Once matched, both families' Wali contacts are shared so your guardians can take it forward."
          />
        </div>
      </div>

      {/* Personalized matching */}
      <div
        className="mt-10 rounded-2xl p-5 sm:p-8"
        style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
      >
        <div className="flex items-start gap-4">
          <CheckCircle2 className="mt-0.5 size-6 shrink-0 opacity-70" />
          <div>
            <h3 style={{ color: "var(--background)" }}>
              Personalized matchmaking
            </h3>
            <p className="mt-2 text-[14px] opacity-70">
              Unlike other platforms, we don&apos;t leave you to search endlessly.
              Our team carefully reviews every biodata and personally connects compatible
              profiles. Complete your biodata and we&apos;ll handle the rest, In Sha Allah.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCard({
  icon: Icon,
  step,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-white p-5">
      <div className="flex items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
        >
          <Icon className="size-5" />
        </div>
        <span className="text-[12px] font-bold uppercase tracking-wide text-[var(--color-dark-28)]">
          Step {step}
        </span>
      </div>
      <h3 className="mt-4 text-[18px] font-semibold text-[var(--foreground)]">{title}</h3>
      <p className="mt-2 text-[14px] text-[var(--color-dark-56)]">{description}</p>
    </div>
  );
}
