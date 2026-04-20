import Link from "next/link";
import Image from "next/image";
import { bengaliSerif } from "./fonts";
import SiteHeader from "./_components/site-header";
import PilgrimsBookingSection from "./_components/pilgrims-booking-section";
import HowItWorksSection from "./_components/how-it-works-section";
import JourneyCtaSection from "./_components/journey-cta-section";
import TestimonialSection from "./_components/testimonial-section";
import FaqSection from "./_components/faq-section";
import SiteFooter from "./_components/site-footer";
import { MotionSection } from "@/components/ui/motion-section";
import { ChevronRightIcon } from "@/components/ui/chevron-right-icon";
import { AyahBlock } from "@/components/ui/ayah-block";
import {
  goldButtonClass,
  goldIconButtonClass,
} from "@/components/ui/button-styles";

const serviceCards = [
  {
    eyebrow: "Real people, real care",
    title: "Thoughtful introductions, not random matching",
    description:
      "We personally review every profile. This way, your first conversation starts with genuine potential and respect.",
    href: "/#how-it-works",
    linkLabel: "See the process",
  },
  {
    eyebrow: "Faith first",
    title: "A halal and private approach",
    description:
      "Families stay involved and boundaries are clear. We make sure every step protects your dignity.",
    href: "/#faq",
    linkLabel: "How privacy works",
  },
  {
    eyebrow: "Canada focused",
    title: "Bangladeshi roots, Canadian life",
    description:
      "We understand the balance of keeping our family traditions alive while building a confident future here.",
    href: "/register",
    linkLabel: "Begin with us",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <SiteHeader />

      <main className="flex-1">
        <MotionSection className="relative isolate overflow-hidden bg-[var(--surface-inverse)]">
          <Image
            src="/hero-image.webp"
            alt=""
            fill
            loading="eager"
            sizes="100vw"
            className="absolute inset-0 object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(96deg,var(--color-dark-72)_0%,var(--color-dark-56)_55%,var(--color-dark-18)_100%)]" />

          <div className="relative z-10 mx-auto flex min-h-[600px] max-w-[1520px] items-center px-5 py-14 text-[var(--color-light)] sm:min-h-[calc(100vh-148px)] sm:px-6 sm:py-16 md:px-8 md:py-20 min-[1100px]:min-h-[calc(100vh-188px)] min-[1100px]:py-24 lg:px-10">
            <div className="w-full max-w-[760px]">
              <p
                className={`${bengaliSerif.className} text-[24px] leading-none text-[var(--color-light-90)] sm:text-[26px] md:text-[32px]`}
              >
                বিবাহ ও বরকত
              </p>
              <h1 className="mt-4 max-w-[14ch] text-[var(--color-light)] [text-wrap:balance]">
                A quieter, better way to find the right person
              </h1>
              <p
                className={`${bengaliSerif.className} mt-6 max-w-[46ch] text-[18px] leading-[1.65] text-[var(--color-light-90)] md:text-[20px]`}
              >
                প্রতিটি সূচনা হোক শালীনতা, সম্মান ও সুন্দর সদিচ্ছার সাথে।
              </p>
              <p className="mt-4 max-w-[58ch] text-[var(--color-light-96)]">
                We help marriage minded Muslims and their families meet in a
                way that values privacy, respect, and real compatibility. No
                public profiles, just thoughtful introductions.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/register"
                  className={`${goldButtonClass} inline-flex w-full min-w-0 items-center justify-center gap-3 px-6 py-4 text-[15px] font-semibold sm:w-auto sm:min-w-[210px] sm:gap-4 sm:px-8 sm:py-5 sm:text-base`}
                >
                  <span>Begin Your Profile</span>
                  <ArrowRightIcon className="size-5" />
                </Link>

                <Link
                  href="/#how-it-works"
                  className="inline-flex w-full min-w-0 items-center justify-center border border-[var(--color-light)]/40 bg-[var(--color-light)]/10 px-6 py-4 text-[15px] font-semibold !text-[var(--color-light)] backdrop-blur-[2px] transition-colors hover:bg-[var(--color-light)]/20 sm:w-auto sm:min-w-[210px] sm:px-8 sm:py-5 sm:text-base"
                >
                  See How It Works
                </Link>
              </div>
            </div>
          </div>
        </MotionSection>

        <MotionSection
          className="bg-[var(--surface)] py-16 md:py-20 lg:py-24"
          delay={0.05}
        >
          <div className="mx-auto max-w-[1520px] px-6 md:px-8 lg:px-10">
            <div className="mx-auto max-w-[680px] text-center">
              <p className="text-[12px] font-semibold tracking-[0.18em] text-[var(--color-dark-56)] uppercase">
                <span
                  className={`${bengaliSerif.className} text-[15px] tracking-normal normal-case`}
                >
                  আমাদের স্বকীয়তা
                </span>
                <span aria-hidden="true" className="mx-2 opacity-50">
                  ·
                </span>
                What sets us apart
              </p>
              <h2 className="mt-4 text-[var(--foreground)]">
                Built for families who want a better way to search
              </h2>
              <p className="mt-6 text-[var(--color-dark-72)]">
                This is not a public dating app. It is a private space for
                families who value deen, compatibility, and barakah in the
                process.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:mt-14 lg:grid-cols-3">
              {serviceCards.map((card) => (
                <article
                  key={card.title}
                  className="relative flex min-h-[300px] overflow-hidden border border-[var(--color-dark-12)] bg-[var(--surface)] px-6 py-8 transition-shadow duration-300 hover:shadow-[0_18px_40px_rgb(30_58_95_/_0.10)] sm:px-7 sm:py-10 md:px-9"
                >
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,var(--button-gold-light)_0%,var(--button-gold-dark)_100%)]" />
                  <div className="flex h-full w-full max-w-[420px] flex-col">
                    <p className="text-[12px] font-semibold tracking-[0.18em] text-[var(--color-dark-56)] uppercase">
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
                      className="mt-auto inline-flex items-center gap-4 pt-8 text-[15px] font-semibold text-[var(--foreground)]"
                    >
                      <span
                        className={`${goldIconButtonClass} flex size-11 items-center justify-center rounded-full`}
                      >
                        <ChevronRightIcon size={22} />
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

        <MotionSection className="bg-[var(--surface)] py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-[1520px] px-6 md:px-8 lg:px-10">
            <AyahBlock />
          </div>
        </MotionSection>

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
