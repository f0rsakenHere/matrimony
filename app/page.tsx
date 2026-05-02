import Link from "next/link";
import Image from "next/image";
import SiteHeader from "./_components/site-header";
import SiteFooter from "./_components/site-footer";
import { MotionSection } from "@/components/ui/motion-section";
import {
  ShieldCheck,
  UserCheck,
  Heart,
  EyeOff,
  ImageOff,
  BadgeCheck,
  ScanSearch,
  HeartHandshake,
  FileText,
  CircleCheckBig,
  Users,
  Handshake,
  Lock,
  MessageCircle,
} from "lucide-react";

/* ─── Data ─── */

const struggles = [
  "Long sponsorship process and delays",
  "Differences in mindset and lifestyle",
  "Language and cultural barriers",
  "Lack of trust and serious intentions on general platforms",
];

const solutions = [
  "Understanding of Western lifestyle with Islamic values",
  "Matching based on compatibility and values",
  "Focus on serious, long-term marriage",
  "Community-focused and trusted approach",
];

const whyChooseFeatures = [
  {
    icon: Users,
    title: "No Public Profiles",
    description: "Your profile is never publicly displayed",
  },
  {
    icon: ImageOff,
    title: "No Picture Sharing",
    description: "Pictures shared only with consent",
  },
  {
    icon: BadgeCheck,
    title: "100% Verified Profiles",
    description: "No scammers, no fake users",
  },
  {
    icon: ScanSearch,
    title: "Human Screening & Personalized Matching",
    description: "Quality over quantity",
  },
  {
    icon: EyeOff,
    title: "Privacy & Modesty First",
    description: "Respecting your privacy and values",
  },
  {
    icon: HeartHandshake,
    title: "Serious Marriage Seekers Only",
    description: "Only for those who are truly serious",
  },
];

const howItWorksSteps = [
  {
    number: "1",
    icon: FileText,
    title: "Submit Your Profile",
    description: "Fill out the form with your basic details and preferences.",
  },
  {
    number: "2",
    icon: CircleCheckBig,
    title: "We Review & Verify",
    description: "Our team verifies your information carefully.",
  },
  {
    number: "3",
    icon: Users,
    title: "We Find Matches",
    description: "We match you with compatible and suitable profiles.",
  },
  {
    number: "4",
    icon: Handshake,
    title: "Connect with Consent",
    description: "We facilitate the next steps with your full consent.",
  },
];

const islamicValues = [
  { icon: Heart, title: "Deen & Character First" },
  { icon: Users, title: "Family Involvement (Optional)" },
  { icon: HeartHandshake, title: "Honest Intentions Only" },
  { icon: Lock, title: "Respect & Confidentiality" },
];

