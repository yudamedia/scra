import type { CollectionConfig } from 'payload'
import { canManage, publicReadOrManage } from '@/lib/permissions'

export const Committees: CollectionConfig = {
  slug: 'committees',
  admin: {
    useAsTitle: 'name',
    group: 'Collections',
  },
  access: {
    read: publicReadOrManage('committees'),
    create: canManage('committees', 'create'),
    update: canManage('committees', 'update'),
    delete: canManage('committees', 'delete'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
  ],
}
