import Link from "next/link";
import { brandScript } from "@/app/fonts";
import { goldButtonClass } from "@/components/ui/button-styles";
import { MotionSection } from "@/components/ui/motion-section";
import {
  SiteOrnament,
  siteOrnamentAssets,
} from "@/components/ui/site-ornament";

const trustPoints = ["Free to join", "Wali-verified", "100% halal process"];

export default function JourneyCtaSection() {
  return (
    <MotionSection
      id="register"
      className="relative isolate overflow-hidden bg-[linear-gradient(135deg,var(--color-dark)_0%,var(--color-dark-88)_58%,var(--color-dark-72)_100%)] py-16 md:py-20 lg:py-24"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,var(--color-light-12)_0%,var(--color-dark-72)_38%,var(--color-dark)_100%)]" />
        <div className="absolute inset-y-0 left-0 w-[26%] bg-[linear-gradient(90deg,var(--color-dark)_0%,var(--color-dark-28)_100%)]" />
        <div className="absolute inset-y-0 right-0 w-[26%] bg-[linear-gradient(270deg,var(--color-dark)_0%,var(--color-dark-28)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,var(--color-light-12)_0%,transparent_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(0deg,var(--color-dark-28)_0%,transparent_100%)]" />
      </div>

      <SiteOrnament
        {...siteOrnamentAssets.asset1}
        className="absolute -top-8 -left-8 z-0 w-[110px] -rotate-[10deg] opacity-28 sm:-left-10 sm:w-[140px] md:-top-10 md:-left-12 md:w-[170px] lg:w-[210px]"
        sizes="(min-width: 1024px) 14vw, 20vw"
      />
      <SiteOrnament
        {...siteOrnamentAssets.asset4}
        className="absolute right-[-86px] bottom-6 z-0 h-[120px] w-auto rotate-90 opacity-26 sm:right-[-98px] sm:h-[150px] md:right-[-116px] md:h-[180px] lg:right-[-136px] lg:bottom-4 lg:h-[220px]"
        sizes="(min-width: 1024px) 18vw, 24vw"
      />

      <div className="relative z-10 mx-auto max-w-[980px] px-6 text-center md:px-8">
        <p
          className={`${brandScript.className} text-[28px] leading-none text-[var(--color-light-90)] md:text-[36px]`}
        >
          In sha Allah, your next chapter begins here
        </p>

        <h2 className="mt-4 text-[var(--color-light)]">
          Ready to begin with intention, family, and barakah?
        </h2>

        <p className="mx-auto mt-6 max-w-[34ch] text-[var(--color-light-90)]">
          Start with a private profile and let us guide you toward introductions
          that feel respectful, thoughtful, and genuinely marriage-minded.
        </p>

        <div className="mt-8 flex justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-[var(--color-light-18)] bg-[rgb(246_226_210_/_0.08)] px-5 py-3 text-sm font-medium text-[var(--color-light-90)] backdrop-blur-[2px]">
            {trustPoints.map((item, index) => (
              <div key={item} className="contents">
                {index > 0 ? (
                  <span
                    aria-hidden="true"
                    className="inline-flex size-1.5 rounded-full bg-[var(--color-light-48)]"
                  />
                ) : null}
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
          <Link
            href="/#register"
            className={`${goldButtonClass} inline-flex h-14 min-w-[250px] items-center justify-center px-8 text-base font-semibold`}
          >
            Create Your Profile
          </Link>

          <Link
            href="/#how-it-works"
            className={`${goldButtonClass} inline-flex h-14 min-w-[180px] items-center justify-center px-8 text-base font-semibold`}
          >
            See How It Works
          </Link>
        </div>
      </div>
    </MotionSection>
  );
}
