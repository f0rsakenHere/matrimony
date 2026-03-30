import { MotionSection } from "@/components/ui/motion-section";

const testimonials = [
  {
    quote:
      "Impressed by the professionalism and attention to detail throughout every step.",
    name: "Farid Ibrahim",
    handle: "@faridibrahim",
    initials: "FI",
    cardTone: "bg-[var(--color-dark-08)]",
    chipTone: "bg-[var(--surface)]",
  },
  {
    quote:
      "A seamless experience from start to finish. Highly recommend this service.",
    name: "Sami Hassan",
    handle: "@samihassan",
    initials: "SH",
    cardTone: "bg-[var(--color-light-90)]",
    chipTone: "bg-[var(--surface)]",
  },
  {
    quote:
      "Reliable and trustworthy. Made our family process feel clear and easy.",
    name: "Layla Al-Sabah",
    handle: "@laylaalsabah",
    initials: "LA",
    cardTone: "bg-[var(--color-dark-08)]",
    chipTone: "bg-[var(--surface)]",
  },
];

export default function TestimonialSection() {
  return (
    <MotionSection className="bg-[var(--surface)] py-16 md:py-18 lg:py-20">
      <div className="mx-auto max-w-[1520px] px-6 md:px-8 lg:px-10">
        <p className="text-center subheading text-[var(--color-dark-72)]">
          Testimonial
        </p>
        <h2 className="mt-3 text-center text-[var(--foreground)]">
          Transformative Client Experiences
        </h2>

        <div className="mt-12 grid gap-7 lg:grid-cols-3 lg:[grid-auto-rows:1fr]">
          {testimonials.map((item) => (
            <TestimonialCard key={item.handle} item={item} />
          ))}
        </div>

        <div
          className="mt-12 flex items-center justify-center gap-3"
          aria-hidden="true"
        >
          <span className="h-[3px] w-5 bg-[var(--surface-inverse)]" />
          <span className="h-[3px] w-5 bg-[var(--color-dark-18)]" />
          <span className="h-[3px] w-5 bg-[var(--color-dark-18)]" />
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
    handle: string;
    initials: string;
    cardTone: string;
    chipTone: string;
  };
}) {
  return (
    <article className="relative h-full pb-10">
      <div
        className={`relative h-full min-h-[350px] rounded-[20px] border border-[var(--color-dark-12)] px-7 pt-8 pb-12 md:min-h-[370px] md:px-8 md:pt-9 md:pb-14 ${item.cardTone}`}
      >
        <p className="text-[64px] leading-none font-bold text-[var(--color-dark-18)] md:text-[68px]">
          “
        </p>
        <h3 className="mt-4 max-w-[14ch] text-[var(--foreground)]">
          {item.quote}
        </h3>

        <span
          className={`absolute -bottom-3 left-14 size-6 rotate-45 border-r border-b border-[var(--color-dark-12)] ${item.cardTone}`}
        />
      </div>

      <div
        className={`absolute bottom-0 left-4 inline-flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-[16px] border border-[var(--color-dark-12)] px-3 py-2 ${item.chipTone}`}
      >
        <span className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--surface-inverse)] text-base font-semibold text-[var(--color-light)]">
          {item.initials}
        </span>
        <span>
          <span className="block text-base font-semibold text-[var(--foreground)]">
            {item.name}
          </span>
          <span className="block text-[var(--color-dark-72)]">
            {item.handle}
          </span>
        </span>
      </div>
    </article>
  );
}
