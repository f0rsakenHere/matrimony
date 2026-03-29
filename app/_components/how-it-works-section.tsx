import Image from "next/image";
import { ShieldCheckIcon } from "@/components/ui/shield-check-icon";

const processSteps = [
  {
    title: "Inquiry and Consultation",
    description:
      "Begin with a private conversation about your family values, expectations, and timeline so we can guide your search with clarity from day one.",
  },
  {
    title: "Documentation Submission",
    description:
      "Share your biodata and essential details for verification. Every profile is reviewed carefully before any introduction is considered.",
  },
  {
    title: "Review and Confirmation",
    description:
      "Our team evaluates compatibility with sincerity and discretion, then confirms suitable introductions with proper family involvement.",
  },
  {
    title: "Perform Your Nikah Journey",
    description:
      "Move forward with confidence through a halal pathway designed to protect dignity, privacy, and long-term compatibility.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-[var(--surface)] py-14 md:py-16 lg:py-20">
      <div className="mx-auto max-w-[1520px] px-6 md:px-8 lg:px-10">
        <div className="grid border border-[var(--color-dark-12)] lg:grid-cols-[47%_53%]">
          <div className="p-6 md:p-10 lg:p-12">
            <p className="subheading uppercase tracking-[0.08em] text-[var(--color-dark-72)]">
              How It Works
            </p>
            <h2 className="mt-4 max-w-[18ch] text-[var(--foreground)]">
              Embarking Your Sacred Marriage Journey With Care
            </h2>

            <div className="relative mt-8">
              <div className="relative h-[320px] overflow-hidden border border-[var(--color-dark-12)] md:h-[430px]">
                <Image
                  src="/how it works.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 47vw, 100vw"
                  className="object-cover object-center"
                />
              </div>

              <div className="absolute bottom-3 right-3 w-[260px] border border-[var(--color-dark-12)] bg-[var(--surface)] px-4 py-3 md:bottom-4 md:right-4 md:w-[320px] md:px-5 md:py-4">
                <div className="flex items-center gap-3 text-[var(--foreground)]">
                  <ShieldCheckIcon
                    size={36}
                    className="shrink-0 text-[var(--foreground)]"
                    duration={1}
                  />
                  <p className="subheading text-[var(--foreground)]">
                    Trusted by 5000+ Families Across Canada
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 text-[var(--color-dark-72)]">
              Faith-led matchmaking, private handling, and genuine family-first
              support from start to proposal.
            </p>
          </div>

          <div className="border-t border-[var(--color-dark-12)] p-6 md:p-10 lg:border-t-0 lg:border-l lg:p-12">
            <div className="divide-y divide-[var(--color-dark-12)]">
              {processSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="grid gap-5 py-8 first:pt-0 last:pb-0 md:grid-cols-[1fr_74px]"
                >
                  <div>
                    <h3 className="text-[var(--foreground)]">{step.title}</h3>
                    <p className="mt-4 text-[var(--color-dark-72)]">
                      {step.description}
                    </p>
                  </div>
                  <p className="text-right text-[58px] leading-none font-bold text-[var(--foreground)] md:text-[64px]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
