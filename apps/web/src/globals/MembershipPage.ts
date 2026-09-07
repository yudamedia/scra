import type { GlobalConfig } from 'payload'
import { iconSelectOptions } from '@/lib/icon-options'

export const MembershipPage: GlobalConfig = {
  slug: 'membership-page',
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
      ],
    },
    {
      name: 'tiers',
      type: 'array',
      maxRows: 3,
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Personal', value: 'personal' },
            { label: 'Household', value: 'household' },
            { label: 'Corporate', value: 'corporate' },
          ],
        },
        { name: 'price', type: 'text', required: true },
        { name: 'period', type: 'text' },
        { name: 'detail', type: 'text' },
        { name: 'featured', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'tiersFootnote', type: 'text' },
    {
      name: 'benefits',
      type: 'array',
      fields: [
        { name: 'icon', type: 'select', options: iconSelectOptions },
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
      ],
    },
    {
      name: 'discounts',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'intro', type: 'textarea' },
      ],
    },
    {
      name: 'howToJoin',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'applyButtonLabel', type: 'text' },
        {
          name: 'payInPersonText',
          type: 'textarea',
          admin: { description: 'Falls back to Site Settings > Payment > Pay In Person Text if left empty.' },
        },
        { name: 'footerNote', type: 'text' },
      ],
    },
  ],
}
