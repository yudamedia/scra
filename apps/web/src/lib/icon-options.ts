import type { IconSvgElement } from "@hugeicons/react";
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
  CheckmarkCircle02Icon,
  Notification01Icon,
  Discount01Icon,
  Megaphone01Icon,
  IdeaIcon,
  DocumentAttachmentIcon,
  Target02Icon,
  ShieldUserIcon,
  UserGroupIcon,
  Facebook01Icon,
  Mail01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";

/**
 * Curated icon set for CMS `select` icon-picker fields. Every icon currently used anywhere in the
 * frontend for editable content lives here, keyed by a stable string value stored in Payload.
 * Adding a brand-new icon (not just re-pointing an existing content slot to one already listed
 * here) requires a small code change: import it above and add an entry below.
 */
export const iconOptions: { value: string; label: string; icon: IconSvgElement }[] = [
  { value: "information-circle", label: "Information", icon: InformationCircleIcon },
  { value: "shield-01", label: "Shield", icon: Shield01Icon },
  { value: "news", label: "News", icon: NewsIcon },
  { value: "calendar-01", label: "Calendar", icon: Calendar01Icon },
  { value: "folder-01", label: "Folder", icon: Folder01Icon },
  { value: "call-02", label: "Phone", icon: Call02Icon },
  { value: "road", label: "Road", icon: RoadIcon },
  { value: "shield-02", label: "Shield (alt)", icon: Shield02Icon },
  { value: "droplet", label: "Droplet / Water", icon: DropletIcon },
  { value: "leaf-01", label: "Leaf / Environment", icon: Leaf01Icon },
  { value: "building-01", label: "Building", icon: Building01Icon },
  { value: "recycle-01", label: "Recycle", icon: Recycle01Icon },
  { value: "checkmark-circle-02", label: "Checkmark", icon: CheckmarkCircle02Icon },
  { value: "notification-01", label: "Notification / Bell", icon: Notification01Icon },
  { value: "discount-01", label: "Discount / Tag", icon: Discount01Icon },
  { value: "megaphone-01", label: "Megaphone", icon: Megaphone01Icon },
  { value: "idea", label: "Idea / Lightbulb", icon: IdeaIcon },
  { value: "document-attachment", label: "Document", icon: DocumentAttachmentIcon },
  { value: "target-02", label: "Target", icon: Target02Icon },
  { value: "shield-user", label: "Shield User / Watchdog", icon: ShieldUserIcon },
  { value: "user-group", label: "User Group", icon: UserGroupIcon },
  { value: "facebook-01", label: "Facebook", icon: Facebook01Icon },
  { value: "mail-01", label: "Mail / Email", icon: Mail01Icon },
  { value: "location-01", label: "Location / Address", icon: Location01Icon },
];

/** Payload `select` field `options` for any icon-picker field. */
export const iconSelectOptions = iconOptions.map(({ value, label }) => ({ value, label }));

/** Frontend lookup: `ICON_MAP[value]` -> the actual hugeicons icon to pass to `<HugeiconsIcon icon={...} />`. */
export const ICON_MAP: Record<string, IconSvgElement> = Object.fromEntries(
  iconOptions.map(({ value, icon }) => [value, icon]),
);
