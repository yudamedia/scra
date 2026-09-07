import type { GlobalConfig } from 'payload'
import { iconSelectOptions } from '@/lib/icon-options'

// Mirrors `Issues.category`'s option set (src/collections/Issues.ts). Kept as a fixed list here
// too (rather than dynamically reading the collection config) so a bad value can't silently slip
// in; adding a genuinely new category still requires adding it to Issues.ts as well.
const categoryValueOptions = [
  { label: 'Roads & Infrastructure', value: 'roads-infrastructure' },
  { label: 'Security', value: 'security' },
  { label: 'Water Supply', value: 'water-supply' },
  { label: 'Electricity', value: 'electricity' },
  { label: 'Waste Management', value: 'waste-management' },
  { label: 'Environment', value: 'environment' },
  { label: 'Beach Access', value: 'beach-access' },
  { label: 'Planning & Development', value: 'planning-development' },
]

export const IssueCategories: GlobalConfig = {
  slug: 'issue-categories',
  admin: {
    group: 'Site Content',
    description:
      'Marketing copy (label/description/icon) for issue categories shown in the header dropdown, homepage tiles, and issues page filters. The underlying category values are defined in the Issues collection.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'categories',
      type: 'array',
      fields: [
        {
          name: 'value',
          type: 'select',
          required: true,
          options: categoryValueOptions,
        },
        { name: 'label', type: 'text', required: true },
        { name: 'description', type: 'text' },
        {
          name: 'icon',
          type: 'select',
          options: iconSelectOptions,
        },
        {
          name: 'featuredOnHomepage',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show this category as one of the tiles in the homepage "Issues We Are Working On" section.',
          },
        },
      ],
    },
  ],
}
