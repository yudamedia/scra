import ReactMarkdown from "react-markdown";
import { getPayloadClient } from "@/lib/payload";

export const revalidate = 60;

export const metadata = {
  title: "Terms of Service — South Coast Residents' Association",
};

export default async function TermsOfServicePage() {
  const payload = await getPayloadClient();
  const legalPages = await payload.findGlobal({ slug: "legal-pages" });

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto w-[min(1280px,92%)] max-w-3xl">
        <div
          className="max-w-none text-foreground
            [&_h1]:text-3xl [&_h1]:md:text-4xl [&_h1]:mb-6
            [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:mt-10 [&_h2]:mb-3
            [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2
            [&_p]:mb-4 [&_p]:leading-relaxed
            [&_ul]:mb-4 [&_ul]:pl-6 [&_ul]:list-disc [&_ul]:space-y-1
            [&_li]:leading-relaxed
            [&_strong]:font-semibold [&_strong]:text-foreground"
        >
          <ReactMarkdown>{legalPages.termsOfServiceMarkdown}</ReactMarkdown>
        </div>
      </div>
    </section>
  );
}
