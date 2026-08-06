export function formatLabel(value: string) {
  return value.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

export const statusStyles: Record<string, string> = {
  received: "bg-muted text-muted-foreground",
  "under-review": "bg-warning/15 text-warning",
  "in-progress": "bg-secondary/15 text-secondary",
  resolved: "bg-success/15 text-success",
};

export const directoryCategoryLabels: Record<string, string> = {
  hospitals: "Hospitals",
  police: "Police Stations",
  emergency: "Emergency Contacts",
  utilities: "Utilities",
  schools: "Schools",
  government: "Government Offices",
  "member-business": "Member Businesses",
  "professional-services": "Professional Services",
};

export const documentCategoryLabels: Record<string, string> = {
  "annual-report": "Annual Reports",
  "meeting-minutes": "Meeting Minutes",
  "position-paper": "Position Papers",
  "county-notice": "County Notices",
  "environmental-resource": "Environmental Resources",
  "planning-guideline": "Planning Guidelines",
  "public-participation": "Public Participation Documents",
  "press-release": "Press Releases",
};

export const eventTypeLabels: Record<string, string> = {
  "public-participation": "Public Participation Meeting",
  "community-event": "Community Event",
  "environmental-activity": "Environmental Activity",
  "committee-meeting": "Committee Meeting",
  "public-notice": "Public Notice",
};

export const roleOrder = [
  "Chairman",
  "Vice-Chairman",
  "Secretary/Treasurer",
  "Assistant Treasurer",
];
