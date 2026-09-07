import type { Field, GlobalConfig } from 'payload'

const introFields: Field[] = [
  { name: 'eyebrow', type: 'text' },
  { name: 'heading', type: 'text' },
  { name: 'paragraph', type: 'textarea' },
  { name: 'image', type: 'upload', relationTo: 'media' },
]

function pageTab(name: string, label: string, extraFields: Field[] = []) {
  return {
    name,
    label,
    fields: [...introFields, ...extraFields],
  }
}

export const PageIntros: GlobalConfig = {
  slug: 'page-intros',
  admin: {
    group: 'Site Content',
    description:
      'Hero eyebrow/heading/paragraph for pages that only need a simple intro block above their CMS-driven list.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        pageTab('contact', 'Contact', [
          { name: 'membershipCalloutText', type: 'textarea' },
        ]),
        pageTab('leadership', 'Leadership'),
        pageTab('committees', 'Committees'),
        pageTab('directory', 'Directory'),
        pageTab('issues', 'Issues'),
        pageTab('news', 'News'),
        pageTab('areas', 'Areas'),
        pageTab('documents', 'Documents', [
          { name: 'emptyStateText', type: 'text' },
        ]),
        pageTab('events', 'Events', [
          { name: 'emptyStateHeading', type: 'text' },
          { name: 'emptyStateText', type: 'textarea' },
        ]),
        pageTab('map', 'Map'),
        pageTab('reportIssue', 'Report an Issue'),
        pageTab('membershipApply', 'Membership Apply'),
      ],
    },
  ],
}
