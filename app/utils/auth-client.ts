import { createAuthClient } from 'better-auth/vue'
import {
  convexClient,
  crossDomainClient
} from '@convex-dev/better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: '/api/auth',
  plugins: [convexClient(), crossDomainClient()]
})

export type Session = typeof authClient.$Infer.Session
