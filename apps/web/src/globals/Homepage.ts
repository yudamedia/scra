import type { GlobalConfig } from 'payload'
import { iconSelectOptions } from '@/lib/icon-options'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
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
        { name: 'heading', type: 'text', required: true },
        { name: 'subtext', type: 'textarea' },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Falls back to /hero/homepage.jpg if left empty.' },
        },
        {
          name: 'ctaButtons',
          type: 'array',
          maxRows: 3,
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
            {
              name: 'style',
              type: 'select',
              defaultValue: 'primary',
              options: [
                { label: 'Primary (filled)', value: 'primary' },
                { label: 'Secondary (outline)', value: 'secondary' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'quickLinks',
      type: 'array',
      admin: { description: 'The icon row of shortcuts just below the hero.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'sub', type: 'text' },
        { name: 'href', type: 'text', required: true },
        { name: 'icon', type: 'select', options: iconSelectOptions },
      ],
    },
    {
      name: 'newsSection',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'heading', type: 'text' },
      ],
    },
    {
      name: 'issuesSection',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'heading', type: 'text' },
      ],
    },
    {
      name: 'membershipCta',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'paragraph', type: 'textarea' },
        { name: 'buttonLabel', type: 'text' },
        {
          name: 'benefits',
          type: 'array',
          maxRows: 3,
          fields: [
            { name: 'icon', type: 'select', options: iconSelectOptions },
            { name: 'title', type: 'text', required: true },
            { name: 'text', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'eventsEmptyStateText',
      type: 'textarea',
    },
  ],
}
