// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Announcements } from './collections/Announcements'
import { HomeSlider } from './collections/HomeSlider'
import { BlogPosts } from './collections/BlogPosts'
import { Testimonials } from './collections/Testimonials'
import { COE } from './collections/COE'
import { COECategories } from './collections/COECategories'
import { Departments } from './collections/Departments'
import { DepartmentSections } from './collections/DepartmentSections'
import { SecondaryNav } from './collections/SecondaryNav'
import { DynamicPages } from './collections/DynamicPages'

// Import globals
import { About } from './globals/About'
import { Admissions } from './globals/Admissions'
import { Research } from './globals/Research'
import { Placement } from './globals/Placement'
import { InternationalRelations } from './globals/InternationalRelations'
import { Regulations } from './globals/Regulations'
import { StudentLife } from './globals/StudentLife'
// Import endpoints
import { departmentsNavEndpoint, departmentContentEndpoint, departmentBySectionEndpoint } from './endpoints/departments'
import { dynamicPageBySlugEndpoint, globalsPatternEndpoint } from './endpoints/dynamicPages'
import { secondaryNavEndpoint } from './endpoints/secondaryNav'
import { Academics } from './globals/Academics'
import { Facilities } from './globals/Facilities'
import { Alumini } from './globals/Alumini'
import { ApplyNow } from './collections/ApplyNow'
import { FeeLink } from './collections/FeeLink'
import { ImageSlider } from './collections/ImageSlider'
import { Contact } from './collections/Contact'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // Define collection groups order
    meta: {
      titleSuffix: '- Rajalakshmi CMS',
      description: 'Content Management System for Rajalakshmi Engineering College',
    },
  },
  collections: [Users, Media, Announcements, HomeSlider, BlogPosts, Testimonials, COE, COECategories, Departments, DepartmentSections, SecondaryNav, DynamicPages, ApplyNow, FeeLink, ImageSlider],
  globals: [About, Admissions, Research, Placement, InternationalRelations, Academics, StudentLife, Regulations, Facilities, Alumini, Contact],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  cors: process.env.PAYLOAD_CORS_ORIGINS 
    ? process.env.PAYLOAD_CORS_ORIGINS.split(',').map(origin => origin.trim())
    : [
        'http://localhost:3000', 
        'http://localhost:3001', 
        'http://localhost:5173', 
        'http://localhost:4200',
        'http://localhost:8000',
        'https://reccms.flashserver.in',
        'https://cmsrec.flashserver.in',
        'https://recwebsite.flashserver.in',
        'https://rajalakshmi-website.vercel.app',
      ],
  csrf: process.env.PAYLOAD_CSRF_ORIGINS 
    ? process.env.PAYLOAD_CSRF_ORIGINS.split(',').map(origin => origin.trim())
    : [
        'http://localhost:3000',
        'http://localhost:3001', 
        'http://localhost:5173',
        'http://localhost:4200',
        'http://localhost:8000',
        'https://reccms.flashserver.in',
        'https://cmsrec.flashserver.in',
        'https://recwebsite.flashserver.in',
        'https://rajalakshmi-website.vercel.app',
      ],
  sharp,
  plugins: [
    payloadCloudPlugin(),
  ],
  endpoints: [
    globalsPatternEndpoint,
    departmentsNavEndpoint,
    departmentContentEndpoint,
    departmentBySectionEndpoint,
    dynamicPageBySlugEndpoint,
    secondaryNavEndpoint,
  ],
})
