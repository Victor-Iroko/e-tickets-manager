import type { ConvexClient } from 'convex/browser'

declare module '#app' {
  interface NuxtApp {
    $convexClient: ConvexClient | null
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $convexClient: ConvexClient | null
  }
}

export {}
