import { v } from 'convex/values'

export const eventStatusValidator = v.union(
  v.literal('draft'),
  v.literal('on_sale'),
  v.literal('closed'),
  v.literal('completed')
)

export const eventValidator = v.object({
  _id: v.id('events'),
  _creationTime: v.number(),
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  date: v.number(),
  salesStartTime: v.number(),
  salesEndTime: v.number(),
  status: eventStatusValidator,
  bankName: v.optional(v.string()),
  bankAccountNumber: v.optional(v.string()),
  paymentAccountId: v.optional(v.string()),
  createdBy: v.string(),
  createdAt: v.number()
})

export const publishChecklistValidator = v.object({
  hasDetails: v.boolean(),
  hasTicketTypes: v.boolean(),
  hasFormFields: v.boolean(),
  hasBankDetails: v.boolean(),
  allPassed: v.boolean(),
  errors: v.array(v.string())
})

/**
 * Generate a URL-friendly slug from an event name.
 * Appends a random 4-character suffix for uniqueness.
 */
export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  const suffix = Math.random().toString(36).substring(2, 6)
  return `${base}-${suffix}`
}
