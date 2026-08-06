import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Target02Icon,
  ShieldUserIcon,
  Leaf01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

export const revalidate = 60;

export default async function AboutPage() {
  const payload = await getPayloadClient();
  const [{ totalDocs: areaCount }, { totalDocs: committeeCount }, { totalDocs: issueCount }] =
    await Promise.all([
      payload.find({ collection: "areas", limit: 0 }),
      payload.find({ collection: "committees", limit: 0 }),
      payload.find({ collection: "issues", limit: 0 }),
    ]);

  const stats = [
    { value: "1983", label: "Founded" },
    { value: "1,000+", label: "Members represented" },
    { value: String(areaCount), label: "Areas served, Likoni to Lunga Lunga" },
    { value: String(issueCount), label: "Community issues tracked" },
  ];

  return (
    <>
      <section
        className="text-white py-20 md:py-28"
        style={{
          background:
            "linear-gradient(rgba(13,43,91,.72), rgba(7,28,61,.85)), url(/hero/aboutus.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto w-[min(1280px,92%)] max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80 mb-3">
            About Us
          </p>
          <h1 className="text-white mb-5">Representing the South Coast Since 1983</h1>
          <p className="text-white/90 text-lg leading-relaxed">
            SCRA is a non-profit, non-political, non-denominational and
            non-racial association advancing the interests of residents,
            property owners and businesses on Kenya&apos;s South Coast —
            from Likoni to Lunga Lunga.
          </p>
        </div>
      </section>

      <section className="py-16 border-b border-border">
        <div className="mx-auto w-[min(1280px,92%)] grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading font-bold text-3xl md:text-4xl text-primary mb-1">
                {stat.value}
              </p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto w-[min(1280px,92%)] max-w-3xl space-y-12">
          <div>
            <h2 className="mb-4">Our History</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              SCRA was established in 1983 as the Likoni &amp; South Mainland
              Residents Association, initially operating from Shelley Beach.
              After a period of inactivity, the Association relocated to
              Diani and resumed operations, growing into the organisation
              that today represents residents, property owners and
              businesses across the whole of Kenya&apos;s South Coast.
            </p>
          </div>

          <div>
            <h2 className="mb-4">Who We Represent</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              SCRA represents over 1,000 people, including residents,
              hoteliers, bankers, local businesses, fishermen and youth
              groups across the South Coast — from the Likoni ferry crossing
              to the Tanzanian border at Lunga Lunga.
            </p>
          </div>

          <div>
            <h2 className="mb-4">What We Do</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              As a non-political, non-profit making, non-denominational and
              non-racial association, SCRA provides an avenue for
              representing residents&apos; interests to, and liaising with,
              all Government of Kenya ministries and the Kwale &amp;
              Msambweni district offices — serving as a watchdog for the
              community while working to improve social services and
              environmental conservation along the coast.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="bg-card rounded-lg shadow-sm p-6">
                <HugeiconsIcon icon={ShieldUserIcon} size={28} strokeWidth={1.8} className="text-secondary mb-3" />
                <h3 className="text-primary text-lg mb-2">Community Watchdog</h3>
                <p className="text-muted-foreground text-sm">
                  Monitoring development, planning and public conduct that
                  affects residents, and raising concerns with the relevant
                  authorities.
                </p>
              </div>
              <div className="bg-card rounded-lg shadow-sm p-6">
                <HugeiconsIcon icon={Target02Icon} size={28} strokeWidth={1.8} className="text-secondary mb-3" />
                <h3 className="text-primary text-lg mb-2">Government Liaison</h3>
                <p className="text-muted-foreground text-sm">
                  Representing member interests to national and county
                  government ministries and offices on issues affecting the
                  South Coast.
                </p>
              </div>
              <div className="bg-card rounded-lg shadow-sm p-6">
                <HugeiconsIcon icon={Leaf01Icon} size={28} strokeWidth={1.8} className="text-secondary mb-3" />
                <h3 className="text-primary text-lg mb-2">Environmental Conservation</h3>
                <p className="text-muted-foreground text-sm">
                  Partnering with conservation organisations to protect the
                  coastal forest, marine environment and wildlife the South
                  Coast depends on.
                </p>
              </div>
              <div className="bg-card rounded-lg shadow-sm p-6">
                <HugeiconsIcon icon={UserGroupIcon} size={28} strokeWidth={1.8} className="text-secondary mb-3" />
                <h3 className="text-primary text-lg mb-2">Social Services</h3>
                <p className="text-muted-foreground text-sm">
                  Working to improve the services residents rely on —
                  roads, security, water, electricity and waste management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="mx-auto w-[min(1280px,92%)] grid gap-8 md:grid-cols-3">
          <Link
            href="/leadership"
            className="bg-card rounded-lg shadow-sm p-8 hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <h3 className="text-primary text-xl mb-2">Our Leadership</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Meet the Executive Committee leading SCRA&apos;s work on
              behalf of South Coast residents.
            </p>
            <span className="text-secondary font-medium text-sm">Meet the team →</span>
          </Link>
          <Link
            href="/committees"
            className="bg-card rounded-lg shadow-sm p-8 hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <h3 className="text-primary text-xl mb-2">Our Committees</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {committeeCount} committees and working groups carry out
              SCRA&apos;s work across the South Coast.
            </p>
            <span className="text-secondary font-medium text-sm">See committees →</span>
          </Link>
          <Link
            href="/membership"
            className="bg-primary rounded-lg shadow-sm p-8 hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <h3 className="text-white text-xl mb-2">Become a Member</h3>
            <p className="text-white/80 text-sm mb-4">
              Join SCRA and add your voice to a stronger South Coast.
            </p>
            <span className="text-white font-medium text-sm">Join / Renew →</span>
          </Link>
        </div>
      </section>
    </>
  );
}
