import Image from "next/image";
import { bengaliSerif } from "@/app/fonts";
import { goldIconButtonClass } from "@/components/ui/button-styles";
import { MotionSection } from "@/components/ui/motion-section";
import { ShieldCheckIcon } from "@/components/ui/shield-check-icon";

const processSteps = [
  {
    title: "Share your intentions",
    description:
      "Tell us about your family, your values, and what you are really looking for in a spouse.",
  },
  {
    title: "Submit your biodata",
    description:
      "We review everything privately and get your profile ready.",
  },
  {
    title: "Get matched thoughtfully",
    description:
      "We only share compatible biodatas when there is a true match in deen, values, and future goals.",
  },
  {
    title: "Move forward together",
    description:
      "When both sides agree, we help transition the conversation respectfully toward meetings and nikah talks.",
  },
];

export default function HowItWorksSection() {
  return (
    <MotionSection
      id="how-it-works"
      className="bg-[var(--surface-muted)] py-16 md:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1520px] px-6 md:px-8 lg:px-10">
        <div className="grid overflow-hidden border border-[var(--color-dark-12)] bg-[var(--surface)] lg:grid-cols-[47%_53%]">
          <div className="p-6 sm:p-7 md:p-10 lg:p-12">
            <p className="text-[12px] font-semibold tracking-[0.18em] text-[var(--color-dark-56)] uppercase">
              <span
                className={`${bengaliSerif.className} text-[15px] tracking-normal normal-case`}
              >
                যেভাবে পুরো প্রক্রিয়াটি সম্পন্ন হয়
              </span>
              <span aria-hidden="true" className="mx-2 opacity-50">
                ·
              </span>
              How It Works
            </p>
            <h2 className="mt-4 max-w-[18ch] text-[var(--foreground)]">
              How a respectful introduction unfolds
            </h2>

            <div className="relative mt-10">
              <div className="relative h-[320px] overflow-hidden border border-[var(--color-dark-12)] md:h-[440px]">
                <Image
                  src="/table-decor.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 47vw, 100vw"
                  className="object-cover object-center"
                />
              </div>

              <div className="absolute right-3 bottom-3 w-[calc(100%-1.5rem)] max-w-[340px] border border-[var(--color-dark-12)] bg-[var(--surface)] px-4 py-3 md:right-4 md:bottom-4 md:px-5 md:py-4">
                <div className="flex items-center gap-3 text-[var(--foreground)]">
                  <ShieldCheckIcon
                    size={28}
                    className="shrink-0 text-[var(--foreground)]"
                    duration={1}
                  />
                  <p className="text-[14px] font-semibold leading-snug text-[var(--foreground)] md:text-[15px]">
                    Guided and family friendly from the start
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--color-dark-12)] p-6 sm:p-7 md:p-10 lg:border-t-0 lg:border-l lg:p-12">
            <div className="space-y-5">
              {processSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="grid grid-cols-[48px_1fr] items-start gap-4 border-b border-[var(--color-dark-12)] pb-5 last:border-b-0 last:pb-0 sm:grid-cols-[56px_1fr] sm:gap-5 md:grid-cols-[64px_1fr]"
                >
                  <span
                    className={`${goldIconButtonClass} inline-flex size-12 items-center justify-center rounded-full text-base font-semibold sm:size-14 sm:text-lg`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="pt-1">
                    <h3 className="text-[var(--foreground)]">{step.title}</h3>
                    <p className="mt-3 text-[var(--color-dark-72)] sm:mt-4">
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
