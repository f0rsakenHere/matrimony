import type { Metadata } from "next";
import {
  arabicSerif,
  bengaliSerif,
  geistMono,
  headingManrope,
  headingSerif,
  soraSans,
} from "./fonts";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/AuthContext";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.banglanikahcanada.com";
const SITE_DESCRIPTION =
  "A halal matrimony service helping Bangladeshi Muslims find a spouse in Canada. Send us your profile for free and we'll handpick a match for you.";

// The sharing image comes from app/opengraph-image.jpg / twitter-image.jpg.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "BanglaNikahCanada — A Halal Matrimony Service",
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "BanglaNikahCanada",
    title: "BanglaNikahCanada — A Halal Matrimony Service",
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "BanglaNikahCanada — A Halal Matrimony Service",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        soraSans.variable,
        headingSerif.variable,
        headingManrope.variable,
        geistMono.variable,
        bengaliSerif.variable,
        arabicSerif.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)] font-sans"
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
