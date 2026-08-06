import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { IssueCard } from "@/components/issue-card";
import { getDefaultThumbnail } from "@/lib/default-thumbnail";
import { eventTypeLabels } from "@/lib/format";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InformationCircleIcon,
  Shield01Icon,
  NewsIcon,
  Calendar01Icon,
  Folder01Icon,
  Call02Icon,
  RoadIcon,
  Shield02Icon,
  DropletIcon,
  Leaf01Icon,
  Building01Icon,
  Recycle01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";

export const revalidate = 60;

const quickLinks = [
  { href: "/about", label: "About SCRA", sub: "Who we are", icon: InformationCircleIcon },
  { href: "/committees", label: "Our Committees", sub: "Leadership & teams", icon: Shield01Icon },
  { href: "/news", label: "Newsroom", sub: "Latest news", icon: NewsIcon },
  { href: "/events", label: "Events", sub: "What's happening", icon: Calendar01Icon },
  { href: "/documents", label: "Knowledge Centre", sub: "Reports & documents", icon: Folder01Icon },
  { href: "/contact", label: "Contact Us", sub: "Get in touch", icon: Call02Icon },
];

const issueCategoryLinks = [
  { category: "roads-infrastructure", label: "Roads & Infrastructure", desc: "Safe, reliable and well-maintained roads.", icon: RoadIcon },
  { category: "security", label: "Security", desc: "Working towards safe communities for all.", icon: Shield02Icon },
  { category: "water-supply", label: "Water Supply", desc: "Reliable and sustainable water for all residents.", icon: DropletIcon },
  { category: "environment", label: "Environment", desc: "Protecting our natural heritage and coastline.", icon: Leaf01Icon },
  { category: "planning-development", label: "Planning & Development", desc: "Responsible development for a sustainable future.", icon: Building01Icon },
  { category: "waste-management", label: "Waste Management", desc: "Cleaner communities through better systems.", icon: Recycle01Icon },
];

