import type { QueryCtx, MutationCtx } from '../_generated/server'
import type { Id } from '../_generated/dataModel'
import { authComponent } from '../auth'
import { ConvexError } from 'convex/values'

/**
 * Get the authenticated user or throw an error.
 * Use in any Convex function that requires authentication.
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const user = await authComponent.safeGetAuthUser(ctx)
  if (!user) {
    throw new ConvexError('Authentication required')
  }
  return user
}

/**
 * Verify the current user has the 'planner' role for an event.
 * Returns the authenticated user on success, throws on failure.
 */
export async function requirePlannerRole(
  ctx: QueryCtx | MutationCtx,
  eventId: Id<'events'>
) {
  const user = await requireAuth(ctx)

  const association = await ctx.db
    .query('eventRoles')
    .withIndex('by_user_event', (q) =>
      q.eq('userId', user._id).eq('eventId', eventId)
    )
    .unique()

  if (!association || association.role !== 'planner') {
    throw new ConvexError('Planner role required for this event')
  }

  return user
}

/**
 * Verify the current user has the 'scanner' role for an event.
 * Returns the authenticated user on success, throws on failure.
 */
export async function requireScannerRole(
  ctx: QueryCtx | MutationCtx,
  eventId: Id<'events'>
) {
  const user = await requireAuth(ctx)

  const association = await ctx.db
    .query('eventRoles')
    .withIndex('by_user_event', (q) =>
      q.eq('userId', user._id).eq('eventId', eventId)
    )
    .unique()

  if (!association || association.role !== 'scanner') {
    throw new ConvexError('Scanner role required for this event')
  }

  return user
}
