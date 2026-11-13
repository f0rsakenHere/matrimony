import { useId } from "react";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  /** "dark" = for light backgrounds (default), "light" = for dark/green backgrounds. */
  tone?: "dark" | "light";
};

// Heart in a 100×100 box (tip at the bottom).
const HEART =
  "M50 92 C30 78 4 58 4 32 C4 16 16 6 30 6 C40 6 47 12 50 20 C53 12 60 6 70 6 C84 6 96 16 96 32 C96 58 70 78 50 92 Z";

// Stylised maple leaf in a 24×24 box.
export const MAPLE =
  "M12 1 13.6 5 15.6 4.2 15 9 18.5 6 19.2 8 22.5 7.4 21 11 23 12.2 17.5 16.5 18.2 18.5 12.8 17.6 12.8 22.5 11.2 22.5 11.2 17.6 5.8 18.5 6.5 16.5 1 12.2 3 11 1.5 7.4 4.8 8 5.5 6 9 9 8.4 4.2 10.4 5Z";

const GREEN_HEART = "translate(4 14) scale(0.9)";
const RED_HEART = "translate(44 38) scale(0.66)";

/**
 * BanglaNikahCanada wordmark: interlocking green and red outline hearts, a
 * thin rule, then the Bengali name, "BanglaNikahCanada.com" with a maple
 * leaf, and the tagline "A Halal Matrimony Service".
 * Size it with a width class (e.g. "w-[240px]"); height follows the aspect ratio.
 */
export function BrandLogo({ className, tone = "dark" }: BrandLogoProps) {
  const uid = useId().replace(/:/g, "");
  const clipId = `logo-clip-${uid}`;
  const light = tone === "light";
  const green = light ? "#ffffff" : "#1b5e3b";
  const red = light ? "#ffb4b9" : "#b3141f";
  const ink = light ? "#ffffff" : "#1b5e3b";
  const sub = light ? "rgba(255,255,255,0.85)" : "#2a332d";
  const rule = light ? "rgba(255,255,255,0.45)" : "#c9a24a";

  return (
    <svg viewBox="0 0 520 116" aria-hidden="true" className={cn("block h-auto shrink-0", className)}>
      <defs>
        {/* Where the red heart passes OVER the green one, so they interlock. */}
        <clipPath id={clipId}>
          <rect x="78" y="40" width="24" height="40" />
        </clipPath>
      </defs>

      <g fill="none" strokeLinejoin="round">
        <path d={HEART} transform={RED_HEART} stroke={red} strokeWidth={6.6} />
        <path d={HEART} transform={GREEN_HEART} stroke={green} strokeWidth={4.9} />
        <g clipPath={`url(#${clipId})`}>
          <path d={HEART} transform={RED_HEART} stroke={red} strokeWidth={6.6} />
        </g>
      </g>

      {/* Divider */}
      <rect x="126" y="12" width="1.5" height="92" fill={rule} />

      {/* Bengali name */}
      <text
        x="142"
        y="44"
        fill={ink}
        textLength="262"
        lengthAdjust="spacingAndGlyphs"
        style={{ fontFamily: "var(--font-bengali), serif", fontSize: 34, fontWeight: 700 }}
      >
        বাংলা নিকাহ কানাডা
      </text>

      {/* English name + maple leaf */}
      <text
        x="142"
        y="79"
        fill={ink}
        textLength="330"
        lengthAdjust="spacingAndGlyphs"
        style={{ fontFamily: "var(--font-heading), Georgia, serif", fontSize: 29, fontWeight: 400 }}
      >
        BanglaNikahCanada.com
      </text>
      <path d={MAPLE} transform="translate(478 56) scale(1.05)" fill={red} />

      {/* Tagline */}
      <text
        x="143"
        y="105"
        fill={sub}
        textLength="262"
        lengthAdjust="spacing"
        style={{ fontFamily: "var(--font-heading), Georgia, serif", fontSize: 15, fontStyle: "italic", letterSpacing: "0.12em" }}
      >
        A Halal Matrimony Service
      </text>
    </svg>
  );
}
