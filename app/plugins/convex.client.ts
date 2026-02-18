import { ConvexClient } from 'convex/browser'

export default defineNuxtPlugin({
  name: 'convex-client',
  setup() {
    const convexUrl = useRuntimeConfig().public.convexUrl
    const convexClient: ConvexClient | null =
      typeof convexUrl === 'string' && convexUrl.length > 0
        ? new ConvexClient(convexUrl)
        : null

    return {
      provide: {
        convexClient
      }
    }
  }
})
