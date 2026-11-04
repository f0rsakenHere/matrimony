import { useId } from "react";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  /** "dark" = for light backgrounds (default), "light" = for dark/purple backgrounds. */
  tone?: "dark" | "light";
};

// Heart in a 100×100 box (tip at the bottom).
const HEART =
  "M50 92 C30 78 4 58 4 32 C4 16 16 6 30 6 C40 6 47 12 50 20 C53 12 60 6 70 6 C84 6 96 16 96 32 C96 58 70 78 50 92 Z";

/**
 * BanglaNikahCanada wordmark: interlocking calligraphic hearts, the
 * English name, and the Bengali name ("বাংলা নিকাহ কানাডা") between two rules.
 * Size it with a width class (e.g. "w-[240px]"); height follows the aspect ratio.
 */
export function BrandLogo({ className, tone = "dark" }: BrandLogoProps) {
  const uid = useId().replace(/:/g, "");
  const gradId = `logo-grad-${uid}`;
  const maskId = `logo-mask-${uid}`;
  const light = tone === "light";
  const ink = light ? "#ffffff" : "#4a1a57";

  return (
    <svg
      viewBox="0 0 508 86"
      aria-hidden="true"
      className={cn("block h-auto shrink-0", className)}
    >
      <defs>
        <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1="92" y1="4" x2="8" y2="80">
          {light ? (
            <>
              <stop offset="0%" stopColor="#ffd3ea" />
              <stop offset="100%" stopColor="#f39ac9" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#d81b60" />
              <stop offset="50%" stopColor="#a3195f" />
              <stop offset="100%" stopColor="#5e0f45" />
            </>
          )}
        </linearGradient>

        {/* Cut the big heart where the small heart crosses it, so they interlock
            cleanly on any background. */}
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="84">
          <rect x="0" y="0" width="120" height="84" fill="white" />
          <path
            d={HEART}
            transform="translate(56 33) scale(0.5)"
            fill="black"
            stroke="black"
            strokeWidth={18}
          />
        </mask>
      </defs>

      {/* Big heart — thick on the left/bottom, thin on the upper right */}
      <g mask={`url(#${maskId})`}>
      <path
        fill={`url(#${gradId})`}
        fillRule="evenodd"
        transform="scale(0.96 0.84)"
        d={`${HEART} M56 75.74 C41.6 65.66 22.88 51.26 22.88 32.54 C22.88 21.02 31.52 13.82 41.6 13.82 C48.8 13.82 53.84 18.14 56 23.9 C58.16 18.14 63.2 13.82 70.4 13.82 C80.48 13.82 89.12 21.02 89.12 32.54 C89.12 51.26 70.4 65.66 56 75.74 Z`}
      />
      </g>

      {/* Small heart */}
      <path
        fill={`url(#${gradId})`}
        fillRule="evenodd"
        transform="translate(56 33) scale(0.5)"
        d={`${HEART} M51 77.4 C37 67.6 18.8 53.6 18.8 35.4 C18.8 24.2 27.2 17.2 37 17.2 C44 17.2 48.9 21.4 51 27 C53.1 21.4 58 17.2 65 17.2 C74.8 17.2 83.2 24.2 83.2 35.4 C83.2 53.6 65 67.6 51 77.4 Z`}
      />

      {/* English name */}
      <text
        x="110"
        y="40"
        fill={ink}
        textLength="394"
        lengthAdjust="spacingAndGlyphs"
        style={{ fontFamily: "var(--font-heading), Georgia, serif", fontSize: 44, fontWeight: 700 }}
      >
        BanglaNikahCanada
      </text>

      {/* Bengali name between rules */}
      <line x1="118" y1="67" x2="158" y2="67" stroke={ink} strokeWidth="2.5" />
      <text
        x="307"
        y="79"
        textAnchor="middle"
        fill={ink}
        textLength="282"
        lengthAdjust="spacingAndGlyphs"
        style={{ fontFamily: "var(--font-bengali), serif", fontSize: 31, fontWeight: 700 }}
      >
        বাংলা নিকাহ কানাডা
      </text>
      <line x1="456" y1="67" x2="504" y2="67" stroke={ink} strokeWidth="2.5" />
    </svg>
  );
}
