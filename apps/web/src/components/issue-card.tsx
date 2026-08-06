import Link from "next/link";
import { formatLabel, statusStyles } from "@/lib/format";

type IssueCardProps = {
  slug: string;
  title: string;
  category: string;
  status: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

export function IssueCard({
  slug,
  title,
  category,
  status,
  imageUrl,
  imageAlt,
}: IssueCardProps) {
  return (
    <Link
      href={`/issues/${slug}`}
      className="block bg-card rounded-lg shadow overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all"
    >
      {imageUrl && (
        <img src={imageUrl} alt={imageAlt ?? ""} className="w-full h-40 object-cover" />
      )}
      <div className="p-8">
        <span className="inline-block text-xs font-semibold uppercase tracking-wide text-secondary mb-3">
          {formatLabel(category)}
        </span>
        <h3 className="text-primary text-xl mb-3">{title}</h3>
        <span
          className={`inline-block text-xs font-semibold px-3 py-1 rounded-pill ${statusStyles[status] ?? "bg-muted text-muted-foreground"}`}
        >
          {formatLabel(status)}
        </span>
      </div>
    </Link>
  );
}
