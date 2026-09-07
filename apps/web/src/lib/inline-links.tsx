import Link from "next/link";
import type { ReactNode } from "react";

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

/**
 * Renders plain text that may contain one or more `[label](href)` markdown-style links —
 * used for CMS text fields where a sentence needs one inline link (e.g. "Visit the
 * [Membership page](/membership) for...") without pulling in a full richText editor.
 */
export function renderInlineLinks(
  text: string | undefined | null,
  linkClassName = "underline hover:no-underline",
): ReactNode {
  if (!text) return null;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const [, label, href] = match;
    parts.push(
      <Link key={key++} href={href} className={linkClassName}>
        {label}
      </Link>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}
