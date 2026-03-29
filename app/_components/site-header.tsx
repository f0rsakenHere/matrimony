import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { soraSans } from "@/app/fonts";
import { FacebookIcon } from "@/components/ui/facebook-icon";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { TwitterIcon } from "@/components/ui/twitter-icon";

const utilityLinks = [
  { href: "/#guide", label: "Wali Guidelines" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

const navigationLinks = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#success-stories", label: "Success Stories" },
  { href: "/#pricing", label: "Pricing" },
];

const registerLink = { href: "/#register", label: "Register Free" };

const socialLinks = [
  { href: "/#top", label: "Facebook", icon: FacebookIcon },
  { href: "/#top", label: "Twitter", icon: TwitterIcon },
  { href: "/#top", label: "Instagram", icon: InstagramIcon },
];

export default function SiteHeader() {
  return (
    <header
      id="top"
      className={`${soraSans.className} w-full bg-[var(--surface)] text-[var(--foreground)]`}
    >
      <div className="hidden min-[1100px]:block">
        <div className="grid h-[50px] grid-cols-[29.5%_39.3%_31.2%] bg-[var(--surface-inverse)] text-[var(--color-light)]">
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
            Strictly Confidential. Wali Verified Profiles Only.{" "}
            <Link
              href="/#contact"
              className="ml-1 font-bold underline underline-offset-[2px]"
            >
              Secure Your Seat Now
            </Link>
          </p>

          <div className="flex items-center justify-center gap-[28px] text-[12.5px] font-semibold">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="inline-flex items-center gap-[9px] text-[var(--color-light)] transition-opacity hover:opacity-100"
              >
                <Icon size={13} duration={1} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid h-[122px] grid-cols-[29.5%_39.3%_31.2%] border-b border-[var(--border-subtle)] bg-[var(--surface)]">
          <div className="flex items-center justify-center border-r border-[var(--border-subtle)]">
            <Link href="/" aria-label="Qahira home">
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
              className="inline-flex h-[56px] min-w-[206px] items-center justify-center bg-[var(--surface-inverse)] px-6 transition-opacity hover:opacity-90"
            >
              <span className="text-[16px] font-semibold text-[var(--color-light)] whitespace-nowrap">
                {registerLink.label}
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="min-[1100px]:hidden">
        <div className="border-b border-[var(--border-subtle)] bg-[var(--surface-inverse)] px-4 py-3 text-[var(--color-light)]">
          <p className="text-center text-[12px] font-semibold">
            Secure and Reliable Umrah Experience.
          </p>
        </div>

        <div className="border-b border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" aria-label="Qahira home" className="shrink-0">
              <BrandLogo compact />
            </Link>

            <Link
              href={registerLink.href}
              className="inline-flex h-11 min-w-[132px] items-center justify-center bg-[var(--surface-inverse)] px-4 transition-opacity hover:opacity-90"
            >
              <span className="text-[14px] font-semibold text-[var(--color-light)] whitespace-nowrap">
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
  return (
    <Image
      src="/bdcannikah-logo.png"
      alt="BDCanNikah Logo"
      width={511}
      height={77}
      preload
      className={compact ? "h-auto w-[176px]" : "h-auto w-[248px]"}
    />
  );
}
