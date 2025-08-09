import { GlobalConfig } from 'payload'
import { globalAccess } from '../access'
import { createGlobalPageConfig } from './shared/globalConfig'
import { academicsGlobalWebhook } from '../hooks/webhook'

export const Academics: GlobalConfig = {
  ...createGlobalPageConfig('academics', 'Academics'),
  access: globalAccess,
  hooks: {
    afterChange: [academicsGlobalWebhook],
  },
}
