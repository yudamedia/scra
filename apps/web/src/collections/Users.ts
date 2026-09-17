import type { CollectionConfig } from 'payload'

import { PERMISSION_RESOURCE_OPTIONS } from '@/lib/permissions'

const isSuperAdmin = ({ req }: { req: { user?: { role?: string } | null } }) =>
  req.user?.role === 'superAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  access: {
    // A superAdmin can see every user; an admin can only see their own record.
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'superAdmin') return true
      return { id: { equals: req.user.id } }
    },
    // Only a superAdmin can create new admin users — this is the exclusive
    // "ability to create other users" the role model is built around.
    create: isSuperAdmin,
    update: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'superAdmin') return true
      return { id: { equals: req.user.id } }
    },
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Super Admin', value: 'superAdmin' },
        { label: 'Admin', value: 'admin' },
      ],
      access: {
        // Prevent an admin from self-promoting via their own document-level update access.
        update: isSuperAdmin,
      },
      admin: {
        description: 'Super Admins have full control over everything, including creating other users.',
      },
    },
    {
      name: 'permissions',
      type: 'array',
      labels: { singular: 'Permission', plural: 'Permissions' },
      access: {
        update: isSuperAdmin,
      },
      admin: {
        description: 'Grants this admin access to specific collections or Site Content sections.',
        condition: (data) => data?.role !== 'superAdmin',
      },
      fields: [
        {
          name: 'resource',
          type: 'select',
          required: true,
          options: PERMISSION_RESOURCE_OPTIONS,
        },
        { name: 'read', type: 'checkbox', defaultValue: true },
        { name: 'create', type: 'checkbox', defaultValue: false },
        { name: 'update', type: 'checkbox', defaultValue: false },
        { name: 'delete', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
