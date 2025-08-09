import { GlobalConfig } from 'payload'
import { globalAccess } from '../access'
import { createGlobalPageConfig } from './shared/globalConfig'
import { studentLifeGlobalWebhook } from '../hooks/webhook'

export const StudentLife: GlobalConfig = {
  ...createGlobalPageConfig('student-life', 'Student Life'),
  access: globalAccess,
  hooks: {
    afterChange: [studentLifeGlobalWebhook],
  },
}
