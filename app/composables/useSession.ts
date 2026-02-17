export async function useSession() {
  const { data: session, error } = await authClient.useSession(
    (url, options) => {
      const cookieHeaders = useRequestHeaders(['cookie'])
      return useFetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          cookie: cookieHeaders.cookie
        }
      })
    }
  )

  return {
    session,
    error
  }
}
