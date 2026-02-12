import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  events: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    date: v.number(),
    salesStartTime: v.number(),
    salesEndTime: v.number(),
    status: v.union(
      v.literal('draft'),
      v.literal('on_sale'),
      v.literal('closed'),
      v.literal('completed')
    ),
    paymentAccountId: v.optional(v.string()),
    createdBy: v.id('users'),
    createdAt: v.number()
  })
    .index('by_created_by', ['createdBy'])
    .index('by_status', ['status']),

  eventRoles: defineTable({
    eventId: v.id('events'),
    userId: v.id('users'),
    role: v.union(v.literal('planner'), v.literal('scanner'))
  })
    .index('by_user', ['userId'])
    .index('by_event', ['eventId'])
    .index('by_user_event', ['userId', 'eventId']),

  ticketTypes: defineTable({
    eventId: v.id('events'),
    name: v.string(),
    price: v.number(),
    totalQuantity: v.number(),
    remainingQuantity: v.number(),
    metadata: v.optional(
      v.array(
        v.object({
          key: v.string(),
          value: v.string()
        })
      )
    )
  }).index('by_event', ['eventId']),

  purchases: defineTable({
    eventId: v.id('events'),
    buyerEmail: v.string(),
    buyerName: v.string(),
    totalAmount: v.number(),
    paymentReference: v.optional(v.string()),
    status: v.union(
      v.literal('pending'),
      v.literal('completed'),
      v.literal('failed'),
      v.literal('refunded')
    ),
    createdAt: v.number()
  })
    .index('by_event', ['eventId'])
    .index('by_status', ['status']),

  tickets: defineTable({
    purchaseId: v.id('purchases'),
    ticketTypeId: v.id('ticketTypes'),
    eventId: v.id('events'),
    uniqueCode: v.string(),
    qrCode: v.optional(v.string()),
    status: v.union(
      v.literal('valid'),
      v.literal('used'),
      v.literal('cancelled'),
      v.literal('refunded')
    ),
    checkedInAt: v.optional(v.number()),
    checkedInBy: v.optional(v.id('users')),
    formData: v.optional(v.string()),
    createdAt: v.number()
  })
    .index('by_purchase', ['purchaseId'])
    .index('by_event', ['eventId'])
    .index('by_unique_code', ['uniqueCode']),

  formFields: defineTable({
    eventId: v.id('events'),
    fieldLabel: v.string(),
    fieldType: v.union(
      v.literal('text'),
      v.literal('email'),
      v.literal('number'),
      v.literal('dropdown')
    ),
    fieldOptions: v.optional(v.array(v.string())),
    isRequired: v.boolean(),
    sortOrder: v.number()
  }).index('by_event', ['eventId']),

  formResponses: defineTable({
    eventId: v.id('events'),
    purchaseId: v.id('purchases'),
    responses: v.string(),
    submittedAt: v.number()
  })
    .index('by_event', ['eventId'])
    .index('by_purchase', ['purchaseId'])
})
