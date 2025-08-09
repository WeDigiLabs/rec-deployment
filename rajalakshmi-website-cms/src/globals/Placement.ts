import { GlobalConfig } from 'payload'
import { globalAccess } from '../access'
import { createGlobalPageConfig } from './shared/globalConfig'
import { placementGlobalWebhook } from '../hooks/webhook'

export const Placement: GlobalConfig = {
  ...createGlobalPageConfig('placement', 'Placement'),
  access: globalAccess,
  hooks: {
    afterChange: [placementGlobalWebhook],
  },
}
