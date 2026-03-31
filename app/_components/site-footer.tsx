import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";
import { goldButtonClass } from "@/components/ui/button-styles";
import { FlourishDivider } from "@/components/ui/flourish-divider";
import {
  SiteOrnament,
  siteOrnamentAssets,
} from "@/components/ui/site-ornament";

const usefulLinks = [
  { label: "Our Approach", href: "/#our-approach" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Family Stories", href: "/#success-stories" },
  { label: "Questions", href: "/#faq" },
];

const supportLinks = [
  { label: "Privacy Promise", href: "/#faq" },
  { label: "Family Guidance", href: "/#our-approach" },
  { label: "Contact Us", href: "/#contact" },
  { label: "Begin Your Profile", href: "/#register" },
];

export default function SiteFooter() {
  return (
    <footer
      id="contact"
      className="relative isolate overflow-hidden bg-[linear-gradient(135deg,var(--color-dark)_0%,var(--color-dark-88)_54%,var(--color-dark-72)_100%)] text-[var(--color-light)]"
    >
      <SiteOrnament
        {...siteOrnamentAssets.asset3}
        className="absolute right-[-82px] bottom-[-46px] z-0 w-[166px] opacity-40 sm:w-[206px] md:w-[246px] lg:w-[310px]"
        sizes="(min-width: 1024px) 20vw, 30vw"
      />

      <div className="relative z-10 mx-auto max-w-[1520px] px-6 py-14 md:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[2.3fr_1.7fr_1.3fr_1.3fr] lg:gap-10">
          <section>
            <Link href="/" className="inline-flex" aria-label="BDCanNikah home">
              <BrandLogo
                src="/bdcannikah-footer-logo.png"
                tone="light"
                className="w-[220px] md:w-[260px]"
              />
            </Link>

            <p className="mt-8 max-w-[36ch] text-[var(--color-light-90)]">
              Faith-led matchmaking for Bangladeshi-Canadian Muslims seeking
              marriage with dignity, family involvement, and barakah in the
              process.
            </p>
          </section>

          <section>
            <h3 className="text-[var(--color-light)]">Contact & Care</h3>
            <ul className="mt-6 space-y-4 text-[var(--color-light-90)]">
              <li className="flex items-start gap-3">
                <DotMark className="mt-2 size-2.5" />
                <span>Online consultations for families across Canada</span>
              </li>
              <li className="flex items-start gap-3">
                <DotMark className="mt-2 size-2.5" />
                <Link href="tel:+17042791249" className="hover:opacity-100">
                  +1 (704) 279-1249
                </Link>
              </li>
              <li className="flex items-start gap-3">
                <DotMark className="mt-2 size-2.5" />
                <Link
                  href="mailto:hello@bdcannikah.ca"
                  className="hover:opacity-100"
                >
                  hello@bdcannikah.ca
                </Link>
              </li>
              <li className="flex items-start gap-3">
                <DotMark className="mt-2 size-2.5" />
                <span>Replies within 1-2 business days</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-[var(--color-light)]">Explore</h3>
            <ul className="mt-6 space-y-4 text-[var(--color-light-90)]">
              {usefulLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-3 hover:opacity-100"
                  >
                    <ArrowMark className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-[var(--color-light)]">Support</h3>
            <ul className="mt-6 space-y-4 text-[var(--color-light-90)]">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-3 hover:opacity-100"
                  >
                    <ArrowMark className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="relative z-10 border-t border-[var(--color-light-18)]">
        <div className="mx-auto flex max-w-[1520px] flex-col gap-4 px-6 py-5 md:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p className="text-[var(--color-light-90)]">
            Copyright 2026 BDCanNikah, All Rights Reserved.
          </p>

          <p className="text-[var(--color-light-90)]">
            Privacy-first, family-aware, and designed for serious marriage
            introductions.
          </p>
        </div>
      </div>
    </footer>
  );
}

function DotMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 8 8"
      className={className}
      fill="currentColor"
    >
      <circle cx="4" cy="4" r="4" />
    </svg>
  );
}

function ArrowMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={className}
      fill="none"
    >
      <path
        d="M7 5.5 11.5 10 7 14.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
