import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Site Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'orgName',
      type: 'text',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      admin: {
        description: 'Shown on the homepage hero and in the footer.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Falls back to the built-in logo file if left empty.',
      },
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'phone', type: 'text' },
        { name: 'email', type: 'text' },
        { name: 'addressLine1', type: 'text', admin: { description: 'e.g. "Diani, Kenya"' } },
        {
          name: 'addressDetail',
          type: 'text',
          admin: { description: 'e.g. "First floor, Diani Beach Shopping Center."' },
        },
      ],
    },
    {
      name: 'social',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'X (Twitter)', value: 'x' },
            { label: 'YouTube', value: 'youtube' },
          ],
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'payment',
      type: 'group',
      fields: [
        { name: 'paybillNumber', type: 'text' },
        { name: 'paybillAccount', type: 'text' },
        {
          name: 'payInPersonText',
          type: 'textarea',
          admin: {
            description: 'e.g. instructions for paying at the Safarilink Office.',
          },
        },
      ],
    },
    {
      name: 'seoDefaults',
      type: 'group',
      fields: [
        { name: 'defaultTitle', type: 'text' },
        { name: 'defaultDescription', type: 'textarea' },
      ],
    },
    {
      name: 'footerLegal',
      type: 'group',
      fields: [
        { name: 'copyrightName', type: 'text' },
        { name: 'builtByText', type: 'text' },
      ],
    },
  ],
}
