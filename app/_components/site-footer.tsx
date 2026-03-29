import Image from "next/image";
import Link from "next/link";
import { FacebookIcon } from "@/components/ui/facebook-icon";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { TwitterIcon } from "@/components/ui/twitter-icon";

const usefulLinks = [
  "Investment",
  "Careers",
  "FAQs",
  "Travel",
  "Guides",
  "Training",
];

const customerLinks = [
  "Customer Help",
  "Refund Policy",
  "Training",
  "Packages",
];

export default function SiteFooter() {
  return (
    <footer className="bg-[var(--surface-inverse)] text-[var(--color-light)]">
      <div className="mx-auto max-w-[1520px] px-6 py-14 md:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[2.3fr_1.7fr_1.3fr_1.3fr] lg:gap-10">
          <section>
            <Link href="/" className="inline-flex" aria-label="BDCanNikah home">
              <Image
                src="/bdcannikah-footer-logo.png"
                alt="BDCanNikah"
                width={511}
                height={77}
                sizes="(min-width:1024px) 280px, 220px"
                className="h-auto w-[220px] md:w-[260px]"
              />
            </Link>

            <p className="mt-8 max-w-[36ch] text-[var(--color-light-90)]">
              Dedicated halal matchmaking for families seeking sincere,
              respectful, and privacy-first introductions across Canada.
            </p>

            <div className="mt-8 border-t border-[var(--color-light-18)] pt-8">
              <p className="text-[32px] leading-[1.1] font-semibold text-[var(--color-light)]">
                Social Media
              </p>

              <div className="mt-6 flex items-center gap-4">
                <SocialIconLink href="/#top" label="Facebook">
                  <FacebookIcon size={20} duration={1} />
                </SocialIconLink>
                <SocialIconLink href="/#top" label="Twitter">
                  <TwitterIcon size={20} duration={1} />
                </SocialIconLink>
                <SocialIconLink href="/#top" label="Instagram">
                  <InstagramIcon size={20} duration={1} />
                </SocialIconLink>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[var(--color-light)]">Contact Us</h3>
            <ul className="mt-6 space-y-4 text-[var(--color-light-90)]">
              <li className="flex items-start gap-3">
                <DotMark className="mt-2 size-2.5" />
                <span>PO Box 16122 Collins Street</span>
              </li>
              <li className="flex items-start gap-3">
                <DotMark className="mt-2 size-2.5" />
                <span>+1 (704) 279-1249</span>
              </li>
              <li className="flex items-start gap-3">
                <DotMark className="mt-2 size-2.5" />
                <span>Email: hello@bdcannikah.ca</span>
              </li>
              <li className="flex items-start gap-3">
                <DotMark className="mt-2 size-2.5" />
                <span>www.bdcannikah.ca</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-[var(--color-light)]">Useful Link</h3>
            <ul className="mt-6 space-y-4 text-[var(--color-light-90)]">
              {usefulLinks.map((item) => (
                <li key={item}>
                  <Link
                    href="/#"
                    className="inline-flex items-center gap-3 hover:opacity-100"
                  >
                    <ArrowMark className="size-4" />
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-[var(--color-light)]">Customer</h3>
            <ul className="mt-6 space-y-4 text-[var(--color-light-90)]">
              {customerLinks.map((item) => (
                <li key={item}>
                  <Link
                    href="/#"
                    className="inline-flex items-center gap-3 hover:opacity-100"
                  >
                    <ArrowMark className="size-4" />
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="border-t border-[var(--color-light-18)]">
        <div className="mx-auto flex max-w-[1520px] flex-col gap-4 px-6 py-5 md:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p className="text-[var(--color-light-90)]">
            Copyright 2026 BDCanNikah, All Rights Reserved.
          </p>

          <div className="flex items-center gap-5 text-[var(--color-light-90)]">
            <Link href="/#" className="hover:opacity-100">
              Term Of Use
            </Link>
            <span
              className="h-4 w-px bg-[var(--color-light-18)]"
              aria-hidden="true"
            />
            <Link href="/#" className="hover:opacity-100">
              Cookie Policy
            </Link>
            <span
              className="h-4 w-px bg-[var(--color-light-18)]"
              aria-hidden="true"
            />
            <Link href="/#" className="hover:opacity-100">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex items-center justify-start text-[var(--color-light)] transition-opacity hover:opacity-80"
    >
      {children}
    </Link>
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
