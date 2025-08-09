import { GlobalConfig } from 'payload'
import { globalAccess } from '../access'
import { createGlobalPageConfig } from './shared/globalConfig'
import { aboutGlobalWebhook } from '../hooks/webhook'

export const About: GlobalConfig = {
  ...createGlobalPageConfig('about', 'About'),
  access: globalAccess,
  hooks: {
    afterChange: [aboutGlobalWebhook],
  },
}
