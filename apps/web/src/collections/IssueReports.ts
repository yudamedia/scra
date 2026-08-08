import type { CollectionConfig } from 'payload'

async function nextReferenceCode(payload: import('payload').Payload): Promise<string> {
  const { docs } = await payload.find({
    collection: 'issue-reports',
    limit: 0,
    depth: 0,
    select: { referenceCode: true },
  })

  let max = 0
  for (const doc of docs) {
    const match = doc.referenceCode?.match(/^SCRA-(\d+)$/)
    if (match) {
      const parsed = parseInt(match[1], 10)
      if (parsed > max) max = parsed
    }
  }

  return `SCRA-${max + 1}`
}

export const IssueReports: CollectionConfig = {
  slug: 'issue-reports',
  admin: {
    useAsTitle: 'referenceCode',
    defaultColumns: ['referenceCode', 'category', 'status', 'reporterName', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create' && !data.referenceCode) {
          data.referenceCode = await nextReferenceCode(req.payload)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'referenceCode',
      type: 'text',
      unique: true,
      admin: {
        description: 'Auto-generated (e.g. SCRA-2847). How anonymous reporters check status without an account.',
        readOnly: true,
      },
    },
    { name: 'reporterName', type: 'text', required: true },
    { name: 'reporterPhone', type: 'text' },
    { name: 'reporterEmail', type: 'email' },
    {
      name: 'reportedBy',
      type: 'text',
      admin: {
        description:
          "Better Auth user id, set only if logged in at submission — not a Payload relationship, since Better Auth users live in a separate schema.",
        readOnly: true,
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Roads', value: 'roads' },
        { label: 'Security', value: 'security' },
        { label: 'Street Lighting', value: 'street_lighting' },
        { label: 'Illegal Development', value: 'illegal_development' },
        { label: 'Environmental', value: 'environmental' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'photos',
      type: 'array',
      labels: { singular: 'Photo', plural: 'Photos' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'location',
      type: 'group',
      admin: {
        description: 'Real coordinates captured from day one for the future map layer.',
      },
      fields: [
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
        { name: 'addressText', type: 'text' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'received',
      options: [
        { label: 'Received', value: 'received' },
        { label: 'Under Review', value: 'under_review' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Resolved', value: 'resolved' },
      ],
    },
    {
      name: 'statusHistory',
      type: 'array',
      admin: {
        description: 'Audit trail powering the reporter-facing timeline.',
      },
      fields: [
        {
          name: 'status',
          type: 'select',
          required: true,
          options: [
            { label: 'Received', value: 'received' },
            { label: 'Under Review', value: 'under_review' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'Resolved', value: 'resolved' },
          ],
        },
        { name: 'changedAt', type: 'date', required: true },
        { name: 'changedBy', type: 'relationship', relationTo: 'users' },
        { name: 'note', type: 'textarea' },
      ],
    },
    {
      name: 'linkedIssue',
      type: 'relationship',
      relationTo: 'issues',
    },
  ],
}
