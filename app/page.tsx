import Link from "next/link";
import Image from "next/image";
import SiteHeader from "./_components/site-header";
import PilgrimsBookingSection from "./_components/pilgrims-booking-section";
import HowItWorksSection from "./_components/how-it-works-section";
import JourneyCtaSection from "./_components/journey-cta-section";
import TestimonialSection from "./_components/testimonial-section";
import FaqSection from "./_components/faq-section";
import SiteFooter from "./_components/site-footer";
import { MotionSection } from "@/components/ui/motion-section";
import { ChevronRightIcon } from "@/components/ui/chevron-right-icon";

const serviceCards = [
  {
    title: "Expert Manual Curation",
    description:
      "We never rely on matching algorithms. Our dedicated matchmakers personally review every single biodata to handpick candidates who truly align with your family values.",
    inverted: true,
  },
  {
    title: "Strictly Halal and Private",
    description:
      "Profiles are never made public. We strictly follow Islamic guidelines and encourage Wali involvement during all introductions.",
    inverted: true,
  },
  {
    title: "For Bangladeshi Canadians",
    description:
      "We understand exactly what it takes to honor your rich ancestral roots while building a successful and modern life here in Canada.",
    inverted: false,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <SiteHeader />

      <main className="flex-1">
        <MotionSection className="relative isolate overflow-hidden bg-[var(--surface-inverse)]">
          <Image
            src="/nikah-canada-hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 object-cover object-center"
          />
          <div className="absolute inset-0 bg-[var(--color-dark-28)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-dark-18)_0%,var(--color-dark-28)_30%,var(--color-dark-56)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-dark-18)_0%,transparent_40%,var(--color-dark-18)_100%)]" />

          <div className="relative mx-auto flex min-h-[calc(100vh-132px)] max-w-[1520px] flex-col items-center justify-center px-6 py-14 text-center text-[var(--color-light)] md:px-8 md:py-16 min-[1100px]:min-h-[calc(100vh-172px)] min-[1100px]:py-20 lg:px-10">
            <div className="mx-auto flex w-full max-w-[1180px] flex-col items-center gap-6">
              <div className="flex w-full max-w-[980px] flex-col items-center gap-4">
                <p className="subheading max-w-[420px] uppercase tracking-[0.06em] text-[var(--color-light)]">
                  Complete Half Your Deen
                </p>

                <h1 className="max-w-[20ch] text-[var(--color-light)] [text-wrap:balance]">
                  Find Your Partner the Halal Way
                </h1>
              </div>

              <p className="max-w-[820px] text-[var(--color-light-96)]">
                Canada&apos;s #1 faith-first matrimonial platform. Connecting
                serious, marriage-minded Muslims through a Wali-verified, halal
                process.
              </p>

              <div className="flex flex-col items-center gap-8">
                <div className="flex flex-col items-center gap-5 lg:flex-row lg:gap-5">
                  <p className="subheading text-[var(--color-light)]">
                    Trusted by 5000+ All Clients and Business
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/#package"
                    className="inline-flex min-w-[196px] items-center justify-center gap-4 bg-[var(--color-dark-72)] px-8 py-5 text-base font-semibold text-[var(--color-light)] transition-colors hover:bg-[var(--color-dark-88)]"
                  >
                    <span>Our Package</span>
                    <ArrowRightIcon className="size-5" />
                  </Link>

                  <Link
                    href="/#about"
                    className="inline-flex min-w-[178px] items-center justify-center bg-[var(--color-dark-88)] px-8 py-5 text-base font-semibold text-[var(--color-light)] transition-colors hover:bg-[var(--color-dark)]"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </MotionSection>

        <MotionSection className="grid lg:grid-cols-3" delay={0.05}>
          {serviceCards.map((card) => (
            <article
              key={card.title}
              className={`flex min-h-[270px] px-6 py-12 md:px-10 lg:min-h-[300px] lg:px-12 lg:py-14 ${
                card.inverted
                  ? "border-r border-[var(--color-light-18)] bg-[var(--surface-inverse)] text-[var(--color-light)]"
                  : "bg-[var(--surface)] text-[var(--foreground)]"
              }`}
            >
              <div className="mx-auto flex h-full w-full max-w-[420px] flex-col">
                <h3
                  className={
                    card.inverted
                      ? "text-[var(--color-light)]"
                      : "text-[var(--foreground)]"
                  }
                >
                  {card.title}
                </h3>

                <p
                  className={`mt-[20px] max-w-[360px] ${
                    card.inverted
                      ? "text-[var(--color-light-90)]"
                      : "text-[var(--color-dark-72)]"
                  }`}
                >
                  {card.description}
                </p>

                <Link
                  href="/#about"
                  className={`mt-auto pt-10 inline-flex items-center gap-4 text-base font-semibold ${
                    card.inverted
                      ? "text-[var(--color-light)]"
                      : "text-[var(--foreground)]"
                  }`}
                >
                  <span
                    className={`flex size-12 items-center justify-center rounded-full ${
                      card.inverted
                        ? "bg-[var(--color-light)] text-[var(--foreground)]"
                        : "bg-[var(--surface-inverse)] text-[var(--color-light)]"
                    }`}
                  >
                    <ChevronRightIcon size={24} />
                  </span>
                  <span>Explore More</span>
                </Link>
              </div>
            </article>
          ))}
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
