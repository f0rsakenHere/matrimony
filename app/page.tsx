import Link from "next/link";
import Image from "next/image";
import SiteHeader from "./_components/site-header";
import SiteFooter from "./_components/site-footer";
import { MotionSection } from "@/components/ui/motion-section";
import {
  ShieldCheck,
  HeartHandshake,
  FileText,
  CircleCheckBig,
  Users,
  Handshake,
  Lock,
  MapPin,
  BookOpen,
  CircleCheck,
} from "lucide-react";

/* ─── Data ─── */

// Each promise is always shown on exactly two lines, so the items line up.
const promises = [
  { icon: ShieldCheck, lines: ["Verified", "Profiles Only"] },
  { icon: Lock, lines: ["Profiles Kept", "Confidential & Safe"] },
  { icon: Users, lines: ["Personalized Service", "To Meet Your Needs"] },
  { icon: MapPin, lines: ["Based In Montreal;", "Operating Across Canada"] },
  { icon: BookOpen, lines: ["Developed In Collaboration", "With Islamic Scholars"] },
];

const privacyPoints = [
  "Your biodata is kept private and is not available for public browsing.",
  "Our team personally contacts applicants before matchmaking.",
  "Photographs are shared privately only after both parties express mutual interest.",
  "Contact information is shared only after both parties agree to proceed and complete the required matchmaking payment.",
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

/* ─── Ornaments ─── */

/** Thin-line mosque silhouette (onion dome + two minaret domes) on a horizon rule. */
function MosqueOrnament({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 340 84" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="mosque-rule" x1="0" x2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.35" stopColor="currentColor" />
          <stop offset="0.65" stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* finial */}
        <path d="M170 4v8" />
        <circle cx="170" cy="14" r="1.6" fill="currentColor" />
        {/* main onion dome */}
        <path d="M150 74V52c0-14 8-22 14-28 3-3 6-6 6-8 0 2 3 5 6 8 6 6 14 14 14 28v22" />
        <path d="M162 74V60a8 8 0 0 1 16 0v14" />
        {/* left minaret */}
        <path d="M128 74V58c0-6 4-10 7-12 1.5-1 2-2.5 2-3.5 0 1 .5 2.5 2 3.5 3 2 7 6 7 12v16" />
        <path d="M137 38v4" />
        {/* right minaret */}
        <path d="M194 74V58c0-6 4-10 7-12 1.5-1 2-2.5 2-3.5 0 1 .5 2.5 2 3.5 3 2 7 6 7 12v16" />
        <path d="M203 38v4" />
      </g>
      <rect x="0" y="73" width="340" height="2.2" rx="1.1" fill="url(#mosque-rule)" />
    </svg>
  );
}

/** Two fading rules with a small diamond in the middle. */
function DiamondDivider({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 16" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="div-l" x1="0" x2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" />
        </linearGradient>
        <linearGradient id="div-r" x1="0" x2="1">
          <stop offset="0" stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="7" width="134" height="2" fill="url(#div-l)" />
      <rect x="166" y="7" width="134" height="2" fill="url(#div-r)" />
      <path d="M150 1l7 7-7 7-7-7z" fill="currentColor" />
    </svg>
  );
}