export default async function HomePage() {
  const payload = await getPayloadClient();
  const [{ docs: posts }, { docs: areas }, { docs: upcomingEvents }, defaultThumbnail] =
    await Promise.all([
      payload.find({ collection: "posts", limit: 3, sort: "-publishedDate", depth: 1 }),
      payload.find({ collection: "areas", limit: 9, sort: "name" }),
      payload.find({
        collection: "events",
        limit: 50,
        sort: "startDate",
        depth: 0,
      }),
      getDefaultThumbnail(),
    ]);

  const { docs: issues } = await payload.find({
    collection: "issues",
    limit: 3,
    sort: "-updatedAt",
    depth: 1,
  });

  const now = Date.now();
  const events = upcomingEvents
    .filter((e) => new Date(e.startDate).getTime() >= now)
    .slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section
        className="relative text-white pt-24 pb-40 md:pt-32 md:pb-52"
        style={{
          background:
            "linear-gradient(rgba(13,43,91,.72), rgba(7,28,61,.85)), url(/hero/homepage.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto w-[min(1280px,92%)]">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl mb-6 max-w-3xl">
            Working Together for a Better South Coast
          </h1>
          <p className="text-white/90 text-lg max-w-xl mb-8">
            Representing residents, property owners and businesses from
            Likoni to Lunga Lunga since 1983.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/membership"
              className="inline-flex items-center justify-center rounded-md bg-white text-primary font-semibold px-7 py-3.5 hover:bg-white/90 transition-colors"
            >
              Become a Member
            </Link>
            <Link
              href="/issues"
              className="inline-flex items-center justify-center rounded-md border border-white/60 text-white font-semibold px-7 py-3.5 hover:bg-white/10 transition-colors"
            >
              View Current Issues
            </Link>
            <Link
              href="/news"
              className="inline-flex items-center justify-center rounded-md border border-white/60 text-white font-semibold px-7 py-3.5 hover:bg-white/10 transition-colors"
            >
              Latest Updates →
            </Link>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="relative">
        <div className="mx-auto w-[min(1280px,92%)] -mt-20 md:-mt-24 relative z-10">
          <div className="bg-card rounded-xl shadow-lg p-6 md:p-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center text-center gap-2 group"
              >
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                  <HugeiconsIcon icon={link.icon} size={26} strokeWidth={1.8} />
                </span>
                <span className="text-sm font-semibold text-primary">{link.label}</span>
                <span className="text-xs text-muted-foreground hidden sm:block">{link.sub}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* News & updates */}
      {posts.length > 0 && (
        <section className="py-20 md:py-24">
          <div className="mx-auto w-[min(1280px,92%)]">
            <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-secondary mb-2">
                  News &amp; Updates
                </p>
                <h2>Stay Informed. Stay Involved.</h2>
              </div>
              <Link href="/news" className="text-secondary font-medium hover:text-primary transition-colors">
                View all news →
              </Link>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const img =
                  post.featuredImage && typeof post.featuredImage === "object"
                    ? post.featuredImage
                    : null;
                return (
                  <Link
                    key={post.id}
                    href={`/news/${post.slug}`}
                    className="block bg-card rounded-lg shadow overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all"
                  >
                    {(img?.url ?? defaultThumbnail?.url) && (
                      <img
                        src={img?.url ?? defaultThumbnail?.url}
                        alt={img?.alt ?? defaultThumbnail?.alt ?? ""}
                        className="w-full h-44 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-primary text-lg mb-2">{post.title}</h3>
                      {post.excerpt && (
                        <p className="text-muted-foreground text-sm mb-3">{post.excerpt}</p>
                      )}
                      <span className="text-xs font-semibold text-muted-foreground">
                        {new Date(post.publishedDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Issues we're working on */}
      <section className="py-20 md:py-24 bg-muted">
        <div className="mx-auto w-[min(1280px,92%)]">
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-secondary mb-2">
                Issues We Are Working On
              </p>
              <h2>Representing Your Interests on the Issues That Matter.</h2>
            </div>
            <Link
              href="/issues"
              className="inline-flex items-center justify-center rounded-md bg-primary text-white font-semibold text-sm px-5 py-2.5 hover:bg-primary-dark transition-colors"
            >
              View all issues →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {issueCategoryLinks.map((cat) => (
              <Link
                key={cat.category}
                href={`/issues?category=${cat.category}`}
                className="bg-card rounded-lg shadow-sm p-5 hover:-translate-y-1 hover:shadow-md transition-all"
              >
                <HugeiconsIcon icon={cat.icon} size={24} strokeWidth={1.8} className="text-secondary mb-3" />
                <h3 className="text-primary text-sm mb-1">{cat.label}</h3>
                <p className="text-muted-foreground text-xs">{cat.desc}</p>
              </Link>
            ))}
          </div>

          {issues.length > 0 && (
            <div className="grid gap-8 md:grid-cols-3 mt-12">
              {issues.map((issue) => {
                const img =
                  issue.featuredImage && typeof issue.featuredImage === "object"
                    ? issue.featuredImage
                    : null;
                return (
                  <IssueCard
                    key={issue.id}
                    slug={String(issue.slug)}
                    title={issue.title}
                    category={String(issue.category)}
                    status={String(issue.status)}
                    imageUrl={img?.url ?? defaultThumbnail?.url}
                    imageAlt={img?.alt ?? defaultThumbnail?.alt}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Membership CTA */}
      <section className="py-20 bg-primary text-white overflow-hidden relative">
        <div className="mx-auto w-[min(1280px,92%)] grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-white mb-4">Stronger Together. Become a Member Today.</h2>
            <p className="text-white/80 text-lg mb-8 max-w-md">
              Your membership supports our advocacy, strengthens our voice
              and helps build a better South Coast.
            </p>
            <Link
              href="/membership"
              className="inline-flex items-center justify-center rounded-md bg-white text-primary font-semibold px-7 py-3.5 hover:bg-white/90 transition-colors"
            >
              Join / Renew Membership →
            </Link>
          </div>
          <div className="grid gap-6">
            <div className="flex items-start gap-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/15 shrink-0">
                <HugeiconsIcon icon={NewsIcon} size={18} strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="text-white text-base mb-0.5">Have Your Voice Heard</h3>
                <p className="text-white/70 text-sm">Influence decisions that impact our communities.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/15 shrink-0">
                <HugeiconsIcon icon={Folder01Icon} size={18} strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="text-white text-base mb-0.5">Access Information</h3>
                <p className="text-white/70 text-sm">Stay updated with reports, news and alerts.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/15 shrink-0">
                <HugeiconsIcon icon={Building01Icon} size={18} strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="text-white text-base mb-0.5">Build a Better South Coast</h3>
                <p className="text-white/70 text-sm">
                  Together, we create a safer, cleaner and more sustainable region.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming events + Area guides */}
      <section className="py-20 md:py-24">
        <div className="mx-auto w-[min(1280px,92%)] grid gap-10 lg:grid-cols-2">
          <div>
            <div className="flex items-end justify-between mb-8">
              <h2>Upcoming Events</h2>
              <Link href="/events" className="text-secondary font-medium hover:text-primary transition-colors text-sm">
                View all events →
              </Link>
            </div>
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => {
                  const date = new Date(event.startDate);
                  return (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="flex gap-4 bg-card rounded-lg shadow-sm p-5 hover:-translate-y-0.5 hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col items-center justify-center bg-muted rounded-md w-14 h-14 shrink-0">
                        <span className="text-[10px] font-semibold uppercase text-secondary">
                          {date.toLocaleDateString("en-GB", { month: "short" })}
                        </span>
                        <span className="font-heading font-bold text-lg text-primary">
                          {date.getDate()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold uppercase tracking-wide text-secondary">
                          {eventTypeLabels[String(event.eventType)] ?? String(event.eventType)}
                        </span>
                        <h3 className="text-primary text-base mt-0.5">{event.title}</h3>
                        {event.location && (
                          <p className="text-muted-foreground text-xs mt-1">{event.location}</p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="bg-card rounded-lg shadow-sm p-8 text-center">
                <HugeiconsIcon icon={Calendar01Icon} size={28} strokeWidth={1.5} className="text-secondary mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  No events scheduled right now — check back soon.
                </p>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-end justify-between mb-8">
              <h2>Explore the South Coast</h2>
              <Link href="/areas" className="text-secondary font-medium hover:text-primary transition-colors text-sm">
                View all areas →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {areas.map((area) => (
                <Link
                  key={area.id}
                  href={`/areas/${area.slug}`}
                  className="flex items-center gap-2 bg-card rounded-lg shadow-sm px-4 py-3.5 hover:-translate-y-0.5 hover:shadow-md transition-all"
                >
                  <HugeiconsIcon icon={Location01Icon} size={16} strokeWidth={1.8} className="text-secondary shrink-0" />
                  <span className="text-sm font-medium text-primary truncate">{area.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
