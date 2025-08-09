import { Endpoint } from 'payload'

// Get active secondary navigation items
export const secondaryNavEndpoint: Endpoint = {
  path: '/secondary-nav',
  method: 'get',
  handler: async (req) => {
    const { payload } = req

    try {
      const navItems = await payload.find({
        collection: 'secondary-nav',
        where: {
          isActive: {
            equals: true,
          },
        },
        sort: '-order',
        limit: 100,
      })

      const formattedNavItems = navItems.docs.map((item: any) => ({
        id: item.id,
        label: item.label,
        href: item.href,
        description: item.description,
        openInNewTab: item.openInNewTab,
        icon: item.icon,
        order: item.order,
      }))

      return Response.json({
        success: true,
        data: formattedNavItems,
      })
    } catch (error: any) {
      return Response.json({
        success: false,
        error: error?.message || 'An error occurred',
      }, { status: 500 })
    }
  },
}
