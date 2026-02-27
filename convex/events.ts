import { ConvexError, v } from 'convex/values'
import { query, mutation } from './_generated/server'
import { requireAuth, requirePlannerRole } from './utils/auth.utils'
import { authComponent } from './auth'
import {
  eventValidator,
  publishChecklistValidator,
  generateSlug
} from './validators/events'

export const createEvent = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    date: v.number(),
    salesStartTime: v.number(),
    salesEndTime: v.number(),
    bankName: v.optional(v.string()),
    bankAccountNumber: v.optional(v.string())
  },
  returns: v.id('events'),
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)

    // Validate date ordering: salesStart < salesEnd < event date
    if (args.salesStartTime >= args.salesEndTime) {
      throw new ConvexError('Sales start time must be before sales end time')
    }
    if (args.salesEndTime >= args.date) {
      throw new ConvexError('Sales end time must be before event date')
    }
    if (args.salesStartTime >= args.date) {
      throw new ConvexError('Sales start time must be before event date')
    }

    // Generate unique slug
    let slug = generateSlug(args.name)
    let existing = await ctx.db
      .query('events')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .unique()

    // Retry with new suffix if collision
    let attempts = 0
    while (existing && attempts < 5) {
      slug = generateSlug(args.name)
      existing = await ctx.db
        .query('events')
        .withIndex('by_slug', (q) => q.eq('slug', slug))
        .unique()
      attempts++
    }
    if (existing) {
      throw new ConvexError(
        'Could not generate a unique slug. Please try again.'
      )
    }

    const eventId = await ctx.db.insert('events', {
      name: args.name,
      slug,
      description: args.description,
      date: args.date,
      salesStartTime: args.salesStartTime,
      salesEndTime: args.salesEndTime,
      status: 'draft' as const,
      bankName: args.bankName,
      bankAccountNumber: args.bankAccountNumber,
      createdBy: user._id,
      createdAt: Date.now()
    })

    // Assign creator as planner
    await ctx.db.insert('eventRoles', {
      eventId,
      userId: user._id,
      role: 'planner' as const
    })

    return eventId
  }
})

export const getEvent = query({
  args: {
    eventId: v.id('events')
  },
  returns: v.union(eventValidator, v.null()),
  handler: async (ctx, { eventId }) => {
    // SSR-safe: return null if not authenticated or not a planner
    const user = await authComponent.safeGetAuthUser(ctx)
    if (!user) return null

    const association = await ctx.db
      .query('eventRoles')
      .withIndex('by_user_event', (q) =>
        q.eq('userId', user._id).eq('eventId', eventId)
      )
      .unique()
    if (!association || association.role !== 'planner') return null

    const event = await ctx.db.get(eventId)
    return event ?? null
  }
})

