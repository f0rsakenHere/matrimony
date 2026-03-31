import Link from "next/link";
import Image from "next/image";
import { brandScript } from "@/app/fonts";
import { goldButtonClass } from "@/components/ui/button-styles";
import { MotionSection } from "@/components/ui/motion-section";
import { ChevronRightIcon } from "@/components/ui/chevron-right-icon";
import { BookOpenCheckIcon } from "@/components/ui/book-open-check-icon";
import { BookmarkCheckIcon } from "@/components/ui/bookmark-check-icon";
import { BlendIcon } from "@/components/ui/blend-icon";

const stats = [
  {
    icon: (
      <BookOpenCheckIcon
        size={44}
        className="text-[var(--color-light)]"
        strokeWidth={2.4}
        duration={1}
      />
    ),
    value: "500+",
    label: "Reviewed biodatas in our network",
  },
  {
    icon: (
      <BookmarkCheckIcon
        size={44}
        className="text-[var(--color-light)]"
        strokeWidth={2.4}
        duration={1}
      />
    ),
    value: "120+",
    label: "Introductions facilitated with care",
  },
  {
    icon: (
      <BlendIcon
        size={44}
        className="text-[var(--color-light)]"
        strokeWidth={2.4}
        duration={1}
      />
    ),
    value: "100%",
    label: "Profiles screened by real people",
  },
];

export default function PilgrimsBookingSection() {
  return (
    <MotionSection
      id="our-approach"
      className="relative isolate overflow-hidden bg-[var(--surface)] py-14 md:py-16 lg:py-20"
    >
      <div className="relative z-10 mx-auto max-w-[1520px] px-6 md:px-8 lg:px-10">
        <div className="overflow-hidden rounded-[32px] border border-[var(--color-dark-12)] bg-[linear-gradient(180deg,var(--surface-muted)_0%,var(--surface)_100%)] shadow-[0_18px_40px_rgb(109_35_49_/_0.08)] lg:-mb-20">
          <div className="grid lg:grid-cols-[390px_1fr]">
            <div className="border-b border-[var(--color-dark-12)] p-8 lg:border-r lg:border-b-0 lg:p-10">
              <p
                className={`${brandScript.className} max-w-[8ch] text-[34px] leading-none text-[var(--color-dark-72)] md:text-[42px]`}
              >
                A search that feels calm
              </p>
              <h3 className="mt-4 max-w-[13ch] font-serif leading-[1.06] text-[var(--foreground)]">
                Designed for privacy, clarity, and family trust
              </h3>
              <p className="mt-6 text-[var(--color-dark-72)]">
                Every introduction is shared thoughtfully so the process feels
                respectful from the very first step.
              </p>
            </div>

            <div className="grid bg-[var(--surface-inverse)] text-[var(--color-light)] md:grid-cols-3">
              {stats.map((item, index) => {
                return (
                  <div
                    key={item.label}
                    className={`relative flex flex-col items-start justify-start px-8 pt-10 pb-8 md:px-10 md:pt-11 md:pb-10 ${
                      index < stats.length - 1
                        ? "border-b border-[var(--color-light-18)] md:border-b-0 md:after:absolute md:after:top-1/2 md:after:right-0 md:after:h-[70%] md:after:w-px md:after:-translate-y-1/2 md:after:bg-[var(--color-light-18)]"
                        : ""
                    }`}
                  >
                    {item.icon}
                    <p className="mt-6 text-[52px] font-bold leading-none md:text-[56px]">
                      {item.value}
                    </p>
                    <p className="subheading mt-4 text-[var(--color-light)]">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="relative isolate w-full overflow-hidden border-y border-[var(--color-dark-12)] lg:min-h-[760px] lg:pt-28">
        <Image
          src="/table-decor.jpg"
          alt=""
          fill
          sizes="100vw"
          className="absolute inset-0 object-cover [filter:sepia(0.3)_saturate(0.82)_hue-rotate(-12deg)]"
          style={{ objectPosition: "center top" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(125deg,var(--color-dark-56)_0%,var(--color-dark-28)_38%,var(--color-light-12)_100%)]" />

        <div className="relative z-10 mx-auto grid max-w-[1520px] gap-10 px-6 py-14 md:px-10 md:py-16 lg:grid-cols-[1fr_420px] lg:items-end lg:px-14 lg:py-16">
          <div className="max-w-[620px] text-[var(--color-dark)] lg:self-start">
            <p className="subheading uppercase tracking-[0.06em] text-[var(--color-light)]">
              A MORE PEACEFUL WAY TO SEARCH
            </p>
            <h2 className="mt-4 text-[var(--color-light)] [text-wrap:balance] [text-shadow:0_4px_18px_var(--color-dark-56)]">
              Your search deserves more than swipes and guesswork
            </h2>
            <p className="mt-6 max-w-[34ch] text-[var(--color-light-96)]">
              We bring care, discretion, and human guidance to every
              introduction so the journey toward marriage feels grounded and
              dignified.
            </p>

            <Link
              href="/#register"
              className={`${goldButtonClass} mt-8 inline-flex h-14 min-w-[188px] items-center justify-center gap-3 px-7 text-base font-semibold`}
            >
              <span>Begin Your Private Profile</span>
              <ChevronRightIcon size={20} />
            </Link>
          </div>

          <aside className="rounded-[28px] bg-[rgb(246_226_210_/_0.94)] p-6 text-[var(--foreground)] shadow-[0_18px_40px_rgb(109_35_49_/_0.14)] md:p-8">
            <h3 className="text-[var(--foreground)]">
              Our Promise to Your Family
            </h3>

            <p className="mt-6 text-[var(--color-dark-72)]">
              Marriage is too important to reduce to swipes and guesswork. We
              keep the process private, thoughtful, and human at every step, so
              your family can move forward with clarity, dignity, and trust.
            </p>

            <p className="mt-8 border-t border-[var(--color-dark-12)] pt-6 text-base font-semibold text-[var(--foreground)]">
              With care from the BDCanNikah team
            </p>
          </aside>
        </div>
      </div>
    </MotionSection>
  );
}
