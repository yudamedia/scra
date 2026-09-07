import type { GlobalConfig } from 'payload'

export const LegalPages: GlobalConfig = {
  slug: 'legal-pages',
  admin: {
    group: 'Site Content',
    description:
      'Markdown source for the Privacy Policy and Terms of Service pages, rendered client-side via react-markdown — write standard markdown (#/## headings, **bold**, - lists) here.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'privacyPolicyMarkdown',
      type: 'code',
      admin: { language: 'markdown' },
    },
    {
      name: 'termsOfServiceMarkdown',
      type: 'code',
      admin: { language: 'markdown' },
    },
  ],
}
