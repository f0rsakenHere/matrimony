import Link from "next/link";
import { bengaliSerif } from "@/app/fonts";
import { BrandLogo } from "@/components/ui/brand-logo";

const exploreLinks = [
  { label: "Our Approach", href: "/#our-approach" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Family Stories", href: "/#success-stories" },
  { label: "Questions", href: "/#faq" },
  { label: "Begin Your Profile", href: "/#register" },
];

export default function SiteFooter() {
  return (
    <footer
      id="contact"
      className="bg-[var(--surface-inverse)] text-[var(--color-light)]"
    >
      <div className="mx-auto max-w-[1520px] px-6 py-14 md:px-8 md:py-16 lg:px-10 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-[1.6fr_1fr_1fr]">
          <section className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex" aria-label="BDCanNikah home">
              <BrandLogo
                src="/bdcannikah-footer-logo.png"
                tone="light"
                className="w-[180px] sm:w-[200px] md:w-[240px]"
              />
            </Link>

            <p
              className={`${bengaliSerif.className} mt-6 text-[18px] leading-snug text-[var(--color-light-90)] sm:mt-8 sm:text-[20px] md:text-[22px]`}
            >
              বিশ্বাস, পরিবার ও বরকত
            </p>

            <p className="mt-4 max-w-[40ch] text-[var(--color-light-90)]">
              Faith led matchmaking for Bangladeshi Canadian Muslims seeking a
              dignified path to marriage.
            </p>
          </section>

          <section>
            <h3 className="text-[var(--color-light)]">Contact</h3>
            <ul className="mt-6 space-y-4 text-[var(--color-light-90)]">
              <li>Online consultations across Canada</li>
              <li>
                <Link
                  href="tel:+17042791249"
                  className="transition-opacity hover:opacity-75"
                >
                  +1 (704) 279 1249
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:hello@bdcannikah.ca"
                  className="transition-opacity hover:opacity-75"
                >
                  hello@bdcannikah.ca
                </Link>
              </li>
              <li className="text-sm text-[var(--color-light-72)]">
                Replies within 1 to 2 business days
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-[var(--color-light)]">Explore</h3>
            <ul className="mt-6 space-y-4 text-[var(--color-light-90)]">
              {exploreLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition-opacity hover:opacity-75"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="border-t border-[var(--color-light-18)]">
        <div className="mx-auto flex max-w-[1520px] flex-col gap-2 px-6 py-5 text-[13px] text-[var(--color-light-72)] sm:gap-3 sm:py-6 sm:text-sm md:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p>© 2026 BDCanNikah · All rights reserved.</p>
          <p>Privacy first · Family aware · Marriage minded</p>
        </div>
      </div>
    </footer>
  );
}
