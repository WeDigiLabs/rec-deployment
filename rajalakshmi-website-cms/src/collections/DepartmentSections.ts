import { CollectionConfig, Field } from 'payload'
import { universalAccess } from '../access'
import { createGlobalSectionFields } from '../globals/shared/globalConfig'
import { departmentSectionsWebhook } from '../hooks/webhook'

export const DepartmentSections: CollectionConfig = {
  slug: 'department-sections',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['department', 'title', 'isActive', 'updatedAt'],
    group: 'Departments',
  },
  access: universalAccess,
  hooks: {
    afterChange: [departmentSectionsWebhook],
  },
  fields: [
    {
      name: 'department',
      type: 'relationship',
      relationTo: 'departments',
      required: true,
      admin: {
        description: 'Select the department this content belongs to',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal title for this content section',
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

    // Dynamic Sections Array - New Feature
    {
      name: 'dynamicSections',
      type: 'array',
      label: 'Dynamic Sections',
      admin: {
        description: 'Create custom sections with rich text, tables, or dynamic tables',
      },
      fields: createGlobalSectionFields(),
    },
    
    // Introduction Section
    {
      name: 'introduction',
      type: 'group',
      label: 'Introduction',
      fields: createGlobalSectionFields(),
    },

    // PEOs Section
    {
      name: 'peos',
      type: 'group',
      label: 'Program Educational Objectives (PEOs)',
      fields: [
        ...createGlobalSectionFields(),
        {
          name: 'objectives',
          type: 'array',
          label: 'PEO List',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
          ],
        },
      ],
    },

    // POs Section
    {
      name: 'pos',
      type: 'group',
      label: 'Program Outcomes (POs)',
      fields: [
        ...createGlobalSectionFields(),
        {
          name: 'outcomes',
          type: 'array',
          label: 'PO List',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
          ],
        },
      ],
    },

    // Opportunities Section
    {
      name: 'opportunities',
      type: 'group',
      label: 'Career Opportunities',
      fields: [
        ...createGlobalSectionFields(),
        {
          name: 'opportunityList',
          type: 'array',
          label: 'Opportunity List',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },

    // Lab Facility Section
    {
      name: 'labFacility',
      type: 'group',
      label: 'Lab Facilities',
      fields: [
        ...createGlobalSectionFields(),
        {
          name: 'labs',
          type: 'array',
          label: 'Laboratory List',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
            {
              name: 'equipment',
              type: 'textarea',
              admin: {
                description: 'List of equipment/software available',
              },
            },
            {
              name: 'images',
              type: 'array',
              label: 'Lab Images',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },

    // Faculty Section
    {
      name: 'faculty',
      type: 'group',
      label: 'Faculty Members',
      fields: [
        ...createGlobalSectionFields(),
        {
          name: 'facultyMembers',
          type: 'array',
          label: 'Faculty List',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'designation',
              type: 'text',
              required: true,
            },
            {
              name: 'qualification',
              type: 'text',
            },
            {
              name: 'specialization',
              type: 'text',
            },
            {
              name: 'experience',
              type: 'text',
            },
            {
              name: 'email',
              type: 'email',
            },
            {
              name: 'phone',
              type: 'text',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'bio',
              type: 'textarea',
            },
          ],
        },
      ],
    },

    // Achievements Section
    {
      name: 'achievements',
      type: 'group',
      label: 'Department Achievements',
      fields: [
        ...createGlobalSectionFields(),
        {
          name: 'achievementList',
          type: 'array',
          label: 'Achievement List',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
            {
              name: 'date',
              type: 'date',
            },
            {
              name: 'category',
              type: 'select',
              options: [
                { label: 'Academic', value: 'academic' },
                { label: 'Research', value: 'research' },
                { label: 'Student Achievement', value: 'student' },
                { label: 'Faculty Achievement', value: 'faculty' },
                { label: 'Awards & Recognition', value: 'awards' },
                { label: 'Other', value: 'other' },
              ],
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },

    // Classroom Section
    {
      name: 'classroom',
      type: 'group',
      label: 'Classroom Facilities',
      fields: [
        ...createGlobalSectionFields(),
        {
          name: 'classrooms',
          type: 'array',
          label: 'Classroom List',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'capacity',
              type: 'number',
            },
            {
              name: 'facilities',
              type: 'textarea',
              admin: {
                description: 'List of facilities available in this classroom',
              },
            },
            {
              name: 'images',
              type: 'array',
              label: 'Classroom Images',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },

    // Faculty Publications Section
    {
      name: 'facultyPublications',
      type: 'group',
      label: 'Faculty Publications',
      fields: [
        ...createGlobalSectionFields(),
        {
          name: 'publications',
          type: 'array',
          label: 'Publication List',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'authors',
              type: 'text',
              required: true,
            },
            {
              name: 'journal',
              type: 'text',
            },
            {
              name: 'conference',
              type: 'text',
            },
            {
              name: 'year',
              type: 'number',
              required: true,
            },
            {
              name: 'type',
              type: 'select',
              options: [
                { label: 'Journal Paper', value: 'journal' },
                { label: 'Conference Paper', value: 'conference' },
                { label: 'Book Chapter', value: 'book_chapter' },
                { label: 'Book', value: 'book' },
                { label: 'Patent', value: 'patent' },
                { label: 'Other', value: 'other' },
              ],
              required: true,
            },
            {
              name: 'doi',
              type: 'text',
              admin: {
                description: 'DOI or URL link to the publication',
              },
            },
          ],
        },
      ],
    },

    // Guest Lectures Section
    {
      name: 'guestLectures',
      type: 'group',
      label: 'Guest Lectures',
      fields: [
        ...createGlobalSectionFields(),
        {
          name: 'lectures',
          type: 'array',
          label: 'Guest Lecture List',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'speaker',
              type: 'text',
              required: true,
            },
            {
              name: 'speakerDesignation',
              type: 'text',
            },
            {
              name: 'organization',
              type: 'text',
            },
            {
              name: 'date',
              type: 'date',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },

    // MoUs Section
    {
      name: 'mous',
      type: 'group',
      label: 'Memorandums of Understanding (MoUs)',
      fields: [
        ...createGlobalSectionFields(),
        {
          name: 'mouList',
          type: 'array',
          label: 'MoU List',
          fields: [
            {
              name: 'organization',
              type: 'text',
              required: true,
            },
            {
              name: 'purpose',
              type: 'textarea',
              required: true,
            },
            {
              name: 'dateOfSigning',
              type: 'date',
            },
            {
              name: 'duration',
              type: 'text',
              admin: {
                description: 'Duration of the MoU (e.g., 3 years)',
              },
            },
            {
              name: 'status',
              type: 'select',
              options: [
                { label: 'Active', value: 'active' },
                { label: 'Expired', value: 'expired' },
                { label: 'Renewed', value: 'renewed' },
              ],
              defaultValue: 'active',
            },
            {
              name: 'document',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'MoU document (PDF)',
              },
            },
          ],
        },
      ],
    },

    // University Rank Holders Section
    {
      name: 'universityRankHolders',
      type: 'group',
      label: 'University Rank Holders',
      fields: [
        ...createGlobalSectionFields(),
        {
          name: 'rankHolders',
          type: 'array',
          label: 'Rank Holder List',
          fields: [
            {
              name: 'studentName',
              type: 'text',
              required: true,
            },
            {
              name: 'rank',
              type: 'number',
              required: true,
            },
            {
              name: 'academicYear',
              type: 'text',
              required: true,
              admin: {
                description: 'Academic year in format: 2024-25',
                placeholder: '2024-25',
              },
            },
            {
              name: 'course',
              type: 'text',
              required: true,
              admin: {
                description: 'Course/Program (e.g., B.E CSE, M.E CSE)',
              },
            },
            {
              name: 'cgpa',
              type: 'number',
              admin: {
                description: 'CGPA/Percentage achieved',
              },
            },
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'currentPosition',
              type: 'text',
              admin: {
                description: 'Current job/position of the student',
              },
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
