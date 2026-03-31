import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  src?: string;
  tone?: "dark" | "light";
};

export function BrandLogo({
  className,
  src = "/bdcannikah-logo.png",
  tone = "dark",
}: BrandLogoProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block aspect-[511/77] shrink-0",
        tone === "light"
          ? "bg-[var(--color-light)]"
          : "bg-[var(--foreground)]",
        className,
      )}
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
