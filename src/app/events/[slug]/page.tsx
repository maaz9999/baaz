import { notFound } from "next/navigation";
import { getEventBySlug, getPlayers, getSponsors } from "@/lib/content";
import { EventDetailClient } from "@/components/EventDetailClient";
import { fetchEventDetails } from "@/lib/startgg";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return { title: event ? `${event.name} ${event.edition} — BAAZ GG` : "Event — BAAZ GG" };
}

export default async function EventDetail({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ game?: string }>;
}) {
  const { slug } = await params;
  const { game } = await searchParams;
  const [event, allPlayers, allSponsors] = await Promise.all([getEventBySlug(slug), getPlayers(), getSponsors()]);
  if (!event) notFound();

  // Fetch start.gg bracket data if Takedown 2026
  let startggData: Record<string, any> = {};
  if (slug === "takedown-2026") {
    const startggSlugs: Record<string, string> = {
      "tekken-8": "tournament/takedown-2026/event/tekken-8-twt-2026-challenger",
      "sf-6": "tournament/takedown-2026/event/street-fighter-6",
      "fatal-fury": "tournament/takedown-2026/event/fatal-fury-city-of-the-wolves-swc-2026-master-2",
      "fc-26": "tournament/takedown-2026/event/ea-sports-fc-26"
    };

    const promises = Object.entries(startggSlugs).map(async ([game, startggSlug]) => {
      try {
        const data = await fetchEventDetails(startggSlug);
        return { game, data };
      } catch {
        return { game, data: null };
      }
    });

    const results = await Promise.all(promises);
    results.forEach(({ game, data }) => {
      if (data) startggData[game] = data;
    });
  }

  return (
    <EventDetailClient
      event={event}
      allPlayers={allPlayers}
      allSponsors={allSponsors}
      startggData={startggData}
      selectedGameParam={game}
    />
  );
}
