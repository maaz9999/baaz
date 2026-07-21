import { EventCard } from "@/components/EventCard";
import { CmsPlacementSection } from "@/components/CmsPlacementSection";
import { getEvents, getPublicPage } from "@/lib/content";

export const metadata = { title: "Events - BAAZ GG" };

export default async function EventsPage() {
  const [events, page] = await Promise.all([getEvents(), getPublicPage("events")]);
  return (
    <section className="relative border-b border-stone-3/60 bg-stone/20 overflow-hidden pt-12 pb-24 lg:pt-16 lg:pb-32">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[-20%_top] opacity-40"
      >
        <source src="/assets/V1.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,255,45,0.03)_0%,transparent_70%)] bg-void/30" />

      <div className="relative mx-auto max-w-[1400px] px-5 lg:px-10">
        <CmsPlacementSection placements={page.placements} slotKey="featured" title="Featured events" className="px-0 pt-0 pb-16" />

        <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
