import { CollectionConfig } from 'payload'
import { universalAccess } from '../access'
import { coeWebhook } from '../hooks/webhook'

export const COE: CollectionConfig = {
  slug: 'coe',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'isActive', 'updatedAt'],
    group: 'COE',
  },
  access: universalAccess,
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        // Auto-set the priority based on category if not set
        if (operation === 'create' && !data.priority) {
          data.priority = 0
        }
        return data
      },
    ],
    afterChange: [coeWebhook],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Title of the COE document',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the document',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'coe-categories',
      required: true,
      admin: {
        description: 'Select the category for this document',
      },
    },
    {
      name: 'pdfFile',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Upload the PDF file for this COE document',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this document is active and visible',
      },
    },
    {
      name: 'priority',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Higher numbers appear first within the category',
      },
    },
    {
      name: 'downloadCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of times this document has been downloaded',
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        description: 'Optional tags for better organization and searchability',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  timestamps: true,
}
