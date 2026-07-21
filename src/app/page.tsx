import Link from "next/link";
import { ArrowRight, Twitch, Youtube } from "lucide-react";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { SectionHeader } from "@/components/SectionHeader";
import { SlotCard } from "@/components/SlotCard";
import { EventCard } from "@/components/EventCard";
import { PlayerCard } from "@/components/PlayerCard";
import { StatBlock } from "@/components/StatBlock";
import { CmsPlacementSection } from "@/components/CmsPlacementSection";
import { CmsTitleText } from "@/components/CmsTitleText";
import { TwitchLiveSection } from "@/components/TwitchLiveSection";
import { UpcomingTimeline } from "@/components/UpcomingTimeline";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ElectricBorder } from "@/components/ElectricBorder";
import Lightfall from "@/components/Lightfall";
import {
  cmsBodyText,
  cmsCta,
  cmsEyebrow,
  cmsItems,
  cmsTitle,
  getCircuitBySlug,
  getCmsSection,
  getEvents,
  getPlayers,
  getPublicPage,
  getSponsors,
  type CmsSectionItem,
} from "@/lib/content";
import type { HeroAccent, HeroSlide } from "@/lib/heroSlides";

export default async function HomePage() {
  const [events, players, sponsors, ptl2026, page] = await Promise.all([
    getEvents(),
    getPlayers(),
    getSponsors(),
    getCircuitBySlug("ptl-2026"),
    getPublicPage("home"),
  ]);
  const placements = page.placements;
  const heroCarousel = getCmsSection(page.content, "hero-carousel");
  const intro = getCmsSection(page.content, "intro");
  const statsSection = getCmsSection(page.content, "stats");
  const ptlTeaser = getCmsSection(page.content, "ptl-teaser");
  const legacy = getCmsSection(page.content, "legacy-events");
  const roster = getCmsSection(page.content, "players-preview");
  const watchLinks = getCmsSection(page.content, "watch-links");
  const marquee = getCmsSection(page.content, "marquee");
  const homepageSlugs = [
    "takedown-2026",
    "ptl-stage-4",
    "takedown-2025-t8",
    "pak-vs-korea-2025",
    "baaz-gauntlet-2024",
    "takedown-2023-t7",
  ];
  const pastEvents = homepageSlugs
    .map((slug) => events.find((e) => e.slug === slug))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));
  const featuredPlayerSlugs = [
    "arslan-ash",
    "atif",
    "farzeen",
    "the-jon",
    "numan-ch",
    "knee",
    "dawood-sikandar",
    "ak",
  ];
  const featuredPlayers = featuredPlayerSlugs
    .map((slug) => players.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const totalEntrants = events.reduce((sum, e) => sum + (e.participants ?? 0), 0);
  const totalPrize = events.reduce((sum, e) => sum + (e.prizePool.pkr ?? 0), 0);

  const fallbackMarqueeItems = [
    "TEKKEN 8",
    "TWT 2025 CHALLENGER",
    "LAHORE",
    "554 ENTRANTS",
    "SEOUL TAKEDOWN",
    "PAK 2 - KOR 0",
    "PTL 2026 INCOMING",
    "EAT SLEEP COMBO",
  ];
  const marqueeItems = cmsItems(marquee, fallbackMarqueeItems.map((label) => ({ label }))).map((item) => itemText(item, "label"));
  const stats = cmsItems(statsSection, [
    { label: "EVENTS", value: String(events.length), sub: "2023 -> 2026" },
    { label: "ENTRANTS", value: totalEntrants.toLocaleString(), sub: "across all opens" },
    { label: "PRIZE", value: `Rs${(totalPrize / 100000).toFixed(1)}M`, sub: "payouts distributed" },
    { label: "GAMES", value: "3", sub: "T7 - T8 - KoF XV" },
    { label: "COUNTRIES", value: "6", sub: "competitors hosted" },
    { label: "CIRCUITS", value: "01", sub: "PTL launching 2026" },
  ]);
  const ptlCta = cmsCta(ptlTeaser, { label: "Full circuit page", href: "/ptl-2026" });
  const watchItems = cmsItems(watchLinks, [
    { label: "TWITCH", title: "-> BAAZ_GG", href: "https://twitch.tv/baaz_gg" },
    { label: "YOUTUBE", title: "-> BAAZGG", href: "https://youtube.com/@baazgg" },
  ]);

  return (
    <div className="relative overflow-hidden w-full bg-void min-h-screen">
      {/* Single Seamless Unified Page Background */}
      <div className="absolute inset-0 pointer-events-none opacity-35 z-0">
        <Lightfall
          colors={["#C9FF2D", "#FFFFFF", "#C9FF2D"]}
          backgroundColor="#090A0C"
          speed={0.4}
          streakCount={4}
          streakWidth={1.2}
          streakLength={1}
          glow={1}
          density={0.55}
          twinkle={1}
          zoom={2.5}
          backgroundGlow={0.35}
          opacity={0.85}
          mouseInteraction={true}
          mouseStrength={0.4}
          mouseRadius={1}
        />
      </div>

      <div className="relative z-10">
        <Hero slides={heroSlidesFromCms(heroCarousel ? cmsItems(heroCarousel, []) : [])} />
        <Marquee items={marqueeItems} />

        {/* UPCOMING TOURNAMENTS */}
        <UpcomingTimeline events={events} />

        <CmsPlacementSection placements={placements} slotKey="hero" title="Featured" className="py-16" />

        {/* INTRO + STATS */}
        <section className="relative overflow-hidden bg-gradient-to-b from-stone-950/60 via-stone-900/30 to-void/40 py-24 lg:py-32">
          {/* Cyber grid pattern & Ambient background glow */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(200,255,45,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(200,255,45,0.025)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-neon/8 rounded-full blur-[160px] pointer-events-none select-none" />

          <div className="relative mx-auto max-w-[1400px] px-5 lg:px-10">
            <div className="grid gap-16 md:grid-cols-12 items-center">
              <div className="md:col-span-5 flex flex-col justify-center">
                <SectionHeader
                  eyebrow={cmsEyebrow(intro, "WHO WE ARE")}
                  title={<CmsTitleText text={cmsTitle(intro, "We build the stage.")} />}
                  subtitle={cmsBodyText(intro, "Baaz is Pakistan's leading FGC esports organization. From Takedown to The Baaz Gauntlet to international invitationals against Korea, we've put Pakistani fighters in front of the world.")}
                />
                <div>
                  <Link
                    href="/about"
                    className="mt-10 inline-flex items-center gap-3 border border-neon/60 bg-neon/10 hover:bg-neon hover:text-void px-6 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-neon font-bold transition-all duration-300 rounded-[2px] shadow-[0_0_20px_rgba(200,255,45,0.1)] group"
                  >
                    <span>The Baaz Story</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
              <div className="md:col-span-7">
                <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
                  {stats.map((stat, index) => (
                    <StatBlock key={`${itemText(stat, "label")}-${index}`} label={itemText(stat, "label")} value={itemText(stat, "value")} sub={itemText(stat, "sub")} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SCROLL REVEAL MANIFESTO BANNER */}
        <section className="relative overflow-hidden bg-gradient-to-b from-void/60 via-stone-950/80 to-void/60 py-24 lg:py-36">
          {/* Background esports grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(200,255,45,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(200,255,45,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

          {/* Wide ambient backdrop for text legibility */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[700px] h-[400px] bg-neon/5 rounded-full blur-[160px] pointer-events-none select-none" />

          <div className="relative mx-auto max-w-[1400px] px-5 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-12 items-center">
              {/* Left Column: Styled Esports Manifesto Card */}
              <div className="lg:col-span-7 flex flex-col justify-center items-start text-left">
                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-neon font-bold mb-8 border border-neon/40 bg-neon/10 px-4 py-1.5 rounded-[2px] shadow-[0_0_15px_rgba(200,255,45,0.1)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse" />
                  <span>// THE BAAZ MANIFESTO</span>
                </div>

                {/* Main Quote Card Frame */}
                <div className="relative pl-6 border-l-2 border-neon bg-stone-950/60 border border-stone-800/90 p-8 md:p-10 rounded-[2px] backdrop-blur-md w-full shadow-2xl space-y-6">
                  {/* Tech Corner Accents */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-neon" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-neon" />

                  <ScrollReveal
                    baseOpacity={0.25}
                    enableBlur={false}
                    baseRotation={0}
                    containerClassName="w-full text-left"
                  >
                    {/* Question Line */}
                    <div className="display text-3xl md:text-4xl lg:text-5xl uppercase font-black tracking-tight leading-tight text-white mb-6">
                      WHEN DOES A FIGHTER <span className="text-neon underline decoration-neon/50 underline-offset-8">TRULY LOSE?</span>
                    </div>

                    {/* Negation Pills */}
                    <div className="flex flex-wrap gap-3 my-6 font-mono text-xs md:text-sm uppercase tracking-wider">
                      <div className="px-4 py-2 border border-stone-700/80 bg-stone-900/80 rounded-[2px] text-stone-200 flex items-center gap-2">
                        <span className="text-neon font-bold">✕</span> NOT WHEN THEY DROP A SET
                      </div>
                      <div className="px-4 py-2 border border-stone-700/80 bg-stone-900/80 rounded-[2px] text-stone-200 flex items-center gap-2">
                        <span className="text-neon font-bold">✕</span> NOT WHEN THEY MISS A COMBO
                      </div>
                    </div>

                    {/* Hero Climax Callout */}
                    <div className="pt-6 border-t border-stone-800/80">
                      <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-neon/80 mb-2 font-bold flex items-center gap-2">
                        <span>THE FIGHTER'S CODE</span>
                        <div className="h-[1px] w-12 bg-neon/30" />
                      </div>
                      <div className="display text-3xl md:text-4xl lg:text-5xl uppercase font-black tracking-tight leading-[1.15] text-neon">
                        A FIGHTER ONLY LOSES WHEN THEY STOP STEPPING ONTO THE STAGE!
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </div>

              {/* Right Column: Falcon Logo Graphic wrapped with ElectricBorder */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end items-center">
                <ElectricBorder
                  color="#C9FF2D"
                  speed={1}
                  chaos={0.04}
                  borderRadius={9999}
                  className="p-1"
                >
                  <div className="relative group p-10 md:p-12 rounded-full border border-stone-3/40 bg-gradient-to-br from-stone-900/80 via-stone-950/90 to-stone/40 backdrop-blur-md shadow-[0_0_50px_rgba(200,255,45,0.15)] hover:border-neon hover:shadow-[0_0_70px_rgba(200,255,45,0.25)] transition-all duration-700 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-neon/10 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <img
                      src="/assets/BAAZ WHITE.png"
                      alt="BAAZ Falcon"
                      className="h-44 md:h-56 lg:h-64 w-auto object-contain brightness-125 drop-shadow-[0_0_35px_rgba(200,255,45,0.4)] group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </ElectricBorder>
              </div>
            </div>
          </div>
        </section>

        <CmsPlacementSection placements={placements} slotKey="featured-posts" title="Updates" className="py-16" />

        {/* LEGACY EVENTS */}
        <section className="relative overflow-hidden bg-gradient-to-b from-stone-950/60 via-void/40 to-stone-950/40 py-24 lg:py-32">
          {/* Cyber grid pattern & Ambient background glow */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(200,255,45,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(200,255,45,0.025)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[400px] bg-neon/5 rounded-full blur-[160px] pointer-events-none select-none" />

          <div className="relative mx-auto max-w-[1400px] px-5 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeader
                eyebrow={cmsEyebrow(legacy, "THE LEGACY")}
                title={<CmsTitleText text={cmsTitle(legacy, "Three years. Six majors.")} />}
                subtitle={cmsBodyText(legacy, "From Pakistan's first major Tekken showcase to a clean sweep in Seoul, every event Baaz has put on the map.")}
              />
              <Link
                href="/events"
                className="font-mono text-xs uppercase tracking-[0.25em] text-bone/70 hover:text-neon"
              >
                ALL EVENTS -&gt;
              </Link>
            </div>

            <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.slice(0, 3).map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          </div>
        </section>

        {/* PLAYERS PREVIEW / THE ROSTER */}
        <section className="relative overflow-hidden bg-gradient-to-b from-stone-950/80 via-stone-900/30 to-void/40 py-24 lg:py-32">
          {/* Cyber grid pattern & Ambient background glow */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(200,255,45,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(200,255,45,0.025)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-neon/6 rounded-full blur-[180px] pointer-events-none select-none" />

          <div className="relative mx-auto max-w-[1400px] px-5 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeader
                eyebrow={cmsEyebrow(roster, "THE ROSTER")}
                title={<CmsTitleText text={cmsTitle(roster, "The fighters.")} />}
                subtitle={cmsBodyText(roster, "Players who have played in Baaz tournaments - national champions, regional studs, and international guests.")}
              />
              {/* Non-clickable Coming Soon tag */}
              <div className="flex items-center gap-2 border border-stone-800 bg-stone-900/90 px-4 py-2 rounded-[2px] shadow-sm select-none">
                <span className="h-1.5 w-1.5 rounded-full bg-neon/70 animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-ash font-bold">
                  COMING SOON
                </span>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
              {featuredPlayers.slice(0, 4).map((p) => (
                <PlayerCard key={p.slug} player={p} sponsors={sponsors} />
              ))}
            </div>
          </div>
        </section>

        {/* WATCH LIVE */}
        <section className="relative overflow-hidden py-24 lg:py-32 bg-stone-950/40">
          <div className="relative mx-auto max-w-[1400px] px-5 lg:px-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon-dim mb-3 slash">
              Broadcast Channels
            </div>
            <h2 className="font-display text-3xl uppercase tracking-wider text-white mb-10">
              Watch Us Live
            </h2>

            <div className="grid gap-10 md:grid-cols-12 items-stretch">
              {/* Twitch Live Stream Column */}
              <div className="col-span-12 md:col-span-8 flex flex-col justify-between">
                <TwitchLiveSection />
              </div>

              {/* YouTube Card Column */}
              <div className="col-span-12 md:col-span-4 flex flex-col">
                {watchItems
                  .filter((item) => itemText(item, "label").toLowerCase().includes("youtube"))
                  .map((item) => (
                    <a
                      key={itemText(item, "label")}
                      href={itemText(item, "href") || "https://youtube.com/@baazgg"}
                      target="_blank"
                      rel="noopener"
                      className="group scanline relative flex flex-col justify-center items-center gap-6 overflow-hidden border border-stone-3 bg-stone/60 p-8 h-full rounded-md card-depth text-center"
                    >
                      <Youtube size={64} style={{ color: "#FF0000" }} className="transition-transform duration-300 group-hover:scale-105" />
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
                          {itemText(item, "label")}
                        </div>
                        <div className="display mt-2 text-3xl text-white group-hover:text-neon transition-colors">
                          {itemText(item, "title") || "-> BAAZGG"}
                        </div>
                        <p className="text-xs text-ash/80 mt-3 max-w-[200px] mx-auto leading-relaxed">
                          Watch tournament VODs, highlights, matches, and recap videos.
                        </p>
                      </div>
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function itemText(item: CmsSectionItem, key: string) {
  const value = item[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function heroSlidesFromCms(items: CmsSectionItem[]): HeroSlide[] | undefined {
  const slides: HeroSlide[] = [];

  items.forEach((item, index) => {
    const title = itemText(item, "title");
    const href = itemText(item, "href");
    const eyebrow = itemText(item, "label");
    if (!title && !eyebrow && !href) return;

    const imageKey = itemText(item, "imageKey");
    const imageUrl = itemText(item, "imageUrl");
    const slide: HeroSlide = {
      id: imageKey || `cms-hero-${index + 1}`,
      accent: heroAccent(itemText(item, "accent"), index),
      eyebrow: eyebrow || "BAAZ",
      meta: itemText(item, "meta"),
      title: title.split(/\n+/).filter(Boolean),
      description: itemText(item, "body"),
      cta: {
        label: itemText(item, "ctaLabel") || "Open",
        href: href || "/",
      },
    };

    if (imageKey) slide.imageKey = imageKey;
    if (imageUrl) slide.imageUrl = imageUrl;
    slides.push(slide);
  });

  return slides.length ? slides : undefined;
}

function heroAccent(value: string, index: number): HeroAccent {
  if (value === "neon" || value === "signal" || value === "blood") return value;
  return index % 3 === 1 ? "signal" : index % 3 === 2 ? "blood" : "neon";
}
