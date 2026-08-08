import type { CollectionConfig } from 'payload'

import { activateMembership } from '../lib/membership-activation'

export const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['membership', 'amount', 'provider', 'paymentStatus', 'paymentType', 'confirmedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        // Webhook-confirmed and manually-reconciled payments both land here via
        // payload.update() — this hook is the single activation path for both,
        // by construction, not by convention.
        if (doc.paymentStatus === 'confirmed' && previousDoc?.paymentStatus !== 'confirmed') {
          await activateMembership({ payment: doc, req })
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'membership',
      type: 'relationship',
      relationTo: 'memberships',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'method',
      type: 'select',
      required: true,
      options: [
        { label: 'STK Push', value: 'stk_push' },
        { label: 'Bank Transfer', value: 'bank_transfer' },
        { label: 'Cash', value: 'cash' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'provider',
      type: 'select',
      required: true,
      options: [
        { label: 'Tuma', value: 'tuma' },
        { label: 'Manual (secretariat reconciliation)', value: 'manual' },
      ],
    },
    {
      name: 'tumaPaymentId',
      type: 'text',
      admin: {
        description: "From Tuma's STK push response.",
      },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'confirmedAt',
      type: 'date',
    },
    {
      name: 'confirmedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Null if confirmed by webhook; set if secretariat manually reconciled it.',
      },
    },
    {
      name: 'rawWebhookPayload',
      type: 'json',
      admin: {
        description: "Raw Tuma callback body, for audit/debugging.",
      },
    },
    {
      name: 'paymentType',
      type: 'select',
      required: true,
      options: [
        { label: 'New membership', value: 'new' },
        { label: 'Renewal', value: 'renewal' },
      ],
    },
  ],
}
