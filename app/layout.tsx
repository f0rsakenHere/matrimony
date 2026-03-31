import type { Metadata } from "next";
import { geistMono, headingManrope, soraSans } from "./fonts";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "BDCanNikah",
  description: "A Graceful Path to the Right Marriage",
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
        headingManrope.variable,
        geistMono.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)] font-sans"
      >
        {children}
      </body>
    </html>
  );
}
