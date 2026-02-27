import type { Session } from '~/utils/auth-client'
import { useFetch, useRequestHeaders } from '#app'

export async function useSession() {
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

  const { data: session, error } = await useFetch<Session | null>(
    '/api/auth/get-session',
    {
      key: 'auth-session',
      headers
    }
  )

  return {
    session,
    error
  }
}
