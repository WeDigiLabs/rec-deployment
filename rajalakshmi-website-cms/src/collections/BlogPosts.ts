import { CollectionConfig } from 'payload'
import { blogPostAccess } from '../access'
import { blogPostsWebhook } from '../hooks/webhook'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'isPublished', 'updatedAt'],
    group: 'Blogs',
  },
  access: blogPostAccess,
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        console.log('BlogPost beforeChange hook:', { 
          operation, 
          userId: req.user?.id,
          userRole: req.user?.role,
          dataAuthor: data.author,
          title: data.title 
        })
        
        // Automatically set author to current user when creating
        if (operation === 'create' && req.user) {
          data.author = req.user.id
          console.log('Setting author to current user:', req.user.id)
        }
        return data
      },
    ],
    afterChange: [
      ({ doc, req, operation }) => {
        // Log after successful creation for debugging
        if (operation === 'create') {
          console.log('Blog post created successfully:', {
            id: doc.id,
            title: doc.title,
            author: doc.author,
            userId: req.user?.id,
            userRole: req.user?.role
          })
        }
        return doc
      },
      blogPostsWebhook,
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
        description: 'Author is automatically set to the current user',
      },
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  timestamps: true,
}