import Link from "next/link";
import SiteHeader from "@/app/_components/site-header";

const serviceCards = [
  {
    title: "Easy Booking Service",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
    inverted: true,
  },
  {
    title: "Trusted 100% Satisfaction",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
    inverted: true,
  },
  {
    title: "Pilgrims Five Stars Service",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
    inverted: false,
  },
];

const trustedProfiles = [
  { label: "MA", tone: "soft" as const },
  { label: "KS", tone: "dark" as const },
  { label: "FN", tone: "soft" as const },
  { label: "AR", tone: "light" as const },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative isolate overflow-hidden bg-[var(--surface-inverse)]">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/nikah-canada-hero.jpg')",
              backgroundPosition: "center center",
            }}
          />
          <div className="absolute inset-0 bg-[var(--color-dark-28)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-dark-18)_0%,var(--color-dark-28)_30%,var(--color-dark-56)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-dark-18)_0%,transparent_40%,var(--color-dark-18)_100%)]" />

          <div className="relative mx-auto flex min-h-[calc(100vh-132px)] max-w-[1520px] flex-col items-center justify-center px-6 py-14 text-center text-[var(--color-light)] md:px-8 md:py-16 min-[1100px]:min-h-[calc(100vh-172px)] min-[1100px]:py-20 lg:px-10">
            <p className="subheading max-w-[420px] uppercase tracking-[0.06em] text-[var(--color-light)]">
              Your Path To Umrah Serenity
            </p>

            <h1 className="mt-3 max-w-[1320px] text-[var(--color-light)]">
              Your Unforgettable Umrah Experience
            </h1>

            <p className="mt-5 max-w-[940px] text-[var(--color-light-96)] leading-[1.55]">
              A prominent pioneer in crafting A-grade Umrah Experiences,
              Nurturing Faith, and Guiding Pilgrims in the USA. Since its
              inception, the organization has consistently expanded its reach,
              witnessing a steady increase in the number of spiritual journeys.
            </p>

            <div className="mt-8 flex flex-col items-center gap-5 lg:flex-row lg:gap-6">
              <div className="flex items-center -space-x-3">
                {trustedProfiles.map((profile) => (
                  <TrustedAvatar key={profile.label} {...profile} />
                ))}
              </div>

              <p className="subheading text-[var(--color-light)]">
                Trusted by 5000+ All Clients and Business
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/#package"
                className="inline-flex min-w-[196px] items-center justify-center gap-4 bg-[var(--color-dark-72)] px-8 py-5 text-base font-semibold text-[var(--color-light)] transition-colors hover:bg-[var(--color-dark-88)]"
              >
                <span>Our Package</span>
                <ArrowRightIcon className="size-5" />
              </Link>

              <Link
                href="/#about"
                className="inline-flex min-w-[178px] items-center justify-center bg-[var(--color-dark-88)] px-8 py-5 text-base font-semibold text-[var(--color-light)] transition-colors hover:bg-[var(--color-dark)]"
              >
                Read More
              </Link>
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-3">
          {serviceCards.map((card) => (
            <article
              key={card.title}
              className={`min-h-[270px] px-6 py-12 md:px-10 lg:min-h-[300px] lg:px-12 lg:py-14 ${
                card.inverted
                  ? "border-r border-[var(--color-light-18)] bg-[var(--surface-inverse)] text-[var(--color-light)]"
                  : "bg-[var(--surface)] text-[var(--foreground)]"
              }`}
            >
              <div className="mx-auto max-w-[420px]">
                <h3
                  className={
                    card.inverted
                      ? "text-[var(--color-light)]"
                      : "text-[var(--foreground)]"
                  }
                >
                  {card.title}
                </h3>

                <p
                  className={`mt-6 max-w-[360px] ${
                    card.inverted
                      ? "text-[var(--color-light-90)]"
                      : "text-[var(--color-dark-72)]"
                  }`}
                >
                  {card.description}
                </p>

                <Link
                  href="/#about"
                  className={`mt-10 inline-flex items-center gap-4 text-base font-semibold ${
                    card.inverted
                      ? "text-[var(--color-light)]"
                      : "text-[var(--foreground)]"
                  }`}
                >
                  <span
                    className={`flex size-12 items-center justify-center rounded-full ${
                      card.inverted
                        ? "bg-[var(--color-light)] text-[var(--foreground)]"
                        : "bg-[var(--surface-inverse)] text-[var(--color-light)]"
                    }`}
                  >
                    <ArrowRightIcon className="size-6" />
                  </span>
                  <span>Explore More</span>
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

function TrustedAvatar({
  label,
  tone,
}: {
  label: string;
  tone: "soft" | "dark" | "light";
}) {
  const toneClassName =
    tone === "dark"
      ? "bg-[var(--color-dark-72)]"
      : tone === "light"
        ? "bg-[var(--color-light-72)]"
        : "bg-[var(--color-light-18)]";

  const silhouetteClassName =
    tone === "light" ? "text-[var(--foreground)]" : "text-[var(--color-light)]";

  return (
    <div
      className={`relative flex size-16 items-center justify-center overflow-hidden rounded-full border-[3px] border-[var(--color-light)] ${toneClassName}`}
    >
      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[var(--color-dark-28)]" />
      <svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        className={`relative size-14 ${silhouetteClassName}`}
        fill="none"
      >
        <circle cx="32" cy="22" r="10" fill="currentColor" opacity="0.95" />
        <path
          d="M15 58c1.8-11.2 8.3-17 17-17 8.6 0 15.1 5.8 17 17"
          fill="currentColor"
          opacity="0.95"
        />
      </svg>
      <span className="absolute bottom-1.5 right-1.5 rounded-full bg-[var(--color-light)] px-1.5 py-0.5 text-[9px] font-bold text-[var(--foreground)]">
        {label}
      </span>
    </div>
  );
}

function ArrowRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
    >
      <path
        d="M5 12h14m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
