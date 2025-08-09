import { GlobalConfig } from 'payload'
import { globalAccess } from '../access'
import { createGlobalPageConfig } from './shared/globalConfig'
import { internationalRelationsGlobalWebhook } from '@/hooks/webhook'

export const Facilities: GlobalConfig = {
  ...createGlobalPageConfig('facilities', 'Facilities'),
  access: globalAccess,
  hooks: {
      afterChange: [internationalRelationsGlobalWebhook],
    },
}
