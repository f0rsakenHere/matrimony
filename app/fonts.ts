import {
  Berkshire_Swash,
  Geist_Mono,
  Manrope,
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
