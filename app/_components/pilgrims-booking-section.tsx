import Link from "next/link";
import Image from "next/image";
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
        duration={1}
      />
    ),
    value: "500+",
    label: "Active Canadian Biodatas",
  },
  {
    icon: (
      <BookmarkCheckIcon
        size={44}
        className="text-[var(--color-light)]"
        duration={1}
      />
    ),
    value: "120+",
    label: "Successful Introductions",
  },
  {
    icon: (
      <BlendIcon size={44} className="text-[var(--color-light)]" duration={1} />
    ),
    value: "100%",
    label: "Manually Curated Matches",
  },
];

export default function PilgrimsBookingSection() {
  return (
    <MotionSection className="bg-[var(--surface)] py-14 md:py-16 lg:py-20">
      <div className="mx-auto max-w-[1520px] px-6 md:px-8 lg:px-10">
        <div className="relative z-10 overflow-hidden border border-[var(--color-dark-12)] bg-[var(--surface)] lg:-mb-20">
          <div className="grid lg:grid-cols-[300px_1fr]">
            <div className="border-b border-[var(--color-dark-12)] p-8 lg:border-r lg:border-b-0 lg:p-10">
              <p className="text-[58px] font-bold leading-none text-[var(--foreground)] md:text-[64px]">
                99%
              </p>
              <h3 className="mt-4 text-[var(--foreground)]">
                Customer Satisfaction
              </h3>
              <p className="mt-6 text-[var(--color-dark-72)]">
                Every single biodata is screened by our team.
              </p>
            </div>

            <div className="grid bg-[var(--surface-inverse)] text-[var(--color-light)] md:grid-cols-3">
              {stats.map((item, index) => {
                return (
                  <div
                    key={item.label}
                    className={`p-8 md:p-10 ${
                      index < stats.length - 1
                        ? "border-b border-[var(--color-light-18)] md:border-r md:border-b-0"
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

      <div className="relative isolate w-full overflow-hidden border-y border-[var(--color-dark-12)] bg-[var(--surface-inverse)] lg:min-h-[760px] lg:pt-28">
        <Image
          src="/booking section.jpg"
          alt=""
          fill
          sizes="100vw"
          className="absolute inset-0 object-cover object-center"
        />
        <div className="absolute inset-0 bg-[var(--color-dark-56)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-dark-72)_0%,var(--color-dark-28)_58%,var(--color-dark-18)_100%)]" />

        <div className="relative z-10 mx-auto grid max-w-[1520px] gap-10 px-6 py-14 md:px-10 md:py-16 lg:grid-cols-[1fr_420px] lg:items-end lg:px-14 lg:py-16">
          <div className="max-w-[620px] text-[var(--color-light)]">
            <p className="subheading uppercase tracking-[0.06em] text-[var(--color-light)]">
              YOUR PRIVATE SEARCH BEGINS HERE
            </p>
            <h2 className="mt-4 text-[var(--color-light)] [text-wrap:balance]">
              Ready to Find Someone Who Shares Your Values?
            </h2>

            <Link
              href="/#consult"
              className="mt-8 inline-flex h-14 min-w-[188px] items-center justify-center gap-3 border border-[var(--color-light-18)] bg-[var(--color-dark-12)] px-7 text-base font-semibold text-[var(--color-light)] transition-colors hover:bg-[var(--color-dark-28)]"
            >
              <span>Consult With Us</span>
              <ChevronRightIcon size={20} />
            </Link>
          </div>

          <aside className="bg-[var(--surface)] p-6 text-[var(--foreground)] md:p-8">
            <h3 className="text-[var(--foreground)]">
              Our Promise to Your Family
            </h3>

            <p className="mt-6 text-[var(--color-dark-72)]">
              We know finding a spouse is the most important decision of your
              life. That is why we treat your search with the utmost respect. No
              public swiping, no hidden algorithms, and absolutely no
              compromises on your privacy. We offer dedicated human effort and
              sincere Duas for your success.
            </p>

            <p className="mt-8 border-t border-[var(--color-dark-12)] pt-6 text-base font-semibold text-[var(--foreground)]">
              The Matchmaking Team
            </p>
          </aside>
        </div>
      </div>
    </MotionSection>
  );
}
