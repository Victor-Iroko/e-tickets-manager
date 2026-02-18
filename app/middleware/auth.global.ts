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

  const eventId =
    (to.params.eventId as string) ?? (to.params.id as string) ?? null

  if (!eventId) {
    return navigateTo('/forbidden')
  }

  const cookieHeaders = useRequestHeaders(['cookie'])

  try {
    const result = await $fetch<{ hasRole: boolean }>('/api/check-role', {
      query: { eventId, role: requiredRole },
      headers: cookieHeaders
    })

    if (!result.hasRole) {
      return navigateTo('/forbidden')
    }
  } catch {
    return navigateTo('/forbidden')
  }
})
