import Image from "next/image";
import { brandScript } from "@/app/fonts";
import { goldIconButtonClass } from "@/components/ui/button-styles";
import { FlourishDivider } from "@/components/ui/flourish-divider";
import { MotionSection } from "@/components/ui/motion-section";

const faqs = [
  {
    question: "How is this platform halal and privacy-first?",
    answer:
      "We do not use public swiping or open profile browsing. Every introduction is handled privately by our team, following Islamic etiquette and family-first values.",
  },
  {
    question: "Is Wali involvement supported for sisters?",
    answer:
      "Yes. Wali involvement is encouraged from the beginning. Families can stay involved during communication and shortlisting so the process remains transparent and respectful.",
  },
  {
    question: "Are profiles manually reviewed?",
    answer:
      "Yes. We manually screen biodatas and prioritize compatibility based on deen, values, family expectations, and life goals rather than hidden algorithms.",
  },
  {
    question: "Who is this service for?",
    answer:
      "This service is designed for serious, marriage-minded Muslims in Canada, with a strong focus on Bangladeshi-Canadian families who want a guided halal process.",
  },
  {
    question: "How do introductions happen?",
    answer:
      "After profile review and compatibility checks, our team shares suitable introductions through a structured process that protects privacy and dignity for both sides.",
  },
  {
    question: "Do you guarantee a match?",
    answer:
      "No service can guarantee a match, but we provide dedicated human support, careful curation, and sincere guidance to maximize quality introductions.",
  },
];

export default function FaqSection() {
  return (
    <MotionSection
      id="faq"
      className="relative isolate overflow-hidden bg-[var(--color-dark-08)] py-14 md:py-16 lg:py-20"
    >
      <Image
        src="/process.jpg"
        alt=""
        fill
        sizes="100vw"
        className="absolute inset-0 object-cover object-center opacity-95 [filter:sepia(0.24)_saturate(0.82)_hue-rotate(-10deg)]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-light-72)_0%,var(--color-light-18)_100%)]" />

      <div className="relative z-10 mx-auto max-w-[980px] px-6 md:px-8">
        <p
          className={`${brandScript.className} text-center text-[28px] leading-none text-[var(--color-dark-72)] md:text-[34px]`}
        >
          Questions families ask before they begin
        </p>
        <h2 className="mt-4 text-center text-[var(--color-dark)]">
          Everything you may want to know before joining
        </h2>
        <p className="mx-auto mt-6 max-w-[60ch] text-center text-[var(--color-dark-72)]">
          A few of the questions we hear most often from families who want a
          private, faith-led, and respectful route toward marriage.
        </p>

        <FlourishDivider className="mt-8 justify-center" />

        <div className="mt-10 space-y-4">
          {faqs.map((item, index) => (
            <details
              key={item.question}
              className={`group overflow-hidden rounded-[24px] border border-[var(--color-dark-12)] shadow-[0_16px_34px_rgb(109_35_49_/_0.08)] ${
                index % 2 === 0
                  ? "bg-[var(--surface)]"
                  : "bg-[var(--color-light-90)]"
              }`}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-6 py-5 text-left">
                <span className="subheading text-[var(--foreground)]">
                  {item.question}
                </span>
                <span
                  className={`${goldIconButtonClass} inline-flex size-10 shrink-0 items-center justify-center rounded-full text-lg font-semibold transition-transform duration-200 group-open:rotate-45`}
                >
                  +
                </span>
              </summary>
              <div className="border-t border-[var(--color-dark-12)] px-6 py-5">
                <p className="text-[var(--color-dark-72)]">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
