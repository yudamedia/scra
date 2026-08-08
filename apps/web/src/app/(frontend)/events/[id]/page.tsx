import { notFound } from "next/navigation";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getPayloadClient } from "@/lib/payload";
import { eventTypeLabels } from "@/lib/format";
import { getPortalSession } from "@/lib/portal";
import { isMembershipActive } from "@/lib/memberships";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar01Icon, Location01Icon, LockIcon } from "@hugeicons/core-free-icons";

export const revalidate = 60;

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payload = await getPayloadClient();

  const event = await payload.findByID({
    collection: "events",
    id,
    depth: 1,
  }).catch(() => null);

  if (!event) notFound();

  const { membership } = await getPortalSession();
  const locked = event.visibility === "membersOnly" && !(membership && isMembershipActive(membership));
  const area = event.area && typeof event.area === "object" ? event.area : null;
  const image = event.image && typeof event.image === "object" ? event.image : null;
  const start = new Date(event.startDate);
  const end = event.endDate ? new Date(event.endDate) : null;

  return (
    <>
      <section
        className={`py-16 md:py-24 ${image?.url ? "text-white" : "bg-muted"}`}
        style={
          image?.url
            ? {
                background: `linear-gradient(rgba(13,43,91,.65), rgba(7,28,61,.8)), url(${image.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="mx-auto w-[min(1280px,92%)] max-w-3xl">
          <Link
            href="/events"
            className={`text-sm transition-colors ${image?.url ? "text-white/80 hover:text-white" : "text-secondary hover:text-primary"}`}
          >
            ← All Events
          </Link>
          <span
            className={`block text-xs font-semibold uppercase tracking-wide mt-4 mb-2 ${image?.url ? "text-white/80" : "text-secondary"}`}
          >
            {eventTypeLabels[String(event.eventType)] ?? String(event.eventType)}
          </span>
          <h1 className={image?.url ? "text-white" : ""}>{event.title}</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-[min(1280px,92%)] max-w-3xl">
          <div className="flex flex-wrap gap-6 mb-10 text-sm">
            <span className="flex items-center gap-2 text-foreground">
              <HugeiconsIcon icon={Calendar01Icon} size={18} strokeWidth={1.8} className="text-secondary" />
              {start.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {" · "}
              {start.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
              {end &&
                ` – ${end.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`}
            </span>
            {event.location && (
              <span className="flex items-center gap-2 text-foreground">
                <HugeiconsIcon icon={Location01Icon} size={18} strokeWidth={1.8} className="text-secondary" />
                {event.location}
              </span>
            )}
          </div>

          {locked ? (
            <div className="bg-muted rounded-lg p-8 text-center">
              <HugeiconsIcon icon={LockIcon} size={24} strokeWidth={1.8} className="text-secondary mx-auto mb-3" />
              <h2 className="text-lg mb-2">Members Only</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Full details for this event are available to active SCRA members.
              </p>
              <Link
                href="/portal/login"
                className="inline-flex items-center justify-center rounded-md bg-primary text-white font-semibold text-sm px-5 py-2.5 hover:bg-primary-dark transition-colors"
              >
                Member Login
              </Link>
            </div>
          ) : (
            event.description && (
              <div className="prose max-w-none text-foreground [&_p]:mb-4 [&_p]:leading-relaxed">
                <RichText data={event.description} />
              </div>
            )
          )}

          {area && (
            <p className="mt-8 text-sm text-muted-foreground">
              Located in{" "}
              <Link href={`/areas/${area.slug}`} className="text-secondary hover:text-primary font-medium">
                {area.name}
              </Link>
            </p>
          )}
        </div>
      </section>
    </>
  );
}
