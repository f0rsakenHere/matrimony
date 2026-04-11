import {
  Amiri,
  Berkshire_Swash,
  Geist_Mono,
  Manrope,
  Noto_Serif_Bengali,
  Sora,
} from "next/font/google";

export const soraSans = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const brandScript = Berkshire_Swash({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const headingManrope = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const bengaliSerif = Noto_Serif_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const arabicSerif = Amiri({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});
