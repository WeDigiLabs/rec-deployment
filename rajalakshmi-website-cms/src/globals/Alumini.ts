import { GlobalConfig } from 'payload'
import { globalAccess } from '../access'
import { createGlobalPageConfig } from './shared/globalConfig'
import { aluminiGlobalWebhook } from '../hooks/webhook'

export const Alumini: GlobalConfig = {
  ...createGlobalPageConfig('alumini', 'Alumini'),
  access: globalAccess,
  hooks: {
    afterChange: [aluminiGlobalWebhook],
  },
}
