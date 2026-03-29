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
    <section
      id="faq"
      className="bg-[var(--color-dark-08)] py-14 md:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[980px] px-6 md:px-8">
        <p className="text-center subheading uppercase tracking-[0.08em] text-[var(--color-dark-72)]">
          FAQ
        </p>
        <h2 className="mt-4 text-center text-[var(--foreground)]">
          Common Questions
        </h2>
        <p className="mx-auto mt-6 max-w-[60ch] text-center text-[var(--color-dark-72)]">
          Everything you need to know about our halal Muslim matchmaking
          process, privacy standards, and family involvement.
        </p>

        <div className="mt-10 space-y-4">
          {faqs.map((item) => (
            <details
              key={item.question}
              className="group border border-[var(--color-dark-12)] bg-[var(--surface)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-6 py-5 text-left">
                <span className="subheading text-[var(--foreground)]">
                  {item.question}
                </span>
                <span className="text-[var(--color-dark-72)] transition-transform group-open:rotate-45">
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
    </section>
  );
}
