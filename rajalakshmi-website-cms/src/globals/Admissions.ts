import { GlobalConfig } from 'payload'
import { globalAccess } from '../access'
import { createGlobalPageConfig } from './shared/globalConfig'
import { admissionsGlobalWebhook } from '../hooks/webhook'

export const Admissions: GlobalConfig = {
  ...createGlobalPageConfig('admissions', 'Admissions'),
  access: globalAccess,
  hooks: {
    afterChange: [admissionsGlobalWebhook],
  },
}
