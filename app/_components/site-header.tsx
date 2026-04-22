import Link from "next/link";
import { soraSans } from "@/app/fonts";
import { BrandLogo as SiteBrandLogo } from "@/components/ui/brand-logo";
import { AuthButtons } from "./auth-buttons";
import { MobileMenu } from "./mobile-menu";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About Us" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#contact", label: "Contact" },
];

export default function SiteHeader() {
  return (
    <header
      id="top"
      className={`${soraSans.className} relative isolate w-full bg-[var(--surface)] text-[var(--foreground)]`}
    >
      <div className="bg-[var(--surface-inverse)] text-[var(--color-light)]">
        <div className="mx-auto flex max-w-[1520px] items-center justify-center px-5 py-2 sm:px-6 sm:py-2.5 md:px-8 lg:px-10">
          <p className="text-center text-[10px] leading-snug tracking-[0.08em] uppercase text-[var(--color-light-90)] sm:text-[12px] sm:tracking-[0.14em]">
            Private introductions for Bangladeshi Canadian Muslim families
          </p>
        </div>
      </div>

      <div className="border-b border-[var(--border-subtle)]">
        <div className="mx-auto flex h-[64px] max-w-[1520px] items-center justify-between gap-3 px-4 sm:h-[88px] sm:gap-6 sm:px-6 md:px-8 lg:h-[104px] lg:px-10">
          <Link
            href="/"
            aria-label="BDCanNikah home"
            className="shrink-0"
          >
            <SiteBrandLogo className="w-[130px] sm:w-[180px] md:w-[220px] lg:w-[240px]" />
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
            <AuthButtons />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
