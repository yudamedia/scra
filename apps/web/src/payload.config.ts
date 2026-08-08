import path from 'path'
import { fileURLToPath } from 'url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Documents } from './collections/Documents'
import { Areas } from './collections/Areas'
import { Issues } from './collections/Issues'
import { DirectoryEntries } from './collections/DirectoryEntries'
import { Committees } from './collections/Committees'
import { People } from './collections/People'
import { Posts } from './collections/Posts'
import { Events } from './collections/Events'
import { Memberships } from './collections/Memberships'
import { Payments } from './collections/Payments'
import { IssueReports } from './collections/IssueReports'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
  },
  collections: [
    Users,
    Media,
    Documents,
    Areas,
    Issues,
    DirectoryEntries,
    Committees,
    People,
    Posts,
    Events,
    Memberships,
    Payments,
    IssueReports,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
})
