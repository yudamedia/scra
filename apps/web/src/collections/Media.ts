import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
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
    staticDir: path.resolve(__dirname, '../../media'),
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300 },
      { name: 'card', width: 800, height: 600 },
      { name: 'hero', width: 1920, height: 900 },
    ],
  },
}
