import type { CollectionConfig } from 'payload'
import { applyGeocodeHook } from '@/lib/geocode'

export const Areas: CollectionConfig = {
  slug: 'areas',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        await applyGeocodeHook(data, {
          sourceText: data.name ? `${data.name}, Kenya` : null,
        })
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier, e.g. "diani"',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'overview',
      type: 'richText',
      required: true,
    },
    {
      name: 'keyServices',
      type: 'array',
      fields: [
        {
          name: 'service',
          type: 'text',
        },
      ],
    },
    {
      name: 'attractions',
      type: 'richText',
    },
    {
      name: 'location',
      type: 'group',
      admin: {
        description:
          'Auto-filled by geocoding the area name. Used as the map fallback center for directory entries and issues in this area that have no location of their own. Edit these manually if the auto-placed pin lands somewhere wrong — a manual value is never overwritten.',
      },
      fields: [
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
      ],
    },
  ],
}
