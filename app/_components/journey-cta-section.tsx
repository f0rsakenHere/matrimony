import Link from "next/link";
import { bengaliSerif } from "@/app/fonts";
import { goldButtonClass } from "@/components/ui/button-styles";
import { MotionSection } from "@/components/ui/motion-section";

const trustPoints = ["Free to join", "Wali verified", "100% halal process"];

export default function JourneyCtaSection() {
  return (
    <MotionSection
      id="register"
      className="relative isolate overflow-hidden bg-[linear-gradient(135deg,var(--color-dark)_0%,var(--color-dark-72)_100%)] py-20 md:py-24 lg:py-28"
    >
      <div className="relative z-10 mx-auto max-w-[820px] px-6 text-center md:px-8">
        <p
          className={`${bengaliSerif.className} text-[22px] leading-none text-[var(--color-light-90)] md:text-[26px]`}
        >
          ইনশাআল্লাহ
        </p>

        <h2 className="mt-4 text-[var(--color-light)]">
          Ready to start this journey the right way?
        </h2>

        <p className="mx-auto mt-6 max-w-[46ch] text-[var(--color-light-90)]">
          Set up a private profile and let us help you find someone who shares
          your values.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] font-semibold tracking-[0.08em] text-[var(--color-light-90)] uppercase">
          {trustPoints.map((item, index) => (
            <span key={item} className="inline-flex items-center gap-6">
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="inline-flex size-1 rounded-full bg-[var(--color-light-72)]"
                />
              ) : null}
              <span>{item}</span>
            </span>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
          <Link
            href="/#register"
            className={`${goldButtonClass} inline-flex h-14 min-w-[230px] items-center justify-center px-8 text-base font-semibold`}
          >
            Create Your Profile
          </Link>

          <Link
            href="/#how-it-works"
            className="inline-flex h-14 min-w-[180px] items-center justify-center border border-[var(--color-light)]/40 bg-[var(--color-light)]/10 px-8 text-base font-semibold !text-[var(--color-light)] backdrop-blur-[2px] transition-colors hover:bg-[var(--color-light)]/20"
          >
            See How It Works
          </Link>
        </div>
      </div>
    </MotionSection>
  );
}
