import type { GlobalConfig } from 'payload'

const navChildFields = [
  { name: 'label', type: 'text' as const, required: true },
  { name: 'href', type: 'text' as const, required: true },
]

export const MainNavigation: GlobalConfig = {
  slug: 'main-navigation',
  admin: {
    group: 'Site Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'headerLinks',
      type: 'array',
      admin: {
        description: 'Top nav bar. Leave "children" empty for a plain link with no dropdown.',
      },
      fields: [
        ...navChildFields,
        {
          name: 'children',
          type: 'array',
          fields: navChildFields,
        },
      ],
    },
    {
      name: 'footerQuickLinks',
      type: 'array',
      fields: navChildFields,
    },
    {
      name: 'footerResourceLinks',
      type: 'array',
      fields: navChildFields,
    },
    {
      name: 'footerLegalLinks',
      type: 'array',
      fields: navChildFields,
    },
  ],
}
