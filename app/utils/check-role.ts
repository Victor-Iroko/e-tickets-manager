import { ConvexHttpClient } from 'convex/browser'
import { api } from '~~/convex/_generated/api'
import type { Id } from '~~/convex/_generated/dataModel'

export async function checkRole(
  eventId: Id<'events'>,
  requiredRole: 'planner' | 'scanner'
): Promise<boolean> {
  if (import.meta.server) {
    return checkRoleOnServer(eventId, requiredRole)
  }

  return checkRoleOnClient(eventId, requiredRole)
}

async function checkRoleOnClient(
  eventId: Id<'events'>,
  requiredRole: 'planner' | 'scanner'
): Promise<boolean> {
  const client = useConvexClient()
  if (!client) {
    return false
  }

  const result = await client.query(api.eventRoles.checkRole, {
    eventId,
    requiredRole
  })

  return result.hasRole
}

async function checkRoleOnServer(
  eventId: Id<'events'>,
  requiredRole: 'planner' | 'scanner'
): Promise<boolean> {
  const { token, convexUrl } = await fetchConvexToken()

  if (!token || !convexUrl) {
    return false
  }

  const client = new ConvexHttpClient(convexUrl)
  client.setAuth(token)

  const result = await client.query(api.eventRoles.checkRole, {
    eventId,
    requiredRole
  })

  return result.hasRole
}
