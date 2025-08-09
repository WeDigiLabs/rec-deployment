import { CollectionConfig } from 'payload'
import { universalAccess } from '../access'
import { coeCategoriesWebhook } from '../hooks/webhook'

export const COECategories: CollectionConfig = {
  slug: 'coe-categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'isActive', 'order', 'updatedAt'],
    group: 'COE',
  },
  access: universalAccess,
  hooks: {
    afterChange: [coeCategoriesWebhook],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Name of the COE category (e.g., "AI/ML", "IoT", "Cybersecurity")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of what this category represents',
      },
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Icon class or emoji for the category (optional)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this category is active and visible',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order of display (higher numbers appear first)',
      },
    },
  ],
  timestamps: true,
}
