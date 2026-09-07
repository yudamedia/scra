import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ICON_MAP } from "@/lib/icon-options";
import { resolveUploadUrl } from "@/lib/resolve-image";

export const revalidate = 60;

export default async function AboutPage() {
  const payload = await getPayloadClient();
  const [{ totalDocs: areaCount }, { totalDocs: committeeCount }, { totalDocs: issueCount }, aboutPage] =
    await Promise.all([
      payload.find({ collection: "areas", limit: 0 }),
      payload.find({ collection: "committees", limit: 0 }),
      payload.find({ collection: "issues", limit: 0 }),
      payload.findGlobal({ slug: "about-page" }),
    ]);

  const stats = [
    { value: aboutPage.stats?.foundedYear, label: "Founded" },
    { value: aboutPage.stats?.membersValue, label: aboutPage.stats?.membersLabel },
    { value: String(areaCount), label: aboutPage.stats?.areasServedLabel },
    { value: String(issueCount), label: aboutPage.stats?.issuesTrackedLabel },
  ];

  const heroImageUrl = resolveUploadUrl(aboutPage.hero.image, "/hero/aboutus.jpg");

  return (
    <>
      <section
        className="text-white py-20 md:py-28"
        style={{
          background: `linear-gradient(rgba(13,43,91,.72), rgba(7,28,61,.85)), url(${heroImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto w-[min(1280px,92%)] max-w-3xl">
          {aboutPage.hero.eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80 mb-3">
              {aboutPage.hero.eyebrow}
            </p>
          )}
          <h1 className="text-white mb-5">{aboutPage.hero.heading}</h1>
          {aboutPage.hero.paragraph && (
            <p className="text-white/90 text-lg leading-relaxed">{aboutPage.hero.paragraph}</p>
          )}
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
          {aboutPage.history && (
            <div>
              <h2 className="mb-4">Our History</h2>
              <div className="text-muted-foreground text-lg leading-relaxed [&_p]:mb-4">
                <RichText data={aboutPage.history} />
              </div>
            </div>
          )}

          {aboutPage.whoWeRepresent && (
            <div>
              <h2 className="mb-4">Who We Represent</h2>
              <div className="text-muted-foreground text-lg leading-relaxed [&_p]:mb-4">
                <RichText data={aboutPage.whoWeRepresent} />
              </div>
            </div>
          )}

          <div>
            <h2 className="mb-4">What We Do</h2>
            {aboutPage.whatWeDoIntro && (
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {aboutPage.whatWeDoIntro}
              </p>
            )}
            <div className="grid gap-6 sm:grid-cols-2">
              {(aboutPage.whatWeDo ?? []).map((card) => (
                <div key={card.title} className="bg-card rounded-lg shadow-sm p-6">
                  {card.icon && ICON_MAP[card.icon] && (
                    <HugeiconsIcon
                      icon={ICON_MAP[card.icon]}
                      size={28}
                      strokeWidth={1.8}
                      className="text-secondary mb-3"
                    />
                  )}
                  <h3 className="text-primary text-lg mb-2">{card.title}</h3>
                  {card.text && <p className="text-muted-foreground text-sm">{card.text}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="mx-auto w-[min(1280px,92%)] grid gap-8 md:grid-cols-3">
          {(aboutPage.bottomCtaCards ?? []).map((card) => {
            const isPrimary = !!card.featured;
            const text = card.text?.replace("{count}", String(committeeCount));
            return (
              <Link
                key={card.href}
                href={card.href}
                className={`rounded-lg shadow-sm p-8 hover:-translate-y-1 hover:shadow-lg transition-all ${
                  isPrimary ? "bg-primary" : "bg-card"
                }`}
              >
                <h3 className={`text-xl mb-2 ${isPrimary ? "text-white" : "text-primary"}`}>
                  {card.title}
                </h3>
                {text && (
                  <p className={`text-sm mb-4 ${isPrimary ? "text-white/80" : "text-muted-foreground"}`}>
                    {text}
                  </p>
                )}
                {card.linkLabel && (
                  <span className={`font-medium text-sm ${isPrimary ? "text-white" : "text-secondary"}`}>
                    {card.linkLabel}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
