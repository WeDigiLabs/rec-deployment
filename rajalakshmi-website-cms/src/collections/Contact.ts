import { globalAccess, universalAccess } from "@/access";
import { CollectionConfig, GlobalConfig } from "payload";

export const Contact: GlobalConfig = {
  slug: 'contact',
  access: globalAccess,
  admin: {
    group: 'Landing Page Components',
  },
  fields: [
    // Social Media Links
    {
      name: 'socialMedia',
      label: 'Social Media',
      type: 'group',
      fields: [
        {
          name: 'linkedin',
          label: 'LinkedIn URL',
          type: 'text',
          required: false,
        },
        {
          name: 'facebook',
          label: 'Facebook URL',
          type: 'text',
          required: false,
        },
        {
          name: 'instagram',
          label: 'Instagram URL',
          type: 'text',
          required: false,
        },
        {
          name: 'email',
          label: 'General Email',
          type: 'email',
          required: false,
        },
        {
          name: 'phone',
          label: 'General Phone',
          type: 'text',
          required: false,
        },
      ],
    },
    
    // Contact Categories
    {
      name: 'contactCategories',
      label: 'Contact Categories',
      type: 'array',
      fields: [
        {
          name: 'title',
          label: 'Category Title',
          type: 'text',
          required: true,
        },
        {
          name: 'items',
          label: 'Contact Items',
          type: 'array',
          fields: [
            {
              name: 'label',
              label: 'Contact Label',
              type: 'text',
              required: true,
            },
            {
              name: 'email',
              label: 'Email Address',
              type: 'email',
              required: true,
            },
          ],
        },
      ],
    },

    // Addresses
    {
      name: 'addresses',
      label: 'Office Addresses',
      type: 'array',
      fields: [
        {
          name: 'title',
          label: 'Office Title',
          type: 'text',
          required: true,
        },
        {
          name: 'address',
          label: 'Full Address',
          type: 'textarea',
          required: true,
        },
        {
          name: 'phones',
          label: 'Phone Numbers',
          type: 'array',
          fields: [
            {
              name: 'number',
              label: 'Phone Number',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'fax',
          label: 'Fax Number',
          type: 'text',
          required: false,
        },
        {
          name: 'email',
          label: 'Office Email',
          type: 'email',
          required: true,
        },
      ],
    },

    // Important Numbers
    {
      name: 'importantNumbers',
      label: 'Important Contact Numbers',
      type: 'array',
      fields: [
        {
          name: 'label',
          label: 'Contact Type',
          type: 'text',
          required: true,
        },
        {
          name: 'phones',
          label: 'Phone Numbers',
          type: 'array',
          fields: [
            {
              name: 'number',
              label: 'Phone Number',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },

    // Website Information
    {
      name: 'website',
      label: 'Website Information',
      type: 'group',
      fields: [
        {
          name: 'url',
          label: 'Website URL',
          type: 'text',
          required: false,
          defaultValue: 'https://www.rajalakshmi.org',
        },
        {
          name: 'displayText',
          label: 'Display Text',
          type: 'text',
          required: false,
          defaultValue: 'www.rajalakshmi.org',
        },
      ],
    },
  ],
};
