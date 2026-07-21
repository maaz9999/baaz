"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Trophy, Calendar, MapPin, Layers, Gamepad2, Youtube } from "lucide-react";
import type { BaazEvent, Player, Sponsor } from "@/lib/types";
import { getMediaUrl, findSponsorBySlug } from "@/lib/content";
import { formatDateRange } from "@/lib/format";
import { Top8Table } from "@/components/Top8Table";
import { SponsorTile } from "@/components/SponsorTile";
import { StatBlock } from "@/components/StatBlock";
import { Tilt3D } from "@/components/Tilt3D";
import { TournamentBracket } from "@/components/TournamentBracket";
import { NotableEntrants } from "@/components/NotableEntrants";
import { GauntletParticipants } from "@/components/GauntletParticipants";
import { TeamMatchShowcase } from "@/components/TeamMatchShowcase";
import { cn } from "@/lib/cn";
import { BracketTabs } from "@/components/BracketTabs";
import { RefreshButton } from "@/components/RefreshButton";
import { TwitchLiveSection } from "@/components/TwitchLiveSection";
import { FlagImage, getPlayerCountry } from "@/components/FlagImage";

const CASTER_DETAILS: Record<string, { country: string; realName?: string }> = {
  "INFANAX": { country: "PK" },
  "RIP": { country: "US", realName: "Reepal Parbhoo" },
  "SAMDDING": { country: "IE", realName: "Samuel Moylan" },
  "SILVERFOX": { country: "PK", realName: "Nosherwan Khan" },
  "SOUL DRAGGER": { country: "PK", realName: "Bawaqar Haider" },
  "SPAG": { country: "GB", realName: "Hassan Farooq" },
  "TASTY STEVE": { country: "US", realName: "Steven Scott" },
  "DNM": { country: "PK", realName: "Daniyal Nasir Mirza" },
  "SIKKIFY": { country: "PK", realName: "Sikander Khan" },
  "SIKKI": { country: "PK", realName: "Sikander Khan" },
  "BROWNMAN": { country: "NZ", realName: "Yuven Vincent" },
  "ISTI": { country: "PK" },
  "GERALD LEE": { country: "KR" },
  "MAJIN OBAMA": { country: "US", realName: "Jonathan Metoyer" },
  "CHOP": { country: "GB" },
  "AYANOHISAKO": { country: "PK", realName: "Onaiza" }
};

const GAME_METRICS: Record<string, {
  prizePool: { display: string; usd?: number };
  format: string;
  participants?: number;
  fullName: string;
  shortName: string;
  casters: string[];
}> = {
  "tekken-7": {
    prizePool: { display: "Rs 2,000,000", usd: 7062 },
    format: "Double-elimination",
    participants: 517,
    fullName: "Tekken 7",
    shortName: "T7",
    casters: ["Infanax", "Rip", "SamDDing", "SilverFox", "Soul Dragger", "Spag", "Tasty Steve"]
  },
  "kof-xv": {
    prizePool: { display: "Rs 250,000", usd: 882 },
    format: "Double-elimination",
    participants: 132,
    fullName: "The King of Fighters XV",
    shortName: "KoFXV",
    casters: ["SilverFox", "Soul Dragger"]
  },
  "tekken-8": {
    prizePool: { display: "Rs 2,500,000", usd: 8897 },
    format: "Double-elimination",
    participants: 554,
    fullName: "Tekken 8",
    shortName: "T8",
    casters: ["DNM", "Brownman", "Isti", "Sikki", "SilverFox", "Soul Dragger", "Spag"]
  },
  "fatal-fury": {
    prizePool: { display: "Rs 500,000", usd: 1779.36 },
    format: "Double-elimination",
    participants: 66,
    fullName: "Fatal Fury: COTW",
    shortName: "FF COTW",
    casters: ["SilverFox", "Soul Dragger"]
  },
  "sf-6": {
    prizePool: { display: "Split", usd: 0 },
    format: "Double-elimination",
    fullName: "Street Fighter 6",
    shortName: "SF6",
    casters: ["SilverFox", "Soul Dragger"]
  },
  "fc-26": {
    prizePool: { display: "Split", usd: 0 },
    format: "Double-elimination",
    fullName: "EA Sports FC 26",
    shortName: "FC26",
    casters: ["SilverFox", "Soul Dragger"]
  }
};

