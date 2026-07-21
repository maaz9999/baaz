import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Trophy, Tv, Twitch, Youtube } from "lucide-react";
import { SlotCard } from "@/components/SlotCard";
import { SectionHeader } from "@/components/SectionHeader";
import { CmsPlacementSection } from "@/components/CmsPlacementSection";
import { CmsTitleText } from "@/components/CmsTitleText";
import { StageBracket } from "@/components/StageBracket";
import { VideoBackground } from "@/components/VideoBackground";
import { cmsBodyText, cmsCta, cmsEyebrow, cmsItems, cmsTitle, getCircuitBySlug, getCmsSection, getPtlPage, getStartggStandings, type CmsSectionItem } from "@/lib/content";
import { ptlPointsRace, ptlStageChampions, ptlStages } from "@/lib/ptlPoints";
import { cn } from "@/lib/cn";

export const metadata = { title: "PTL 2026 - BAAZ GG" };

const fallbackStages = [
  { label: "01", title: "STAGE 1", meta: "APR '26", body: "Lahore" },
  { label: "02", title: "STAGE 2", meta: "MAY '26", body: "Lahore" },
  { label: "03", title: "STAGE 3", meta: "JUN '26", body: "Lahore" },
  { label: "04", title: "STAGE 4", meta: "JUL '26", body: "Lahore" },
  { label: "TD", title: "TAKEDOWN", meta: "SEP '26", body: "Packages Mall, Lahore" },
  { label: "LCQ", title: "LCQ", meta: "TBD", body: "TBD" },
  { label: "F", title: "FINALE", meta: "TBD", body: "TBD" },
];

