import { CollectionConfig } from 'payload'
import { universalAccess } from '../access'
import { departmentsWebhook } from '../hooks/webhook'

export const Departments: CollectionConfig = {
  slug: 'departments',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code', 'isActive', 'order', 'updatedAt'],
    description: 'Manage departments for navigation dropdown',
    group: 'Departments',
  },
  access: universalAccess,
  hooks: {
    afterChange: [departmentsWebhook],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Department name (e.g., Computer Science Engineering)',
      },
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Department code (e.g., CSE, ECE, MECH)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug (e.g., computer-science-engineering)',
      },
    },
    {
      name: 'shortName',
      type: 'text',
      admin: {
        description: 'Short name for display in dropdown (optional)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the department',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show in navigation dropdown',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order in dropdown (higher numbers first)',
      },
    },
  ],
  timestamps: true,
}
