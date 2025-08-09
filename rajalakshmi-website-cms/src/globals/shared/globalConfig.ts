import { Field, GlobalConfig } from 'payload'
import { CollectionSlug } from 'payload'

// Helper function to parse CSV data and convert to table structure
const parseCSVToTableData = (csvText: string) => {
  if (!csvText || csvText.trim() === '') return { columns: [], rows: [] }
  
  const lines = csvText.trim().split('\n')
  if (lines.length === 0) return { columns: [], rows: [] }
  
  // First line is headers/columns
  const headers = lines[0].split(',').map(header => header.trim().replace(/['"]/g, ''))
  
  // Generate columns array
  const columns = headers.map((header, index) => ({
    key: header.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), // Convert to camelCase-like key
    label: header,
    width: '', // Optional width
  }))
  
  // Generate rows array
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.trim().replace(/['"]/g, ''))
    const rowData = headers.map((header, index) => ({
      columnKey: header.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''),
      value: values[index] || '',
      isLink: false,
      linkUrl: '',
      isExternal: false,
    }))
    
    return { rowData }
  })
  
  return { columns, rows }
}

export const createSEOFields = (): Field[] => [
  {
    name: 'seo',
    type: 'group',
    label: 'SEO Settings',
    fields: [
      {
        name: 'metaTitle',
        type: 'text',
        admin: {
          description: 'Meta title for SEO (defaults to hero title if empty). Recommended: 50-60 characters',
        },
        validate: (val: string | undefined | null) => {
          if (val && val.length > 60) {
            return 'Meta title should be 60 characters or less for optimal SEO'
          }
          return true
        },
      },
      {
        name: 'metaDescription',
        type: 'textarea',
        admin: {
          description: 'Meta description for SEO and social media previews. Recommended: 150-160 characters',
        },
        validate: (val: string | undefined | null) => {
          if (val && val.length > 160) {
            return 'Meta description should be 160 characters or less for optimal SEO'
          }
          return true
        },
      },
      {
        name: 'keywords',
        type: 'text',
        admin: {
          description: 'SEO keywords (comma-separated). Focus on 3-5 relevant keywords',
        },
      },
      {
        name: 'ogTitle',
        type: 'text',
        admin: {
          description: 'Open Graph title for social media sharing (defaults to meta title if empty)',
        },
      },
      {
        name: 'ogDescription',
        type: 'textarea',
        admin: {
          description: 'Open Graph description for social media sharing (defaults to meta description if empty)',
        },
      },
      {
        name: 'ogImage',
        type: 'upload',
        relationTo: 'media',
        admin: {
          description: 'Open Graph image for social media sharing (recommended: 1200x630px)',
        },
      },
      {
        name: 'twitterCard',
        type: 'select',
        options: [
          { label: 'Summary', value: 'summary' },
          { label: 'Summary Large Image', value: 'summary_large_image' },
        ],
        defaultValue: 'summary_large_image',
        admin: {
          description: 'Twitter card type for Twitter sharing',
        },
      },
      {
        name: 'noIndex',
        type: 'checkbox',
        defaultValue: false,
        admin: {
          description: 'Prevent search engines from indexing this page',
        },
      },
      {
        name: 'noFollow',
        type: 'checkbox',
        defaultValue: false,
        admin: {
          description: 'Prevent search engines from following links on this page',
        },
      },
      {
        name: 'canonicalUrl',
        type: 'text',
        admin: {
          description: 'Canonical URL for this page (leave empty to use current page URL)',
        },
        validate: (val: string | undefined | null) => {
          if (val && !val.startsWith('http')) {
            return 'Canonical URL must be a complete URL starting with http:// or https://'
          }
          return true
        },
      },
    ],
  },
]

export const createGlobalSectionFields = (): Field[] => [
  {
    name: 'title',
    type: 'text',
    required: true,
    admin: {
      description: 'Title of the section',
    },
  },
  {
    name: 'contentType',
    type: 'select',
    options: [
      { label: 'Rich Text Content', value: 'richText' },
      { label: 'Link Table', value: 'table' },
      { label: 'Dynamic Table', value: 'dynamicTable' },
      { label: 'Multiple Dynamic Tables', value: 'multipleTables' },
      { label: 'Mixed Content (Rich Text + Link Table)', value: 'mixed' },
      { label: 'Mixed Content (Rich Text + Dynamic Table)', value: 'mixedDynamic' },
      { label: 'Mixed Content (Rich Text + Multiple Tables)', value: 'mixedMultipleTables' },
    ],
    defaultValue: 'richText',
    admin: {
      description: 'Choose the type of content for this section',
    },
  },
  {
    name: 'content',
    type: 'richText',
    admin: {
      condition: (data, siblingData) => 
        siblingData?.contentType === 'richText' || 
        siblingData?.contentType === 'mixed' ||
        siblingData?.contentType === 'mixedDynamic' ||
        siblingData?.contentType === 'mixedMultipleTables',
      description: 'Rich text content for this section',
    },
  },
  {
    name: 'tableData',
    type: 'array',
    label: 'Table Rows',
    admin: {
      condition: (data, siblingData) => 
        siblingData?.contentType === 'table' || 
        siblingData?.contentType === 'mixed',
      description: 'Table data with labels and links',
    },
    fields: [
      {
        name: 'label',
        type: 'text',
        required: true,
        admin: {
          description: 'Display text for the table row',
        },
      },
      {
        name: 'link',
        type: 'text',
        required: true,
        admin: {
          description: 'URL or file path for the link',
        },
      },
      {
        name: 'isExternal',
        type: 'checkbox',
        defaultValue: false,
        admin: {
          description: 'Check if this is an external link (opens in new tab)',
        },
      },
    ],
  },
  {
    name: 'dynamicTableConfig',
    type: 'group',
    label: 'Dynamic Table Configuration',
    admin: {
      condition: (data, siblingData) => 
        siblingData?.contentType === 'dynamicTable' ||
        siblingData?.contentType === 'mixedDynamic',
      description: 'Configure a custom table with multiple columns',
    },
    fields: [
      {
        name: 'csvInput',
        type: 'textarea',
        admin: {
          description: 'Paste CSV data here to automatically populate the table. Data will be processed when you save.',
          placeholder: 'Paste your CSV data here...\nExample:\nName,Email,Department\nJohn Doe,john@example.com,Engineering\nJane Smith,jane@example.com,Marketing',
          rows: 6,
        },
        hooks: {
          beforeChange: [
            ({ value, siblingData, data }) => {
              // If CSV input has data, parse it and populate columns/rows
              if (value && value.trim() !== '') {
                const parsedData = parseCSVToTableData(value)
                
                // Update the sibling fields with parsed data
                if (siblingData) {
                  siblingData.columns = parsedData.columns
                  siblingData.rows = parsedData.rows
                }
              }
              return value
            }
          ]
        }
      },
      {
        name: 'columns',
        type: 'array',
        label: 'Table Columns',
        required: true,
        fields: [
          {
            name: 'key',
            type: 'text',
            required: true,
            admin: {
              description: 'Unique identifier for this column (no spaces, use camelCase)',
            },
          },
          {
            name: 'label',
            type: 'text',
            required: true,
            admin: {
              description: 'Display label for the column header',
            },
          },
          {
            name: 'width',
            type: 'text',
            admin: {
              description: 'Optional CSS width (e.g., "w-20", "w-1/4")',
            },
          },
        ],
      },
      {
        name: 'rows',
        type: 'array',
        label: 'Table Rows',
        required: true,
        admin: {
          description: 'Add rows to your table. Each row should have data for all columns.',
        },
        fields: [
          {
            name: 'rowData',
            type: 'array',
            label: 'Row Cells',
            required: true,
            admin: {
              description: 'Add data for each column in this row. Make sure to add cells in the same order as your columns.',
            },
            fields: [
              {
                name: 'columnKey',
                type: 'text',
                required: true,
                admin: {
                  description: 'Column key (should match one of your column keys above)',
                  placeholder: 'e.g., name, email, department',
                },
              },
              {
                name: 'value',
                type: 'text',
                required: true,
                admin: {
                  description: 'Cell content/value',
                  placeholder: 'Enter the cell content',
                },
              },
              {
                name: 'isLink',
                type: 'checkbox',
                defaultValue: false,
                admin: {
                  description: 'Make this cell a clickable link',
                },
              },
              {
                name: 'linkUrl',
                type: 'text',
                admin: {
                  condition: (data, siblingData) => siblingData?.isLink === true,
                  description: 'URL for the link',
                  placeholder: 'https://example.com or /internal-page',
                },
              },
              {
                name: 'isExternal',
                type: 'checkbox',
                defaultValue: false,
                admin: {
                  condition: (data, siblingData) => siblingData?.isLink === true,
                  description: 'External link (opens in new tab)',
                },
              },
            ],
          },
        ],
      },
      {
        name: 'variant',
        type: 'select',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Bordered', value: 'bordered' },
          { label: 'Striped', value: 'striped' },
        ],
        defaultValue: 'default',
        admin: {
          description: 'Visual style of the table',
        },
      },
    ],
  },
  {
    name: 'multipleTablesConfig',
    type: 'array',
    label: 'Multiple Tables Configuration',
    admin: {
      condition: (data, siblingData) => 
        siblingData?.contentType === 'multipleTables' ||
        siblingData?.contentType === 'mixedMultipleTables',
      description: 'Configure multiple custom tables with CSV input support',
    },
    fields: [
      {
        name: 'tableTitle',
        type: 'text',
        admin: {
          description: 'Title for this table',
          placeholder: 'Enter table title',
        },
      },
      {
        name: 'csvInput',
        type: 'textarea',
        admin: {
          description: 'Paste CSV data here to automatically populate the table. Data will be processed when you save.',
          placeholder: 'Paste your CSV data here...\nExample:\nName,Email,Department\nJohn Doe,john@example.com,Engineering\nJane Smith,jane@example.com,Marketing',
          rows: 6,
        },
        hooks: {
          beforeChange: [
            ({ value, siblingData, data }) => {
              // If CSV input has data, parse it and populate columns/rows
              if (value && value.trim() !== '') {
                const parsedData = parseCSVToTableData(value)
                
                // Update the sibling fields with parsed data
                if (siblingData) {
                  siblingData.columns = parsedData.columns
                  siblingData.rows = parsedData.rows
                }
              }
              return value
            }
          ]
        }
      },
      {
        name: 'columns',
        type: 'array',
        label: 'Table Columns',
        required: true,
        fields: [
          {
            name: 'key',
            type: 'text',
            required: true,
            admin: {
              description: 'Unique identifier for this column (no spaces, use camelCase)',
            },
          },
          {
            name: 'label',
            type: 'text',
            required: true,
            admin: {
              description: 'Display label for the column header',
            },
          },
          {
            name: 'width',
            type: 'text',
            admin: {
              description: 'Optional CSS width (e.g., "w-20", "w-1/4")',
            },
          },
        ],
      },
      {
        name: 'rows',
        type: 'array',
        label: 'Table Rows',
        required: true,
        admin: {
          description: 'Add rows to your table. Each row should have data for all columns.',
        },
        fields: [
          {
            name: 'rowData',
            type: 'array',
            label: 'Row Cells',
            required: true,
            admin: {
              description: 'Add data for each column in this row. Make sure to add cells in the same order as your columns.',
            },
            fields: [
              {
                name: 'columnKey',
                type: 'text',
                required: true,
                admin: {
                  description: 'Column key (should match one of your column keys above)',
                  placeholder: 'e.g., name, email, department',
                },
              },
              {
                name: 'value',
                type: 'text',
                required: true,
                admin: {
                  description: 'Cell content/value',
                  placeholder: 'Enter the cell content',
                },
              },
              {
                name: 'isLink',
                type: 'checkbox',
                defaultValue: false,
                admin: {
                  description: 'Make this cell a clickable link',
                },
              },
              {
                name: 'linkUrl',
                type: 'text',
                admin: {
                  condition: (data, siblingData) => siblingData?.isLink === true,
                  description: 'URL for the link',
                  placeholder: 'https://example.com or /internal-page',
                },
              },
              {
                name: 'isExternal',
                type: 'checkbox',
                defaultValue: false,
                admin: {
                  condition: (data, siblingData) => siblingData?.isLink === true,
                  description: 'External link (opens in new tab)',
                },
              },
            ],
          },
        ],
      },
      {
        name: 'variant',
        type: 'select',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Bordered', value: 'bordered' },
          { label: 'Striped', value: 'striped' },
        ],
        defaultValue: 'default',
        admin: {
          description: 'Visual style of the table',
        },
      },
    ],
  },
  {
    name: 'tableTitle',
    type: 'text',
    admin: {
      condition: (data, siblingData) => 
        siblingData?.contentType === 'table' || 
        siblingData?.contentType === 'mixed' ||
        siblingData?.contentType === 'dynamicTable' ||
        siblingData?.contentType === 'mixedDynamic',
      description: 'Optional custom title for the table (defaults to "Table Title")',
    },
  },
  {
    name: 'image',
    type: 'upload',
    relationTo: 'media' as CollectionSlug,
    admin: {
      description: 'Optional image for this section',
    },
  },
  {
    name: 'order',
    type: 'number',
    defaultValue: 0,
    admin: {
      description: 'Order of display (lower numbers appear first)',
    },
  },
  {
    name: 'isActive',
    type: 'checkbox',
    defaultValue: true,
    admin: {
      description: 'Whether this section is active and visible',
    },
  },
]

export const createGlobalPageConfig = (slug: string, title: string, description?: string): Omit<GlobalConfig, 'access'> => ({
  slug,
  admin: {
    group: 'Content',
    description: description || `Manage ${title} page content`,
  },
  fields: [
    // SEO Fields
    ...createSEOFields(),
    // Hero Section
    {
      name: 'heroTitle',
      type: 'text',
      required: true,
      admin: {
        description: `Main hero title for the ${title.toLowerCase()} page`,
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
      label: `${title} Sections`,
      fields: createGlobalSectionFields(),
    },
  ],
})
