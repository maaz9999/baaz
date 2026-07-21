import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDateRange } from "@/lib/format";
import { getGameBySlug, getMediaUrl } from "@/lib/content";
import type { BaazEvent } from "@/lib/types";
import { Tilt3D } from "@/components/Tilt3D";

export function EventCard({ event }: { event: BaazEvent }) {
  const gameNames = event.games.map((g) => getGameBySlug(g)?.short).filter(Boolean).join(" / ");
  const poster = getMediaUrl(event.poster);
  return (
    <Tilt3D max={7}>
     <Link
      href={`/events/${event.slug}`}
      className="card-depth group block h-full scanline border border-neon bg-stone/60 p-5 transition-colors"
    >
      {poster && (
        <img src={poster} alt={event.name} className="mb-4 aspect-[2.1/1] w-full border border-stone-3 object-cover transition-transform duration-300 group-hover:scale-[1.01]" />
      )}
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
        <span>
          {event.edition} · {gameNames}
        </span>
        {event.status === "upcoming" && <span className="chip chip-neon">UPCOMING</span>}
        {event.status === "live" && <span className="chip chip-live">LIVE</span>}
      </div>

      <h3 className="display mt-2 text-2xl text-bone group-hover:text-neon md:text-3xl">
        {event.name}
      </h3>

      {event.tagline && <p className="mt-2 text-xs text-ash line-clamp-1">{event.tagline}</p>}

      <div className="mt-4 grid grid-cols-3 gap-4 border-t border-stone-3/60 pt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-bone/80">
        <div>
          <div className="text-ash">DATE</div>
          <div className="mt-1">{formatDateRange(event.startDate, event.endDate)}</div>
        </div>
        <div>
          <div className="text-ash">VENUE</div>
          <div className="mt-1">{event.city}</div>
        </div>
        <div>
          <div className="text-ash">PRIZE</div>
          <div className="mt-1">{event.prizePool.display}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-bone/60 group-hover:text-neon">
        <span className={event.registrationClosed ? "text-blood font-semibold" : "text-neon font-semibold"}>
          {event.participants
            ? `${event.participants} ENTRANTS`
            : event.registrationClosed
            ? "REGISTRATION CLOSED"
            : event.status === "upcoming"
            ? "REGISTRATION OPEN"
            : "INVITATIONAL"}
        </span>
        <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </Link>
    </Tilt3D>
  );
}
