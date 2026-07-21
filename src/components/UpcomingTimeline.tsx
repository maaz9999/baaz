import Link from "next/link";
import { Calendar, MapPin, Trophy, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { formatDateRange } from "@/lib/format";
import { getGameBySlug, getMediaUrl } from "@/lib/content";
import type { BaazEvent } from "@/lib/types";

export function UpcomingTimeline({ events }: { events: BaazEvent[] }) {
  const upcomingEvents = events
    .filter((e) => e.status === "upcoming")
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  if (upcomingEvents.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-void/60 via-stone-950/40 to-stone-950/20 py-20 lg:py-28">

      {/* Cyber grid pattern & Ambient background glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(200,255,45,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(200,255,45,0.025)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-neon/8 rounded-full blur-[160px] pointer-events-none select-none" />

      <div className="relative mx-auto max-w-[1400px] px-5 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-neon slash font-bold">
              <Sparkles size={12} className="text-neon animate-spin-slow" />
              <span>ACTIVE SCHEDULE</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tighter text-white">
              Upcoming Tournaments
            </h2>
          </div>
          <div className="flex items-center gap-3 bg-neon/10 border border-neon/40 px-4 py-2 rounded-[2px]">
            <span className="h-2 w-2 rounded-full bg-neon animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-neon font-bold">Registration Live</span>
          </div>
        </div>

        {/* Major Feature Cards */}
        <div className="space-y-8">
          {upcomingEvents.map((event) => {
            const poster = getMediaUrl(event.poster);
            const gamesList = event.games.map((g) => {
              const info = getGameBySlug(g);
              return { slug: g, name: info?.short || info?.name || g.toUpperCase() };
            });

            return (
              <div
                key={event.slug}
                className="group relative border border-neon/50 bg-gradient-to-br from-stone-900/60 via-stone-950/90 to-stone/30 backdrop-blur-md rounded-[2px] p-6 lg:p-8 transition-all duration-500 hover:border-neon hover:shadow-[0_0_60px_rgba(200,255,45,0.2)] shadow-[0_0_35px_rgba(200,255,45,0.1)] overflow-hidden card-depth"
              >
                {/* Top Glowing Bar - Permanent */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-neon shadow-[0_0_14px_rgba(200,255,45,0.9)]" />

                {/* Left & Right Side Glowing Accent Lines - Permanent */}
                <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-neon via-neon/40 to-transparent shadow-[0_0_10px_rgba(200,255,45,0.8)]" />
                <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-neon via-neon/40 to-transparent shadow-[0_0_10px_rgba(200,255,45,0.8)]" />

                {/* Left & Right Side Ambient Glow Leaks - Permanent */}
                <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-48 h-48 bg-neon/15 rounded-full blur-3xl opacity-75 pointer-events-none" />
                <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-48 h-48 bg-neon/15 rounded-full blur-3xl opacity-75 pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-neon/20 rounded-full blur-3xl opacity-80 pointer-events-none" />

                <div className="grid gap-8 lg:grid-cols-12 items-center">
                  {/* Left Column: Poster Image */}
                  {poster && (
                    <div className="lg:col-span-5 w-full">
                      <Link href={`/events/${event.slug}`} className="block group/poster overflow-hidden rounded-[2px] border border-stone-3/50 bg-stone/40 relative aspect-[16/10] md:aspect-video lg:aspect-[16/10]">
                        <img
                          src={poster}
                          alt={event.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover/poster:scale-105 group-hover/poster:brightness-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-60" />
                        
                        {/* Overlay Badge */}
                        <div className="absolute top-3 left-3 bg-void/90 border border-stone-3/60 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-bone/90 backdrop-blur-md">
                          {event.edition} Major
                        </div>
                      </Link>
                    </div>
                  )}

                  {/* Right Column: Event Info */}
                  <div className={poster ? "lg:col-span-7 flex flex-col justify-between h-full" : "lg:col-span-12 flex flex-col justify-between h-full"}>
                    <div>
                      {/* Status Pills & Tier */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        {event.tier ? (
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1 border border-neon/40 bg-neon/10 text-neon font-semibold rounded-[2px]">
                            {event.tier}
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1 border border-stone-3/40 bg-stone/20 text-ash rounded-[2px]">
                            {event.edition} Edition
                          </span>
                        )}

                        <div className="flex items-center gap-2 font-mono text-[9px]">
                          <span className="chip chip-neon">UPCOMING</span>
                          {event.participants ? (
                            <span className="chip text-neon border-neon/35">{event.participants} ENTRANTS</span>
                          ) : event.registrationClosed ? (
                            <span className="chip text-blood border-blood/35">REGISTRATION CLOSED</span>
                          ) : (
                            <span className="chip text-neon border-neon/35">REGISTRATION OPEN</span>
                          )}
                        </div>
                      </div>

                      {/* Main Title */}
                      <Link href={`/events/${event.slug}`} className="group/title block">
                        <h3 className="display text-4xl md:text-5xl lg:text-6xl text-white tracking-tight uppercase group-hover/title:text-neon transition-colors leading-[0.95] mb-3">
                          {event.name}
                        </h3>
                      </Link>

                      {/* Tagline */}
                      {event.tagline && (
                        <p className="text-sm md:text-base text-ash leading-relaxed font-light mb-6 max-w-2xl">
                          {event.tagline}
                        </p>
                      )}

                      {/* Featured Game Badges */}
                      <div className="mb-6">
                        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-ash/60 mb-2 font-bold">Featured Titles</div>
                        <div className="flex flex-wrap gap-2">
                          {gamesList.map((g) => (
                            <span
                              key={g.slug}
                              className="font-mono text-[10px] uppercase tracking-wider px-3 py-1 border border-stone-3/50 bg-stone/30 text-bone/90 group-hover:border-stone-3/80 transition-colors rounded-[2px]"
                            >
                              {g.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Metadata Grid & CTAs */}
                    <div className="pt-6 border-t border-stone-3/20">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 font-mono text-[11px] uppercase tracking-wider">
                        <div className="space-y-1">
                          <span className="text-[9px] text-ash/60 block font-bold">PRIZE POOL</span>
                          <span className="text-neon font-display text-xl md:text-2xl leading-none font-bold block">
                            {event.prizePool.display}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] text-ash/60 block font-bold">SCHEDULE DATE</span>
                          <span className="text-white block font-semibold">
                            {formatDateRange(event.startDate, event.endDate)}
                          </span>
                        </div>
                        <div className="space-y-1 col-span-2 sm:col-span-1">
                          <span className="text-[9px] text-ash/60 block font-bold">VENUE / LOCATION</span>
                          <span className="text-white block font-semibold truncate">
                            {event.venue}, {event.city}
                          </span>
                        </div>
                      </div>

                      {/* Action CTAs */}
                      <div className="flex flex-wrap gap-4">
                        {!event.registrationClosed && (
                          <a
                            href={event.registrationUrl || event.liquipedia || "https://ticketwala.pk/event/takedown-2026-baaz-6253"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-neon text-void hover:bg-white px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 rounded-[2px] shadow-[0_0_25px_rgba(200,255,45,0.2)] group/btn"
                          >
                            <span className="h-2 w-2 rounded-full bg-void animate-ping" />
                            <span>Register Now</span>
                            <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                          </a>
                        )}

                        <Link
                          href={`/events/${event.slug}`}
                          className="inline-flex items-center gap-2 border border-stone-3/60 bg-stone/20 hover:border-neon hover:text-neon px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-bone font-semibold transition-all duration-300 rounded-[2px]"
                        >
                          <span>Event Details</span>
                          <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
