import Link from "next/link";
import Image from "next/image";
import { brandScript } from "./fonts";
import SiteHeader from "./_components/site-header";
import PilgrimsBookingSection from "./_components/pilgrims-booking-section";
import HowItWorksSection from "./_components/how-it-works-section";
import JourneyCtaSection from "./_components/journey-cta-section";
import TestimonialSection from "./_components/testimonial-section";
import FaqSection from "./_components/faq-section";
import SiteFooter from "./_components/site-footer";
import { MotionSection } from "@/components/ui/motion-section";
import { ChevronRightIcon } from "@/components/ui/chevron-right-icon";
import {
  goldButtonClass,
  goldIconButtonClass,
} from "@/components/ui/button-styles";
import { FlourishDivider } from "@/components/ui/flourish-divider";
import {
  SiteOrnament,
  siteOrnamentAssets,
} from "@/components/ui/site-ornament";

const heroHighlights = [
  {
    title: "Family-guided",
    description:
      "Wali support and family involvement are welcomed from the start.",
  },
  {
    title: "Private by design",
    description: "No public swiping, no browsing strangers, and no guesswork.",
  },
  {
    title: "Curated in Canada",
    description:
      "Built for Bangladeshi-Canadian Muslims balancing deen and life here.",
  },
];

const heroGuidancePoints = [
  "Every biodata is reviewed by a real person before any introduction is considered.",
  "Matches are shared only when values, goals, and family expectations show genuine alignment.",
  "The process stays calm, respectful, and focused on marriage from the very beginning.",
];

