import { CollectionConfig } from 'payload'
import { universalAccess } from '../access'
import { testimonialsWebhook } from '../hooks/webhook'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'authorName',
    group: 'Landing Page Components',
  },
  access: universalAccess,
  hooks: {
    afterChange: [testimonialsWebhook],
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
    },
    {
      name: 'authorTitle',
      type: 'text',
      admin: {
        description: 'e.g., "Student", "Faculty", "Alumni"',
      },
    },
    {
      name: 'authorImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  timestamps: true,
}