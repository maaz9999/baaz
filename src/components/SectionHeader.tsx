import { cn } from "@/lib/cn";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({ eyebrow, title, subtitle, align = "left", className }: Props) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon">
          <span className="slash">{eyebrow}</span>
        </div>
      )}
      <h2 className="display mt-3 text-4xl text-bone md:text-6xl">{title}</h2>
      {subtitle && (
        <p className={cn("mt-4 max-w-2xl text-base text-ash", align === "center" && "mx-auto")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
