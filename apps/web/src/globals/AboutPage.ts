import type { GlobalConfig } from 'payload'
import { iconSelectOptions } from '@/lib/icon-options'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  admin: {
    group: 'Site Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'heading', type: 'text', required: true },
        { name: 'paragraph', type: 'textarea' },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Falls back to /hero/aboutus.jpg if left empty.' },
        },
      ],
    },
    {
      name: 'stats',
      type: 'group',
      admin: {
        description:
          'Areas-served and issues-tracked counts are computed live from the Areas/Issues collections — only their labels are editable here.',
      },
      fields: [
        { name: 'foundedYear', type: 'text' },
        { name: 'membersValue', type: 'text' },
        { name: 'membersLabel', type: 'text' },
        { name: 'areasServedLabel', type: 'text' },
        { name: 'issuesTrackedLabel', type: 'text' },
      ],
    },
    { name: 'history', type: 'richText' },
    { name: 'whoWeRepresent', type: 'richText' },
    {
      name: 'whatWeDoIntro',
      type: 'textarea',
    },
    {
      name: 'whatWeDo',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'icon', type: 'select', options: iconSelectOptions },
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
      ],
    },
    {
      name: 'bottomCtaCards',
      type: 'array',
      maxRows: 3,
      admin: {
        description:
          'Use the token "{count}" in the text of the Committees card to interpolate the live committee count, e.g. "{count} committees and working groups carry out SCRA\'s work...".',
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'text' },
        { name: 'linkLabel', type: 'text' },
        { name: 'href', type: 'text', required: true },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Renders this card in the dark/primary style (e.g. "Become a Member").' },
        },
      ],
    },
  ],
}
