export function formatLabel(value: string) {
  return value.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

export const statusStyles: Record<string, string> = {
  received: "bg-muted text-muted-foreground",
  "under-review": "bg-warning/15 text-warning",
  "in-progress": "bg-secondary/15 text-secondary",
  resolved: "bg-success/15 text-success",
};
