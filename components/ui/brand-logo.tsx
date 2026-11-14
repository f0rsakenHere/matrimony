import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  /** "dark" = for light backgrounds (default), "light" = for dark/green backgrounds. */
  tone?: "dark" | "light";
};

// Stylised maple leaf in a 24×24 box.
export const MAPLE =
  "M12 1 13.6 5 15.6 4.2 15 9 18.5 6 19.2 8 22.5 7.4 21 11 23 12.2 17.5 16.5 18.2 18.5 12.8 17.6 12.8 22.5 11.2 22.5 11.2 17.6 5.8 18.5 6.5 16.5 1 12.2 3 11 1.5 7.4 4.8 8 5.5 6 9 9 8.4 4.2 10.4 5Z";

/**
 * The heart mark in a ~106×100 box: a large green brush-stroke heart, open
 * at the lower right, cradling a smaller red calligraphic heart. Also used
 * (as plain paths) in app/icon.svg.
 */
export const GREEN_SWOOSH =
  "M66 97 C40 84 6 62 5 36 C4 16 20 4 38 5 C52 6 62 14 67 26 C74 15 85 11 95 15 C104 19 107 30 104 42 C103 46 101 49 99 51 C99 42 96 34 89 31 C81 28 73 32 68 40 L66 44 C62 30 52 20 39 20 C27 20 19 28 19 40 C19 62 44 82 66 97 Z";
export const RED_HEART =
  "M66 91 C56 84 43 74 43 61 C43 53 49 48 56 48 C61 48 64.5 51 66 55 C67.5 51 71 48 76 48 C83 48 89 53 89 61 C89 74 76 84 66 91 Z M68.5 86.62 C61.3 81.58 51.94 74.38 51.94 65.02 C51.94 59.26 56.26 55.66 61.3 55.66 C64.9 55.66 67.42 57.82 68.5 60.7 C69.58 57.82 72.1 55.66 75.7 55.66 C80.74 55.66 85.06 59.26 85.06 65.02 C85.06 74.38 75.7 81.58 68.5 86.62 Z";

/**
 * BanglaNikahCanada wordmark: green + red heart mark, the Bengali name,
 * "BanglaNikahCanada.com" in heavy italic serif, and the tagline
 * "A Halal Matrimony Service" below it.
 * Size it with a width class (e.g. "w-[240px]"); height follows the aspect ratio.
 */
export function BrandLogo({ className, tone = "dark" }: BrandLogoProps) {
  const light = tone === "light";
  const green = light ? "#ffffff" : "#1b5e3b";
  const red = light ? "#ffb4b9" : "#c8181f";
  const ink = light ? "#ffffff" : "#141414";
  const sub = light ? "rgba(255,255,255,0.88)" : "#1f1f1f";

  return (
    <svg viewBox="0 0 520 118" aria-hidden="true" className={cn("block h-auto shrink-0", className)}>
      <g transform="translate(0 4)">
        <path d={GREEN_SWOOSH} fill={green} />
        <path d={RED_HEART} fill={red} fillRule="evenodd" />
      </g>

      {/* Bengali name */}
      <text
        x="122"
        y="40"
        fill={ink}
        textLength="250"
        lengthAdjust="spacingAndGlyphs"
        style={{ fontFamily: "var(--font-bengali), serif", fontSize: 36, fontWeight: 700 }}
      >
        বাংলা নিকাহ কানাডা
      </text>

      {/* English name */}
      <text
        x="120"
        y="80"
        fill={ink}
        textLength="392"
        lengthAdjust="spacingAndGlyphs"
        style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: 37, fontWeight: 900, fontStyle: "italic" }}
      >
        BanglaNikahCanada.com
      </text>

      {/* Tagline, spanning the width of the English name */}
      <text
        x="122"
        y="110"
        fill={sub}
        textLength="388"
        lengthAdjust="spacing"
        style={{ fontFamily: "var(--font-sora), sans-serif", fontSize: 22, fontStyle: "italic", fontWeight: 600 }}
      >
        A Halal Matrimony Service
      </text>
    </svg>
  );
}
