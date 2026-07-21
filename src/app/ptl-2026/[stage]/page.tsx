import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trophy, Calendar, MapPin, Play } from "lucide-react";
import { fetchEventDetails } from "@/lib/startgg";
import { VideoBackground } from "@/components/VideoBackground";
import { SectionHeader } from "@/components/SectionHeader";
import { CmsTitleText } from "@/components/CmsTitleText";
import { RefreshButton } from "@/components/RefreshButton";
import { BracketTabs } from "@/components/BracketTabs";
import { cn } from "@/lib/cn";

interface PageProps {
  params: Promise<{ stage: string }>;
}

const stageSlugs: Record<string, { name: string; slug: string; date: string; location: string }> = {
  "stage-1": {
    name: "PTL Stage 1",
    slug: "tournament/pakistan-tekken-league-stage-1/event/tekken-8",
    date: "April 2026",
    location: "Lahore, Pakistan",
  },
  "stage-2": {
    name: "PTL Stage 2",
    slug: "tournament/pakistan-tekken-league-stage-2/event/tekken-8",
    date: "May 2026",
    location: "Lahore, Pakistan",
  },
  "stage-3": {
    name: "PTL Stage 3",
    slug: "tournament/pakistan-tekken-league-stage-3/event/tekken-8",
    date: "June 2026",
    location: "Lahore, Pakistan",
  },
  "stage-4": {
    name: "PTL Stage 4",
    slug: "tournament/pakistan-tekken-league-stage-4/event/tekken-8",
    date: "July 2026",
    location: "Lahore, Pakistan",
  },
};

function cleanName(name: string): string {
  if (!name) return "";
  const parts = name.split("|");
  return parts[parts.length - 1].trim().toUpperCase();
}

export default async function StageDetailPage({ params }: PageProps) {
  const { stage } = await params;
  const stageKey = stage.toLowerCase();
  const stageInfo = stageSlugs[stageKey];
  if (!stageInfo) {
    notFound();
  }

  const data = await fetchEventDetails(stageInfo.slug);

  let rawStandings = data?.standings?.nodes || [];
  
  // Resolve Stage 4 ties (M. Zubair 1st, Numan Ch 2nd)
  if (stageKey === "stage-4") {
    rawStandings = rawStandings.map((node) => {
      if (!node || !node.entrant) return node;
      const name = cleanName(node.entrant.name);
      if (name === "M. ZUBAIR") {
        return { ...node, placement: 1 };
      } else if (name === "NUMAN CH" && node.placement === 2) {
        return { ...node, placement: 2 };
      }
      return node;
    }).sort((a, b) => (a?.placement || 99) - (b?.placement || 99));
  }

  const standings = rawStandings.map((node) => ({
    ...node,
    entrant: node.entrant ? { ...node.entrant, name: cleanName(node.entrant.name) } : null
  }));

  const sets = data?.sets?.nodes || [];

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-stone-3/60 bg-stone/20">
        <VideoBackground src="/assets/V1.mp4" opacity={30} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,255,45,0.02)_0%,transparent_75%)] bg-void/50" />
        <div className="relative mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28">
          <Link
            href="/ptl-2026"
            className="group mb-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neon hover:text-white transition-colors"
          >
            <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
            Back to PTL 2026
          </Link>
          
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon-dim">
              PTL 2026 Regular Season
            </span>
            <h1 className="font-display text-4xl uppercase tracking-tighter text-white md:text-6xl">
              {stageInfo.name}
            </h1>
            
            <div className="mt-4 flex flex-wrap gap-6 font-mono text-xs text-ash/80">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-neon" />
                <span>{stageInfo.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-neon" />
                <span>{stageInfo.location}</span>
              </div>
              {data?.state === 2 && (
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon"></span>
                  </span>
                  <span className="text-neon uppercase tracking-widest font-bold">LIVE NOW</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* LEFT: Standings (col-span-4) */}
          <div className="lg:col-span-4">
            <h2 className="flex items-center gap-2.5 font-display text-lg uppercase tracking-wider text-white border-b border-stone-3/30 pb-4 mb-6">
              <Trophy size={16} className="text-neon" /> Standings
            </h2>

            {standings.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {standings.map((node, i) => {
                  const isFirst = node.placement === 1;
                  const rankStr = String(node.placement).padStart(2, "0");
                  const rankBg = node.placement === 1
                    ? "bg-neon text-void font-black shadow-[0_0_10px_rgba(200,255,45,0.2)]"
                    : node.placement === 2
                    ? "bg-signal text-void font-bold"
                    : node.placement === 3
                    ? "bg-blood text-void font-bold"
                    : "bg-stone-3/20 text-bone/60 border border-stone-3/40";

                  return (
                    <div
                      key={`${node.entrant?.id || i}`}
                      className={cn(
                        "flex items-center justify-between border p-3 rounded-sm transition-all duration-300",
                        isFirst
                          ? "border-neon/30 bg-neon/5"
                          : "border-stone-3/20 bg-stone/20"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn("w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px]", rankBg)}>
                          {rankStr}
                        </div>
                        <span className="font-mono text-sm tracking-wider uppercase text-white truncate">
                          {node.entrant?.name || "TBA"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="border border-dashed border-stone-3/60 p-8 text-center rounded-sm font-mono text-[10px] uppercase tracking-wider text-ash">
                No standings data available yet.
              </div>
            )}
          </div>

          {/* RIGHT: Live Bracket Sets (col-span-8) */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between border-b border-stone-3/30 pb-4 mb-6">
              <h2 className="flex items-center gap-2.5 font-display text-lg uppercase tracking-wider text-white">
                <Play size={16} className="text-neon" /> Live Matches & Brackets
              </h2>
              <RefreshButton />
            </div>

            <BracketTabs sets={sets} />
          </div>
        </div>
      </section>
    </>
  );
}
