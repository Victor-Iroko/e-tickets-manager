/**
 * Bridges Better Auth sessions to Convex client auth.
 *
 * Convex calls need a Convex JWT (not the Better Auth session cookie), so
 * `setAuth` fetches `/api/auth/convex/token` and returns it to the SDK.
 *
 * Client-only because `useConvex()` relies on Vue inject() in the browser app.
 */
export default defineNuxtPlugin(() => {
  const convexClient = useConvex()

  convexClient.setAuth(async () => {
    try {
      const response = await $fetch<{ token: string }>(
        '/api/auth/convex/token',
        {
          credentials: 'include'
        }
      )
      return response.token ?? null
    } catch {
      return null
    }
  })
})
