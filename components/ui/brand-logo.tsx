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

// Where the small gold heart sits relative to the big heart.
const SMALL_HEART = "translate(50 48) scale(0.5)";

/**
 * BanglaNikahCanada wordmark: a plum heart with a gold heart nested in its
 * lower right, the Bengali name above "BanglaNikahCanada.com", and a gold rule
 * leading into the tagline "A Halal Matrimony Service".
 * Size it with a width class (e.g. "w-[240px]"); height follows the aspect ratio.
 */
export function BrandLogo({ className, tone = "dark" }: BrandLogoProps) {
  const uid = useId().replace(/:/g, "");
  const plumId = `logo-plum-${uid}`;
  const goldId = `logo-gold-${uid}`;
  const maskId = `logo-mask-${uid}`;
  const light = tone === "light";
  const ink = light ? "#ffffff" : "#5a1a57";
  const sub = light ? "#f3dcf0" : "#5a1a57";

  return (
    <svg viewBox="0 0 560 116" aria-hidden="true" className={cn("block h-auto shrink-0", className)}>
      <defs>
        <linearGradient id={plumId} x1="0" y1="0" x2="1" y2="1">
          {light ? (
            <>
              <stop offset="0%" stopColor="#ffd3ea" />
              <stop offset="100%" stopColor="#f39ac9" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#7a2a72" />
              <stop offset="100%" stopColor="#4a1046" />
            </>
          )}
        </linearGradient>
        <linearGradient id={goldId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0cf86" />
          <stop offset="55%" stopColor="#d6a248" />
          <stop offset="100%" stopColor="#b07d2c" />
        </linearGradient>

        {/* Cut the big heart where the gold heart overlaps it, leaving a gap. */}
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="140" height="116">
          <rect x="0" y="0" width="140" height="116" fill="white" />
          <path d={HEART} transform={SMALL_HEART} fill="black" stroke="black" strokeWidth={11} />
        </mask>
      </defs>

      <g transform="translate(0 12) scale(1.12)">
        {/* Big heart — thick on the left/bottom, thin on the upper right */}
        <g mask={`url(#${maskId})`}>
          <path
            fill={`url(#${plumId})`}
            fillRule="evenodd"
            transform="scale(0.96 0.84)"
            d={`${HEART} M56 75.74 C41.6 65.66 22.88 51.26 22.88 32.54 C22.88 21.02 31.52 13.82 41.6 13.82 C48.8 13.82 53.84 18.14 56 23.9 C58.16 18.14 63.2 13.82 70.4 13.82 C80.48 13.82 89.12 21.02 89.12 32.54 C89.12 51.26 70.4 65.66 56 75.74 Z`}
          />
        </g>

        {/* Small gold heart */}
        <path
          fill={`url(#${goldId})`}
          fillRule="evenodd"
          transform={SMALL_HEART}
          d={`${HEART} M51 77.4 C37 67.6 18.8 53.6 18.8 35.4 C18.8 24.2 27.2 17.2 37 17.2 C44 17.2 48.9 21.4 51 27 C53.1 21.4 58 17.2 65 17.2 C74.8 17.2 83.2 24.2 83.2 35.4 C83.2 53.6 65 67.6 51 77.4 Z`}
        />
      </g>

      {/* Bengali name */}
      <text
        x="128"
        y="34"
        fill={ink}
        textLength="214"
        lengthAdjust="spacingAndGlyphs"
        style={{ fontFamily: "var(--font-bengali), serif", fontSize: 30, fontWeight: 600 }}
      >
        বাংলা নিকাহ কানাডা
      </text>

      {/* English name */}
      <text
        x="122"
        y="79"
        fill={ink}
        textLength="432"
        lengthAdjust="spacingAndGlyphs"
        style={{ fontFamily: "var(--font-heading), Georgia, serif", fontSize: 44, fontWeight: 700, fontStyle: "italic" }}
      >
        BanglaNikahCanada.com
      </text>

      {/* Gold rule + tagline */}
      <rect x="126" y="96" width="198" height="2.5" rx="1.25" fill={`url(#${goldId})`} />
      <text
        x="554"
        y="106"
        textAnchor="end"
        fill={sub}
        textLength="222"
        lengthAdjust="spacingAndGlyphs"
        style={{ fontFamily: "var(--font-heading), Georgia, serif", fontSize: 20, fontWeight: 700, fontStyle: "italic" }}
      >
        A Halal Matrimony Service
      </text>
    </svg>
  );
}
