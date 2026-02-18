import type { Id } from '~~/convex/_generated/dataModel'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.meta.auth === false) {
    return
  }

  const { session } = await useSession()

  if (!session.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }

  const requiredRole = to.meta.requiredRole
  if (!requiredRole) {
    return
  }

  const eventId = ((to.params.eventId as string) ??
    (to.params.id as string) ??
    null) as Id<'events'> | null

  if (!eventId) {
    return navigateTo('/forbidden')
  }

  try {
    const hasRole = await checkRole(eventId, requiredRole)

    if (!hasRole) {
      return navigateTo('/forbidden')
    }
  } catch {
    return navigateTo('/forbidden')
  }
})
