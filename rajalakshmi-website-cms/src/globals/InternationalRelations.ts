import { GlobalConfig } from 'payload'
import { globalAccess } from '../access'
import { createGlobalPageConfig } from './shared/globalConfig'
import { internationalRelationsGlobalWebhook } from '../hooks/webhook'

export const InternationalRelations: GlobalConfig = {
  ...createGlobalPageConfig('international-relations', 'International Relations'),
  access: globalAccess,
  hooks: {
    afterChange: [internationalRelationsGlobalWebhook],
  },
}
