import { Fragment } from "react";
import Link from "next/link";
import { soraSans } from "@/app/fonts";
import { BrandLogo as SiteBrandLogo } from "@/components/ui/brand-logo";
import { goldButtonClass } from "@/components/ui/button-styles";
import {
  SiteOrnament,
  siteOrnamentAssets,
} from "@/components/ui/site-ornament";

const utilityLinks = [
  { href: "/#our-approach", label: "Our Approach" },
  { href: "/#faq", label: "Questions" },
  { href: "/#contact", label: "Contact" },
];

const navigationLinks = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#success-stories", label: "Family Stories" },
  { href: "/#faq", label: "Questions" },
];

const registerLink = { href: "/#register", label: "Register Free" };

const trustPoints = ["Private profiles", "Family-aware", "Canada-wide"];

export default function SiteHeader() {
  return (
    <header
      id="top"
      className={`${soraSans.className} relative isolate w-full overflow-hidden bg-[linear-gradient(180deg,var(--surface-muted)_0%,var(--surface)_100%)] text-[var(--foreground)]`}
    >
      <SiteOrnament
        {...siteOrnamentAssets.asset2}
        className="absolute top-0 left-[-12px] z-0 w-[72px] opacity-55 md:w-[90px] lg:w-[110px]"
        sizes="(min-width: 1024px) 7vw, 12vw"
      />
      <SiteOrnament
        {...siteOrnamentAssets.asset4}
        className="absolute right-[-10px] bottom-[-70px] z-0 w-[72px] opacity-55 md:w-[88px] lg:w-[102px]"
        sizes="(min-width: 1024px) 7vw, 11vw"
      />

      <div className="relative z-10 hidden min-[1100px]:block">
        <div className="grid h-[50px] grid-cols-[29.5%_39.3%_31.2%] bg-[linear-gradient(135deg,var(--color-dark)_0%,var(--color-dark-88)_56%,var(--color-dark-72)_100%)] text-[var(--color-light)]">
          <nav
            aria-label="Utility navigation"
            className="flex items-center justify-center text-[12.5px] font-semibold"
          >
            {utilityLinks.map((item, index) => (
              <Fragment key={item.label}>
                <Link
                  href={item.href}
                  className="leading-none text-[var(--color-light)] transition-opacity hover:opacity-100"
                >
                  {item.label}
                </Link>
                {index < utilityLinks.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="mx-[17px] h-4 w-px bg-[var(--color-light-18)]"
                  />
                ) : null}
              </Fragment>
            ))}
          </nav>

          <p className="flex items-center justify-center px-4 text-center text-[12.5px] font-semibold text-[var(--color-light)]">
            Private introductions for marriage-minded Muslim families.{" "}
            <Link
              href="/#register"
              className="ml-1 font-bold underline underline-offset-[2px]"
            >
              Begin your journey
            </Link>
          </p>

          <div className="flex items-center justify-center text-[12.5px] font-semibold text-[var(--color-light)]">
            {trustPoints.map((item, index) => (
              <Fragment key={item}>
                <span>{item}</span>
                {index < trustPoints.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="mx-[16px] h-4 w-px bg-[var(--color-light-18)]"
                  />
                ) : null}
              </Fragment>
            ))}
          </div>
        </div>

        <div className="grid h-[122px] grid-cols-[29.5%_39.3%_31.2%] border-b border-[var(--border-subtle)] bg-[var(--surface)]">
          <div className="flex items-center justify-center border-r border-[var(--border-subtle)]">
            <Link href="/" aria-label="BDCanNikah home">
              <BrandLogo />
            </Link>
          </div>

          <div className="flex items-center justify-center border-r border-[var(--border-subtle)]">
            <nav
              aria-label="Primary navigation"
              className="flex items-center gap-[25px] text-[16px] font-semibold text-[var(--foreground)]"
            >
              {navigationLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="inline-flex h-[42px] items-center justify-center px-[16px] leading-none text-[var(--foreground)] transition-colors hover:bg-[var(--color-dark-08)]"
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center justify-center px-8">
            <Link
              href={registerLink.href}
              className={`${goldButtonClass} inline-flex h-[56px] min-w-[206px] items-center justify-center px-6`}
            >
              <span className="text-[16px] font-semibold whitespace-nowrap">
                {registerLink.label}
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 min-[1100px]:hidden">
        <div className="border-b border-[var(--border-subtle)] bg-[linear-gradient(135deg,var(--color-dark)_0%,var(--color-dark-88)_56%,var(--color-dark-72)_100%)] px-4 py-3 text-[var(--color-light)]">
          <p className="text-center text-[12px] font-semibold">
            Private introductions for marriage-minded Muslim families.
          </p>
        </div>

        <div className="border-b border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" aria-label="BDCanNikah home" className="shrink-0">
              <BrandLogo compact />
            </Link>

            <Link
              href={registerLink.href}
              className={`${goldButtonClass} inline-flex h-11 min-w-[132px] items-center justify-center px-4`}
            >
              <span className="text-[14px] font-semibold whitespace-nowrap">
                {registerLink.label}
              </span>
            </Link>
          </div>

          <details className="group mt-4">
            <summary className="flex h-11 cursor-pointer list-none items-center justify-between border border-[var(--color-dark-12)] px-4 text-[15px] font-semibold text-[var(--foreground)]">
              <span>Menu</span>
              <span className="relative inline-flex size-5 items-center justify-center">
                <span className="absolute h-0.5 w-4 bg-[var(--foreground)] transition-transform duration-200 group-open:rotate-45" />
                <span className="absolute h-0.5 w-4 bg-[var(--foreground)] transition-transform duration-200 group-open:-rotate-45" />
                <span className="absolute h-0.5 w-4 -translate-y-1.5 bg-[var(--foreground)] transition-opacity duration-150 group-open:opacity-0" />
                <span className="absolute h-0.5 w-4 translate-y-1.5 bg-[var(--foreground)] transition-opacity duration-150 group-open:opacity-0" />
              </span>
            </summary>

            <div className="mt-2 space-y-3 border border-[var(--color-dark-12)] p-3">
              <nav aria-label="Primary navigation" className="grid gap-2">
                {navigationLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="inline-flex h-10 items-center border border-[var(--color-dark-12)] bg-[var(--color-dark-08)] px-3 text-[15px] font-semibold text-[var(--foreground)]"
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <nav
                aria-label="Utility navigation"
                className="flex flex-wrap items-center gap-4 text-[12px] font-semibold text-[var(--color-dark-72)]"
              >
                {utilityLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="leading-none"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

function BrandLogo({ compact = false }: { compact?: boolean }) {
  return <BrandLogoMask compact={compact} />;
}

function BrandLogoMask({ compact = false }: { compact?: boolean }) {
  return <SiteBrandLogo className={compact ? "w-[176px]" : "w-[248px]"} />;
}
