import type { CollectionConfig } from 'payload'
import { applyGeocodeHook } from '@/lib/geocode'

export const Issues: CollectionConfig = {
  slug: 'issues',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'area'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        await applyGeocodeHook(data, { sourceText: data.locationText })
        return data
      },
    ],
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
      name: 'locationText',
      type: 'text',
      admin: {
        description:
          'Specific site of this issue, e.g. "Diani Beach Road near the Nakumatt roundabout". Leave blank to show this issue at its area\'s general location on the map.',
      },
    },
    {
      name: 'location',
      type: 'group',
      admin: {
        description:
          'Auto-filled by geocoding the location text above. Edit manually if the auto-placed pin lands somewhere wrong — a manual value is never overwritten.',
      },
      fields: [
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
      ],
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      type: 'array',
      labels: {
        singular: 'Photo',
        plural: 'Gallery Photos',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
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
