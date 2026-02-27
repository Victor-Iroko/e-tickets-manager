import { v } from 'convex/values'

export const metadataValidator = v.optional(
  v.array(
    v.object({
      key: v.string(),
      value: v.string()
    })
  )
)

export const ticketTypeValidator = v.object({
  _id: v.id('ticketTypes'),
  _creationTime: v.number(),
  eventId: v.id('events'),
  name: v.string(),
  price: v.number(),
  totalQuantity: v.number(),
  remainingQuantity: v.number(),
  metadata: metadataValidator
})
