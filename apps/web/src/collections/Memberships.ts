import type { CollectionConfig } from 'payload'

import { getNextMembershipNumber } from '../lib/memberships'

export const Memberships: CollectionConfig = {
  slug: 'memberships',
  admin: {
    useAsTitle: 'membershipNumber',
    defaultColumns: ['membershipNumber', 'type', 'primaryContact', 'expiryDate', 'adminRevoked'],
    description:
      'Active/expired status is computed from expiryDate + adminRevoked, not stored here.',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create' && !data.membershipNumber) {
          data.membershipNumber = await getNextMembershipNumber(req.payload)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'membershipNumber',
      type: 'text',
      unique: true,
      admin: {
        description: 'Auto-assigned on create if left blank. Legacy numbers preserve exact zero-padding.',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Personal', value: 'personal' },
        { label: 'Household', value: 'household' },
        { label: 'Corporate', value: 'corporate' },
        { label: 'Free (exempted legacy member)', value: 'free' },
      ],
    },
    {
      name: 'adminRevoked',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Manual override, independent of expiryDate.',
      },
    },
    {
      name: 'revokedReason',
      type: 'text',
      admin: {
        condition: (data) => Boolean(data?.adminRevoked),
      },
    },
    {
      name: 'primaryContact',
      type: 'group',
      fields: [
        { name: 'surname', type: 'text', required: true },
        { name: 'firstName', type: 'text' },
        { name: 'phone', type: 'text' },
        {
          name: 'email',
          type: 'email',
          admin: {
            description: 'Optional for legacy imports; required for any new portal signup.',
          },
        },
      ],
    },
    { name: 'postalAddress', type: 'text' },
    { name: 'town', type: 'text' },
    { name: 'postalCode', type: 'text' },
    {
      name: 'corporateBusinessName',
      type: 'text',
      admin: {
        condition: (data) => data?.type === 'corporate',
      },
    },
    {
      name: 'additionalMembers',
      type: 'array',
      labels: { singular: 'Additional Member', plural: 'Additional Members' },
      admin: {
        description:
          'Household: names only. Corporate: up to 4, each may carry its own phone/email for a linked portal account.',
      },
      fields: [
        { name: 'surname', type: 'text', required: true },
        { name: 'firstName', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'email', type: 'email' },
      ],
    },
    {
      name: 'subscriptionAmount',
      type: 'number',
      admin: {
        description: 'Stored per-record so future rate changes do not rewrite history.',
      },
    },
    {
      name: 'expiryDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Single source of truth for active/expired.',
      },
    },
    {
      name: 'importStatus',
      type: 'select',
      required: true,
      defaultValue: 'native',
      options: [
        { label: 'Native (created via portal/admin)', value: 'native' },
        { label: 'Imported (legacy spreadsheet)', value: 'imported' },
      ],
    },
    {
      name: 'importFlags',
      type: 'textarea',
      admin: {
        description: 'Free text for anything ambiguous carried forward from a source import, for secretariat review.',
      },
    },
    {
      name: 'linkedAuthUsers',
      type: 'array',
      labels: { singular: 'Linked Portal Account', plural: 'Linked Portal Accounts' },
      admin: {
        description:
          "Better Auth users live in a separate Postgres schema outside Payload's collection registry, so this can't be a native relationship field. Populated only once an account actually exists.",
        readOnly: true,
      },
      fields: [
        { name: 'authUserId', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
      ],
    },
    {
      name: 'lastReminderStage',
      type: 'select',
      defaultValue: 'none',
      admin: {
        description: 'Idempotency marker for the renewal-reminder cron — not a status field.',
        position: 'sidebar',
      },
      options: [
        { label: 'None sent', value: 'none' },
        { label: '30-day reminder sent', value: '30day' },
        { label: '7-day reminder sent', value: '7day' },
        { label: 'Due-day reminder sent', value: 'dueday' },
        { label: 'Lapsed nudge sent', value: 'lapsed' },
      ],
    },
  ],
}
