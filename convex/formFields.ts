import { ConvexError, v } from 'convex/values'
import { query, mutation } from './_generated/server'
import { requirePlannerRole } from './utils/auth.utils'
import {
  formFieldTypeValidator,
  formFieldValidator
} from './validators/formFields'

export const listByEvent = query({
  args: {
    eventId: v.id('events')
  },
  returns: v.array(formFieldValidator),
  handler: async (ctx, { eventId }) => {
    await requirePlannerRole(ctx, eventId)

    const fields = await ctx.db
      .query('formFields')
      .withIndex('by_event', (q) => q.eq('eventId', eventId))
      .collect()

    // Sort by sortOrder ascending
    fields.sort((a, b) => a.sortOrder - b.sortOrder)

    return fields
  }
})

export const createFormField = mutation({
  args: {
    eventId: v.id('events'),
    fieldLabel: v.string(),
    fieldType: formFieldTypeValidator,
    fieldOptions: v.optional(v.array(v.string())),
    isRequired: v.boolean()
  },
  returns: v.id('formFields'),
  handler: async (ctx, args) => {
    await requirePlannerRole(ctx, args.eventId)

    const event = await ctx.db.get(args.eventId)
    if (!event) {
      throw new ConvexError('Event not found')
    }

    // Validate dropdown requires options
    if (args.fieldType === 'dropdown') {
      if (!args.fieldOptions || args.fieldOptions.length === 0) {
        throw new ConvexError('Dropdown fields must have at least one option')
      }
    }

    // Auto-assign sortOrder (max + 1)
    const existingFields = await ctx.db
      .query('formFields')
      .withIndex('by_event', (q) => q.eq('eventId', args.eventId))
      .collect()

    const maxOrder =
      existingFields.length > 0
        ? Math.max(...existingFields.map((f) => f.sortOrder))
        : -1

    const fieldId = await ctx.db.insert('formFields', {
      eventId: args.eventId,
      fieldLabel: args.fieldLabel,
      fieldType: args.fieldType,
      fieldOptions: args.fieldOptions,
      isRequired: args.isRequired,
      sortOrder: maxOrder + 1
    })

    return fieldId
  }
})

export const updateFormField = mutation({
  args: {
    formFieldId: v.id('formFields'),
    fieldLabel: v.optional(v.string()),
    fieldType: v.optional(formFieldTypeValidator),
    fieldOptions: v.optional(v.array(v.string())),
    isRequired: v.optional(v.boolean())
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const field = await ctx.db.get(args.formFieldId)
    if (!field) {
      throw new ConvexError('Form field not found')
    }

    await requirePlannerRole(ctx, field.eventId)

    // Check if event has completed purchases — restrict destructive changes
    const purchases = await ctx.db
      .query('purchases')
      .withIndex('by_event', (q) => q.eq('eventId', field.eventId))
      .collect()
    const hasCompletedPurchases = purchases.some(
      (p) => p.status === 'completed'
    )

    if (hasCompletedPurchases) {
      // After purchases, only allow label changes and making fields optional
      if (args.fieldType !== undefined && args.fieldType !== field.fieldType) {
        throw new ConvexError(
          'Cannot change field type after tickets have been purchased'
        )
      }
      if (args.isRequired === true && !field.isRequired) {
        throw new ConvexError(
          'Cannot make a field required after tickets have been purchased'
        )
      }
    }

    // Validate dropdown options
    const effectiveType = args.fieldType ?? field.fieldType
    if (effectiveType === 'dropdown') {
      const effectiveOptions = args.fieldOptions ?? field.fieldOptions
      if (!effectiveOptions || effectiveOptions.length === 0) {
        throw new ConvexError('Dropdown fields must have at least one option')
      }
    }

    const patch: Record<string, unknown> = {}
    if (args.fieldLabel !== undefined) patch.fieldLabel = args.fieldLabel
    if (args.fieldType !== undefined) patch.fieldType = args.fieldType
    if (args.fieldOptions !== undefined) patch.fieldOptions = args.fieldOptions
    if (args.isRequired !== undefined) patch.isRequired = args.isRequired

    await ctx.db.patch(args.formFieldId, patch)
    return null
  }
})

export const deleteFormField = mutation({
  args: {
    formFieldId: v.id('formFields')
  },
  returns: v.null(),
  handler: async (ctx, { formFieldId }) => {
    const field = await ctx.db.get(formFieldId)
    if (!field) {
      throw new ConvexError('Form field not found')
    }

    await requirePlannerRole(ctx, field.eventId)

    // Check if event has completed purchases
    const purchases = await ctx.db
      .query('purchases')
      .withIndex('by_event', (q) => q.eq('eventId', field.eventId))
      .collect()
    const hasCompletedPurchases = purchases.some(
      (p) => p.status === 'completed'
    )

    if (hasCompletedPurchases) {
      throw new ConvexError(
        'Cannot delete form fields after tickets have been purchased'
      )
    }

    await ctx.db.delete(formFieldId)
    return null
  }
})

export const reorderFormFields = mutation({
  args: {
    eventId: v.id('events'),
    orderedIds: v.array(v.id('formFields'))
  },
  returns: v.null(),
  handler: async (ctx, { eventId, orderedIds }) => {
    await requirePlannerRole(ctx, eventId)

    // Verify all IDs belong to this event
    for (const [i, fieldId] of orderedIds.entries()) {
      const field = await ctx.db.get(fieldId)
      if (!field) {
        throw new ConvexError(`Form field not found: ${fieldId}`)
      }
      if (field.eventId !== eventId) {
        throw new ConvexError('Form field does not belong to this event')
      }
      await ctx.db.patch(fieldId, { sortOrder: i })
    }

    return null
  }
})
