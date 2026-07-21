"use client";
import { cn } from "@/lib/cn";

type Props = { items: string[]; className?: string };

export function Marquee({ items, className }: Props) {
  const doubled = [...items, ...items];
  return (
    <div className={cn("overflow-hidden bg-stone/40 py-4 backdrop-blur-sm", className)} aria-hidden="true">
      <div className="marquee flex w-max items-center gap-12 font-mono text-xs uppercase tracking-[0.3em] text-bone/60">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-12">
            {item}
            <span className="text-neon">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
