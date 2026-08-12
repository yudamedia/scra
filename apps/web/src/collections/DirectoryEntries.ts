import type { CollectionConfig } from 'payload'
import { applyGeocodeHook } from '@/lib/geocode'

export const DirectoryEntries: CollectionConfig = {
  slug: 'directory-entries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'area'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        await applyGeocodeHook(data, { sourceText: data.address })
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
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Hospitals', value: 'hospitals' },
        { label: 'Police Stations', value: 'police' },
        { label: 'Emergency Contacts', value: 'emergency' },
        { label: 'Utilities', value: 'utilities' },
        { label: 'Schools', value: 'schools' },
        { label: 'Government Offices', value: 'government' },
        { label: 'Member Businesses', value: 'member-business' },
        { label: 'Professional Services', value: 'professional-services' },
      ],
    },
    {
      name: 'area',
      type: 'relationship',
      relationTo: 'areas',
    },
    {
      name: 'address',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'website',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'location',
      type: 'group',
      admin: {
        description:
          'Auto-filled by geocoding the address above. Falls back to the linked area\'s location on the map if left blank. Edit manually if the auto-placed pin lands somewhere wrong — a manual value is never overwritten.',
      },
      fields: [
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
      ],
    },
  ],
}
