import Link from "next/link";
import Image from "next/image";
import SiteHeader from "./_components/site-header";
import SiteFooter from "./_components/site-footer";
import { MotionSection } from "@/components/ui/motion-section";
import { GoldFloral, MapleDivider } from "@/components/ui/gold-floral";
import {
  ShieldCheck,
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

/* ─── Page ─── */

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <SiteHeader />

      <main className="flex-1">
        {/* ════════ HERO ════════ */}
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fcf8f0_0%,#f8f0e2_100%)]">
          <div className="relative z-10 mx-auto flex max-w-[860px] flex-col items-center px-5 pt-8 text-center sm:px-8 sm:pt-12 lg:pt-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--brand-green)] sm:text-[13px] sm:tracking-[0.32em]">
              Personalized Halal Matchmaking
            </p>

            <h1 className="mt-4 font-[family-name:var(--font-display)] font-black text-[#1a1a1a]">
              <span className="block text-balance text-[27px] leading-[1.18] min-[400px]:text-[30px] sm:text-[42px] lg:text-[50px]">
                Helping Bengali Canadian Muslims Find Their
              </span>
              <span className="mt-1 block text-[38px] leading-[1.1] text-[var(--brand-red)] min-[400px]:text-[42px] sm:text-[58px] lg:text-[70px]">
                Life Partner
              </span>
            </h1>

            <MapleDivider className="mt-3 w-[260px] sm:mt-4 sm:w-[340px]" />

            <ul className="mt-5 space-y-2.5 text-left sm:mt-6">
              {["Send us your profile.", "We’ll handpick a match for you."].map((t) => (
                <li key={t} className="flex items-center gap-3 text-[17px] font-medium text-[var(--brand-ink)] sm:text-[20px]">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)] sm:size-7">
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
              className="mt-7 inline-flex h-14 w-full max-w-[400px] items-center justify-center rounded-full bg-[linear-gradient(180deg,#c8181f_0%,#9c0f17_100%)] text-[20px] font-bold shadow-[0_10px_24px_rgb(156_15_23_/_0.3)] transition-[filter,transform] hover:brightness-110 active:scale-[0.99] sm:mt-8 sm:h-16 sm:text-[22px]"
              style={{ color: "#fff" }}
            >
              Register Now
            </Link>

            <ul className="mt-7 grid w-full max-w-[520px] grid-cols-3 divide-x divide-[var(--brand-gold)]/50 sm:mt-8">
              {[
                { icon: ShieldCheck, label: ["Verified", "Profiles"] },
                { icon: Lock, label: ["Private &", "Confidential"] },
                { icon: Users, label: ["Personalized", "Matchmaking"] },
              ].map(({ icon: Icon, label }) => (
                <li key={label[0]} className="flex flex-col items-center gap-2 px-2">
                  <Icon className="size-9 text-[var(--brand-green)] sm:size-10" strokeWidth={1.5} aria-hidden="true" />
                  <span className="text-[13px] font-medium leading-tight text-[var(--brand-ink)] sm:text-[15px]">
                    {label[0]}
                    <br />
                    {label[1]}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Couple over the Toronto skyline; top edge fades into the cream. */}
          <div className="relative mt-2 h-[300px] sm:h-[420px] lg:h-[540px]">
            <Image
              src="/hero-couple-toronto-v3.webp"
              alt="Bengali Muslim bride and groom looking out over the Toronto skyline at sunset"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[42%_30%]"
            />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#f8f0e2] to-transparent sm:h-36" />
            <GoldFloral className="absolute bottom-full left-0 w-16 translate-y-8 -scale-y-100 opacity-70 sm:w-28" />
            <GoldFloral flip className="absolute bottom-full right-0 w-16 translate-y-8 -scale-y-100 opacity-70 sm:w-28" />
          </div>
        </section>

        {/* ════════ OUR PROMISES ════════ */}
        <section aria-label="Our promises" className="bg-[var(--color-light)] pb-2 pt-6 sm:pb-4">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
            <ul className="mx-auto mt-4 w-fit space-y-7 sm:mt-6 sm:space-y-8 xl:mt-8 xl:grid xl:w-full xl:grid-cols-5 xl:gap-4 xl:space-y-0">
              {promises.map(({ icon: Icon, lines }) => (
                <li key={lines[0]} className="flex items-center gap-5 xl:flex-col xl:gap-4 xl:text-center">
                  <Icon className="size-11 shrink-0 text-[var(--brand-green)] sm:size-12" strokeWidth={1.5} aria-hidden="true" />
                  <span className="whitespace-nowrap text-[18px] font-bold leading-snug text-[var(--brand-green)] min-[400px]:text-[19px] sm:text-[21px] xl:text-[15px] 2xl:text-[17px]">
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
            <h2 className="text-center font-sans text-[28px] font-bold leading-tight text-[var(--brand-green)] sm:text-[36px]">
              Why Send Us Your Profile?
            </h2>
            <div className="mt-6 h-[2px] bg-[var(--button-gold-mid)] sm:mt-8" />

            <h3 className="mt-8 font-sans text-[24px] font-bold leading-tight text-[var(--brand-green)] sm:text-[28px]">
              Finding the Right Match
            </h3>
            <p className="mt-4 text-[17px] leading-[1.75] text-[var(--brand-ink)] sm:text-[18px]">
              Finding a suitable match can be stressful. It can take months or even years, especially when
              you&rsquo;re looking for someone who shares your faith, values, and expectations.
            </p>

            <p className="mt-6 rounded-2xl bg-[var(--brand-green)] px-6 py-4 text-center text-[22px] font-bold leading-tight sm:py-5 sm:text-[26px]" style={{ color: "#fff" }}>
              That&rsquo;s Where We Come In.
            </p>

            <p className="mt-6 text-[17px] leading-[1.75] text-[var(--brand-ink)] sm:text-[18px]">
              Tell us about yourself and what you&rsquo;re looking for. Our team will personally review your
              biodata and handpick potential matches based on your preferences.
            </p>

            <div className="mt-8 h-px bg-[var(--color-dark-18)] sm:mt-10" />
          </div>
        </section>

        {/* ════════ CONFIDENTIAL & SAFE ════════ */}
        <section id="why-choose" className="bg-[var(--color-light)] pb-2 pt-4 sm:pt-6">
          <div className="mx-auto max-w-[680px] px-5 sm:px-8">
            <h2 className="text-center font-sans text-[28px] font-bold leading-tight text-[var(--brand-green)] sm:text-[36px]">
              Confidential &amp; Safe
            </h2>
            <div className="mt-6 h-[2px] bg-[var(--button-gold-mid)] sm:mt-8" />

            <ul className="mt-8 space-y-6 sm:mt-10 sm:space-y-7">
              {privacyPoints.map((text) => (
                <li key={text} className="flex items-start gap-4">
                  <CircleCheck className="mt-[3px] size-6 shrink-0 text-[var(--brand-green)] sm:size-7" strokeWidth={1.75} aria-hidden="true" />
                  <span className="text-[18px] leading-[1.6] text-[var(--brand-ink)] sm:text-[20px]">{text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 h-[2px] bg-[var(--button-gold-mid)] sm:mt-12" />
          </div>
        </section>

        {/* ════════ DEVELOPED WITH SCHOLARS ════════ */}
        <section className="bg-[var(--color-light)] pb-12 pt-4 sm:pb-16 sm:pt-6">
          <div className="mx-auto max-w-[680px] px-5 sm:px-8">
            <h2 className="text-center font-sans text-[28px] font-bold leading-tight text-[var(--brand-green)] sm:text-[36px]">
              Developed With Scholars
            </h2>
            <div className="mt-6 h-[2px] bg-[var(--button-gold-mid)] sm:mt-8" />

            <div className="mt-8 space-y-6 text-[18px] leading-[1.6] text-[var(--brand-ink)] sm:mt-10 sm:text-[20px]">
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
                className="inline-flex h-14 w-full max-w-[360px] items-center justify-center rounded-full bg-[linear-gradient(180deg,#c8181f_0%,#9c0f17_100%)] text-[22px] font-bold shadow-[0_10px_24px_rgb(156_15_23_/_0.3)] transition-[filter] hover:brightness-110 sm:h-16 sm:text-[24px]"
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
