import type { CollectionConfig } from 'payload'
import { canManage, publicReadOrManage } from '@/lib/permissions'

export const People: CollectionConfig = {
  slug: 'people',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'committee'],
    group: 'Collections',
  },
  access: {
    read: publicReadOrManage('people'),
    create: canManage('people', 'create'),
    update: canManage('people', 'update'),
    delete: canManage('people', 'delete'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "Chairperson", "Treasurer"',
      },
    },
    {
      name: 'committee',
      type: 'relationship',
      relationTo: 'committees',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'richText',
    },
  ],
}