const GAME_CARDS_INFO: Record<string, { name: string; title: string; color: string; shadow: string; badge: string; border: string; details: string[] }> = {
  "tekken-7": {
    name: "TEKKEN 7",
    title: "Tekken 7 standings",
    color: "text-yellow-400",
    shadow: "hover:shadow-[0_0_35px_rgba(234,179,8,0.18)]",
    badge: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10",
    border: "border-yellow-500/25 hover:border-yellow-400",
    details: ["• PRIZE POOL: Rs 2,000,000", "• ENTRANTS: 517 Players", "• FORMAT: Double-Elimination"]
  },
  "kof-xv": {
    name: "KOF XV",
    title: "KOF XV standings",
    color: "text-blue-400",
    shadow: "hover:shadow-[0_0_35px_rgba(59,130,246,0.18)]",
    badge: "text-blue-400 border-blue-500/40 bg-blue-500/10",
    border: "border-blue-500/25 hover:border-blue-400",
    details: ["• PRIZE POOL: Rs 250,000", "• ENTRANTS: 132 Players", "• FORMAT: Double-Elimination"]
  },
  "tekken-8": {
    name: "TEKKEN 8",
    title: "Tekken 8",
    color: "text-neon",
    shadow: "hover:shadow-[0_0_35px_rgba(200,255,45,0.18)]",
    badge: "text-neon border-neon/40 bg-neon/10",
    border: "border-neon/25 hover:border-neon",
    details: ["• PRIZE POOL: Rs 2,500,000", "• ENTRANTS: 554 Players", "• FORMAT: Double-Elimination"]
  },
  "fatal-fury": {
    name: "FATAL FURY",
    title: "Fatal Fury",
    color: "text-orange-500",
    shadow: "hover:shadow-[0_0_35px_rgba(249,115,22,0.18)]",
    badge: "text-orange-500 border-orange-500/40 bg-orange-500/10",
    border: "border-orange-500/25 hover:border-orange-500",
    details: ["• PRIZE POOL: Rs 500,000", "• ENTRANTS: 66 Players", "• FORMAT: Double-Elimination"]
  },
  "sf-6": {
    name: "SF6",
    title: "Street Fighter 6",
    color: "text-cyan-400",
    shadow: "hover:shadow-[0_0_35px_rgba(34,211,238,0.18)]",
    badge: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10",
    border: "border-cyan-500/25 hover:border-cyan-400",
    details: ["• PRIZE POOL: Split Pool", "• FORMAT: Double-Elimination"]
  },
  "fc-26": {
    name: "FC26",
    title: "EA Sports FC 26",
    color: "text-emerald-400",
    shadow: "hover:shadow-[0_0_35px_rgba(52,211,153,0.18)]",
    badge: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
    border: "border-emerald-500/25 hover:border-emerald-400",
    details: ["• PRIZE POOL: Split Pool", "• FORMAT: Double-Elimination"]
  }
};

