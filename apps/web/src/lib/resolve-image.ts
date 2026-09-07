type UploadDoc = { url?: string | null; alt?: string | null } | number | null | undefined;

/**
 * Resolves an optional Payload upload relationship to a usable `<img src>`, falling back to a
 * static file (e.g. one of the existing `/hero/*.jpg` assets) when no CMS image has been set yet.
 */
export function resolveUploadUrl(doc: UploadDoc, fallbackPath: string): string {
  return (typeof doc === "object" && doc?.url) || fallbackPath;
}

export function resolveUploadAlt(doc: UploadDoc, fallbackAlt: string): string {
  return (typeof doc === "object" && doc?.alt) || fallbackAlt;
}
