import { ConvexError, v } from 'convex/values'
import { query, mutation } from './_generated/server'
import { requirePlannerRole } from './utils/auth.utils'
import {
  ticketTypeValidator,
  metadataValidator
} from './validators/ticketTypes'

export const listByEvent = query({
  args: {
    eventId: v.id('events')
  },
  returns: v.array(ticketTypeValidator),
  handler: async (ctx, { eventId }) => {
    await requirePlannerRole(ctx, eventId)

    const ticketTypes = await ctx.db
      .query('ticketTypes')
      .withIndex('by_event', (q) => q.eq('eventId', eventId))
      .collect()

    return ticketTypes
  }
})

export const createTicketType = mutation({
  args: {
    eventId: v.id('events'),
    name: v.string(),
    price: v.number(),
    totalQuantity: v.number(),
    metadata: metadataValidator
  },
  returns: v.id('ticketTypes'),
  handler: async (ctx, args) => {
    await requirePlannerRole(ctx, args.eventId)

    const event = await ctx.db.get(args.eventId)
    if (!event) {
      throw new ConvexError('Event not found')
    }
    if (event.status !== 'draft') {
      throw new ConvexError('Can only add ticket types to draft events')
    }

    // Validate constraints
    if (args.price < 0) {
      throw new ConvexError('Price must be zero or greater')
    }
    if (args.totalQuantity <= 0) {
      throw new ConvexError('Total quantity must be greater than zero')
    }
    if (!Number.isInteger(args.totalQuantity)) {
      throw new ConvexError('Total quantity must be a whole number')
    }

    // Check for duplicate names within the event
    const existing = await ctx.db
      .query('ticketTypes')
      .withIndex('by_event', (q) => q.eq('eventId', args.eventId))
      .collect()

    const duplicate = existing.find(
      (t) => t.name.toLowerCase() === args.name.toLowerCase()
    )
    if (duplicate) {
      throw new ConvexError(
        `A ticket type named "${args.name}" already exists for this event`
      )
    }

    const ticketTypeId = await ctx.db.insert('ticketTypes', {
      eventId: args.eventId,
      name: args.name,
      price: args.price,
      totalQuantity: args.totalQuantity,
      remainingQuantity: args.totalQuantity,
      metadata: args.metadata
    })

    return ticketTypeId
  }
})

export const updateTicketType = mutation({
  args: {
    ticketTypeId: v.id('ticketTypes'),
    name: v.optional(v.string()),
    price: v.optional(v.number()),
    totalQuantity: v.optional(v.number()),
    metadata: metadataValidator
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const ticketType = await ctx.db.get(args.ticketTypeId)
    if (!ticketType) {
      throw new ConvexError('Ticket type not found')
    }

    await requirePlannerRole(ctx, ticketType.eventId)

    const event = await ctx.db.get(ticketType.eventId)
    if (!event) {
      throw new ConvexError('Event not found')
    }

    // Check if event has any completed purchases
    const purchases = await ctx.db
      .query('purchases')
      .withIndex('by_event', (q) => q.eq('eventId', ticketType.eventId))
      .collect()
    const hasCompletedPurchases = purchases.some(
      (p) => p.status === 'completed'
    )

    if (hasCompletedPurchases) {
      throw new ConvexError(
        'Cannot edit ticket types after tickets have been purchased'
      )
    }

    // Validate price
    if (args.price !== undefined && args.price < 0) {
      throw new ConvexError('Price must be zero or greater')
    }

    // Validate quantity
    if (args.totalQuantity !== undefined) {
      if (args.totalQuantity <= 0) {
        throw new ConvexError('Total quantity must be greater than zero')
      }
      if (!Number.isInteger(args.totalQuantity)) {
        throw new ConvexError('Total quantity must be a whole number')
      }
    }

    // Check duplicate name (if name is changing)
    if (args.name !== undefined && args.name !== ticketType.name) {
      const siblings = await ctx.db
        .query('ticketTypes')
        .withIndex('by_event', (q) => q.eq('eventId', ticketType.eventId))
        .collect()

      const duplicate = siblings.find(
        (t) =>
          t._id !== args.ticketTypeId &&
          t.name.toLowerCase() === args.name!.toLowerCase()
      )
      if (duplicate) {
        throw new ConvexError(
          `A ticket type named "${args.name}" already exists for this event`
        )
      }
    }

    const patch: Record<string, unknown> = {}
    if (args.name !== undefined) patch.name = args.name
    if (args.price !== undefined) patch.price = args.price
    if (args.totalQuantity !== undefined) {
      const sold = ticketType.totalQuantity - ticketType.remainingQuantity
      patch.totalQuantity = args.totalQuantity
      patch.remainingQuantity = args.totalQuantity - sold
    }
    if (args.metadata !== undefined) patch.metadata = args.metadata

    await ctx.db.patch(args.ticketTypeId, patch)
    return null
  }
})

export const deleteTicketType = mutation({
  args: {
    ticketTypeId: v.id('ticketTypes')
  },
  returns: v.null(),
  handler: async (ctx, { ticketTypeId }) => {
    const ticketType = await ctx.db.get(ticketTypeId)
    if (!ticketType) {
      throw new ConvexError('Ticket type not found')
    }

    await requirePlannerRole(ctx, ticketType.eventId)

    // Check for any purchases referencing tickets of this type
    const tickets = await ctx.db
      .query('tickets')
      .withIndex('by_event', (q) => q.eq('eventId', ticketType.eventId))
      .collect()
    const hasTicketsOfType = tickets.some(
      (t) => t.ticketTypeId === ticketTypeId
    )

    if (hasTicketsOfType) {
      throw new ConvexError('Cannot delete ticket type that has issued tickets')
    }

    const event = await ctx.db.get(ticketType.eventId)
    if (event && event.status !== 'draft') {
      // Allow deletion after publish only if no tickets sold for this type
      // (already checked above)
    }

    await ctx.db.delete(ticketTypeId)
    return null
  }
})