/* ─── Page ─── */

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <SiteHeader />

      <main className="flex-1">
        {/* ════════ HERO ════════ */}
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f6effc_0%,#efe3f8_55%,#ead9f5_100%)]">
          <div className="relative z-10 mx-auto flex max-w-[860px] flex-col items-center px-5 pt-8 text-center sm:px-8 sm:pt-12 lg:pt-14">
            <MosqueOrnament className="w-[260px] text-[#8b5cc4] sm:w-[340px]" />

            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#3d1f63] sm:text-[13px] sm:tracking-[0.32em]">
              Personalized Halal Matchmaking
            </p>

            <h1 className="mt-4 text-balance text-[30px] font-bold leading-[1.12] min-[400px]:text-[34px] text-[#3d1f63] sm:text-[46px] lg:text-[56px]">
              Helping Bangladeshi Muslims Find a Spouse in Canada
            </h1>

            <DiamondDivider className="mt-5 w-[240px] text-[#9a6fcf] sm:mt-6 sm:w-[300px]" />

            <ul className="mt-5 space-y-2.5 text-left sm:mt-6">
              {["Send us your profile for free.", "We’ll handpick a match for you."].map((t) => (
                <li key={t} className="flex items-center gap-3 text-[17px] font-medium text-[#3d1f63] sm:text-[20px]">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#8b6bb3] sm:size-7">
                    <svg className="size-3.5 sm:size-4" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M3 7l3 3 5-5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            <Link
              href="/start"
              className="mt-7 inline-flex h-14 w-full max-w-[420px] items-center justify-center gap-3 rounded-full bg-[linear-gradient(180deg,#6a3fa0_0%,#4b2577_100%)] text-[19px] font-semibold shadow-[0_10px_24px_rgb(75_37_119_/_0.35)] transition-[filter,transform] hover:brightness-110 active:scale-[0.99] sm:mt-8 sm:h-16 sm:text-[21px]"
              style={{ color: "#fff" }}
            >
              <FileText className="size-6" strokeWidth={1.75} />
              Register Now
            </Link>

            <ul className="mt-7 grid w-full max-w-[520px] grid-cols-3 divide-x divide-[#3d1f63]/25 sm:mt-8">
              {[
                { icon: ShieldCheck, label: ["Verified", "Profiles"] },
                { icon: Lock, label: ["Private &", "Confidential"] },
                { icon: HeartHandshake, label: ["Personalized", "Matchmaking"] },
              ].map(({ icon: Icon, label }) => (
                <li key={label[0]} className="flex flex-col items-center gap-2 px-2">
                  <span className="flex size-12 items-center justify-center rounded-full bg-[#e4d3f3] sm:size-14">
                    <Icon className="size-6 text-[#3d1f63] sm:size-7" strokeWidth={1.6} />
                  </span>
                  <span className="text-[13px] font-semibold leading-tight text-[#3d1f63] sm:text-[15px]">
                    {label[0]}
                    <br />
                    {label[1]}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Couple over the Toronto skyline; top edge fades into the lavender. */}
          <div className="relative -mt-4 h-[300px] sm:h-[420px] lg:h-[540px]">
            <Image
              src="/hero-couple-toronto.webp"
              alt="Bangladeshi Muslim bride and groom looking out over the Toronto skyline at sunset"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[38%_30%]"
            />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#efe3f8] to-transparent sm:h-40" />
            <svg
              className="absolute inset-x-0 bottom-0 h-10 w-full sm:h-14"
              viewBox="0 0 1440 80"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M0 80 V44 Q720 -6 1440 44 V80 Z" fill="var(--color-light)" />
              <path d="M0 44 Q720 -6 1440 44" fill="none" stroke="#8b5cc4" strokeWidth="3" />
            </svg>
          </div>
        </section>

        {/* ════════ OUR PROMISES ════════ */}
        <section aria-label="Our promises" className="bg-[var(--color-light)] pb-2 pt-6 sm:pb-4">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
            <ul className="mx-auto mt-4 w-fit space-y-7 sm:mt-6 sm:space-y-8 xl:mt-8 xl:grid xl:w-full xl:grid-cols-5 xl:gap-4 xl:space-y-0">
              {promises.map(({ icon: Icon, lines }) => (
                <li key={lines[0]} className="flex items-center gap-5 xl:flex-col xl:gap-4 xl:text-center">
                  <Icon className="size-11 shrink-0 text-[#5a1a6b] sm:size-12" strokeWidth={1.5} aria-hidden="true" />
                  <span className="whitespace-nowrap text-[18px] font-bold leading-snug text-[#5a1a6b] min-[400px]:text-[19px] sm:text-[21px] xl:text-[15px] 2xl:text-[17px]">
                    {lines[0]}
                    <br />
                    {lines[1]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ════════ WHY SEND US YOUR PROFILE ════════ */}
        <section id="about" className="scroll-mt-4 bg-[var(--color-light)] pb-2 pt-10 sm:pt-14 lg:pt-16">
          <div className="mx-auto max-w-[680px] px-5 sm:px-8">
            <h2 className="text-center font-sans text-[28px] font-bold leading-tight text-[#5a1a6b] sm:text-[36px]">
              Why Send Us Your Profile?
            </h2>
            <div className="mt-6 h-[2px] bg-[var(--button-gold-mid)] sm:mt-8" />

            <h3 className="mt-8 font-sans text-[24px] font-bold leading-tight text-[#5a1a6b] sm:text-[28px]">
              Finding the Right Match
            </h3>
            <p className="mt-4 text-[17px] leading-[1.75] text-[#2b2b33] sm:text-[18px]">
              Finding a suitable match can be stressful. It can take months or even years, especially when
              you&rsquo;re looking for someone who shares your faith, values, and expectations.
            </p>

            <p className="mt-6 rounded-2xl bg-[#5a1a6b] px-6 py-4 text-center text-[22px] font-bold leading-tight sm:py-5 sm:text-[26px]" style={{ color: "#fff" }}>
              That&rsquo;s Where We Come In.
            </p>

            <p className="mt-6 text-[17px] leading-[1.75] text-[#2b2b33] sm:text-[18px]">
              Tell us about yourself and what you&rsquo;re looking for. Our team will personally review your
              biodata and handpick potential matches based on your preferences.
            </p>

            <div className="mt-8 h-px bg-[var(--color-dark-18)] sm:mt-10" />
          </div>
        </section>

        {/* ════════ CONFIDENTIAL & SAFE ════════ */}
        <section id="why-choose" className="bg-[var(--color-light)] pb-2 pt-4 sm:pt-6">
          <div className="mx-auto max-w-[680px] px-5 sm:px-8">
            <h2 className="text-center font-sans text-[28px] font-bold leading-tight text-[#5a1a6b] sm:text-[36px]">
              Confidential &amp; Safe
            </h2>
            <div className="mt-6 h-[2px] bg-[var(--button-gold-mid)] sm:mt-8" />

            <ul className="mt-8 space-y-6 sm:mt-10 sm:space-y-7">
              {privacyPoints.map((text) => (
                <li key={text} className="flex items-start gap-4">
                  <CircleCheck className="mt-[3px] size-6 shrink-0 text-[#5a1a6b] sm:size-7" strokeWidth={1.75} aria-hidden="true" />
                  <span className="text-[18px] leading-[1.6] text-[#2b2b33] sm:text-[20px]">{text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 h-[2px] bg-[var(--button-gold-mid)] sm:mt-12" />
          </div>
        </section>

        {/* ════════ DEVELOPED WITH SCHOLARS ════════ */}
        <section className="bg-[var(--color-light)] pb-12 pt-4 sm:pb-16 sm:pt-6">
          <div className="mx-auto max-w-[680px] px-5 sm:px-8">
            <h2 className="text-center font-sans text-[28px] font-bold leading-tight text-[#5a1a6b] sm:text-[36px]">
              Developed With Scholars
            </h2>
            <div className="mt-6 h-[2px] bg-[var(--button-gold-mid)] sm:mt-8" />

            <div className="mt-8 space-y-6 text-[18px] leading-[1.6] text-[#2b2b33] sm:mt-10 sm:text-[20px]">
              <p>Our services were developed in collaboration with traditional Scholars.</p>
              <p>Our goal is to provide you with a matchmaking experience in line with the Islamic injunctions.</p>
              <p>
                Many measures have been put in place to achieve this, such as the mandatory inclusion of a{" "}
                <em>wali</em> for women and the prevention of direct contact between both candidates.
              </p>
            </div>

            <div className="mt-10 h-[2px] bg-[var(--button-gold-mid)] sm:mt-12" />

            <div className="mt-8 flex justify-center sm:mt-10">
              <Link
                href="/start"
                className="inline-flex h-14 w-full max-w-[360px] items-center justify-center rounded-full bg-[#5a1a6b] text-[22px] font-bold shadow-[0_10px_24px_rgb(90_26_107_/_0.3)] transition-[filter] hover:brightness-110 sm:h-16 sm:text-[24px]"
                style={{ color: "#fff" }}
              >
                Register Now
              </Link>
            </div>
          </div>
        </section>

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

      </main>

      <SiteFooter />
    </div>
  );
}
