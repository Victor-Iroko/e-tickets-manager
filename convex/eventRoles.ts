import { v } from 'convex/values'
import { query } from './_generated/server'
import { authComponent } from './auth'

export const listUserEventAssociations = query({
  args: {},
  returns: v.array(
    v.object({
      eventId: v.id('events'),
      eventName: v.string(),
      eventStatus: v.union(
        v.literal('draft'),
        v.literal('on_sale'),
        v.literal('closed'),
        v.literal('completed')
      ),
      role: v.union(v.literal('planner'), v.literal('scanner'))
    })
  ),
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx)
    if (!user) {
      return []
    }

    const userId = user._id
    const associations = await ctx.db
      .query('eventRoles')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect()

    const associationDetails: {
      eventId: (typeof associations)[number]['eventId']
      eventName: string
      eventStatus: 'draft' | 'on_sale' | 'closed' | 'completed'
      role: 'planner' | 'scanner'
    }[] = []

    for (const association of associations) {
      const event = await ctx.db.get(association.eventId)
      if (!event) {
        continue
      }

      associationDetails.push({
        eventId: event._id,
        eventName: event.name,
        eventStatus: event.status,
        role: association.role
      })
    }

    return associationDetails
  }
})

export const checkRole = query({
  args: {
    eventId: v.id('events'),
    requiredRole: v.union(v.literal('planner'), v.literal('scanner'))
  },
  returns: v.object({
    hasRole: v.boolean()
  }),
  handler: async (ctx, { eventId, requiredRole }) => {
    const user = await authComponent.safeGetAuthUser(ctx)
    if (!user) {
      return { hasRole: false }
    }

    const association = await ctx.db
      .query('eventRoles')
      .withIndex('by_user_event', (q) =>
        q.eq('userId', user._id).eq('eventId', eventId)
      )
      .unique()

    if (!association) {
      return { hasRole: false }
    }

    return { hasRole: association.role === requiredRole }
  }
})
