import type { CollectionConfig } from 'payload'
import { UserWithRole, isSuperAdmin, isSuperAdminOrAdmin } from '../access'
import { usersWebhook } from '../hooks/webhook'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'System',
  },
  auth: true,
  hooks: {
    afterChange: [usersWebhook],
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'Blogger',
      options: [
        {
          label: 'Super Admin',
          value: 'SuperAdmin',
        },
        {
          label: 'Admin',
          value: 'Admin',
        },
        {
          label: 'Blogger',
          value: 'Blogger',
        },
      ],
      access: {
        create: ({ req: { user } }) => {
          // Only SuperAdmins can assign roles during creation
          return isSuperAdmin(user)
        },
        update: ({ req: { user } }) => {
          // Only SuperAdmins can update roles
          return isSuperAdmin(user)
        },
      },
    },
    // Email added by default
    // Add more fields as needed
  ],
  access: {
    // Only SuperAdmins and Admins can create new users
    create: ({ req: { user } }) => {
      return isSuperAdminOrAdmin(user)
    },
    // Users can read their own profile, SuperAdmins and Admins can read all
    read: ({ req: { user } }) => {
      if (isSuperAdminOrAdmin(user)) return true
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    // Users can update their own profile (except role), SuperAdmins and Admins can update all
    update: ({ req: { user } }) => {
      if (isSuperAdminOrAdmin(user)) return true
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    // Only SuperAdmins can delete users
    delete: ({ req: { user } }) => {
      return isSuperAdmin(user)
    },
  },
}
