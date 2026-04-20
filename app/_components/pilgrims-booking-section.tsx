import Link from "next/link";
import Image from "next/image";
import { bengaliSerif } from "@/app/fonts";
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
    label: "Introductions made",
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
    label: "Profiles verified by real people",
  },
];

export default function PilgrimsBookingSection() {
  return (
    <MotionSection
      id="our-approach"
      className="relative isolate overflow-hidden bg-[var(--surface)] py-16 md:py-20 lg:py-24"
    >
      <div className="relative z-10 mx-auto max-w-[1520px] px-6 md:px-8 lg:px-10">
        <div className="overflow-hidden border border-[var(--color-dark-12)] bg-[var(--surface)] lg:-mb-20">
          <div className="grid lg:grid-cols-[390px_1fr]">
            <div className="border-b border-[var(--color-dark-12)] p-6 sm:p-7 md:p-8 lg:border-r lg:border-b-0 lg:p-10">
              <p className="text-[12px] font-semibold tracking-[0.18em] text-[var(--color-dark-56)] uppercase">
                <span
                  className={`${bengaliSerif.className} text-[15px] tracking-normal normal-case`}
                >
                  আমাদের দৃষ্টিভঙ্গি
                </span>
                <span aria-hidden="true" className="mx-2 opacity-50">
                  ·
                </span>
                Our Approach
              </p>
              <h3 className="mt-4 max-w-[16ch] text-[var(--foreground)]">
                Built on privacy, clarity, and family trust
              </h3>
              <p className="mt-6 text-[var(--color-dark-72)]">
                Every introduction is handled with care so the whole experience
                feels dignified from day one.
              </p>
            </div>

            <div className="grid bg-[var(--surface-inverse)] text-[var(--color-light)] md:grid-cols-3">
              {stats.map((item, index) => {
                return (
                  <div
                    key={item.label}
                    className={`relative flex flex-col items-start justify-start px-6 pt-8 pb-7 sm:px-8 sm:pt-10 sm:pb-8 md:px-8 md:pt-11 md:pb-10 lg:px-10 ${
                      index < stats.length - 1
                        ? "border-b border-[var(--color-light-18)] md:border-b-0 md:after:absolute md:after:top-1/2 md:after:right-0 md:after:h-[70%] md:after:w-px md:after:-translate-y-1/2 md:after:bg-[var(--color-light-18)]"
                        : ""
                    }`}
                  >
                    {item.icon}
                    <p className="mt-5 text-[44px] font-bold leading-none sm:mt-6 sm:text-[52px] md:text-[56px]">
                      {item.value}
                    </p>
                    <p className="subheading mt-3 text-[var(--color-light)] sm:mt-4">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="relative isolate w-full overflow-hidden lg:min-h-[640px] lg:pt-32">
        <Image
          src="/wedding.webp"
          alt=""
          fill
          sizes="100vw"
          className="absolute inset-0 object-cover"
          style={{ objectPosition: "center top" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,var(--color-dark-72)_0%,var(--color-dark-56)_55%,var(--color-dark-18)_100%)]" />

        <div className="relative z-10 mx-auto grid max-w-[1520px] gap-8 px-6 py-14 sm:gap-10 sm:py-16 md:px-10 md:py-20 lg:grid-cols-[1fr_420px] lg:items-end lg:px-14 lg:py-20">
          <div className="max-w-[620px] lg:self-start">
            <p className="text-[12px] font-semibold tracking-[0.18em] text-[var(--color-light-90)] uppercase">
              <span
                className={`${bengaliSerif.className} text-[15px] tracking-normal normal-case`}
              >
                একটি প্রশান্তিময় পথ
              </span>
              <span aria-hidden="true" className="mx-2 opacity-60">
                ·
              </span>
              A more peaceful way to search
            </p>
            <h2 className="mt-4 text-[var(--color-light)] [text-wrap:balance]">
              Your search deserves more than endless swiping
            </h2>
            <p className="mt-6 max-w-[36ch] text-[var(--color-light-96)]">
              We bring empathy and privacy to the table, making the journey to
              marriage feel grounded and safe.
            </p>

            <Link
              href="/#register"
              className={`${goldButtonClass} mt-8 inline-flex h-14 w-full min-w-0 items-center justify-center gap-3 px-6 text-[15px] font-semibold sm:w-auto sm:min-w-[230px] sm:px-7 sm:text-base`}
            >
              <span>Begin Your Private Profile</span>
              <ChevronRightIcon size={20} />
            </Link>
          </div>

          <aside className="border border-[var(--color-light-18)] bg-[rgb(30_58_95_/_0.55)] p-6 text-[var(--color-light)] backdrop-blur-[3px] sm:p-7 md:p-8">
            <h3 className="text-[var(--color-light)]">
              Our promise to your family
            </h3>

            <p className="mt-6 text-[var(--color-light-90)]">
              Marriage is too big of a decision for guesswork. We keep things
              private and thoughtful at every stage. This helps your family
              move forward with trust and clarity.
            </p>

            <p className="mt-8 border-t border-[var(--color-light-18)] pt-6 text-sm font-semibold tracking-[0.14em] text-[var(--color-light)] uppercase">
              With care · BDCanNikah team
            </p>
          </aside>
        </div>
      </div>
    </MotionSection>
  );
}
