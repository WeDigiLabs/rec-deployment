import { CollectionConfig } from 'payload'
import { universalAccess } from '../access'
import { applyNowWebhook} from '../hooks/webhook'

export const ApplyNow: CollectionConfig = {
  slug: 'apply-now',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'href', 'isActive', 'order', 'updatedAt'],
    group: 'Landing Page Components',
    description: 'Manage secondary navigation links (IIC, IIIC, IQAC, etc.)',
  },
  access: universalAccess,
  hooks: {
    afterChange: [applyNowWebhook],
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
      name: 'link',
      type: 'text',
      required: true,
      admin: {
        description: 'URL path for the navigation link (e.g., "/iic", "/iqac")',
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
