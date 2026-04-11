import { cn } from "@/lib/utils";

type AyahBlockProps = {
  className?: string;
};

export function AyahBlock({ className }: AyahBlockProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[820px] text-center",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="mx-auto block h-px w-16 bg-[var(--color-dark-28)]"
      />

      <p
        lang="ar"
        className="arabic mt-10 text-[28px] text-[var(--foreground)] md:text-[36px]"
      >
        وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
        لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
      </p>

      <p
        lang="bn"
        className="bengali mx-auto mt-8 max-w-[58ch] text-[17px] leading-[1.85] text-[var(--foreground)] md:text-[19px]"
      >
        “আর তাঁর নিদর্শনগুলোর মধ্যে রয়েছে যে, তিনি তোমাদের জন্য তোমাদের মধ্য
        থেকেই সঙ্গী সৃষ্টি করেছেন, যাতে তোমরা তাদের কাছে প্রশান্তি লাভ করতে
        পারো। আর তিনি তোমাদের মধ্যে ভালোবাসা ও দয়া সৃষ্টি করেছেন।”
      </p>

      <p className="mx-auto mt-6 max-w-[58ch] text-[16px] leading-[1.7] text-[var(--color-dark-72)] italic md:text-[18px]">
        “And among His signs is this, that He created for you mates from among
        yourselves, that you may dwell in tranquility with them, and He has put
        love and mercy between your hearts.”
      </p>

      <p className="mt-6 text-sm font-semibold tracking-[0.18em] text-[var(--color-dark-56)] uppercase">
        Surah Ar Rum · 30:21
      </p>

      <span
        aria-hidden="true"
        className="mx-auto mt-10 block h-px w-16 bg-[var(--color-dark-28)]"
      />
    </div>
  );
}
