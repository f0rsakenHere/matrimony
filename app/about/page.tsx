import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown, ArrowUpRight, BookOpen, Globe, HandHeart, Heart,
  LockKeyhole, MessagesSquare, Scale, ShieldCheck, Users,
} from "lucide-react";
import SiteHeader from "../_components/site-header";
import SiteFooter from "../_components/site-footer";
import { MapleDivider } from "@/components/ui/gold-floral";
import styles from "./about.module.css";

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
];

const promises = [
  { icon: ShieldCheck, title: "Rooted in faith", text: "A thoughtful, halal approach" },
  { icon: LockKeyhole, title: "Personal & private", text: "Your journey, treated with care" },
  { icon: Users, title: "Connected by community", text: "Bengali roots. Canadian home." },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main id="main-content">
        <section className={styles.hero} aria-labelledby="about-title">
          <div className={`${styles.container} ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}><span /> About us</p>
              <h1 id="about-title" className={styles.heroTitle}>
                Making nikah<br /><em>simple, halal</em><br />&amp; accessible.
              </h1>
              <MapleDivider className={styles.divider} />
              <p className={styles.heroDescription}>
                As Bengali Muslims who were born or raised in Canada, we understand what it&rsquo;s like to grow
                up between two cultures. We understand the lifestyle, mindset, and expectations of Bengali
                Muslims who call Canada home.
              </p>
              <div className={styles.heroActions}>
                <Link href="/start" className={styles.primaryButton}>
                  Register for Free <ArrowUpRight size={19} aria-hidden="true" />
                </Link>
                <a href="#our-story" className={styles.textLink}>
                  Get to know us <ArrowDown size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className={styles.heroVisual}>
              <div className={styles.heroFrame}>
                <Image
                  src="/images/about/shared-beginnings.webp"
                  alt="A Bengali Muslim couple sharing a warm smile in a sunlit Montreal courtyard garden"
                  fill priority
                  sizes="(max-width: 760px) 100vw, (max-width: 1200px) 48vw, 550px"
                  className={styles.heroImage}
                />
              </div>
              <span className={styles.imageAccent} aria-hidden="true" />
              <div className={styles.imageNote}>
                <span className={styles.noteIcon}><Heart size={22} strokeWidth={1.4} aria-hidden="true" /></span>
                <div>
                  <span className={styles.noteLabel}>Faith. Family. A shared future.</span>
                  <p>Meaningful connections begin here.</p>
                </div>
              </div>
              <p className={styles.imageCaption}>Bengali at heart. At home in Canada.</p>
            </div>
          </div>
        </section>

        <div className={styles.promiseBand}>
          <ul className={`${styles.container} ${styles.promises}`} aria-label="Our values">
            {promises.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <Icon size={27} strokeWidth={1.35} aria-hidden="true" />
                <div><p>{title}</p><span>{text}</span></div>
              </li>
            ))}
          </ul>
        </div>

        <section id="our-story" className={`${styles.section} ${styles.story}`} aria-labelledby="story-title">
          <div className={`${styles.container} ${styles.storyGrid}`}>
            <div className={styles.storyVisual}>
              <div className={styles.storyImage}>
                <Image
                  src="/images/about/family-connections.webp"
                  alt="Two generations of a Bengali Canadian family enjoying a thoughtful conversation over tea"
                  fill
                  sizes="(max-width: 760px) 100vw, (max-width: 1200px) 46vw, 550px"
                />
              </div>
              <div className={styles.storyNote}>
                <span className={styles.eyebrow}>A sense of belonging</span>
                <p>Two cultures.<br />Shared values.<br /><em>One meaningful journey.</em></p>
              </div>
            </div>
            <div className={styles.storyCopy}>
              <p className={styles.eyebrow}>That&rsquo;s why we exist</p>
              <h2 id="story-title" className={styles.sectionTitle}>A connection that<br />feels like <em>home.</em></h2>
              <div className={styles.goldRule} />
              <p className={styles.bodyCopy}>
                We want to bring Bengali Muslims across Canada together through a trusted, halal matchmaking
                service where individuals and families can connect, explore compatible matches, and take
                meaningful steps toward nikah.
              </p>
              <p className={styles.bodyCopy}>
                Our goal is to help you find a compatible life partner who shares your values, understands
                your mindset, and has similar hopes and goals for the future.
              </p>
              <Link href="/#how-it-works" className={styles.textLink}>
                Discover our approach <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.services}`} aria-labelledby="services-title">
          <div className={styles.container}>
            <div className={styles.servicesIntro}>
              <div>
                <p className={styles.eyebrow}>Support at every step</p>
                <h2 id="services-title" className={styles.sectionTitle}>More than<br /><em>matchmaking.</em></h2>
              </div>
              <div>
                <p className={styles.bodyCopy}>
                  We want to be more than just another matrimonial platform. Our vision is to become a
                  trusted, one stop resource for everything related to nikah and marriage.
                </p>
                <p className={styles.bodyCopy}>
                  Our team brings together Islamic scholars, experienced marriage counselors, a social
                  worker, a lawyer, and individuals with years of experience supporting families.
                </p>
              </div>
            </div>
            <p className={styles.servicesLabel}>Together, we aim to provide:</p>
            <ul className={styles.serviceGrid}>
              {services.map(({ icon: Icon, title, text }, index) => (
                <li key={title} className={styles.serviceCard}>
                  <div className={styles.serviceTop}>
                    <Icon size={29} strokeWidth={1.3} aria-hidden="true" />
                    <span aria-hidden="true">0{index + 1}</span>
                  </div>
                  <h3>{title}</h3><p>{text}</p>
                </li>
              ))}
            </ul>
            <div className={styles.languageBar}>
              <Globe size={27} strokeWidth={1.3} aria-hidden="true" />
              <div>
                <h3>Multilingual Assistance</h3>
                <p>Support in Bangla, English, French, Arabic, Urdu, and other languages where available.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.welcome}`} aria-labelledby="welcome-title">
          <div className={`${styles.container} ${styles.welcomeGrid}`}>
            <div>
              <p className={styles.eyebrow}>A place for your next chapter</p>
              <h2 id="welcome-title" className={styles.sectionTitle}>Everyone is<br /><em>welcome.</em></h2>
              <MapleDivider className={styles.welcomeDivider} />
            </div>
            <div>
              <p className={styles.bodyCopy}>
                Whether you&rsquo;ve never been married, are divorced, or are widowed, you&rsquo;re welcome
                here, regardless of your age or marital status.
              </p>
              <p className={styles.bodyCopy}>We believe everyone should have the opportunity to find a compatible life partner.</p>
              <p className={styles.bodyCopy}>
                We want everyone who wishes to marry to experience the companionship, love, and happiness of
                sharing life with someone.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.mission} aria-labelledby="mission-title">
          <div className={styles.missionCopy}>
            <p className={styles.eyebrow}>Our mission</p>
            <h2 id="mission-title">To make nikah<br /><em>simple, halal,</em> and<br />accessible for everyone.</h2>
            <div className={styles.missionActions}>
              <Link href="/start" className={styles.primaryButton}>
                Register for Free <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
              <Link href="/contact" className={styles.textLink}>
                Speak with our team <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className={styles.missionImage}>
            <Image
              src="/images/about/a-shared-future.webp"
              alt="Two gold wedding bands on ivory Bengali silk beside white jasmine and a brass tea cup"
              fill sizes="(max-width: 760px) 100vw, 45vw"
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
