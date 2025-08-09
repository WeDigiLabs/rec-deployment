import { CollectionConfig } from 'payload'
import { universalAccess } from '../access'
import { announcementsWebhook } from '../hooks/webhook'

export const Announcements: CollectionConfig = {
  slug: 'announcements',
  admin: {
    useAsTitle: 'title',
    group: 'Landing Page Components',
  },
  access: universalAccess,
  hooks: {
    afterChange: [announcementsWebhook],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'link',
      type: 'text',
      admin: {
        description: 'Optional link for "Read More" or call-to-action',
      },
    },
    {
      name: 'linkText',
      type: 'text',
      admin: {
        description: 'Text to display for the link (e.g., "Read More", "Learn More")',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'priority',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Higher numbers appear first',
      },
    },
  ],
  timestamps: true,
}