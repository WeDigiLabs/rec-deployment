import { CollectionConfig } from 'payload'
import { universalAccess } from '../access'
import { admissionsWebhook } from '../hooks/webhook'

export const Admissions: CollectionConfig = {
  slug: 'admissions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'isActive', 'updatedAt'],
  },
  access: universalAccess,
  hooks: {
    afterChange: [admissionsWebhook],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Title for the admission section',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug for the admission page (e.g., 2024-25-admissions)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this admission page is active and visible',
      },
    },

    // Programmes Offered Section
    {
      name: 'programmesOffered',
      type: 'group',
      label: 'Programmes Offered',
      fields: [
        {
          name: 'content',
          type: 'richText',
          admin: {
            description: 'Overview content for programmes offered',
          },
        },
        {
          name: 'programmesList',
          type: 'array',
          label: 'Programmes List',
          fields: [
            {
              name: 'programmeType',
              type: 'select',
              options: [
                { label: 'Undergraduate (UG)', value: 'undergraduate' },
                { label: 'Postgraduate (PG)', value: 'postgraduate' },
                { label: 'Research (PhD)', value: 'research' },
                { label: 'Diploma', value: 'diploma' },
              ],
              admin: {
                description: 'Type of programme',
              },
            },
            {
              name: 'programmeName',
              type: 'text',
              required: true,
              admin: {
                description: 'Name of the programme (e.g., B.E. Computer Science)',
              },
            },
            {
              name: 'department',
              type: 'text',
              admin: {
                description: 'Department offering the programme',
              },
            },
            {
              name: 'duration',
              type: 'text',
              admin: {
                description: 'Duration of the programme (e.g., 4 years)',
              },
            },
            {
              name: 'seats',
              type: 'number',
              admin: {
                description: 'Number of seats available',
              },
            },
            {
              name: 'description',
              type: 'richText',
              admin: {
                description: 'Detailed description of the programme',
              },
            },
            {
              name: 'syllabus',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Upload syllabus document (PDF)',
              },
            },
            {
              name: 'isActive',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Whether this programme is currently offered',
              },
            },
          ],
        },
      ],
    },

    // Eligibility Section
    {
      name: 'eligibility',
      type: 'group',
      label: 'Eligibility',
      fields: [
        {
          name: 'content',
          type: 'richText',
          admin: {
            description: 'General eligibility overview content',
          },
        },
        {
          name: 'eligibilityCriteria',
          type: 'array',
          label: 'Eligibility Criteria',
          fields: [
            {
              name: 'programmeType',
              type: 'select',
              options: [
                { label: 'Undergraduate (UG)', value: 'undergraduate' },
                { label: 'Postgraduate (PG)', value: 'postgraduate' },
                { label: 'Research (PhD)', value: 'research' },
                { label: 'Diploma', value: 'diploma' },
              ],
              admin: {
                description: 'Type of programme this eligibility applies to',
              },
            },
            {
              name: 'programmeName',
              type: 'text',
              admin: {
                description: 'Specific programme name (optional, leave blank for general criteria)',
              },
            },
            {
              name: 'minimumQualification',
              type: 'richText',
              required: true,
              admin: {
                description: 'Minimum educational qualification required',
              },
            },
            {
              name: 'minimumMarks',
              type: 'text',
              admin: {
                description: 'Minimum marks/percentage required',
              },
            },
            {
              name: 'entranceExam',
              type: 'text',
              admin: {
                description: 'Required entrance exam (e.g., JEE, NEET, GATE)',
              },
            },
            {
              name: 'ageLimit',
              type: 'text',
              admin: {
                description: 'Age limit criteria if any',
              },
            },
            {
              name: 'additionalCriteria',
              type: 'richText',
              admin: {
                description: 'Any additional eligibility criteria',
              },
            },
            {
              name: 'documents',
              type: 'array',
              label: 'Required Documents',
              fields: [
                {
                  name: 'documentName',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Name of the required document',
                  },
                },
                {
                  name: 'description',
                  type: 'text',
                  admin: {
                    description: 'Description or additional notes about the document',
                  },
                },
                {
                  name: 'isMandatory',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Whether this document is mandatory',
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    // Cutoff Marks Section
    {
      name: 'cutoffMarks',
      type: 'group',
      label: 'Cutoff Marks',
      fields: [
        {
          name: 'content',
          type: 'richText',
          admin: {
            description: 'Cutoff marks overview content',
          },
        },
        {
          name: 'cutoffData',
          type: 'array',
          label: 'Cutoff Data',
          fields: [
            {
              name: 'academicYear',
              type: 'text',
              required: true,
              admin: {
                description: 'Academic year (e.g., 2024-25)',
              },
            },
            {
              name: 'programmeName',
              type: 'text',
              required: true,
              admin: {
                description: 'Programme name',
              },
            },
            {
              name: 'category',
              type: 'select',
              options: [
                { label: 'General/Open', value: 'general' },
                { label: 'OBC', value: 'obc' },
                { label: 'SC', value: 'sc' },
                { label: 'ST', value: 'st' },
                { label: 'EWS', value: 'ews' },
                { label: 'Management Quota', value: 'management' },
                { label: 'NRI', value: 'nri' },
              ],
              admin: {
                description: 'Category for which cutoff applies',
              },
            },
            {
              name: 'entranceExam',
              type: 'text',
              admin: {
                description: 'Entrance exam (e.g., JEE Main, TNEA)',
              },
            },
            {
              name: 'cutoffRank',
              type: 'number',
              admin: {
                description: 'Cutoff rank',
              },
            },
            {
              name: 'cutoffScore',
              type: 'number',
              admin: {
                description: 'Cutoff score/marks',
              },
            },
            {
              name: 'lastRankAdmitted',
              type: 'number',
              admin: {
                description: 'Last rank admitted in previous year',
              },
            },
            {
              name: 'round',
              type: 'select',
              options: [
                { label: 'Round 1', value: 'round1' },
                { label: 'Round 2', value: 'round2' },
                { label: 'Round 3', value: 'round3' },
                { label: 'Special Round', value: 'special' },
                { label: 'Final', value: 'final' },
              ],
              admin: {
                description: 'Counselling round',
              },
            },
            {
              name: 'notes',
              type: 'text',
              admin: {
                description: 'Additional notes about this cutoff',
              },
            },
          ],
        },
        {
          name: 'cutoffDocument',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Upload detailed cutoff document (PDF/Excel)',
          },
        },
      ],
    },

    // Application Forms Section
    {
      name: 'applicationForms',
      type: 'group',
      label: 'Application Forms',
      fields: [
        {
          name: 'content',
          type: 'richText',
          admin: {
            description: 'Application forms overview content',
          },
        },
        {
          name: 'applicationProcess',
          type: 'richText',
          admin: {
            description: 'Step-by-step application process',
          },
        },
        {
          name: 'formsList',
          type: 'array',
          label: 'Application Forms',
          fields: [
            {
              name: 'formTitle',
              type: 'text',
              required: true,
              admin: {
                description: 'Title of the application form',
              },
            },
            {
              name: 'formType',
              type: 'select',
              options: [
                { label: 'Online Application', value: 'online' },
                { label: 'Offline Application', value: 'offline' },
                { label: 'Both Online & Offline', value: 'both' },
              ],
              admin: {
                description: 'Type of application form',
              },
            },
            {
              name: 'programmesApplicable',
              type: 'text',
              admin: {
                description: 'Programmes this form applies to (comma separated)',
              },
            },
            {
              name: 'applicationFee',
              type: 'number',
              admin: {
                description: 'Application fee amount',
              },
            },
            {
              name: 'startDate',
              type: 'date',
              admin: {
                description: 'Application start date',
              },
            },
            {
              name: 'lastDate',
              type: 'date',
              admin: {
                description: 'Last date for application submission',
              },
            },
            {
              name: 'onlineFormLink',
              type: 'text',
              admin: {
                description: 'Link to online application form',
              },
            },
            {
              name: 'offlineForm',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Upload offline application form (PDF)',
              },
            },
            {
              name: 'instructions',
              type: 'richText',
              admin: {
                description: 'Instructions for filling the form',
              },
            },
            {
              name: 'requiredDocuments',
              type: 'array',
              label: 'Required Documents',
              fields: [
                {
                  name: 'documentName',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'format',
                  type: 'text',
                  admin: {
                    description: 'Required format (e.g., PDF, JPG)',
                  },
                },
                {
                  name: 'maxSize',
                  type: 'text',
                  admin: {
                    description: 'Maximum file size (e.g., 2MB)',
                  },
                },
              ],
            },
            {
              name: 'helplineContact',
              type: 'group',
              label: 'Helpline Contact',
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  admin: {
                    description: 'Helpline email for this form',
                  },
                },
                {
                  name: 'phone',
                  type: 'text',
                  admin: {
                    description: 'Helpline phone number',
                  },
                },
                {
                  name: 'timings',
                  type: 'text',
                  admin: {
                    description: 'Available timings for helpline',
                  },
                },
              ],
            },
            {
              name: 'isActive',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Whether this form is currently active',
              },
            },
          ],
        },
        {
          name: 'importantDates',
          type: 'array',
          label: 'Important Dates',
          fields: [
            {
              name: 'event',
              type: 'text',
              required: true,
              admin: {
                description: 'Event name (e.g., Application Start, Last Date, Counselling)',
              },
            },
            {
              name: 'date',
              type: 'date',
              required: true,
            },
            {
              name: 'time',
              type: 'text',
              admin: {
                description: 'Time if applicable',
              },
            },
            {
              name: 'description',
              type: 'text',
              admin: {
                description: 'Additional description about the event',
              },
            },
          ],
        },
        {
          name: 'feeStructure',
          type: 'group',
          label: 'Fee Structure',
          fields: [
            {
              name: 'content',
              type: 'richText',
              admin: {
                description: 'Fee structure overview content',
              },
            },
            {
              name: 'feeDocument',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Upload detailed fee structure document (PDF)',
              },
            },
          ],
        },
      ],
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
