import { bengaliSerif } from "@/app/fonts";
import { MotionSection } from "@/components/ui/motion-section";

const testimonials = [
  {
    quote:
      "What stood out most was the respect. Nothing was rushed or awkward. Everything was handled beautifully.",
    name: "Rahman Family",
    detail: "Parents of a bride, Mississauga",
    initials: "RF",
    cardTone: "bg-[var(--color-light-90)]",
    chipTone: "bg-[var(--surface)]",
  },
  {
    quote:
      "We needed something that honored our deen and included our family. This finally felt right.",
    name: "Sakib & Nura",
    detail: "Introduced through the service",
    initials: "SN",
    cardTone:
      "bg-[linear-gradient(180deg,var(--surface)_0%,var(--color-light-90)_100%)]",
    chipTone: "bg-[var(--surface)]",
  },
  {
    quote:
      "They really get the balance of Bangladeshi culture and living in Canada. That gave us so much peace of mind.",
    name: "Tasnim's Wali",
    detail: "Brother and wali, Toronto",
    initials: "TW",
    cardTone: "bg-[var(--color-light-90)]",
    chipTone: "bg-[var(--surface)]",
  },
];

export default function TestimonialSection() {
  return (
    <MotionSection
      id="success-stories"
      className="bg-[var(--surface)] py-16 md:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1520px] px-6 md:px-8 lg:px-10">
        <div className="mx-auto max-w-[680px] text-center">
          <p className="text-[12px] font-semibold tracking-[0.18em] text-[var(--color-dark-56)] uppercase">
            <span
              className={`${bengaliSerif.className} text-[15px] tracking-normal normal-case`}
            >
              পরিবারগুলোর অনুভূতি
            </span>
            <span aria-hidden="true" className="mx-2 opacity-50">
              ·
            </span>
            Family Stories
          </p>
          <h2 className="mt-4 text-[var(--foreground)]">
            Words from families we have guided
          </h2>
        </div>

        <div className="mt-14 grid gap-7 lg:grid-cols-3 lg:[grid-auto-rows:1fr]">
          {testimonials.map((item) => (
            <TestimonialCard key={item.name} item={item} />
          ))}
        </div>
      </div>
    </MotionSection>
  );
}

function TestimonialCard({
  item,
}: {
  item: {
    quote: string;
    name: string;
    detail: string;
    initials: string;
    cardTone: string;
    chipTone: string;
  };
}) {
  return (
    <article className="relative h-full pb-12">
      <div
        className={`relative h-full min-h-[320px] border border-[var(--color-dark-12)] px-6 pt-8 pb-14 sm:min-h-[340px] sm:px-7 sm:pt-9 md:min-h-[360px] md:px-8 ${item.cardTone}`}
      >
        <p className="text-[56px] leading-none font-bold text-[var(--color-dark-18)] sm:text-[60px] md:text-[64px]">
          &ldquo;
        </p>
        <p className="mt-3 text-[18px] leading-[1.5] font-medium text-[var(--foreground)] sm:mt-4 sm:text-[20px]">
          {item.quote}
        </p>

        <span
          className={`absolute -bottom-3 left-12 size-6 rotate-45 border-r border-b border-[var(--color-dark-12)] sm:left-14 ${item.cardTone}`}
        />
      </div>

      <div
        className={`absolute bottom-0 left-4 inline-flex max-w-[calc(100%-2rem)] items-center gap-3 border border-[var(--color-dark-12)] px-3 py-2 ${item.chipTone}`}
      >
        <span className="inline-flex size-10 shrink-0 items-center justify-center bg-[var(--surface-inverse)] text-[15px] font-semibold text-[var(--color-light)] sm:size-11 sm:text-base">
          {item.initials}
        </span>
        <span className="min-w-0">
          <span className="block text-[15px] font-semibold text-[var(--foreground)] sm:text-base">
            {item.name}
          </span>
          <span className="block text-[13px] text-[var(--color-dark-72)] sm:text-sm">
            {item.detail}
          </span>
        </span>
      </div>
    </article>
  );
}
