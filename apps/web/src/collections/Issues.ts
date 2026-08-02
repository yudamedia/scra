import type { CollectionConfig } from 'payload'

export const Issues: CollectionConfig = {
  slug: 'issues',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'area'],
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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Roads & Infrastructure', value: 'roads-infrastructure' },
        { label: 'Security', value: 'security' },
        { label: 'Water Supply', value: 'water-supply' },
        { label: 'Electricity', value: 'electricity' },
        { label: 'Waste Management', value: 'waste-management' },
        { label: 'Environment', value: 'environment' },
        { label: 'Beach Access', value: 'beach-access' },
        { label: 'Planning & Development', value: 'planning-development' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'received',
      options: [
        { label: 'Received', value: 'received' },
        { label: 'Under Review', value: 'under-review' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Resolved', value: 'resolved' },
      ],
    },
    {
      name: 'area',
      type: 'relationship',
      relationTo: 'areas',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'background',
      type: 'richText',
      required: true,
    },
    {
      name: 'actionsUndertaken',
      type: 'richText',
    },
    {
      name: 'progressUpdates',
      type: 'array',
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
        },
        {
          name: 'update',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'supportingDocuments',
      type: 'relationship',
      relationTo: 'documents',
      hasMany: true,
    },
    {
      name: 'relatedNews',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
    },
  ],
}
