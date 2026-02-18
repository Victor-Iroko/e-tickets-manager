import type { ConvexClient } from 'convex/browser'

export function useConvexClient(): ConvexClient | null {
  return useNuxtApp().$convexClient ?? null
}
