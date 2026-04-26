import { cn } from "@/lib/utils";

/* ─── StatCard ─── */

export function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-dark-12)] bg-[var(--background)] p-4">
      <div className="flex items-center gap-3">
        <Icon className={cn("size-5", color || "text-[var(--foreground)]")} />
        <div>
          <p className="text-[22px] font-bold text-[var(--foreground)]">{value}</p>
          <p className="text-[12px] text-[var(--color-dark-56)]">{label}</p>
        </div>
      </div>
    </div>
  );
}
