import { authClient } from '~/utils/auth-client'

/**
 * SSR-compatible auth composable.
 * Uses useFetch wrapper to ensure cookies are forwarded correctly during SSR.
 */
export function useAuth() {
  const session = authClient.useSession()

  const user = computed(() => session.value.data?.user ?? null)
  const isAuthenticated = computed(
    () => !!session.value.data && !session.value.isPending
  )
  const isLoading = computed(() => session.value.isPending)

  async function signInWithEmail(email: string, password: string) {
    return authClient.signIn.email({
      email,
      password
    })
  }

  async function signUpWithEmail(
    email: string,
    password: string,
    name?: string
  ) {
    return authClient.signUp.email({
      email,
      password,
      name: name ?? email.split('@')[0] ?? 'User'
    })
  }

  async function signInWithGoogle() {
    return authClient.signIn.social({
      provider: 'google',
      callbackURL: '/'
    })
  }

  async function signOut() {
    return authClient.signOut()
  }

  return {
    session,
    user,
    isAuthenticated,
    isLoading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut
  }
}

/**
 * SSR-compatible session fetching using useFetch.
 * Use this in middleware or when you need SSR-compatible session data.
 */
export async function useAuthSession() {
  // Custom useFetch wrapper that handles relative URLs for SSR cookie forwarding
  const relativeFetch = ((url: string, opts?: Record<string, unknown>) => {
    let processedUrl = url
    try {
      if (url.startsWith('http')) processedUrl = new URL(url).pathname
    } catch {
      // Keep original URL if parsing fails
    }
    return useFetch(processedUrl, opts)
  }) as typeof useFetch

  return await authClient.useSession(relativeFetch)
}
