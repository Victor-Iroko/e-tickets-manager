/**
 * Auth middleware - protects routes from unauthenticated users.
 * Add to pages with: definePageMeta({ middleware: 'auth' })
 */
export default defineNuxtRouteMiddleware(async () => {
  const { data: session } = await useAuthSession()

  if (!session.value) {
    return navigateTo('/login', {
      redirectCode: 302
    })
  }
})
