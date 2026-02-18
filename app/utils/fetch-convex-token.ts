type FetchConvexTokenResult = {
  token: string | null
  convexUrl: string | null
}

export async function fetchConvexToken(): Promise<FetchConvexTokenResult> {
  const convexUrl = useRuntimeConfig().public.convexUrl
  if (typeof convexUrl !== 'string' || convexUrl.length === 0) {
    return { token: null, convexUrl: null }
  }

  const cookieHeaders = useRequestHeaders(['cookie'])
  const response = await $fetch<{ token: string | null }>(
    '/api/auth/convex/token',
    {
      headers: cookieHeaders
    }
  )

  return { token: response.token, convexUrl }
}
