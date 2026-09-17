import path from 'path'
import type { CollectionConfig } from 'payload'
import { canManage, publicReadOrManage } from '@/lib/permissions'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Collections',
  },
  access: {
    read: publicReadOrManage('media'),
    create: canManage('media', 'create'),
    update: canManage('media', 'update'),
    delete: canManage('media', 'delete'),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the image for accessibility and SEO.',
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
  upload: {
    staticDir: path.resolve(process.cwd(), 'media'),
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300 },
      { name: 'card', width: 800, height: 600 },
      { name: 'hero', width: 1920, height: 900 },
    ],
  },
}