/* ─── Page ─── */

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <SiteHeader />

      <main className="flex-1">
        {/* ════════ HERO ════════ */}
        <MotionSection className="relative flex flex-col overflow-hidden bg-[var(--background)] lg:block lg:h-[calc(100dvh-150px)] lg:min-h-[640px]">
          {/* Background image — right half on desktop, below text on mobile */}
          <div className="order-2 flex flex-col lg:absolute lg:inset-y-0 lg:right-0 lg:block lg:w-[55%]">
            {/* Image */}
            <div className="relative min-h-[280px] sm:min-h-[360px] lg:absolute lg:inset-0">
              <Image
                src="/nika-hero.png"
                alt="Muslim couple"
                fill
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-[center_20%] lg:object-center"
              />
              {/* Gradient fade into background on the left edge */}
              <div className="hidden lg:block absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[var(--background)] to-transparent" />
            </div>
            {/* Quran verse card — flows below image on mobile, overlays on desktop */}
            <div className="relative z-10 -mt-6 mx-3 rounded-2xl bg-[var(--foreground)]/85 p-4 text-center backdrop-blur-sm sm:mx-auto sm:max-w-[420px] sm:p-6 lg:absolute lg:bottom-[90px] lg:right-8 lg:mx-0 lg:mt-0 lg:text-left" style={{ color: "#fff" }}>
              <span className="text-[24px] font-bold leading-none sm:text-[32px]" style={{ color: "var(--button-gold-dark)" }}>&ldquo;</span>
              <p className="mt-1 text-[13px] leading-[1.6] opacity-90 sm:text-[15px] sm:leading-[1.7]">
                And among His signs is that He created for you from yourselves
                mates that you may find tranquility in them and He placed
                between you affection and mercy. Indeed in that are signs for a
                people who give thought.
              </p>
              <p className="mt-3 text-[13px] font-semibold opacity-70">
                &ndash; Quran 30:21
              </p>
            </div>
          </div>

          {/* Content overlay — shows first on mobile via order */}
          <div className="relative z-10 order-1 mx-auto flex h-full max-w-[1520px] flex-col px-5 sm:px-6 md:px-8 lg:order-none lg:px-10">
            {/* Text content — left side */}
            <div className="flex flex-1 items-center py-8 sm:py-14 lg:w-[45%] lg:py-0 lg:pr-12">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.18em] text-[var(--foreground)] uppercase">
                  A trusted matrimonial service for
                </p>
                <h1 className="mt-4 text-[28px] leading-[1.15] text-[var(--foreground)] sm:text-[36px] md:text-[48px] lg:text-[54px]">
                  Bangladeshi Muslims in Canada &amp; North America
                </h1>

                <p className="mt-4 max-w-[42ch] text-[14px] text-[var(--color-dark-72)] sm:mt-6 sm:text-[16px]">
                  Connecting hearts with faith, culture and understanding. Find a
                  compatible life partner who shares your values, mindset and
                  goals.
                </p>

                <div className="mt-6 sm:mt-7">
                  <Link
                    href="/start"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--foreground)] px-5 py-3 text-[14px] font-semibold shadow-[0_4px_14px_rgb(75_45_127_/_0.3)] transition-all hover:shadow-[0_6px_20px_rgb(75_45_127_/_0.4)] sm:w-auto sm:min-w-[200px] sm:gap-2.5 sm:px-8 sm:py-3.5 sm:text-[15px]"
                    style={{ color: "#fff" }}
                  >
                    <FileText className="size-4 sm:size-5" />
                    Submit Your Biodata
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="mt-6 grid grid-cols-3 gap-3 sm:mt-8 sm:gap-4">
                  <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:items-center sm:gap-2.5">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)]/10">
                      <ShieldCheck className="size-4 text-[var(--foreground)]" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-[11px] font-semibold text-[var(--foreground)] sm:text-[13px]">Private &amp; Secure</p>
                      <p className="hidden text-[12px] text-[var(--color-dark-56)] sm:block">Your privacy is our priority</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:items-center sm:gap-2.5">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)]/10">
                      <UserCheck className="size-4 text-[var(--foreground)]" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-[11px] font-semibold text-[var(--foreground)] sm:text-[13px]">Verified Profiles</p>
                      <p className="hidden text-[12px] text-[var(--color-dark-56)] sm:block">100% verified members</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:items-center sm:gap-2.5">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)]/10">
                      <Heart className="size-4 text-[var(--foreground)]" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-[11px] font-semibold text-[var(--foreground)] sm:text-[13px]">Serious Matches</p>
                      <p className="hidden text-[12px] text-[var(--color-dark-56)] sm:block">For a lifetime</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MotionSection>

        {/* ════════ WHY STRUGGLING / WE UNDERSTAND / SERVICE BUILT FOR ════════ */}
        <MotionSection
          id="about"
          className="bg-[var(--surface-muted)] py-12 md:py-20 lg:py-24"
          delay={0.05}
        >
          <div className="mx-auto max-w-[1520px] px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-5">
              {/* Left — Struggles */}
              <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm sm:p-8 lg:p-10">
                <h3 className="text-[var(--foreground)]">
                  Why Many Are Struggling to Find the Right Match
                </h3>
                <span className="mt-4 block h-[2px] w-12 bg-[var(--color-dark-28)]" />
                <ul className="mt-6 space-y-4">
                  {struggles.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)]">
                        <svg className="size-3.5" viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      <span className="text-[var(--color-dark-72)]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Center — We Understand card */}
              <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl px-5 py-8 text-center sm:px-7 sm:py-12" style={{ backgroundColor: "var(--foreground)", color: "#fff" }}>
                {/* Corner mandala patterns — top-left & top-right only */}
                <Image src="/4x/asset1.png" alt="" width={140} height={140} className="pointer-events-none absolute -top-6 -left-6 size-32 opacity-[0.3]" style={{ filter: "sepia(1) saturate(2) brightness(1.5) hue-rotate(10deg)" }} aria-hidden="true" />
                <Image src="/4x/asset1.png" alt="" width={140} height={140} className="pointer-events-none absolute -top-6 -right-6 size-32 rotate-90 opacity-[0.3]" style={{ filter: "sepia(1) saturate(2) brightness(1.5) hue-rotate(10deg)" }} aria-hidden="true" />
                {/* Mosque icon */}
                <Image
                  src="/4x/crescent.png"
                  alt=""
                  width={80}
                  height={80}
                  className="relative z-10 size-20 brightness-0 invert"
                  aria-hidden="true"
                />
                <h3 className="mt-5" style={{ color: "#fff" }}>
                  We Understand.<br />We&apos;re Here to Help.
                </h3>
                <p className="mt-4 text-[14px] leading-relaxed opacity-85">
                  BDCanNikah is built exclusively for Bangladeshi Muslims in
                  Canada &amp; North America who are looking for a serious and
                  halal marriage.
                </p>
                
              </div>

              {/* Right — Solutions */}
              <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm sm:p-8 lg:p-10">
                <h3 className="text-[var(--foreground)]">
                  A Service Built for Bangladeshi Muslims in North America
                </h3>
                <span className="mt-4 block h-[2px] w-12 bg-[var(--color-dark-28)]" />
                <ul className="mt-6 space-y-4">
                  {solutions.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)]">
                        <svg className="size-3.5" viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      <span className="text-[var(--color-dark-72)]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </MotionSection>

        {/* ════════ WHY CHOOSE US ════════ */}
        <MotionSection
          id="why-choose"
          className="bg-[var(--surface-muted)] py-12 md:py-20 lg:py-24"
          delay={0.05}
        >
          <div className="mx-auto max-w-[1520px] px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="text-center">
              <h2 className="text-[var(--foreground)]">
                Why Choose BDCanNikah?
              </h2>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-14 sm:gap-6 md:grid-cols-3 lg:grid-cols-6">
              {whyChooseFeatures.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex flex-col items-center text-center">
                  <div className="flex size-14 items-center justify-center rounded-full border border-[var(--color-dark-14)] bg-[var(--background)] sm:size-16">
                    <Icon className="size-6 text-[var(--foreground)] sm:size-7" strokeWidth={1.5} />
                  </div>
                  <p className="mt-3 text-[13px] font-semibold text-[var(--foreground)] sm:mt-4 sm:text-[14px]">
                    {title}
                  </p>
                  <p className="mt-1 text-[12px] text-[var(--color-dark-56)] sm:mt-1.5 sm:text-[13px]">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </MotionSection>

        {/* ════════ HOW IT WORKS ════════ */}
        <MotionSection
          id="how-it-works"
          className="bg-[var(--surface-muted)] py-12 md:py-20 lg:py-24"
          delay={0.05}
        >
          <div className="mx-auto max-w-[1520px] px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="text-center">
              <h2 className="text-[var(--foreground)]">How It Works</h2>
            </div>

            <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
              {howItWorksSteps.map(({ number, icon: Icon, title, description }, index) => (
                <div key={title} className="relative flex flex-col items-center text-center">
                  {/* Icon circle with step number badge */}
                  <div className="relative">
                    <div className="flex size-[56px] items-center justify-center rounded-xl bg-[var(--foreground)] sm:size-[72px] sm:rounded-2xl">
                      <Icon className="size-6 text-[var(--color-light)] sm:size-8" strokeWidth={1.5} />
                    </div>
                    <span className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full border-2 border-[var(--surface-muted)] bg-[var(--button-gold-mid)] text-[11px] font-bold text-white sm:-top-2 sm:-right-2 sm:size-7 sm:text-[12px]">
                      {number}
                    </span>
                  </div>
                  {/* Dotted connector (desktop only, not on last) */}
                  {index < howItWorksSteps.length - 1 && (
                    <div className="absolute top-[36px] left-[calc(50%+44px)] hidden w-[calc(100%-88px)] items-center xl:flex">
                      <span className="h-px flex-1 border-t-2 border-dashed border-[var(--color-dark-18)]" />
                      <svg className="size-3 shrink-0 text-[var(--color-dark-28)]" viewBox="0 0 12 12" fill="currentColor"><path d="M4 2l4 4-4 4" /></svg>
                    </div>
                  )}
                  <p className="mt-4 text-[13px] font-semibold text-[var(--foreground)] sm:mt-5 sm:text-[15px]">
                    {title}
                  </p>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--color-dark-56)] sm:mt-2 sm:max-w-[200px] sm:text-[13px]">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </MotionSection>

        {/* ════════ BUILT ON ISLAMIC VALUES + CTA ════════ */}
        <MotionSection className="bg-[var(--surface-muted)] py-12 md:py-20 lg:py-24">
          <div className="mx-auto max-w-[1520px] px-4 sm:px-6 md:px-8 lg:px-10">
            {/* Built on Islamic Values — single horizontal card */}
            <div className="overflow-hidden rounded-2xl bg-[#ece2ee] shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8 lg:py-5 lg:pl-6 lg:pr-10">
                {/* Trust building image */}
                <div className="hidden shrink-0 lg:block">
                  <Image
                    src="/4x/trust-building.png"
                    alt=""
                    width={160}
                    height={160}
                    className="size-[160px] rounded-xl object-contain"
                  />
                </div>

                {/* Text */}
                <div className="px-4 py-4 sm:px-8 sm:py-5 lg:flex-1 lg:px-0 lg:py-0">
                  <h2 className="text-[var(--foreground)]" style={{ fontSize: "var(--font-size-h3)" }}>
                    Built on Islamic Values
                  </h2>
                  <p className="mt-3 max-w-[48ch] text-[14px] leading-relaxed text-[var(--color-dark-72)]">
                    We believe marriage is a sacred bond built on deen, trust and
                    respect. Our platform is designed to help you find a partner
                    who shares your faith, values and life goals.
                  </p>
                </div>

                {/* 4 value icons */}
                <div className="grid shrink-0 grid-cols-2 gap-x-6 gap-y-4 px-4 pb-5 sm:flex sm:gap-8 sm:px-8 lg:gap-10 lg:px-0 lg:pb-0">
                  {islamicValues.map(({ icon: Icon, title }) => (
                    <div key={title} className="flex flex-col items-center text-center">
                      <div className="flex size-10 items-center justify-center rounded-full border border-[var(--button-gold-dark)]/40 sm:size-14">
                        <Icon className="size-5 text-[var(--button-gold-dark)] sm:size-7" strokeWidth={1.5} />
                      </div>
                      <p className="mt-1.5 text-[11px] font-semibold leading-tight text-[var(--foreground)] sm:mt-3 sm:w-[90px] sm:text-[13px]">
                        {title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Bar — Ready to Find Your Life Partner? */}
            <div
              id="register"
              className="mt-6 overflow-hidden rounded-2xl lg:flex lg:items-center lg:gap-8 lg:py-5 lg:pl-6 lg:pr-10"
              style={{ backgroundColor: "var(--foreground)", color: "#fff" }}
            >
              {/* Find partner image */}
              <div className="hidden shrink-0 lg:block">
                <Image
                  src="/4x/find-partner.png"
                  alt=""
                  width={160}
                  height={160}
                  className="size-[160px] rounded-xl object-contain"
                />
              </div>

              {/* Text */}
              <div className="px-4 py-4 sm:px-8 sm:py-5 lg:flex-1 lg:px-0 lg:py-0">
                <h2 style={{ color: "#fff", fontSize: "var(--font-size-h3)" }}>
                  Ready to Find Your Life Partner?
                </h2>
                <p className="mt-3 max-w-[44ch] text-[15px] opacity-85">
                  Join a trusted community of Bangladeshi Muslims in Canada &amp;
                  North America looking for a meaningful and lasting marriage.
                </p>
              </div>

              {/* Buttons */}
              <div className="px-4 pb-5 sm:px-8 lg:shrink-0 lg:px-0 lg:pb-0">
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link
                    href="/start"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[var(--button-gold-border)] bg-[linear-gradient(180deg,var(--button-gold-light)_0%,var(--button-gold-mid)_56%,var(--button-gold-dark)_100%)] px-6 text-[14px] font-semibold text-[var(--button-gold-text)] shadow-[inset_0_1px_0_rgb(255_249_233_/_0.78),0_10px_20px_rgb(72_26_34_/_0.16)] transition-[filter] hover:[filter:brightness(1.03)] sm:h-13 sm:px-8 sm:text-[15px] lg:min-w-[240px]"
                  >
                    <FileText className="size-4 sm:size-5" />
                    Submit Your Biodata
                  </Link>
                  <Link
                    href="https://wa.me/15149655265"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 text-[14px] font-semibold backdrop-blur-[2px] transition-colors hover:bg-white/20 sm:h-13 sm:px-8 sm:text-[15px] lg:min-w-[240px]"
                    style={{ color: "#fff" }}
                  >
                    <MessageCircle className="size-4 sm:size-5" />
                    Contact Us on WhatsApp
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </MotionSection>
      </main>

      <SiteFooter />
    </div>
  );
}
