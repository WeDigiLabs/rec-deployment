import { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

export const createWebhookHook = (collectionSlug: string): CollectionAfterChangeHook => {
  return async ({ doc, req, operation }) => {
    // Only trigger webhook for create and update operations
    if (operation === 'create' || operation === 'update') {
      try {
        const webhookUrl = process.env.WEBHOOK_URL || 'http://localhost:8000/webhook/payload'
        
        const payload = {
          collection: collectionSlug,
          operation,
          timestamp: new Date().toISOString(),
          id: doc.id,
          user: req.user ? {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role
          } : null,
        }

        console.log(`Sending webhook for ${collectionSlug} ${operation}:`, payload.id)

        // Send webhook to FastAPI server
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Source': 'payload-cms',
            'X-Collection': collectionSlug,
            'X-Operation': operation,
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          console.error(`Webhook failed for ${collectionSlug}:`, response.status, response.statusText)
        } else {
          console.log(`Webhook sent successfully for ${collectionSlug} ${operation}`)
        }
      } catch (error) {
        console.error(`Webhook error for ${collectionSlug}:`, error)
        // Don't throw the error to prevent breaking the main operation
      }
    }

    return doc
  }
}

export const createGlobalWebhookHook = (globalSlug: string): GlobalAfterChangeHook => {
  return async ({ doc, req }) => {
    try {
      const webhookUrl = process.env.WEBHOOK_URL || 'http://localhost:8000/webhook/payload'
      
      const payload = {
        global: globalSlug,
        operation: 'update', // Globals only have update operations
        timestamp: new Date().toISOString(),
        user: req.user ? {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role
        } : null,
      }

      console.log(`Sending webhook for global ${globalSlug} update`)

      // Send webhook to FastAPI server
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Source': 'payload-cms',
          'X-Global': globalSlug,
          'X-Operation': 'update',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        console.error(`Webhook failed for global ${globalSlug}:`, response.status, response.statusText)
      } else {
        console.log(`Webhook sent successfully for global ${globalSlug}`)
      }
    } catch (error) {
      console.error(`Webhook error for global ${globalSlug}:`, error)
      // Don't throw the error to prevent breaking the main operation
    }

    return doc
  }
}

// Export webhook hooks for different collections
export const announcementsWebhook = createWebhookHook('announcements')
export const blogPostsWebhook = createWebhookHook('blog-posts')
export const testimonialsWebhook = createWebhookHook('testimonials')
export const coeWebhook = createWebhookHook('coe')
export const coeCategoriesWebhook = createWebhookHook('coe-categories')
export const departmentsWebhook = createWebhookHook('departments')
export const departmentSectionsWebhook = createWebhookHook('department-sections')
export const secondaryNavWebhook = createWebhookHook('secondary-nav')
export const dynamicPagesWebhook = createWebhookHook('dynamic-pages')
export const homeSliderWebhook = createWebhookHook('home-slider')
export const mediaWebhook = createWebhookHook('media')
export const admissionsWebhook = createWebhookHook('admissions')
export const usersWebhook = createWebhookHook('users')
export const applyNowWebhook = createWebhookHook('apply-now')
export const feeLinkWebhook = createWebhookHook('fee-link')

// Export webhook hooks for globals
export const aboutGlobalWebhook = createGlobalWebhookHook('about')
export const admissionsGlobalWebhook = createGlobalWebhookHook('admissions')
export const researchGlobalWebhook = createGlobalWebhookHook('research')
export const placementGlobalWebhook = createGlobalWebhookHook('placement')
export const internationalRelationsGlobalWebhook = createGlobalWebhookHook('international-relations')
export const academicsGlobalWebhook = createGlobalWebhookHook('academics')
export const studentLifeGlobalWebhook = createGlobalWebhookHook('student-life')
export const regulationsGlobalWebhook = createGlobalWebhookHook('regulations')
export const aluminiGlobalWebhook = createGlobalWebhookHook('Alumini')