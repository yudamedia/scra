import Link from "next/link";
import { formatLabel, statusStyles } from "@/lib/format";

type IssueCardProps = {
  slug: string;
  title: string;
  category: string;
  status: string;
};

export function IssueCard({ slug, title, category, status }: IssueCardProps) {
  return (
    <Link
      href={`/issues/${slug}`}
      className="block bg-card rounded-lg shadow p-8 hover:-translate-y-1 hover:shadow-lg transition-all"
    >
      <span className="inline-block text-xs font-semibold uppercase tracking-wide text-secondary mb-3">
        {formatLabel(category)}
      </span>
      <h3 className="text-primary text-xl mb-3">{title}</h3>
      <span
        className={`inline-block text-xs font-semibold px-3 py-1 rounded-pill ${statusStyles[status] ?? "bg-muted text-muted-foreground"}`}
      >
        {formatLabel(status)}
      </span>
    </Link>
  );
}
