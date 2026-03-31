import Image from "next/image";
import { goldIconButtonClass } from "@/components/ui/button-styles";
import { FlourishDivider } from "@/components/ui/flourish-divider";
import { MotionSection } from "@/components/ui/motion-section";
import { ShieldCheckIcon } from "@/components/ui/shield-check-icon";

const processSteps = [
  {
    title: "Share your intentions",
    description:
      "Tell us about your family, values, and the qualities that matter most in a spouse so we can guide the search with care.",
  },
  {
    title: "Submit your biodata",
    description:
      "We review your details privately, verify the essentials, and prepare your profile for thoughtful introduction.",
  },
  {
    title: "Receive curated introductions",
    description:
      "Compatible biodatas are shared discreetly only when there is real alignment in deen, family priorities, and future plans.",
  },
  {
    title: "Move forward with family involvement",
    description:
      "When both sides feel comfortable, we help the conversation progress respectfully toward meetings, istikhara, and nikah discussions.",
  },
];

export default function HowItWorksSection() {
  return (
    <MotionSection
      id="how-it-works"
      className="relative isolate overflow-hidden bg-[var(--surface)] py-14 md:py-16 lg:py-20"
    >
      <div className="relative z-10 mx-auto max-w-[1520px] px-6 md:px-8 lg:px-10">
        <div className="grid overflow-hidden rounded-[32px] border border-[var(--color-dark-12)] bg-[linear-gradient(180deg,var(--surface-muted)_0%,var(--surface)_100%)] shadow-[0_18px_40px_rgb(109_35_49_/_0.08)] lg:grid-cols-[47%_53%]">
          <div className="p-6 md:p-10 lg:p-12">
            <p className="subheading uppercase tracking-[0.08em] text-[var(--color-dark-72)]">
              How It Works
            </p>
            <h2 className="mt-4 max-w-[18ch] text-[var(--foreground)]">
              How a respectful introduction unfolds
            </h2>
            <FlourishDivider className="mt-8" />

            <div className="relative mt-8">
              <div className="relative h-[320px] overflow-hidden rounded-[28px] border border-[var(--color-dark-12)] md:h-[430px]">
                <Image
                  src="/flowers.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 47vw, 100vw"
                  className="object-cover object-center [filter:sepia(0.22)_saturate(0.86)_hue-rotate(-8deg)]"
                />
              </div>

              <div className="absolute bottom-3 right-3 w-[260px] rounded-[22px] border border-[var(--color-dark-12)] bg-[rgb(246_226_210_/_0.94)] px-4 py-3 shadow-[0_16px_32px_rgb(109_35_49_/_0.14)] md:bottom-4 md:right-4 md:w-[320px] md:px-5 md:py-4">
                <div className="flex items-center gap-3 text-[var(--foreground)]">
                  <ShieldCheckIcon
                    size={36}
                    className="shrink-0 text-[var(--foreground)]"
                    duration={1}
                  />
                  <p className="subheading text-[var(--foreground)]">
                    Private, guided, and family-aware from day one
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 text-[var(--color-dark-72)]">
              A calm, family-aware process from first intention to meaningful
              conversation.
            </p>
          </div>

          <div className="border-t border-[var(--color-dark-12)] p-6 md:p-10 lg:border-t-0 lg:border-l lg:p-12">
            <div className="space-y-4">
              {processSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="grid gap-5 rounded-[24px] border border-[var(--color-dark-12)] bg-[rgb(246_226_210_/_0.56)] p-6 md:grid-cols-[64px_1fr] md:items-start"
                >
                  <span
                    className={`${goldIconButtonClass} inline-flex size-14 items-center justify-center rounded-full text-lg font-semibold`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="md:pt-1">
                    <h3 className="text-[var(--foreground)]">{step.title}</h3>
                    <p className="mt-4 text-[var(--color-dark-72)]">
                      {step.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
