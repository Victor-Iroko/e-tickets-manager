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
})