export function EventDetailClient({
  event,
  allPlayers,
  allSponsors,
  startggData,
  selectedGameParam
}: {
  event: BaazEvent;
  allPlayers: Player[];
  allSponsors: Sponsor[];
  startggData?: Record<string, any>;
  selectedGameParam?: string;
}) {
  const isMultiGame = event.games.length > 1;
  const router = useRouter();
  const selectedGame = selectedGameParam || (isMultiGame ? null : event.games[0]);
  const setSelectedGame = (game: string | null) => {
    if (game) {
      router.push(`/events/${event.slug}?game=${game}`, { scroll: false });
    } else {
      router.push(`/events/${event.slug}`, { scroll: false });
    }
  };

  const sponsors = event.sponsors
    .map((sponsorSlug) => findSponsorBySlug(sponsorSlug, allSponsors))
    .filter((sponsor): sponsor is NonNullable<typeof sponsor> => Boolean(sponsor));
  const isKof = selectedGame === "kof-xv";
  const teamSponsors = sponsors.filter((s) => {
    if (s.tier !== "team") return false;
    if (isKof) {
      return s.slug === "ashes" || s.slug === "cyber-ninjas";
    }
    return s.slug !== "cyber-ninjas";
  });
  const broadcastPartners = sponsors.filter((s) => s.tier === "broadcast" || s.tier === "partner");
  const otherSponsors = sponsors.filter((s) => !["team", "broadcast", "partner"].includes(s.tier));
  const poster = getMediaUrl(event.poster);

  // If KOF / Multi-game is selected, read metrics; fallback to event properties
  const metrics = selectedGame ? GAME_METRICS[selectedGame] : null;
  const currentPrize = event.slug === "takedown-2026" && selectedGame
    ? selectedGame === "tekken-8"
      ? { display: "Rs 2,500,000", usd: 8897 }
      : selectedGame === "fatal-fury"
      ? { display: "Rs 1,400,000", usd: 5000 }
      : selectedGame === "sf-6"
      ? { display: "Rs 500,000", usd: 1779 }
      : selectedGame === "fc-26"
      ? { display: "Rs 500,000", usd: 1779 }
      : { display: "TBA" }
    : metrics ? metrics.prizePool : event.prizePool;
  const currentParticipants = metrics ? metrics.participants : event.participants;
  const currentFormat = metrics ? metrics.format : event.format;
  const currentCasters = metrics ? metrics.casters : event.broadcastTalent;
  const currentTier = event.slug === "takedown-2026" && selectedGame
    ? selectedGame === "tekken-8"
      ? "Tekken World Tour 2026 — Challenger"
      : selectedGame === "fatal-fury"
      ? "SNK World Championship 2026 — Master 2"
      : selectedGame === "sf-6"
      ? "Street Fighter 6 National Major"
      : selectedGame === "fc-26"
      ? "EA Sports FC 26 National Major"
      : event.tier
    : event.tier;
  const currentTagline = event.slug === "takedown-2026" && selectedGame
    ? selectedGame === "tekken-8"
      ? "TWT 2026 Challenger. Pakistan's ultimate fighting stage for Tekken 8."
      : selectedGame === "fatal-fury"
      ? "SNK World Championship Master 2. Pakistan's ultimate fighting stage for City of the Wolves."
      : selectedGame === "sf-6"
      ? "Pakistan's ultimate fighting stage for Street Fighter 6."
      : selectedGame === "fc-26"
      ? "Pakistan's premier stage for EA Sports FC 26."
      : event.tagline
    : event.tagline;

  // 1. GAME SELECTION SCREEN
  if (isMultiGame && selectedGame === null) {
    return (
      <section className="relative min-h-[80vh] flex flex-col justify-center items-center py-20 px-5 z-10 bg-void overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <div className="absolute -left-1/4 -top-1/4 w-[600px] h-[600px] rounded-full bg-red-600/10 blur-[140px] pointer-events-none" />
          <div className="absolute -right-1/4 -bottom-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[140px] pointer-events-none" />
        </div>

        <div className="relative z-10 text-center max-w-2xl mb-12">
          {/* Back Button */}
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-bone/50 hover:text-neon transition-colors mb-6"
          >
            ← BACK TO ARCHIVE
          </Link>
          <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-neon mb-3 slash">MULTI-GAME MAJOR</div>
          <h1 className="display text-4xl md:text-6xl text-bone tracking-tight leading-none">
            {event.name} {event.edition}
          </h1>
          <p className="mt-4 text-xs md:text-sm text-ash leading-relaxed font-mono uppercase tracking-wider">
            Select a tournament game to view results, brackets, & standings.
          </p>
        </div>

        {/* Game Cards Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {event.games.map((gameSlug) => {
            const info = GAME_CARDS_INFO[gameSlug] || {
              name: gameSlug.toUpperCase(),
              title: `${gameSlug} standings`,
              color: "text-bone",
              shadow: "hover:shadow-[0_0_35px_rgba(255,255,255,0.1)]",
              badge: "text-bone border-stone-3/40 bg-stone/10",
              border: "border-stone-3/25 hover:border-stone-3",
              details: []
            };

            return (
              <Tilt3D key={gameSlug} max={6}>
                <button
                  onClick={() => setSelectedGame(gameSlug)}
                  className={`bracket-frame group relative flex flex-col justify-between w-full h-[280px] p-8 bg-gradient-to-br from-stone/5 via-stone-900/60 to-stone-950/90 text-left transition-all overflow-hidden cursor-pointer ${info.border} ${info.shadow}`}
                >
                  {/* Subtle color leak in bottom right corner on hover */}
                  <div className={`absolute bottom-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity blur-2xl pointer-events-none ${
                    gameSlug === "tekken-8"
                      ? "bg-neon"
                      : gameSlug === "fatal-fury"
                      ? "bg-orange-500"
                      : gameSlug === "sf-6"
                      ? "bg-cyan-500"
                      : gameSlug === "fc-26"
                      ? "bg-emerald-500"
                      : "bg-white"
                  }`} />
                  {gameSlug === "tekken-8" && event.slug === "takedown-2026" && (
                    <img
                      src="/assets/TWT.png"
                      alt="TWT"
                      className="absolute top-8 right-8 h-10 w-auto object-contain opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    />
                  )}
                  {gameSlug === "fatal-fury" && event.slug === "takedown-2026" && (
                    <img
                      src="/assets/SNK.png"
                      alt="SNK"
                      className="absolute top-8 right-8 h-8 w-auto object-contain opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    />
                  )}
                  <div>
                    <span className={`font-mono text-[8px] uppercase tracking-[0.3em] px-2.5 py-0.5 font-semibold ${info.badge}`}>
                      {info.name}
                    </span>
                    <h2 className={`display text-3xl md:text-4xl text-bone mt-4 group-hover:${info.color} transition-colors uppercase leading-none`}>
                      {info.title}
                    </h2>
                  </div>
                  <div className="font-mono text-xs text-ash/80 space-y-1">
                    {(event.slug === "takedown-2026"
                      ? gameSlug === "tekken-8"
                        ? [
                            "• PRIZE POOL: Rs 2,500,000",
                            "• ENTRANTS: TBA",
                            "• FORMAT: Double-Elimination"
                          ]
                        : gameSlug === "fatal-fury"
                        ? [
                            "• PRIZE POOL: Rs 1,400,000 ($5,000)",
                            "• ENTRANTS: TBA",
                            "• FORMAT: Double-Elimination"
                          ]
                        : gameSlug === "sf-6"
                        ? [
                            "• PRIZE POOL: Rs 500,000",
                            "• ENTRANTS: TBA",
                            "• FORMAT: Double-Elimination"
                          ]
                        : gameSlug === "fc-26"
                        ? [
                            "• PRIZE POOL: Rs 500,000",
                            "• ENTRANTS: TBA",
                            "• FORMAT: Double-Elimination"
                          ]
                        : [
                            "• PRIZE POOL: TBA",
                            "• ENTRANTS: TBA",
                            "• FORMAT: Double-Elimination"
                          ]
                      : info.details
                    ).map((d, idx) => (
                      <div key={idx}>{d}</div>
                    ))}
                  </div>
                </button>
              </Tilt3D>
            );
          })}
        </div>
      </section>
    );
  }

  // 2. DETAIL VIEW FOR SELECTED GAME
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-stone-3/60 bg-void z-10">
        {/* Ambient Color Bleed Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          <div className="absolute inset-0 light-leak opacity-40" />
          {poster && (
            <div
              className="absolute -right-20 -top-20 w-[600px] h-[600px] opacity-15 blur-[120px] rounded-full bg-no-repeat bg-cover bg-center"
              style={{ backgroundImage: `url(${poster})` }}
            />
          )}
        </div>

        <div className="relative z-10 mx-auto max-w-[1400px] px-5 py-16 lg:px-10 lg:py-24">
          <div className="flex flex-col gap-10 lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">
            
            {/* Left Column: Details */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              {/* Back Link Wrapper */}
              <div className="flex items-center gap-4 mb-6">
                {isMultiGame ? (
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="inline-flex items-center gap-1.5 font-mono text-xs md:text-sm uppercase tracking-[0.25em] text-bone/60 hover:text-neon transition-colors font-semibold cursor-pointer"
                  >
                    ← BACK TO GAMES SELECTOR
                  </button>
                ) : (
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-1.5 font-mono text-xs md:text-sm uppercase tracking-[0.25em] text-bone/60 hover:text-neon transition-colors font-semibold group/back"
                  >
                    <span className="transition-transform group-hover/back:-translate-x-1">←</span> BACK TO ARCHIVE
                  </Link>
                )}
              </div>

              {/* Game Switcher Tabs for Multi-game Events */}
              {isMultiGame && (
                <div className="mb-6 flex gap-2">
                  {event.games.map((g) => {
                    const info = GAME_METRICS[g];
                    const active = selectedGame === g;
                    return (
                      <button
                        key={g}
                        onClick={() => setSelectedGame(g)}
                        className={`font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border transition-all cursor-pointer ${
                          active
                            ? "bg-neon/10 border-neon text-neon font-bold"
                            : "border-stone-3/40 bg-stone/20 text-bone/50 hover:border-stone-3/80 hover:text-bone"
                        }`}
                      >
                        {info?.shortName || g}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.3em] text-neon mb-5">
                {currentTier && (
                  <span className="border border-neon/50 bg-neon/10 px-2 py-0.5 font-semibold">
                    {currentTier}
                  </span>
                )}
                <span className="slash">{event.edition}</span>
                {metrics && (
                  <>
                    <span className="text-ash">•</span>
                    <span className="text-bone font-semibold">{metrics.fullName}</span>
                  </>
                )}
              </div>

              <h1 className="display text-5xl md:text-7xl lg:text-8xl text-bone tracking-tight leading-[0.95]">
                {event.name}
              </h1>

              {currentTagline && (
                <p className="mt-6 max-w-xl text-base md:text-lg text-ash leading-relaxed">
                  {currentTagline}
                </p>
              )}

              {/* Status Button */}
              {event.status === "upcoming" && (
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {event.registrationClosed ? (
                    <span className="inline-flex items-center gap-1.5 border border-stone-3/45 bg-stone/5 px-4.5 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
                      <span className="h-1.5 w-1.5 rounded-full bg-ash" />
                      Registration Closed
                    </span>
                  ) : (
                    <a
                      href={event.registrationUrl || "https://ticketwala.pk/event/takedown-2026-baaz-6253"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 border border-neon/60 bg-neon/10 hover:bg-neon hover:text-void px-4.5 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neon font-bold transition-all duration-300 rounded-[2px]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse" />
                      Registration Open — Buy Tickets
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Poster */}
            {poster && (
              <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
                <Tilt3D max={4}>
                  <div className="bracket-frame card-depth overflow-hidden border border-stone-3/50 bg-stone/30 p-2.5 transition-all duration-300 hover:border-neon/40 hover:shadow-[0_0_30px_rgba(200,255,45,0.08)]">
                    <img src={poster} alt={event.name} className="aspect-video w-full object-cover rounded-[1px]" />
                  </div>
                </Tilt3D>
              </div>
            )}
          </div>

          {/* Redesigned Metrics Grid */}
          {(() => {
            const showPrizePool = !event.slug.includes("stage") && event.slug !== "ptl-2026" && currentPrize?.display && currentPrize.display !== "TBA";
            return (
              <div className={cn("mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2", showPrizePool ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
                <StatBlock
                  label="DATES"
                  value={formatDateRange(event.startDate, event.endDate)}
                  sub="Event Schedule"
                />
                <StatBlock
                  label="VENUE"
                  value={event.venue}
                  sub={`${event.city}, ${event.country}`}
                />
                {showPrizePool && (
                  <StatBlock
                    label="PRIZE POOL"
                    value={currentPrize.display}
                    sub={currentPrize.usd ? `≃ $${currentPrize.usd.toLocaleString()} USD` : "Regional Pool"}
                  />
                )}
                <StatBlock
                  label="FORMAT"
                  value={currentFormat}
                  sub={currentParticipants ? `${currentParticipants} ENTRANTS` : "Tournament Bracket"}
                />
              </div>
            );
          })()}
        </div>
      </section>

      {/* TOP 8 */}
      {selectedGame && event.top8 && event.top8[selectedGame as never] && (
        <section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10">
          <div className="mb-8 flex items-end justify-between border-b border-stone-3/20 pb-4">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-neon slash">RESULTS</div>
              <h2 className="display mt-2.5 text-3xl md:text-4xl text-bone">
                Top 8 standings · {metrics?.fullName || selectedGame}
              </h2>
            </div>
          </div>
          <Top8Table entries={event.top8[selectedGame as never] ?? []} players={allPlayers} sponsors={allSponsors} />
        </section>
      )}

      {/* TOURNAMENT BRACKET / SHOWCASE */}
      {selectedGame && (selectedGame === "tekken-7" || selectedGame === "kof-xv" || selectedGame === "tekken-8" || selectedGame === "fatal-fury" || selectedGame === "sf-6" || selectedGame === "fc-26") && (
        <section className="mx-auto max-w-[1400px] px-5 pb-20 lg:px-10">
          <div className="mb-8 flex items-end justify-between border-b border-stone-3/20 pb-4">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-neon slash">
                {event.slug === "pak-vs-korea-2025" ? "MATCH DETAILS" : "BRACKET"}
              </div>
              <h2 className="display mt-2.5 text-3xl md:text-4xl text-bone">
                {event.slug === "takedown-2026" ? "Live Bracket & Standings" : event.slug === "pak-vs-korea-2025" ? "Team Showmatch Results" : "Tournament Finals Bracket"}
              </h2>
            </div>
            {event.slug === "takedown-2026" && (
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-ash uppercase tracking-widest">Live Updates</span>
                <RefreshButton />
              </div>
            )}
          </div>
          {event.slug === "pak-vs-korea-2025" ? (
            <TeamMatchShowcase />
          ) : (event.slug === "takedown-2026" || event.slug.startsWith("ptl-stage-")) ? (
            (() => {
              const gameData = startggData?.[selectedGame];
              const standings = gameData?.standings?.nodes || [];
              const sets = gameData?.sets?.nodes || [];

              if (standings.length === 0 && sets.length === 0) {
                return (
                  <div className="border border-dashed border-stone-3/60 p-16 text-center rounded-sm max-w-2xl mx-auto flex flex-col items-center justify-center bg-stone/20">
                    <Gamepad2 size={40} className="text-neon mb-4 animate-pulse" />
                    <h3 className="font-display text-2xl uppercase tracking-wider text-white mb-2">Coming Soon</h3>
                    <p className="text-sm text-ash leading-relaxed">
                      Brackets, live matches, and standings for {GAME_METRICS[selectedGame]?.fullName || selectedGame} will update here dynamically once the tournament begins.
                    </p>
                  </div>
                );
              }

              return (
                <div className="grid gap-12 lg:grid-cols-12 items-start">
                  {/* Standings */}
                  <div className="lg:col-span-4">
                    <h3 className="flex items-center gap-2.5 font-display text-lg uppercase tracking-wider text-white border-b border-stone-3/30 pb-4 mb-6">
                      <Trophy size={16} className="text-neon" /> Standings
                    </h3>

                    {standings.length > 0 ? (
                      <div className="flex flex-col gap-2.5">
                        {standings.map((node: any, i: number) => {
                          const isFirst = node.placement === 1;
                          const rankStr = String(node.placement).padStart(2, "0");
                          const rankBg = node.placement === 1
                            ? "bg-neon text-void font-black shadow-[0_0_10px_rgba(200,255,45,0.2)]"
                            : node.placement === 2
                            ? "bg-signal text-void font-bold"
                            : node.placement === 3
                            ? "bg-blood text-void font-bold"
                            : "bg-stone-3/20 text-bone/60 border border-stone-3/40";

                          const name = node.entrant?.name 
                            ? node.entrant.name.split("|").pop().trim().toUpperCase() 
                            : "TBA";

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
                                <FlagImage country={getPlayerCountry(name)} />
                                <span className="font-mono text-sm tracking-wider uppercase text-white truncate">
                                  {name}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="border border-dashed border-stone-3/60 p-8 text-center rounded-sm font-mono text-[10px] uppercase tracking-wider text-ash">
                        No standings data available yet. Brackets will load once tournament matches begin.
                      </div>
                    )}
                  </div>

                  {/* Sets Bracket */}
                  <div className="lg:col-span-8">
                    <h3 className="flex items-center gap-2.5 font-display text-lg uppercase tracking-wider text-white border-b border-stone-3/30 pb-4 mb-6">
                      <Gamepad2 size={16} className="text-neon" /> Live Matches & Brackets
                    </h3>
                    <BracketTabs sets={sets} />
                  </div>
                </div>
              );
            })()
          ) : (
            <TournamentBracket game={selectedGame} eventSlug={event.slug} />
          )}
        </section>
      )}

      {/* WATCH LIVE (FOR TAKEDOWN 2026 EVENT CHANNELS) */}
      {event.slug === "takedown-2026" && selectedGame && (
        <section className="border-t border-stone-3/30 bg-void">
          <div className="mx-auto max-w-[1400px] px-5 py-24 lg:px-10 lg:py-32">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon mb-3 slash">
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
                <a
                  href="https://youtube.com/@baazgg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group scanline relative flex flex-col justify-center items-center gap-6 overflow-hidden border border-stone-3 bg-stone/60 p-8 h-full rounded-md card-depth text-center min-h-[300px]"
                >
                  <Youtube size={64} style={{ color: "#FF0000" }} className="transition-transform duration-300 group-hover:scale-105" />
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash font-bold">
                      YOUTUBE
                    </div>
                    <div className="display mt-2 text-3xl text-white group-hover:text-neon transition-colors">
                      -&gt; BAAZGG
                    </div>
                    <p className="text-xs text-ash/80 mt-3 max-w-[200px] mx-auto leading-relaxed font-light">
                      Watch tournament VODs, highlights, matches, and recap videos.
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
