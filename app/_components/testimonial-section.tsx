import { brandScript } from "@/app/fonts";
import { FlourishDivider } from "@/components/ui/flourish-divider";
import { MotionSection } from "@/components/ui/motion-section";

const testimonials = [
  {
    quote:
      "What stood out to us was the respect. Nothing felt rushed, public, or awkward. Every introduction came with clarity and care.",
    name: "Rahman Family",
    detail: "Parents of a bride, Mississauga",
    initials: "RF",
    cardTone: "bg-[var(--color-light-90)]",
    chipTone: "bg-[var(--surface)]",
  },
  {
    quote:
      "We wanted a process that honored deen and family involvement. This finally felt like a service built for that purpose.",
    name: "Sakib & Nura",
    detail: "Introduced through the service",
    initials: "SN",
    cardTone:
      "bg-[linear-gradient(180deg,var(--surface)_0%,var(--color-light-90)_100%)]",
    chipTone: "bg-[var(--surface)]",
  },
  {
    quote:
      "The team understood both our Bangladeshi values and life in Canada. That balance made all the difference for our family.",
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
      className="relative isolate overflow-hidden bg-[var(--surface)] py-16 md:py-18 lg:py-20"
    >
      <div className="relative z-10 mx-auto max-w-[1520px] px-6 md:px-8 lg:px-10">
        <p
          className={`${brandScript.className} text-center text-[28px] leading-none text-[var(--color-dark-72)] md:text-[34px]`}
        >
          Families remember how the process felt
        </p>
        <p className="mt-4 text-center subheading text-[var(--color-dark-72)]">
          Family Stories
        </p>
        <h2 className="mt-4 text-center text-[var(--foreground)]">
          Words from families we have guided with care
        </h2>
        <p className="mx-auto mt-6 max-w-[60ch] text-center text-[var(--color-dark-72)]">
          The right process should feel calm, respectful, and reassuring for
          everyone involved, not just successful at the end.
        </p>
        <FlourishDivider className="mt-8 justify-center" />

        <div className="mt-12 grid gap-7 lg:grid-cols-3 lg:[grid-auto-rows:1fr]">
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
    <article className="relative h-full pb-10">
      <div
        className={`relative h-full min-h-[350px] rounded-[28px] border border-[var(--color-dark-12)] px-7 pt-8 pb-12 shadow-[0_18px_40px_rgb(109_35_49_/_0.08)] md:min-h-[370px] md:px-8 md:pt-9 md:pb-14 ${item.cardTone}`}
      >
        <p className="text-[64px] leading-none font-bold text-[var(--color-dark-18)] md:text-[68px]">
          &ldquo;
        </p>
        <p className="mt-4 text-[22px] leading-[1.45] font-semibold text-[var(--foreground)]">
          {item.quote}
        </p>

        <span
          className={`absolute -bottom-3 left-14 size-6 rotate-45 border-r border-b border-[var(--color-dark-12)] ${item.cardTone}`}
        />
      </div>

      <div
        className={`absolute bottom-0 left-4 inline-flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-[18px] border border-[var(--color-dark-12)] px-3 py-2 shadow-[0_12px_28px_rgb(109_35_49_/_0.08)] ${item.chipTone}`}
      >
        <span className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--surface-inverse)] text-base font-semibold text-[var(--color-light)]">
          {item.initials}
        </span>
        <span>
          <span className="block text-base font-semibold text-[var(--foreground)]">
            {item.name}
          </span>
          <span className="block text-[var(--color-dark-72)]">
            {item.detail}
          </span>
        </span>
      </div>
    </article>
  );
}
