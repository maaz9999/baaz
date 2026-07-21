"use client";

import { countryFlag } from "@/lib/format";

export function FlagImage({ country = "PK", className = "h-2.5 w-3.5" }: { country?: string; className?: string }) {
  const code = (country || "PK").toUpperCase();
  const flagUrl = `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

  return (
    <span className="inline-flex items-center shrink-0">
      <img
        src={flagUrl}
        alt={code}
        onError={(e) => {
          (e.currentTarget as HTMLElement).style.display = "none";
          const sibling = e.currentTarget.nextElementSibling as HTMLElement;
          if (sibling) sibling.style.display = "inline";
        }}
        className={`${className} object-cover border border-stone-3/40 rounded-[1px]`}
      />
      <span className="hidden font-mono text-[10px] leading-none select-none">{countryFlag(code) || "🇵🇰"}</span>
    </span>
  );
}

export function getPlayerCountry(name: string): string {
  if (!name) return "PK";
  const upper = name.toUpperCase();
  if (upper.includes("ULSAN") || upper.includes("KNEE") || upper.includes("CHANEL") || upper.includes("LOWHIGH") || upper.includes("JONDIK") || upper.includes("MULGOLD") || upper.includes("JAEHYUN")) return "KR";
  if (upper.includes("AK") && !upper.includes("KASHI") && !upper.includes("SAK") && !upper.includes("BAK")) return "PH";
  if (upper.includes("JOKA") || upper.includes("CHOP")) return "GB";
  if (upper.includes("TASTY STEVE") || upper.includes("RIP") || upper.includes("MAJIN OBAMA")) return "US";
  return "PK";
}
