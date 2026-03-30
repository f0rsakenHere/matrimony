import Link from "next/link";
import { MotionSection } from "@/components/ui/motion-section";

export default function JourneyCtaSection() {
  return (
    <MotionSection className="relative isolate overflow-hidden bg-[var(--surface-inverse)] py-16 md:py-20 lg:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,var(--color-light-12)_0%,var(--color-dark)_42%,var(--color-dark)_100%)]" />
        <div className="absolute inset-y-0 left-0 w-[26%] bg-[linear-gradient(90deg,var(--color-dark)_0%,var(--color-dark-28)_100%)]" />
        <div className="absolute inset-y-0 right-0 w-[26%] bg-[linear-gradient(270deg,var(--color-dark)_0%,var(--color-dark-28)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,var(--color-light-12)_0%,transparent_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(0deg,var(--color-dark-28)_0%,transparent_100%)]" />
      </div>

      <div className="relative mx-auto max-w-[980px] px-6 text-center md:px-8">
        <p className="subheading uppercase tracking-[0.2em] text-[var(--color-light-90)]">
          Begin Your Journey
        </p>

        <h2 className="mt-4 text-[var(--color-light)]">
          Your Life Partner Awaits
        </h2>

        <p className="mx-auto mt-6 max-w-[34ch] text-[var(--color-light-90)]">
          Join thousands of serious, marriage-minded Canadian Muslims on a
          platform built for those who put faith first.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
          <Link
            href="/#register"
            className="inline-flex h-14 min-w-[250px] items-center justify-center border border-[var(--color-light)] bg-[var(--color-light)] px-8 text-base font-semibold text-[var(--surface-inverse)] transition-opacity hover:opacity-90"
          >
            Create Your Profile
          </Link>

          <Link
            href="/#faq"
            className="inline-flex h-14 min-w-[180px] items-center justify-center border border-[var(--color-light-72)] bg-[var(--color-dark-12)] px-8 text-base font-semibold !text-white transition-colors hover:bg-[var(--color-dark-28)]"
          >
            Learn More
          </Link>
        </div>

        <p className="mt-7 text-[var(--color-light-72)]">
          Free to join · Wali-verified · 100% halal process
        </p>
      </div>
    </MotionSection>
  );
}
