import Link from "next/link";
import { Crown, Medal } from "lucide-react";
import type { TournamentEntry } from "@/lib/types";
import { cn } from "@/lib/cn";
import esharibImg from "@/assets/ESHARIB_SQUARE.png";
import shehramImg from "@/assets/SHEHRAM_SQUARE.png";
import usamaImg from "@/assets/USAMA_SQUARE.png";

const champPhotos: Record<string, string> = {
  ESHARIB: esharibImg.src,
  SHEHRAM: shehramImg.src,
  "USAMA ABBASI": usamaImg.src,
  USAMA: usamaImg.src,
};

const placementAccent: Record<string, string> = {
  "1st": "border-signal/70 text-signal",
  "2nd": "border-bone/40 text-bone",
  "3rd": "border-blood/60 text-blood",
};

export function StageBracket({ label, entries }: { label: string; entries: TournamentEntry[] }) {
  const first = entries.find((e) => e.placement === "1st");
  const second = entries.find((e) => e.placement === "2nd");
  const third = entries.find((e) => e.placement === "3rd");
  const rest = entries.filter((e) => !["1st", "2nd", "3rd"].includes(e.placement));

  return (
    <div className="bracket-frame border border-stone-3 bg-stone/40 p-5">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
        <span className="slash text-neon">{label}</span>
        <span>{entries.length ? "RESULTS" : "TBA"}</span>
      </div>

      {first && (
        <div className={cn("card-depth-signal mt-4 flex items-center gap-4 border bg-void/40 p-3", placementAccent["1st"])}>
          {champPhotos[first.player.toUpperCase()] ? (
            <div className="relative w-12 h-12 overflow-hidden border border-neon/30 bg-stone-2/50 rounded-sm shrink-0">
              <img 
                src={champPhotos[first.player.toUpperCase()]} 
                alt={first.player} 
                className="w-full h-full object-cover" 
              />
            </div>
          ) : (
            <Crown size={22} className="shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-ash/80">Champion</div>
            <div className="display break-words text-xl leading-tight text-bone flex items-center gap-1.5">
              {champPhotos[first.player.toUpperCase()] && <Crown size={14} className="text-signal shrink-0" />}
              {first.player}
            </div>
          </div>
        </div>
      )}

      {(second || third) && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {second && (
            <div className={cn("flex items-center gap-2 border bg-void/25 p-3", placementAccent["2nd"])}>
              <Medal size={16} className="shrink-0" />
              <div className="min-w-0">
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-ash">2nd</div>
                <div className="break-words text-sm font-semibold leading-tight text-bone">{second.player}</div>
              </div>
            </div>
          )}
          {third && (
            <div className={cn("flex items-center gap-2 border bg-void/25 p-3", placementAccent["3rd"])}>
              <Medal size={16} className="shrink-0" />
              <div className="min-w-0">
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-ash">3rd</div>
                <div className="break-words text-sm font-semibold leading-tight text-bone">{third.player}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {rest.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {rest.map((entry, i) => (
            <div key={`${entry.player}-${i}`} className="flex items-center justify-between gap-3 border border-stone-3/60 bg-void/15 px-3 py-2">
              <span className="min-w-0 flex-1 truncate text-xs text-bone/80">{entry.player}</span>
              <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.15em] text-ash">{entry.placement}</span>
            </div>
          ))}
        </div>
      )}

      {entries.length === 0 && (
        <div className="mt-4 border border-dashed border-stone-3/60 p-6 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
          Coming soon
        </div>
      )}

      {(() => {
        const stageSlug = label.toLowerCase().replace(" ", "-");
        if (!["stage-1", "stage-2", "stage-3", "stage-4"].includes(stageSlug)) return null;
        return (
          <Link
            href={`/ptl-2026/${stageSlug}`}
            className="mt-5 block w-full text-center border border-neon/20 bg-neon/5 hover:bg-neon hover:text-void py-2 rounded-sm font-mono text-[9px] uppercase tracking-[0.2em] text-neon transition-colors duration-200"
          >
            View Stage Details
          </Link>
        );
      })()}
    </div>
  );
}
