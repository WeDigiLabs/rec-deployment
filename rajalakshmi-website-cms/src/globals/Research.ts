import { GlobalConfig } from 'payload'
import { globalAccess } from '../access'
import { createGlobalPageConfig } from './shared/globalConfig'
import { researchGlobalWebhook } from '../hooks/webhook'

export const Research: GlobalConfig = {
  ...createGlobalPageConfig('research', 'Research'),
  access: globalAccess,
  hooks: {
    afterChange: [researchGlobalWebhook],
  },
}
