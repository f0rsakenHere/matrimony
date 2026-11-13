import { cn } from "@/lib/utils";
import { MAPLE } from "./brand-logo";

/**
 * Decorative gold floral sprig for page corners (line art: vines, leaves,
 * small blossoms). Drawn for the TOP-LEFT corner; pass `flip` for the
 * top-right, or rotate with classes for the bottom corners.
 */
export function GoldFloral({ className, flip = false }: { className?: string; flip?: boolean }) {
  const leaf = "M0 0 C5 -7 15 -7 20 0 C15 7 5 7 0 0Z";
  const leaves: Array<[number, number, number, number]> = [
    // x, y, rotation, scale
    [26, 14, 15, 1], [50, 26, 40, 1.1], [70, 46, 62, 1], [82, 74, 80, 0.95], [86, 104, 95, 0.9],
    [14, 30, 70, 0.9], [22, 56, 95, 0.85], [44, 8, -10, 0.9], [96, 10, 5, 0.85], [58, 64, 120, 0.8],
  ];
  const blossoms: Array<[number, number, number]> = [
    [60, 34, 1], [90, 62, 0.85], [32, 40, 0.75], [118, 16, 0.7], [84, 128, 0.7],
  ];

  return (
    <svg
      viewBox="0 0 160 160"
      aria-hidden="true"
      className={cn("pointer-events-none select-none", flip && "-scale-x-100", className)}
    >
      <g fill="none" stroke="#c9a24a" strokeLinecap="round">
        <path d="M2 2 C38 10 66 30 80 62 C90 86 90 116 80 156" strokeWidth="1.6" />
        <path d="M2 2 C26 26 32 58 26 96 C23 112 16 124 8 132" strokeWidth="1.2" />
        <path d="M2 2 C40 0 82 2 148 6" strokeWidth="1.2" />
        <path d="M60 34 C70 22 86 18 100 22" strokeWidth="1" />
        <path d="M90 62 C104 56 116 60 124 70" strokeWidth="1" />
        <path d="M30 40 C40 52 42 66 38 78" strokeWidth="1" />
        <path d="M120 70 c6 -4 10 0 8 5 c-2 5 -9 4 -9 -1" strokeWidth="1" />
        <path d="M100 22 c5 -5 11 -2 10 3 c-1 5 -8 5 -8 0" strokeWidth="1" />
      </g>
      <g fill="#c9a24a">
        {leaves.map(([x, y, r, s], i) => (
          <path key={i} d={leaf} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} fillOpacity="0.55" />
        ))}
        {blossoms.map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-5" rx="3" ry="5" transform={`rotate(${a})`} fillOpacity="0.45" />
            ))}
            <circle r="2.2" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Red rules fading out to the sides with a red maple leaf in the middle. */
export function MapleDivider({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 340 24" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="md-l" x1="0" x2="1">
          <stop offset="0" stopColor="#b3141f" stopOpacity="0" />
          <stop offset="1" stopColor="#b3141f" />
        </linearGradient>
        <linearGradient id="md-r" x1="0" x2="1">
          <stop offset="0" stopColor="#b3141f" />
          <stop offset="1" stopColor="#b3141f" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="11.25" width="152" height="1.5" fill="url(#md-l)" />
      <rect x="188" y="11.25" width="152" height="1.5" fill="url(#md-r)" />
      <path d={MAPLE} transform="translate(158 0)" fill="#b3141f" />
    </svg>
  );
}

/** Red rules fading out to the sides with a small gold scroll in the middle. */
export function RedGoldDivider({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 340 20" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="rgd-l" x1="0" x2="1">
          <stop offset="0" stopColor="#b3141f" stopOpacity="0" />
          <stop offset="1" stopColor="#b3141f" />
        </linearGradient>
        <linearGradient id="rgd-r" x1="0" x2="1">
          <stop offset="0" stopColor="#b3141f" />
          <stop offset="1" stopColor="#b3141f" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="9.25" width="128" height="1.5" fill="url(#rgd-l)" />
      <rect x="212" y="9.25" width="128" height="1.5" fill="url(#rgd-r)" />
      <g fill="none" stroke="#c9a24a" strokeWidth="1.6" strokeLinecap="round">
        <path d="M128 10 C138 10 144 4 152 4 C160 4 162 10 170 10 C178 10 180 16 188 16 C196 16 202 10 212 10" />
        <path d="M128 10 C138 10 144 16 152 16 C160 16 162 10 170 10 C178 10 180 4 188 4 C196 4 202 10 212 10" />
      </g>
      <path d="M170 5 L175 10 L170 15 L165 10 Z" fill="#c9a24a" />
    </svg>
  );
}