export const updateEvent = mutation({
  args: {
    eventId: v.id('events'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    date: v.optional(v.number()),
    salesStartTime: v.optional(v.number()),
    salesEndTime: v.optional(v.number()),
    bankName: v.optional(v.string()),
    bankAccountNumber: v.optional(v.string())
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requirePlannerRole(ctx, args.eventId)

    const event = await ctx.db.get(args.eventId)
    if (!event) {
      throw new ConvexError('Event not found')
    }
    if (event.status !== 'draft') {
      throw new ConvexError('Can only edit events in draft status')
    }

    // Merge dates for validation
    const salesStartTime = args.salesStartTime ?? event.salesStartTime
    const salesEndTime = args.salesEndTime ?? event.salesEndTime
    const date = args.date ?? event.date

    if (salesStartTime >= salesEndTime) {
      throw new ConvexError('Sales start time must be before sales end time')
    }
    if (salesEndTime >= date) {
      throw new ConvexError('Sales end time must be before event date')
    }

    // Build patch object (only include provided fields)
    const patch: Record<string, unknown> = {}
    if (args.name !== undefined) patch.name = args.name
    if (args.description !== undefined) patch.description = args.description
    if (args.date !== undefined) patch.date = args.date
    if (args.salesStartTime !== undefined)
      patch.salesStartTime = args.salesStartTime
    if (args.salesEndTime !== undefined) patch.salesEndTime = args.salesEndTime
    if (args.bankName !== undefined) patch.bankName = args.bankName
    if (args.bankAccountNumber !== undefined)
      patch.bankAccountNumber = args.bankAccountNumber

    // Re-generate slug if name changed
    if (args.name !== undefined && args.name !== event.name) {
      let slug = generateSlug(args.name)
      let existing = await ctx.db
        .query('events')
        .withIndex('by_slug', (q) => q.eq('slug', slug))
        .unique()

      let attempts = 0
      while (existing && attempts < 5) {
        slug = generateSlug(args.name)
        existing = await ctx.db
          .query('events')
          .withIndex('by_slug', (q) => q.eq('slug', slug))
          .unique()
        attempts++
      }
      if (existing) {
        throw new ConvexError(
          'Could not generate a unique slug. Please try again.'
        )
      }
      patch.slug = slug
    }

    await ctx.db.patch(args.eventId, patch)
    return null
  }
})

export const getPublishChecklist = query({
  args: {
    eventId: v.id('events')
  },
  returns: publishChecklistValidator,
  handler: async (ctx, { eventId }) => {
    // SSR-safe: return empty checklist if not authenticated
    const user = await authComponent.safeGetAuthUser(ctx)
    if (!user) {
      return {
        hasDetails: false,
        hasTicketTypes: false,
        hasFormFields: false,
        hasBankDetails: false,
        allPassed: false,
        errors: ['Authentication required']
      }
    }

    const event = await ctx.db.get(eventId)
    if (!event) {
      throw new ConvexError('Event not found')
    }

    const errors: string[] = []

    // Check event details
    const hasDetails = !!(
      event.name &&
      event.date &&
      event.salesStartTime &&
      event.salesEndTime
    )
    if (!hasDetails) {
      errors.push('Event details are incomplete (name, date, sales window)')
    }

    // Check ticket types
    const ticketTypes = await ctx.db
      .query('ticketTypes')
      .withIndex('by_event', (q) => q.eq('eventId', eventId))
      .collect()
    const hasTicketTypes = ticketTypes.length > 0
    if (!hasTicketTypes) {
      errors.push('At least one ticket type is required')
    }

    // Check form fields
    const formFields = await ctx.db
      .query('formFields')
      .withIndex('by_event', (q) => q.eq('eventId', eventId))
      .collect()
    const hasFormFields = formFields.length > 0
    if (!hasFormFields) {
      errors.push('At least one form field is required')
    }

    // Check bank details
    const hasBankDetails = !!(event.bankName && event.bankAccountNumber)
    if (!hasBankDetails) {
      errors.push('Bank details are required for payment processing')
    }

    const allPassed =
      hasDetails && hasTicketTypes && hasFormFields && hasBankDetails

    return {
      hasDetails,
      hasTicketTypes,
      hasFormFields,
      hasBankDetails,
      allPassed,
      errors
    }
  }
})

export const publishEvent = mutation({
  args: {
    eventId: v.id('events')
  },
  returns: v.object({
    slug: v.string()
  }),
  handler: async (ctx, { eventId }) => {
    await requirePlannerRole(ctx, eventId)

    const event = await ctx.db.get(eventId)
    if (!event) {
      throw new ConvexError('Event not found')
    }
    if (event.status !== 'draft') {
      throw new ConvexError('Only draft events can be published')
    }

    // Run all publish checks
    const errors: string[] = []

    if (
      !event.name ||
      !event.date ||
      !event.salesStartTime ||
      !event.salesEndTime
    ) {
      errors.push('Event details are incomplete')
    }

    const ticketTypes = await ctx.db
      .query('ticketTypes')
      .withIndex('by_event', (q) => q.eq('eventId', eventId))
      .collect()
    if (ticketTypes.length === 0) {
      errors.push('At least one ticket type is required')
    }

    const formFields = await ctx.db
      .query('formFields')
      .withIndex('by_event', (q) => q.eq('eventId', eventId))
      .collect()
    if (formFields.length === 0) {
      errors.push('At least one form field is required')
    }

    if (!event.bankName || !event.bankAccountNumber) {
      errors.push('Bank details are required')
    }

    if (errors.length > 0) {
      throw new ConvexError(`Cannot publish: ${errors.join('; ')}`)
    }

    await ctx.db.patch(eventId, { status: 'on_sale' as const })

    return { slug: event.slug }
  }
})

export const getEventBySlug = query({
  args: {
    slug: v.string()
  },
  returns: v.union(eventValidator, v.null()),
  handler: async (ctx, { slug }) => {
    // Public query — no auth required
    const event = await ctx.db
      .query('events')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .unique()

    return event ?? null
  }
})
