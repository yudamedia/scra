import type { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedDate'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Annual Report', value: 'annual-report' },
        { label: 'Meeting Minutes', value: 'meeting-minutes' },
        { label: 'Position Paper', value: 'position-paper' },
        { label: 'County Notice', value: 'county-notice' },
        { label: 'Environmental Resource', value: 'environmental-resource' },
        { label: 'Planning Guideline', value: 'planning-guideline' },
        { label: 'Public Participation Document', value: 'public-participation' },
        { label: 'Press Release', value: 'press-release' },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
    },
  ],
  upload: {
    staticDir: '../documents',
    mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
}
