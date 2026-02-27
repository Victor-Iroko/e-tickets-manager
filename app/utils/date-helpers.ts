import {
  CalendarDateTime,
  type DateValue,
  getLocalTimeZone
} from '@internationalized/date'
import { format } from 'date-fns'

/**
 * Convert an epoch timestamp (ms) to CalendarDateTime for UInputDate.
 */
export function epochToCalendarDateTime(epoch: number): CalendarDateTime {
  const d = new Date(epoch)
  return new CalendarDateTime(
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate(),
    d.getHours(),
    d.getMinutes()
  )
}

/**
 * Convert a CalendarDateTime (or DateValue) to epoch timestamp (ms).
 */
export function calendarDateTimeToEpoch(dt: DateValue): number {
  return dt.toDate(getLocalTimeZone()).getTime()
}

/**
 * Format an epoch timestamp for display.
 */
export function formatEventDate(epoch: number): string {
  return format(new Date(epoch), 'PPP p')
}

/**
 * Format an epoch timestamp as date only.
 */
export function formatDate(epoch: number): string {
  return format(new Date(epoch), 'PPP')
}

/**
 * Format an epoch timestamp as time only.
 */
export function formatTime(epoch: number): string {
  return format(new Date(epoch), 'p')
}

/**
 * Format a price in Naira.
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount)
}
