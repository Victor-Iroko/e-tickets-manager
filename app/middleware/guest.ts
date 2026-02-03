/**
 * Guest middleware - redirects authenticated users away from auth pages.
 * Add to pages with: definePageMeta({ middleware: 'guest' })
 */
export default defineNuxtRouteMiddleware(async () => {
  const { data: session } = await useAuthSession()

  if (session.value) {
    return navigateTo('/', {
      redirectCode: 302
    })
  }
})
