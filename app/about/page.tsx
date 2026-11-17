import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Globe,
  HandHeart,
  Heart,
  MessagesSquare,
  Scale,
  Users,
} from "lucide-react";
import SiteHeader from "../_components/site-header";
import SiteFooter from "../_components/site-footer";
import { MapleDivider } from "@/components/ui/gold-floral";

export const metadata: Metadata = {
  title: "About Us | BanglaNikahCanada",
  description:
    "Making nikah simple, halal and accessible. A trusted halal matchmaking service bringing Bengali Muslims across Canada together.",
};

const services = [
  { icon: Heart, title: "Halal Matchmaking", text: "Personalized, private introductions." },
  { icon: BookOpen, title: "Islamic Guidance", text: "Support from qualified scholars, including a Mufti and Maulana." },
  { icon: Users, title: "Premarital Guidance", text: "Helping couples prepare for marriage." },
  { icon: HandHeart, title: "Nikah Services", text: "Assistance with Islamic marriage ceremonies." },
  { icon: MessagesSquare, title: "Marriage & Family Counseling", text: "Experienced guidance before and after nikah." },
  { icon: Scale, title: "Legal & Professional Support", text: "Access to a lawyer and social worker for marriage related matters." },
  { icon: Globe, title: "Multilingual Assistance", text: "Support in Bangla, English, French, Arabic, Urdu, and other languages where available." },
];

const h2 = "font-[family-name:var(--font-display)] text-[26px] font-black leading-tight text-[var(--brand-green)] sm:text-[32px]";
const p = "mt-4 text-[17px] leading-[1.8] text-[var(--brand-ink)] sm:text-[18px]";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-light)]">
      <SiteHeader />

      <main className="flex-1">
        {/* Intro */}
        <section className="bg-[linear-gradient(180deg,#fcf8f0_0%,#f8f0e2_100%)] pb-12 pt-10 text-center sm:pb-16 sm:pt-14">
          <div className="mx-auto max-w-[760px] px-5 sm:px-8">
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[var(--brand-green)] sm:text-[13px]">
              About Us
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] font-black text-[#1a1a1a]">
              <span className="block text-balance text-[30px] leading-[1.15] sm:text-[44px]">Making Nikah</span>
              <span className="mt-1 block text-balance text-[32px] leading-[1.15] text-[var(--brand-red)] sm:text-[48px]">
                Simple, Halal &amp; Accessible
              </span>
            </h1>
            <MapleDivider className="mx-auto mt-4 w-[240px] sm:w-[320px]" />
            <p className="mx-auto mt-6 max-w-[640px] text-[17px] leading-[1.8] text-[var(--brand-ink)] sm:text-[19px]">
              As Bengali Muslims who were born or raised in Canada, we understand what it&rsquo;s like to grow
              up between two cultures. We understand the lifestyle, mindset, and expectations of Bengali
              Muslims who call Canada home.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-[1040px] px-5 sm:mt-10 sm:px-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--brand-gold)]/35 shadow-[0_12px_32px_rgb(27_94_59_/_0.08)] sm:aspect-[3/1]">
              <Image
                src="/images/about/islamic-courtyard.webp"
                alt="A peaceful empty Islamic courtyard with cream stone arches, green doors, and jasmine"
                fill
                priority
                sizes="(max-width: 1040px) 100vw, 976px"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Why we exist */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-[760px] px-5 sm:px-8">
            <h2 className={h2}>That&rsquo;s Why We Exist.</h2>
            <p className={p}>
              We want to bring Bengali Muslims across Canada together through a trusted, halal matchmaking
              service where individuals and families can connect, explore compatible matches, and take
              meaningful steps toward nikah.
            </p>
            <p className={p}>
              Our goal is to help you find a compatible life partner who shares your values, understands
              your mindset, and has similar hopes and goals for the future.
            </p>
          </div>
        </section>

        {/* More than matchmaking */}
        <section className="bg-white/60 py-12 sm:py-16">
          <div className="mx-auto max-w-[1040px] px-5 sm:px-8">
            <div className="mx-auto max-w-[760px]">
              <h2 className={h2}>More Than Matchmaking</h2>
              <p className={p}>
                We want to be more than just another matrimonial platform. Our vision is to become a
                trusted, one stop resource for everything related to nikah and marriage.
              </p>
              <p className={p}>
                Our team brings together Islamic scholars, experienced marriage counselors, a social
                worker, a lawyer, and individuals with years of experience supporting families.
              </p>
              <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--brand-gold)]/35 sm:aspect-[5/2]">
                <Image
                  src="/images/about/bengali-hospitality.webp"
                  alt="A brass Bengali tea service with ivory cups, jasmine flowers, and green and gold textiles"
                  fill
                  sizes="(max-width: 760px) 100vw, 760px"
                  className="object-cover"
                />
              </div>
              <p className={`${p} font-semibold`}>Together, we aim to provide:</p>
            </div>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:[&>li:last-child]:col-start-2">
              {services.map(({ icon: Icon, title, text }) => (
                <li
                  key={title}
                  className="flex gap-4 rounded-2xl border border-[var(--brand-gold)]/35 bg-[var(--brand-cream)] p-5"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)]">
                    <Icon className="size-5 text-white" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[17px] font-semibold text-[var(--brand-green)]">{title}</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-[var(--brand-ink)]">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Everyone is welcome */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-[760px] px-5 sm:px-8">
            <h2 className={h2}>Everyone Is Welcome</h2>
            <p className={p}>
              Whether you&rsquo;ve never been married, are divorced, or are widowed, you&rsquo;re welcome
              here, regardless of your age or marital status.
            </p>
            <p className={p}>We believe everyone should have the opportunity to find a compatible life partner.</p>
            <p className={p}>
              We want everyone who wishes to marry to experience the companionship, love, and happiness of
              sharing life with someone.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-[var(--brand-green)] py-14 text-center sm:py-20">
          <div className="mx-auto max-w-[760px] px-5 sm:px-8">
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#f0cf86] sm:text-[13px]">
              Our Mission
            </p>
            <p className="mt-4 text-balance font-[family-name:var(--font-display)] text-[28px] font-black leading-snug text-white sm:text-[40px]">
              To make nikah simple, halal, and accessible for everyone.
            </p>
            <Link
              href="/start"
              className="mt-8 inline-flex h-14 items-center justify-center rounded-full border border-[#7d0d14] bg-[linear-gradient(180deg,#c8181f_0%,#9c0f17_100%)] px-10 text-[18px] font-bold !text-white shadow-[0_10px_24px_rgb(0_0_0_/_0.25)] transition-[filter] hover:brightness-110"
            >
              Register for Free
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
