/**
 * Bridges Better Auth sessions to Convex client auth.
 *
 * Convex calls need a Convex JWT (not the Better Auth session cookie), so
 * `setAuth` fetches `/api/auth/convex/token` and returns it to the SDK.
 */
export default defineNuxtPlugin({
  name: 'convex-auth',
  dependsOn: ['convex-client'],
  setup() {
    const convexClient = useConvexClient()

    if (!convexClient) {
      return
    }

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
  }
})
