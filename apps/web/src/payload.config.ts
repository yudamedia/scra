import path from 'path'
import { fileURLToPath } from 'url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
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
  plugins: [
    // Public bucket: site images, logos, etc. Served directly, no signing.
    s3Storage({
      collections: {
        media: {
          disableLocalStorage: true,
          generateFileURL: ({ filename }) => `${process.env.R2_MEDIA_PUBLIC_URL}/${filename}`,
        },
      },
      bucket: process.env.R2_MEDIA_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        region: 'auto',
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        forcePathStyle: true,
        // R2 doesn't support the CRC32 checksums the AWS SDK sends by default
        // since v3.729.0 — without this, reads/writes fail with a generic
        // "UnknownError". https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/
        requestChecksumCalculation: 'WHEN_REQUIRED',
        responseChecksumValidation: 'WHEN_REQUIRED',
      },
    }),
    // Private bucket: PDFs etc. Every read goes through Payload's own route
    // and gets a short-lived signed URL, rather than a raw public bucket URL.
    // NOTE: this does not yet enforce the `visibility` field — Documents.access.read
    // is currently `() => true`. Once the Member Portal / Better Auth session bridge
    // exists, update access.read to check visibility + req.user, since signedDownloads
    // just gates *how* a file is fetched, not *whether* it's fetchable.
    s3Storage({
      collections: {
        documents: {
          disableLocalStorage: true,
          signedDownloads: true,
        },
      },
      bucket: process.env.R2_DOCUMENTS_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        region: 'auto',
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        forcePathStyle: true,
        requestChecksumCalculation: 'WHEN_REQUIRED',
        responseChecksumValidation: 'WHEN_REQUIRED',
      },
    }),
  ],
})