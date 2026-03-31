import Image from "next/image";
import { cn } from "@/lib/utils";

type SiteOrnamentProps = {
  src: string;
  width: number;
  height: number;
  sizes?: string;
  className?: string;
};

export const siteOrnamentAssets = {
  asset1: { src: "/4x/asset1.png", width: 2527, height: 2526 },
  asset2: { src: "/4x/asset2.png", width: 886, height: 3789 },
  asset3: { src: "/4x/asset3.png", width: 2677, height: 2684 },
  asset4: { src: "/4x/asset4.png", width: 846, height: 4108 },
} as const;

export function SiteOrnament({
  src,
  width,
  height,
  sizes = "(min-width: 1024px) 20vw, 30vw",
  className,
}: SiteOrnamentProps) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      width={width}
      height={height}
      sizes={sizes}
      className={cn(
        "pointer-events-none !z-[1] select-none object-contain opacity-70 [filter:brightness(0)_invert(1)_contrast(1.08)]",
        className,
      )}
    />
  );
}
