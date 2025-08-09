import { CollectionConfig } from 'payload'
import { universalAccessPublished } from '../access'
import { createSEOFields, createGlobalSectionFields } from '../globals/shared/globalConfig'
import { dynamicPagesWebhook } from '../hooks/webhook'

export const DynamicPages: CollectionConfig = {
  slug: 'dynamic-pages',
  admin: {
    group: 'Content',
    description: 'Create and manage multiple dynamic pages with flexible content types',
    useAsTitle: 'pageTitle',
    defaultColumns: ['pageTitle', 'slug', 'category', 'isPublished', 'priority', 'updatedAt'],
    pagination: {
      defaultLimit: 20,
    },
  },
  access: universalAccessPublished,
  hooks: {
    afterChange: [dynamicPagesWebhook],
  },
  fields: [
    // Page Identification
    {
      name: 'pageTitle',
      type: 'text',
      required: true,
      admin: {
        description: 'Title of the page (used for admin display)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug for this page (e.g., "about-us", "contact")',
      },
      validate: (val: string | undefined | null) => {
        if (!val) return 'Slug is required'
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val)) {
          return 'Slug must contain only lowercase letters, numbers, and hyphens'
        }
        return true
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'General Pages', value: 'general' },
        { label: 'Academic Pages', value: 'academic' },
        { label: 'Administrative Pages', value: 'administrative' },
        { label: 'Student Resources', value: 'student-resources' },
        { label: 'Faculty Resources', value: 'faculty-resources' },
        { label: 'Research Pages', value: 'research' },
        { label: 'Events & News', value: 'events-news' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'general',
      admin: {
        description: 'Category to help organize and filter pages',
      },
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this page is published and accessible',
      },
    },
    {
      name: 'priority',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Priority for ordering pages (higher numbers appear first)',
      },
    },
    // SEO Fields
    ...createSEOFields(),
    // Hero Section
    {
      name: 'heroTitle',
      type: 'text',
      required: true,
      admin: {
        description: 'Main hero title for the page',
      },
    },
    {
      name: 'heroSubtitle',
      type: 'text',
      admin: {
        description: 'Hero subtitle displayed below the main title',
      },
    },
    {
      name: 'sections',
      type: 'array',
      label: 'Page Sections',
      fields: createGlobalSectionFields(),
    },
  ],
}