const serviceCards = [
  {
    eyebrow: "Human-led",
    title: "Thoughtful Introductions, Not Random Matching",
    description:
      "We personally shortlist profiles so the first conversation feels intentional, respectful, and worth pursuing.",
    href: "/#how-it-works",
    linkLabel: "See the process",
  },
  {
    eyebrow: "Faith-first",
    title: "A Halal Process with Privacy and Adab",
    description:
      "Families stay involved, boundaries stay clear, and each step protects dignity on both sides.",
    href: "/#faq",
    linkLabel: "See how privacy works",
  },
  {
    eyebrow: "Canada-focused",
    title: "Rooted in Bangladeshi Values, Built for Life in Canada",
    description:
      "We understand the balance between family expectations, deen, and building a home in Canada with confidence.",
    href: "/#register",
    linkLabel: "Begin with us",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <SiteHeader />

      <main className="flex-1">
        <MotionSection className="relative isolate overflow-hidden bg-[linear-gradient(135deg,var(--color-dark)_0%,var(--color-dark-88)_58%,var(--color-dark-72)_100%)]">
          <Image
            src="/hero-image.webp"
            alt=""
            fill
            preload
            sizes="100vw"
            className="absolute inset-0 object-cover object-center [filter:sepia(0.14)_saturate(0.8)_brightness(0.68)]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(96deg,var(--color-dark)_0%,var(--color-dark-88)_42%,var(--color-dark-56)_70%,var(--color-dark-18)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-dark-56)_0%,var(--color-dark-18)_42%,var(--color-dark-72)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_28%,var(--color-light-12)_0%,transparent_24%)]" />

          <div className="relative z-10 mx-auto flex min-h-[calc(100vh-132px)] max-w-[1520px] items-center px-6 py-14 text-[var(--color-light)] md:px-8 md:py-16 min-[1100px]:min-h-[calc(100vh-172px)] min-[1100px]:py-20 lg:px-10">
            <div className="max-w-[760px]">
              <p className="subheading max-w-[500px] uppercase tracking-[0.08em] text-[var(--color-light-90)]">
                Private, family-guided introductions for marriage-minded Muslims
                in Canada
              </p>
              <h1 className="mt-4 max-w-[11ch] text-[var(--color-light)] [text-wrap:balance]">
                A Graceful Path to the Right Marriage
              </h1>
              <p className="mt-6 max-w-[62ch] text-[var(--color-light-96)]">
                We guide marriage-minded Muslims and their families through
                discreet, curated introductions rooted in adab, compatibility,
                and sincere intention.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/#register"
                  className={`${goldButtonClass} inline-flex min-w-[210px] items-center justify-center gap-4 px-8 py-5 text-base font-semibold`}
                >
                  <span>Begin Your Profile</span>
                  <ArrowRightIcon className="size-5" />
                </Link>

                <Link
                  href="/#how-it-works"
                  className={`${goldButtonClass} inline-flex min-w-[210px] items-center justify-center px-8 py-5 text-base font-semibold`}
                >
                  See How It Works
                </Link>
              </div>
            </div>
          </div>
        </MotionSection>

        <MotionSection
          className="relative isolate overflow-hidden bg-[linear-gradient(180deg,var(--surface-muted)_0%,var(--surface)_100%)] py-16 md:py-18 lg:py-20"
          delay={0.05}
        >
          <SiteOrnament
            {...siteOrnamentAssets.asset1}
            className="absolute top-0 left-[-72px] z-0 w-[150px] opacity-50 sm:w-[190px] md:w-[230px] lg:w-[280px]"
            sizes="(min-width: 1024px) 18vw, 28vw"
          />
          <SiteOrnament
            {...siteOrnamentAssets.asset3}
            className="absolute right-[-70px] bottom-[-36px] z-0 w-[168px] opacity-45 sm:w-[220px] md:w-[260px] lg:w-[320px]"
            sizes="(min-width: 1024px) 20vw, 30vw"
          />

          <div className="relative z-10 mx-auto max-w-[1520px] px-6 md:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-10">
              <div className="max-w-[560px]">
                <p
                  className={`${brandScript.className} text-[28px] leading-none text-[var(--color-dark-72)] md:text-[34px]`}
                >
                  What families can expect
                </p>
                <h2 className="mt-4 text-[var(--foreground)]">
                  A private process with clarity from the very first step
                </h2>
                <p className="mt-6 text-[var(--color-dark-72)]">
                  We keep the journey calm, intentional, and easy to follow so
                  families understand what happens next and why.
                </p>

                <FlourishDivider className="mt-8" />
              </div>

              <div className="rounded-[30px] border border-[var(--color-dark-12)] bg-[var(--surface)] p-6 shadow-[0_18px_40px_rgb(109_35_49_/_0.08)] md:p-8">
                <div className="space-y-4">
                  {heroGuidancePoints.map((point, index) => (
                    <div key={point} className="flex items-start gap-4">
                      <span
                        className={`${goldIconButtonClass} inline-flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="text-[var(--color-dark-72)]">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {heroHighlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[22px] border border-[var(--color-dark-12)] bg-[var(--surface)] px-5 py-5 shadow-[0_12px_30px_rgb(109_35_49_/_0.06)]"
                >
                  <p className="subheading text-[var(--foreground)]">
                    {item.title}
                  </p>
                  <p className="mt-3 text-sm text-[var(--color-dark-72)]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-14 max-w-[760px] text-center">
              <p
                className={`${brandScript.className} text-[28px] leading-none text-[var(--color-dark-72)] md:text-[34px]`}
              >
                The details matter
              </p>
              <h2 className="mt-4 text-[var(--foreground)]">
                Designed for sincere introductions and beautiful beginnings
              </h2>
              <p className="mt-6 text-[var(--color-dark-72)]">
                This is not a public marketplace. It is a guided matrimony
                experience for families who want compatibility, care, and
                barakah in the process.
              </p>

              <FlourishDivider className="mt-8 justify-center" />
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {serviceCards.map((card) => (
                <article
                  key={card.title}
                  className="relative flex min-h-[320px] overflow-hidden rounded-[28px] border border-[var(--color-dark-12)] bg-[var(--surface)] px-6 py-8 shadow-[0_18px_40px_rgb(109_35_49_/_0.08)] md:px-8"
                >
                  <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,var(--button-gold-light)_0%,var(--button-gold-dark)_100%)]" />
                  <div className="mx-auto flex h-full w-full max-w-[420px] flex-col">
                    <p className="subheading uppercase tracking-[0.08em] text-[var(--color-dark-72)]">
                      {card.eyebrow}
                    </p>
                    <h3 className="mt-4 text-[var(--foreground)]">
                      {card.title}
                    </h3>

                    <p className="mt-6 max-w-[34ch] text-[var(--color-dark-72)]">
                      {card.description}
                    </p>

                    <Link
                      href={card.href}
                      className="mt-auto inline-flex items-center gap-4 pt-8 text-base font-semibold text-[var(--foreground)]"
                    >
                      <span
                        className={`${goldIconButtonClass} flex size-12 items-center justify-center rounded-full`}
                      >
                        <ChevronRightIcon size={24} />
                      </span>
                      <span>{card.linkLabel}</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </MotionSection>

        <PilgrimsBookingSection />
        <HowItWorksSection />
        <JourneyCtaSection />
        <TestimonialSection />
        <FaqSection />
      </main>

      <SiteFooter />
    </div>
  );
}

function ArrowRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
    >
      <path
        d="M5 12h14m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
