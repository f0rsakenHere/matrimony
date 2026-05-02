import Link from "next/link";
import { bengaliSerif } from "@/app/fonts";
import { BrandLogo } from "@/components/ui/brand-logo";
import {
  ShieldCheck,
  Users,
  Lock,
  Heart,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

const exploreLinks = [
  { label: "About Us", href: "/#about" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Register", href: "/register" },
  { label: "Contact", href: "/#contact" },
];

const trustBadges = [
  { icon: ShieldCheck, label: "100% Secure" },
  { icon: Users, label: "Community Trusted" },
  { icon: Lock, label: "Fully Confidential" },
  { icon: Heart, label: "Halal & Ethical" },
];

export default function SiteFooter() {
  return (
    <footer id="contact" className="bg-[var(--surface-inverse)]" style={{ color: "#fff" }}>
      {/* Main footer */}
      <div className="mx-auto max-w-[1520px] px-5 pt-12 pb-8 sm:px-6 md:px-8 lg:px-10 lg:pt-20 lg:pb-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_0.8fr_1fr] lg:gap-10">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex" aria-label="BDCanNikah home">
              <BrandLogo
                src="/bdcannikah-footer-logo.png"
                tone="light"
                className="w-[180px] sm:w-[200px] md:w-[220px]"
              />
            </Link>

            <p
              className={`${bengaliSerif.className} mt-5 text-[16px] leading-snug opacity-90 sm:mt-6 sm:text-[18px] md:text-[20px]`}
            >
              বিশ্বাস, পরিবার ও বরকত
            </p>

            <p className="mt-4 max-w-[36ch] text-[14px] leading-relaxed opacity-80">
              Faith-led matchmaking for Bangladeshi Canadian Muslims seeking a
              dignified path to marriage.
            </p>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
              {trustBadges.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-2.5 py-1 text-[11px] font-medium opacity-85 sm:px-3 sm:py-1.5 sm:text-[12px]"
                >
                  <Icon className="size-3.5" strokeWidth={1.5} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-[13px] font-semibold tracking-[0.1em] uppercase" style={{ color: "var(--button-gold-mid)" }}>
              Quick Links
            </p>
            <ul className="mt-5 space-y-3">
              {exploreLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-[14px] opacity-85 transition-opacity hover:opacity-100"
                    style={{ color: "#fff" }}
                  >
                    {item.label}
                    <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[13px] font-semibold tracking-[0.1em] uppercase" style={{ color: "var(--button-gold-mid)" }}>
              Contact
            </p>
            <ul className="mt-5 space-y-4">
              <li>
                <Link
                  href="tel:+17042791249"
                  className="flex items-center gap-3 text-[14px] opacity-85 transition-opacity hover:opacity-100"
                  style={{ color: "#fff" }}
                >
                  <Phone className="size-4 shrink-0" strokeWidth={1.5} />
                  +1 (704) 279-1249
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:hello@bdcannikah.ca"
                  className="flex items-center gap-3 text-[14px] opacity-85 transition-opacity hover:opacity-100"
                  style={{ color: "#fff" }}
                >
                  <Mail className="size-4 shrink-0" strokeWidth={1.5} />
                  hello@bdcannikah.ca
                </Link>
              </li>
              <li className="flex items-center gap-3 text-[14px] opacity-85">
                <MapPin className="size-4 shrink-0" strokeWidth={1.5} />
                Serving all of Canada
              </li>
            </ul>
          </div>

          {/* Get Started CTA */}
          <div>
            <p className="text-[13px] font-semibold tracking-[0.1em] uppercase" style={{ color: "var(--button-gold-mid)" }}>
              Get Started
            </p>
            <p className="mt-5 text-[14px] leading-relaxed opacity-80">
              Ready to find your life partner? Register today and take the first
              step toward a blessed marriage.
            </p>
            <Link
              href="/start"
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--button-gold-border)] bg-[linear-gradient(180deg,var(--button-gold-light)_0%,var(--button-gold-mid)_56%,var(--button-gold-dark)_100%)] px-6 text-[14px] font-semibold shadow-[inset_0_1px_0_rgb(255_249_233_/_0.78)] transition-[filter] hover:[filter:brightness(1.05)]"
              style={{ color: "var(--button-gold-text)" }}
            >
              Submit Biodata
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1520px] flex-col items-center gap-2 px-5 py-4 text-[12px] opacity-60 sm:flex-row sm:justify-between sm:px-6 sm:py-5 sm:text-[13px] md:px-8 lg:px-10">
          <p>&copy; 2026 BDCanNikah. All rights reserved.</p>
          <p className="text-[12px]">Privacy first &middot; Family aware &middot; Marriage minded</p>
        </div>
      </div>
    </footer>
  );
}
