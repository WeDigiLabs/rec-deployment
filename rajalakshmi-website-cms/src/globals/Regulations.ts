import { GlobalConfig } from 'payload'
import { globalAccess } from '../access'
import { createGlobalPageConfig } from './shared/globalConfig'
import { regulationsGlobalWebhook } from '../hooks/webhook'

export const Regulations: GlobalConfig = {
  ...createGlobalPageConfig('regulations', 'Regulations'),
  access: globalAccess,
  hooks: {
    afterChange: [regulationsGlobalWebhook],
  },
}
