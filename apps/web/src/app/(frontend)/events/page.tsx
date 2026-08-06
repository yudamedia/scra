import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { eventTypeLabels } from "@/lib/format";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar01Icon, Location01Icon } from "@hugeicons/core-free-icons";

export const revalidate = 60;

export default async function EventsIndexPage() {
  const payload = await getPayloadClient();
  const { docs: events } = await payload.find({
    collection: "events",
    limit: 200,
    sort: "startDate",
    depth: 1,
  });

  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.startDate).getTime() >= now);
  const past = events
    .filter((e) => new Date(e.startDate).getTime() < now)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  function EventCard({ event }: { event: (typeof events)[number] }) {
    const date = new Date(event.startDate);
    return (
      <Link
        href={`/events/${event.id}`}
        className="flex gap-5 bg-card rounded-lg shadow-sm p-6 hover:-translate-y-0.5 hover:shadow-md transition-all"
      >
        <div className="flex flex-col items-center justify-center bg-muted rounded-md w-16 h-16 shrink-0">
          <span className="text-xs font-semibold uppercase text-secondary">
            {date.toLocaleDateString("en-GB", { month: "short" })}
          </span>
          <span className="font-heading font-bold text-xl text-primary">
            {date.getDate()}
          </span>
        </div>
        <div className="min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wide text-secondary">
            {eventTypeLabels[String(event.eventType)] ?? String(event.eventType)}
          </span>
          <h3 className="text-primary text-lg mt-1 mb-1">{event.title}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon icon={Calendar01Icon} size={15} strokeWidth={1.8} />
              {date.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Location01Icon} size={15} strokeWidth={1.8} />
                {event.location}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <>
      <section
        className="text-white py-16 md:py-20"
        style={{
          background:
            "linear-gradient(rgba(13,43,91,.72), rgba(7,28,61,.85)), url(/hero/issues.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto w-[min(1280px,92%)]">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80 mb-2">
            Events
          </p>
          <h1 className="text-white mb-4">What&apos;s Happening on the South Coast</h1>
          <p className="max-w-2xl text-white/90 text-lg">
            Public participation meetings, community events, environmental
            activities and committee meetings from SCRA.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-[min(1280px,92%)]">
          {events.length === 0 ? (
            <div className="bg-card rounded-lg shadow-sm p-12 text-center max-w-xl mx-auto">
              <HugeiconsIcon
                icon={Calendar01Icon}
                size={36}
                strokeWidth={1.5}
                className="text-secondary mx-auto mb-4"
              />
              <h2 className="text-xl mb-2">No Events Scheduled Yet</h2>
              <p className="text-muted-foreground">
                There&apos;s nothing on the calendar right now — check back
                soon, or visit our{" "}
                <Link href="/news" className="text-secondary hover:text-primary font-medium">
                  Newsroom
                </Link>{" "}
                for the latest updates.
              </p>
            </div>
          ) : (
            <div className="space-y-14">
              {upcoming.length > 0 && (
                <div>
                  <h2 className="mb-6">Upcoming</h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {upcoming.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              )}
              {past.length > 0 && (
                <div>
                  <h2 className="mb-6">Past Events</h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {past.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