export default async function PTLPage() {
  const [ptl2026, page] = await Promise.all([getCircuitBySlug("ptl-2026"), getPtlPage()]);
  const circuit = ptl2026;
  const stageResults = await Promise.all(
    ptlStages.map(async (stage) => ({ ...stage, entries: (await getStartggStandings(stage.startggEventId)) ?? [] }))
  );
  const hero = getCmsSection(page.content, "intro");
  const statsSection = getCmsSection(page.content, "hero-stats");
  const slotsIntro = getCmsSection(page.content, "slots-intro");
  const stagesIntro = getCmsSection(page.content, "stage-timeline");
  const bracket = getCmsSection(page.content, "bracket-placeholder");
  const standings = getCmsSection(page.content, "standings");
  const watch = getCmsSection(page.content, "watch-links");
  const stages = cmsItems(stagesIntro, fallbackStages);
  const stats = cmsItems(statsSection, [
    { label: "SEASON", value: "APR - DEC '26", type: "calendar" },
    { label: "HOST", value: "LAHORE", type: "map" },
    { label: "SLOTS", value: "8 FINALISTS", type: "trophy" },
    { label: "WATCH", value: "BAAZ_GG", type: "tv" },
  ]);
  const heroCta = cmsCta(hero, { label: "See the road to the final", href: "#slots" });
  const watchItems = cmsItems(watch, [
    { label: "TWITCH", title: "-> BAAZ_GG", href: "https://twitch.tv/baaz_gg" },
    { label: "YOUTUBE", title: "-> BAAZGG", href: "https://youtube.com/@baazgg" },
  ]);

  return (
    <>

      {/* STAGE TIMELINE */}
      <section className="relative border-y border-stone-3/60 bg-stone/20 overflow-hidden pt-12 pb-24 lg:pt-16 lg:pb-32">
        <VideoBackground src="/assets/V1.mp4" opacity={40} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,255,45,0.03)_0%,transparent_70%)] bg-void/30" />
        <div className="relative mx-auto max-w-[1400px] px-5 lg:px-10">
          <SectionHeader
            eyebrow={cmsEyebrow(stagesIntro, "THE CALENDAR")}
            title={<CmsTitleText text={cmsTitle(stagesIntro, "PAKISTAN TEKKEN LEAGUE")} />}
            subtitle={cmsBodyText(stagesIntro, "The full PTL 2026 calendar. Stages and venues finalize as the season approaches - registration opens once details are confirmed.")}
          />

          {/* Timeline container */}
          <div className="relative mt-20">
            {/* Timeline connector track line */}
            <div className="absolute top-[35px] left-0 right-0 hidden h-[2px] bg-stone-3/40 lg:block">
              <div className="h-full bg-gradient-to-r from-neon/40 via-signal/40 to-blood/40 w-full" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 relative z-10">
              {stages.map((stage, i) => {
                const stageName = itemText(stage, "title");
                const champion = ptlStageChampions.find(
                  (c) => c.stage.toLowerCase() === stageName.toLowerCase()
                );
                const isCompleted = !!champion;
                const isLive = stageName.toLowerCase() === "stage 4" && !isCompleted;
                const isUpcoming = !isCompleted && !isLive;

                return (
                  <div
                    key={`${itemText(stage, "label")}-${i}`}
                    className={cn(
                      "group relative border p-6 transition-all duration-300 rounded-sm hover:-translate-y-1.5",
                      isLive 
                        ? "border-neon shadow-[0_0_15px_rgba(200,255,45,0.1)] bg-stone-2/80" 
                        : isCompleted
                        ? "border-neon/15 bg-stone-3/5 opacity-70"
                        : "border-neon/40 bg-stone/60 hover:border-neon"
                    )}
                  >
                    {/* Timeline Node Dot */}
                    <div className="absolute -top-[19px] left-1/2 -translate-x-1/2 hidden lg:flex items-center justify-center">
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 bg-void transition-transform duration-300 group-hover:scale-125",
                        isLive 
                          ? "border-neon bg-neon" 
                          : isCompleted
                          ? "border-neon/20 bg-neon/5"
                          : "border-neon bg-neon"
                      )} />
                    </div>

                    <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.25em]">
                      <span className={cn(
                        "font-semibold",
                        isLive ? "text-neon" : isCompleted ? "text-neon-dim/60" : "text-ash"
                      )}>
                        {stageName.toLowerCase() === "finale" ? "FINALE" : `STAGE ${itemText(stage, "label")}`}
                      </span>
                      {isLive && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] bg-neon text-void font-bold animate-pulse">
                          LIVE
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-neon/40 text-[8px] font-bold">
                          DONE
                        </span>
                      )}
                    </div>

                    <h4 className={cn(
                      "display mt-4 text-2xl leading-none transition-colors",
                      isLive ? "text-white group-hover:text-neon" : isCompleted ? "text-bone/40" : "text-white group-hover:text-neon"
                    )}>
                      {stageName}
                    </h4>

                    {isCompleted && champion ? (
                      <div className="mt-4 flex flex-col gap-1">
                        <div className="inline-flex items-center gap-1.5 bg-neon/10 border border-neon/20 px-2 py-1 rounded text-[9px] font-mono font-bold tracking-wider text-neon">
                          🏆 {champion.player}
                        </div>
                        <div className="flex items-center gap-1.5 text-ash/40 font-mono text-[9px] uppercase tracking-[0.15em] mt-2">
                          <MapPin size={9} />
                          {itemText(stage, "body")}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-6 border-t border-stone-3/40 pt-4 flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.15em]">
                        <div className="flex items-center gap-1.5 text-bone/80">
                          <Calendar size={10} className="text-neon" />
                          {itemText(stage, "meta")}
                        </div>
                        <div className="flex items-center gap-1.5 text-ash mt-0.5">
                          <MapPin size={10} className="text-neon" />
                          {itemText(stage, "body")}
                        </div>
                      </div>
                    )}

                    {["stage 1", "stage 2", "stage 3", "stage 4"].includes(stageName.toLowerCase()) && (
                      <Link
                        href={`/ptl-2026/${stageName.toLowerCase().replace(" ", "-")}`}
                        className="mt-5 block w-full text-center border border-neon/30 bg-neon/5 hover:bg-neon hover:text-void py-1.5 rounded-sm font-mono text-[9px] uppercase tracking-[0.2em] text-neon transition-colors duration-200"
                      >
                        See Details
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Horizontal Stats HUD directly below stage timeline cards row */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <HeroStat key={itemText(stat, "label")} item={stat} index={idx} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <CmsPlacementSection placements={page.placements} slotKey="hero" title="PTL updates" className="py-16" />
      <CmsPlacementSection placements={page.placements} slotKey="featured-posts" title="Latest PTL posts" className="py-16" />
      <CmsPlacementSection placements={page.placements} slotKey="featured" title="Featured PTL updates" className="py-16" />



      <CmsPlacementSection placements={page.placements} slotKey="ptl-stages" title="Stage updates" className="py-16" />

      {/* STAGE RESULTS */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 lg:px-10">
        <SectionHeader
          eyebrow={cmsEyebrow(bracket, "STAGE RESULTS")}
          title={<CmsTitleText text={cmsTitle(bracket, "Three stages down.\nOne to go.")} />}
        />
        <div className="mt-16 grid gap-6 grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto">
          {stageResults.map((stage) => (
            <div key={stage.label} className="group relative border border-neon bg-stone/40 p-6 rounded-sm hover:border-neon transition-all duration-300">
              <StageBracket label={stage.label} entries={stage.entries} />
            </div>
          ))}
        </div>
      </section>

      {/* WATCH */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 lg:px-10">
        <SectionHeader
          eyebrow={cmsEyebrow(watch, "LIVE STREAM")}
          title={<CmsTitleText text={cmsTitle(watch, "Every match. English broadcast.")} />}
          subtitle={cmsBodyText(watch, "Baaz produces every PTL show end-to-end - talent, replays, hype. Subscribe so you don't miss a slot.")}
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {watchItems.map((item) => {
            const label = itemText(item, "label");
            const isYoutube = label.toLowerCase().includes("youtube");
            const Icon = isYoutube ? Youtube : Twitch;
            const brandColor = isYoutube ? "#FF0000" : "#a970ff";
            return (
              <a
                key={label}
                href={itemText(item, "href") || "#"}
                target="_blank"
                rel="noopener"
                className="group scanline relative flex items-center gap-4 overflow-hidden border border-neon bg-stone/60 p-6 transition-colors"
              >
                <Icon size={48} style={{ color: brandColor }} className="transition-transform duration-300 group-hover:scale-105" />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{label}</div>
                  <div className="display mt-1 text-3xl">{itemText(item, "title")}</div>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}

function HeroStat({ item, index }: { item: CmsSectionItem; index: number }) {
  const type = itemText(item, "type");
  const isWatch = type === "tv";
  const Icon = type === "map" ? MapPin : type === "trophy" ? Trophy : Calendar;

  return (
    <div className="relative border border-neon/20 bg-stone/40 p-5 rounded-sm overflow-hidden group hover:border-neon/50 transition-all duration-300">
      {/* Background glow */}
      <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-neon/5 rounded-full blur-xl group-hover:bg-neon/10 transition-colors" />
      <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-neon-dim">
        {isWatch ? (
          <div className="flex items-center gap-1 mr-0.5">
            <Twitch size={12} style={{ color: "#a970ff" }} />
            <Youtube size={12} style={{ color: "#FF0000" }} />
          </div>
        ) : (
          <Icon size={12} className="text-neon" />
        )}
        {itemText(item, "label")}
      </div>
      <div className="display mt-3 text-2xl text-white group-hover:text-neon transition-colors">
        {itemText(item, "value")}
      </div>
    </div>
  );
}

function itemText(item: CmsSectionItem | undefined, key: string) {
  const value = item?.[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}
