import type { Sponsor } from "@/lib/types";
import { Tilt3D } from "@/components/Tilt3D";
import { getMediaUrl } from "@/lib/content";
import { Twitch, Youtube } from "lucide-react";

export function SponsorTile({ sponsor }: { sponsor: Sponsor }) {
  const logo = getMediaUrl(sponsor.logoDark || sponsor.logoLight);
  
  const renderLogo = () => {
    if (sponsor.slug === "twitch") {
      return (
        <div className="flex flex-col items-center gap-1">
          <Twitch className="h-7 w-7 text-[#9146FF] transition-transform group-hover:scale-110" />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#9146FF]/80 group-hover:text-[#9146FF] font-semibold">{sponsor.name}</span>
        </div>
      );
    }
    if (sponsor.slug === "youtube") {
      return (
        <div className="flex flex-col items-center gap-1">
          <Youtube className="h-7 w-7 text-[#FF0000] transition-transform group-hover:scale-110" />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#FF0000]/80 group-hover:text-[#FF0000] font-semibold">{sponsor.name}</span>
        </div>
      );
    }
    if (logo) {
      return <img src={logo} alt={sponsor.name} className="max-h-12 max-w-[80%] object-contain opacity-85 transition-opacity group-hover:opacity-100" />;
    }
    return (
      <div className="text-center">
        <div className="display text-xl leading-none">{sponsor.name}</div>
        <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-ash">
          {sponsor.tier}
        </div>
      </div>
    );
  };

  const inner = (
    <div className="bracket-frame card-depth group flex h-24 items-center justify-center border border-stone-3/40 bg-stone/30 px-4 text-bone/70 transition-colors hover:border-neon hover:text-neon">
      {renderLogo()}
    </div>
  );
  if (sponsor.url) {
    return (
      <Tilt3D max={6}>
        <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="block h-full">
          {inner}
        </a>
      </Tilt3D>
    );
  }
  return <Tilt3D max={6}>{inner}</Tilt3D>;
}
