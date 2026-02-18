/**
 * Bridges Better Auth sessions to Convex client auth.
 *
 * Convex calls need a Convex JWT (not the Better Auth session cookie), so
 * `setAuth` uses `getAuth()` for cached reads and fetches
 * `/api/auth/convex/token` only when Convex forces a refresh.
 */
export default defineNuxtPlugin({
  name: 'convex-auth',
  dependsOn: ['convex-client'],
  setup() {
    const convexClient = useConvexClient()
    let pendingTokenRequest: Promise<string | null> | null = null

    if (!convexClient) {
      return
    }

    convexClient.setAuth(
      async ({
        forceRefreshToken = false
      }: { forceRefreshToken?: boolean } = {}) => {
        if (pendingTokenRequest) {
          return pendingTokenRequest
        }

        if (!forceRefreshToken) {
          return convexClient.getAuth()?.token ?? null
        }

        pendingTokenRequest = (async () => {
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
          } finally {
            pendingTokenRequest = null
          }
        })()

        return pendingTokenRequest
      }
    )
  }
})
