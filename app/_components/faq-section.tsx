import { goldIconButtonClass } from "@/components/ui/button-styles";
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
    question: "How do introductions happen?",
    answer:
      "After profile review and compatibility checks, our team shares suitable introductions through a structured process that protects privacy and dignity for both sides.",
  },
];

export default function FaqSection() {
  return (
    <MotionSection
      id="faq"
      className="bg-[var(--surface-muted)] py-16 md:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[920px] px-6 md:px-8">
        <div className="text-center">
          <p className="text-[12px] font-semibold tracking-[0.18em] text-[var(--color-dark-56)] uppercase">
            Frequently Asked
          </p>
          <h2 className="mt-4 text-[var(--foreground)]">
            Everything you need to know before joining
          </h2>
        </div>

        <div className="mt-14 space-y-3">
          {faqs.map((item) => (
            <details
              key={item.question}
              className="group overflow-hidden border border-[var(--color-dark-12)] bg-[var(--surface)]"
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
