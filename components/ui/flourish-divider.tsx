import { cn } from "@/lib/utils";

type FlourishDividerProps = {
  className?: string;
  inverted?: boolean;
};

export function FlourishDivider({
  className,
  inverted = false,
}: FlourishDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex w-full items-center",
        inverted
          ? "text-[var(--color-light-72)]"
          : "text-[var(--color-dark-28)]",
        className,
      )}
    >
      <svg
        viewBox="0 0 220 18"
        className="h-[18px] w-[220px] shrink-0"
        fill="none"
      >
        <path
          d="M4 9h54"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.34"
        />
        <path
          d="M162 9h54"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.34"
        />
        <path
          d="M66 9c8 0 9-3.5 13-3.5S84 9 89 9"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
        <path
          d="M154 9c-8 0-9-3.5-13-3.5S136 9 131 9"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
        <path
          d="M91 9c6 0 7-5 12-5 3.5 0 4 5 7 5s3.5-5 7-5c5 0 6 5 12 5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.78"
        />
        <circle cx="110" cy="9" r="2.35" fill="currentColor" opacity="0.92" />
      </svg>
    </div>
  );
}
