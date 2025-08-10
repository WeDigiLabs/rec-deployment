import { CollectionConfig } from 'payload'
import { universalAccess } from '../access'
import { homeSliderWebhook } from '../hooks/webhook'

export const ImageSlider: CollectionConfig = {
  slug: 'image-slider',
  admin: {
    useAsTitle: 'title',
    group: 'Landing Page Components',
  },
  access: universalAccess,
  hooks: {
    afterChange: [homeSliderWebhook],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Recommended aspect ratio: 16:9',
      },
    },
    {
      name: 'link',
      type: 'text',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
  timestamps: true,
}