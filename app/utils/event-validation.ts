import { z } from 'zod/mini'

export const createEventSchema = z
  .object({
    name: z
      .string()
      .check(
        z.minLength(3, 'Event name must be at least 3 characters'),
        z.maxLength(100, 'Event name must be at most 100 characters')
      ),
    description: z.optional(
      z
        .string()
        .check(z.maxLength(500, 'Description must be at most 500 characters'))
    ),
    date: z.number().check(z.minimum(1, 'Event date is required')),
    salesStartTime: z
      .number()
      .check(z.minimum(1, 'Sales start time is required')),
    salesEndTime: z.number().check(z.minimum(1, 'Sales end time is required')),
    bankName: z.optional(
      z.string().check(z.minLength(1, 'Bank name cannot be empty'))
    ),
    bankAccountNumber: z.optional(
      z
        .string()
        .check(
          z.minLength(10, 'Account number must be at least 10 digits'),
          z.maxLength(10, 'Account number must be at most 10 digits')
        )
    )
  })
  .check(
    z.refine((data) => data.salesStartTime < data.salesEndTime, {
      message: 'Sales start must be before sales end',
      path: ['salesEndTime']
    }),
    z.refine((data) => data.salesEndTime < data.date, {
      message: 'Sales end must be before the event date',
      path: ['date']
    })
  )

export type CreateEventSchema = z.infer<typeof createEventSchema>

export const ticketTypeSchema = z.object({
  name: z
    .string()
    .check(
      z.minLength(1, 'Ticket name is required'),
      z.maxLength(50, 'Ticket name must be at most 50 characters')
    ),
  price: z.number().check(z.minimum(0, 'Price must be zero or greater')),
  totalQuantity: z.number().check(z.minimum(1, 'Quantity must be at least 1'))
})

export type TicketTypeSchema = z.infer<typeof ticketTypeSchema>

export const formFieldSchema = z
  .object({
    fieldLabel: z
      .string()
      .check(
        z.minLength(1, 'Field label is required'),
        z.maxLength(100, 'Field label must be at most 100 characters')
      ),
    fieldType: z.union([
      z.literal('text'),
      z.literal('email'),
      z.literal('number'),
      z.literal('dropdown')
    ]),
    fieldOptions: z.optional(z.array(z.string())),
    isRequired: z.boolean()
  })
  .check(
    z.refine(
      (data) => {
        if (data.fieldType === 'dropdown') {
          return data.fieldOptions && data.fieldOptions.length > 0
        }
        return true
      },
      {
        message: 'Dropdown fields require at least one option',
        path: ['fieldOptions']
      }
    )
  )

export type FormFieldSchema = z.infer<typeof formFieldSchema>
