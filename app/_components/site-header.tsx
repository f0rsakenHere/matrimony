import Link from "next/link";
import { soraSans } from "@/app/fonts";
import { BrandLogo as SiteBrandLogo } from "@/components/ui/brand-logo";
import { goldButtonClass } from "@/components/ui/button-styles";

const navigationLinks = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#our-approach", label: "Our Approach" },
  { href: "/#success-stories", label: "Family Stories" },
  { href: "/#faq", label: "Questions" },
];

const registerLink = { href: "/#register", label: "Begin Your Profile" };

export default function SiteHeader() {
  return (
    <header
      id="top"
      className={`${soraSans.className} relative isolate w-full bg-[var(--surface)] text-[var(--foreground)]`}
    >
      <div className="bg-[var(--surface-inverse)] text-[var(--color-light)]">
        <div className="mx-auto flex max-w-[1520px] items-center justify-center px-5 py-2 sm:px-6 sm:py-2.5 md:px-8 lg:px-10">
          <p className="text-center text-[11px] leading-snug tracking-[0.12em] uppercase text-[var(--color-light-90)] sm:text-[12px] sm:tracking-[0.14em]">
            Private introductions for Bangladeshi Canadian Muslim families
          </p>
        </div>
      </div>

      <div className="border-b border-[var(--border-subtle)]">
        <div className="mx-auto flex h-[76px] max-w-[1520px] items-center justify-between gap-4 px-5 sm:h-[88px] sm:gap-6 sm:px-6 md:px-8 lg:h-[104px] lg:px-10">
          <Link
            href="/"
            aria-label="BDCanNikah home"
            className="shrink-0"
          >
            <SiteBrandLogo className="w-[160px] sm:w-[180px] md:w-[220px] lg:w-[240px]" />
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-8 text-[15px] font-semibold text-[var(--foreground)] min-[900px]:flex"
          >
            {navigationLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="leading-none text-[var(--foreground)] transition-opacity hover:opacity-70"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={registerLink.href}
              className={`${goldButtonClass} hidden h-12 items-center justify-center px-6 text-[14px] font-semibold whitespace-nowrap min-[900px]:inline-flex lg:h-14 lg:px-7 lg:text-[15px]`}
            >
              {registerLink.label}
            </Link>

            <details className="group relative min-[900px]:hidden">
              <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center border border-[var(--color-dark-18)]">
                <span className="sr-only">Open menu</span>
                <span className="relative inline-flex size-5 items-center justify-center">
                  <span className="absolute h-0.5 w-4 bg-[var(--foreground)] transition-transform duration-200 group-open:rotate-45" />
                  <span className="absolute h-0.5 w-4 bg-[var(--foreground)] transition-transform duration-200 group-open:-rotate-45" />
                  <span className="absolute h-0.5 w-4 -translate-y-1.5 bg-[var(--foreground)] transition-opacity duration-150 group-open:opacity-0" />
                  <span className="absolute h-0.5 w-4 translate-y-1.5 bg-[var(--foreground)] transition-opacity duration-150 group-open:opacity-0" />
                </span>
              </summary>

              <div className="absolute right-0 z-30 mt-2 w-[min(260px,calc(100vw-3rem))] border border-[var(--color-dark-18)] bg-[var(--surface)] p-4 shadow-[0_18px_40px_rgb(109_35_49_/_0.12)]">
                <nav aria-label="Primary navigation" className="grid gap-1">
                  {navigationLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="px-3 py-3 text-[15px] font-semibold text-[var(--foreground)] hover:bg-[var(--color-dark-08)]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <Link
                  href={registerLink.href}
                  className={`${goldButtonClass} mt-3 inline-flex h-12 w-full items-center justify-center text-[14px] font-semibold`}
                >
                  {registerLink.label}
                </Link>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
