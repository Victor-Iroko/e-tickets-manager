import { v } from 'convex/values'

export const formFieldTypeValidator = v.union(
  v.literal('text'),
  v.literal('email'),
  v.literal('number'),
  v.literal('dropdown')
)

export const formFieldValidator = v.object({
  _id: v.id('formFields'),
  _creationTime: v.number(),
  eventId: v.id('events'),
  fieldLabel: v.string(),
  fieldType: formFieldTypeValidator,
  fieldOptions: v.optional(v.array(v.string())),
  isRequired: v.boolean(),
  sortOrder: v.number()
})
