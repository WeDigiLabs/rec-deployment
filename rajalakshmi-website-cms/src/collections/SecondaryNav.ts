import { CollectionConfig } from 'payload'
import { universalAccess } from '../access'
import { secondaryNavWebhook } from '../hooks/webhook'

export const SecondaryNav: CollectionConfig = {
  slug: 'secondary-nav',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'href', 'isActive', 'order', 'updatedAt'],
    group: 'Navigation',
    description: 'Manage secondary navigation links (IIC, IIIC, IQAC, etc.)',
  },
  access: universalAccess,
  hooks: {
    afterChange: [secondaryNavWebhook],
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: {
        description: 'Display text for the navigation link (e.g., "IIC", "IQAC")',
      },
    },
    {
      name: 'href',
      type: 'text',
      required: true,
      admin: {
        description: 'URL path for the navigation link (e.g., "/iic", "/iqac")',
      },
      validate: (val: string | undefined | null) => {
        if (!val) return 'URL path is required'
        if (!val.startsWith('/')) {
          return 'URL path must start with a forward slash (/)'
        }
        return true
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this navigation item is active and visible',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order (higher numbers appear first)',
      },
    },
  ],
  timestamps: true,
}
