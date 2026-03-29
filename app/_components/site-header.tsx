import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { soraSans } from "@/app/fonts";

const utilityLinks = [
  { href: "/#package", label: "Umrah Package" },
  { href: "/#hajj", label: "Hajj Program" },
  { href: "/#contact", label: "Customer Service" },
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
            Secure and Reliable Umrah Experience.{" "}
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
                <Icon className="size-[12px]" />
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
              className="inline-flex h-[56px] min-w-[206px] items-center justify-center bg-[#1c413a] px-6 text-[16px] font-semibold text-[#efefe3] whitespace-nowrap transition-opacity hover:opacity-90"
            >
              {registerLink.label}
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
          <div className="flex items-center justify-between gap-4">
            <Link href="/" aria-label="Qahira home" className="shrink-0">
              <BrandLogo compact />
            </Link>
          </div>

          <Link
            href={registerLink.href}
            className="mt-4 inline-flex h-12 w-full items-center justify-center bg-[#1c413a] px-4 text-[16px] font-semibold text-[#efefe3]"
          >
            {registerLink.label}
          </Link>

          <nav
            aria-label="Primary navigation"
            className="mt-4 flex flex-wrap gap-2 text-[15px] font-semibold text-[var(--foreground)]"
          >
            {navigationLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex h-10 items-center bg-[var(--color-dark-08)] px-3"
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
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
      className={compact ? "h-auto w-[200px]" : "h-auto w-[248px]"}
    />
  );
}

function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M13.4 20v-6h2l.4-2.4h-2.4V10c0-.7.2-1.2 1.2-1.2H16V6.6c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v1.5H8V14h2.4v6h3Z" />
    </svg>
  );
}

function TwitterIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M20.7 7.1c-.6.3-1.2.4-1.8.5.7-.4 1.2-1 1.4-1.8-.6.4-1.4.7-2.1.8A3.3 3.3 0 0 0 12.6 9c0 .3 0 .5.1.8-2.8-.1-5.3-1.5-6.9-3.6-.3.5-.4 1-.4 1.6 0 1.1.5 2 1.4 2.6-.5 0-1-.2-1.5-.4 0 1.6 1.1 2.9 2.6 3.2-.3 0-.6.1-.9.1l-.6-.1c.4 1.3 1.6 2.2 3 2.2A6.6 6.6 0 0 1 5 17.9 9.4 9.4 0 0 0 10.1 19c6.1 0 9.4-5.1 9.4-9.5v-.4c.6-.4 1.1-1 1.5-1.6-.1 0-.2 0-.3-.1Z" />
    </svg>
  );
}

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
    >
      <rect
        x="4.5"
        y="4.5"
        width="15"
        height="15"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.1" cy="6.9" r="1.1" fill="currentColor" />
    </svg>
  );
}
