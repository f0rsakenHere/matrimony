import Link from "next/link";
import { soraSans } from "@/app/fonts";
import { BrandLogo as SiteBrandLogo } from "@/components/ui/brand-logo";
import { AuthButtons } from "./auth-buttons";
import { MobileMenu } from "./mobile-menu";
import { GoldFloral } from "@/components/ui/gold-floral";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About Us" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  return (
    <header
      id="top"
      className={`${soraSans.className} relative isolate w-full bg-[var(--surface)] text-[var(--foreground)]`}
    >
      <div className="bg-[var(--surface-inverse)] text-[var(--color-light)]">
        <div className="mx-auto flex max-w-[1520px] items-center justify-center px-5 py-2 sm:px-6 sm:py-2.5 md:px-8 lg:px-10">
          <p className="text-center text-[12px] font-semibold leading-snug text-[var(--color-light)] sm:text-[15px]">
            Private introductions for Bengali Canadian Muslim families
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden border-b border-[var(--border-subtle)]">
        <GoldFloral className="absolute left-0 top-0 w-10 opacity-50 sm:w-16 lg:w-20" />
        <GoldFloral flip className="absolute right-0 top-0 w-10 opacity-50 sm:w-16 lg:w-20" />
        <div className="relative z-10 mx-auto flex h-[68px] max-w-[1520px] items-center justify-between gap-3 px-4 sm:h-[88px] sm:gap-6 sm:px-6 md:px-8 lg:h-[104px] lg:px-10">
          <Link
            href="/"
            aria-label="BanglaNikahCanada home"
            className="shrink-0"
          >
            <SiteBrandLogo className="w-[220px] sm:w-[260px] md:w-[280px] lg:w-[300px]" />
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
