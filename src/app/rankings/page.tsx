import { SectionHeader } from "@/components/SectionHeader";
import { CmsTitleText } from "@/components/CmsTitleText";
import { Trophy } from "lucide-react";
import { ptlPointsRace, ptlStageChampions } from "@/lib/ptlPoints";
import { cn } from "@/lib/cn";
import { getPtlPage, getCmsSection, cmsEyebrow, cmsTitle, cmsBodyText } from "@/lib/content";
import { VideoBackground } from "@/components/VideoBackground";

export const metadata = { title: "PTL Rankings - BAAZ GG" };

export default async function RankingsPage() {
  const page = await getPtlPage();
  const standings = page?.content ? getCmsSection(page.content, "standings") : undefined;

  return (
    <>
      <section className="relative overflow-hidden border-b border-stone-3/60">
        <VideoBackground src="/assets/V1.mp4" opacity={30} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,255,45,0.02)_0%,transparent_75%)] bg-void/50" />
        <div className="relative mx-auto max-w-[1400px] px-5 py-24 lg:px-10 lg:py-32">
          <SectionHeader
            eyebrow={cmsEyebrow(standings, "POINTS RACE")}
            title={<CmsTitleText text={cmsTitle(standings, "PTL 2026 Rankings")} />}
            subtitle={cmsBodyText(standings, "Performance across all four stages and Takedown adds up. The points leader at season's end claims slot 7 - the most consistent fighter of the year.")}
          />
        </div>
      </section>

      {/* POINTS STANDINGS */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10">
        <div className="flex flex-col gap-3">
          {ptlPointsRace.map((row, i) => {
            const isFirst = i === 0;
            const rankStr = String(i + 1).padStart(2, "0");
            const rankBg = i === 0 
              ? "bg-neon text-void font-black shadow-[0_0_12px_rgba(200,255,45,0.3)]" 
              : i === 1 
              ? "bg-signal text-void font-bold" 
              : i === 2 
              ? "bg-blood text-void font-bold" 
              : "bg-stone-3/20 text-bone/60 border border-stone-3/40";

            return (
              <div
                key={row.player}
                className={cn(
                  "group relative overflow-hidden border p-4 transition-all duration-300 rounded-sm hover:-translate-y-0.5",
                  isFirst 
                    ? "border-neon bg-stone-2/45 shadow-[0_0_15px_rgba(200,255,45,0.06)]" 
                    : "border-neon/15 bg-stone/30 hover:border-neon/50 hover:shadow-[0_0_15px_rgba(200,255,45,0.04)]"
                )}
              >
                {/* Subtle highlight gradient inside card */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon/0 via-neon/0 to-neon/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10 grid grid-cols-12 items-center gap-4">
                  {/* Left block: Rank & Player Info (col-span-12 md:col-span-5) */}
                  <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                    {/* Rank badge */}
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs shrink-0",
                      rankBg
                    )}>
                      {rankStr}
                    </div>

                    {/* Player tag details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg tracking-wider uppercase text-white group-hover:text-neon transition-colors truncate">
                          {row.player}
                        </span>
                        {isFirst && (
                          <span className="text-[8px] bg-neon text-void border border-neon/30 px-1.5 py-0.5 rounded-sm font-bold tracking-widest font-mono shrink-0">
                            LEADER
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle block: Stages capsules (col-span-12 md:col-span-5) */}
                  <div className="col-span-12 md:col-span-5 flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-wider text-ash">
                    <div className="text-[9px] text-[#e0cf26] font-bold mr-1.5 hidden md:block shrink-0">STAGE POINTS:</div>
                    <div className="flex gap-1.5 bg-stone-3/5 border border-stone-3/20 p-1 rounded-sm shrink-0">
                      <div className="flex items-center gap-1.5 bg-stone-2/30 border border-stone-3/10 px-2 py-0.5 rounded-sm">
                        <span className="text-neon-dim/60">S1</span>
                        <span className={cn(row.stage1 && row.stage1 > 0 ? "text-bone font-bold" : "text-ash/40")}>
                          {row.stage1 ?? "0"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-stone-2/30 border border-stone-3/10 px-2 py-0.5 rounded-sm">
                        <span className="text-neon-dim/60">S2</span>
                        <span className={cn(row.stage2 && row.stage2 > 0 ? "text-bone font-bold" : "text-ash/40")}>
                          {row.stage2 ?? "0"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-stone-2/30 border border-stone-3/10 px-2 py-0.5 rounded-sm">
                        <span className="text-neon-dim/60">S3</span>
                        <span className={cn(row.stage3 && row.stage3 > 0 ? "text-bone font-bold" : "text-ash/40")}>
                          {row.stage3 ?? "0"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-stone-2/30 border border-stone-3/10 px-2 py-0.5 rounded-sm">
                        <span className="text-neon-dim/60">S4</span>
                        <span className={cn(row.stage4 && row.stage4 > 0 ? "text-bone font-bold" : "text-ash/40")}>
                          {row.stage4 ?? "0"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right block: Total Points display (col-span-12 md:col-span-2) */}
                  <div className="col-span-12 md:col-span-2 flex items-baseline gap-1 font-mono md:justify-end border-t border-stone-3/20 md:border-t-0 pt-2 md:pt-0">
                    <span className="md:hidden text-[10px] text-ash/40 uppercase tracking-widest mr-auto">TOTAL:</span>
                    <span className={cn(
                      "text-2xl font-black tracking-tighter leading-none",
                      isFirst ? "text-neon" : "text-white group-hover:text-neon transition-colors"
                    )}>
                      {row.total}
                    </span>
                    <span className="text-[10px] text-ash font-bold">PTS</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 border border-neon/15 bg-stone/20 p-5 rounded-sm">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-neon-dim mb-4">
            <Trophy size={12} className="text-neon" /> Already Qualified via Stage Wins
          </div>
          
          <div className="flex flex-wrap gap-3">
            {ptlStageChampions.map((c) => (
              <div 
                key={c.player} 
                className="flex items-center gap-3 bg-neon/5 border border-neon/20 px-3 py-2 rounded-sm group hover:border-neon hover:bg-neon/10 transition-all duration-300"
              >
                <div className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                <div className="flex flex-col">
                  <span className="font-display text-sm tracking-wider uppercase text-white group-hover:text-neon transition-colors leading-none">
                    {c.player}
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-ash/60 mt-1">
                    {c.stage} Champion
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
