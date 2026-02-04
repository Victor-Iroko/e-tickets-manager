export function useAuth() {
  const isLoading = useState<boolean>('auth-loading', () => false)
  const toast = useToast()

  async function signUpWithEmail(
    email: string,
    password: string,
    name: string
  ): Promise<boolean> {
    isLoading.value = true
    try {
      await authClient.signUp.email({ email, password, name })
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed'
      toast.add({
        title: 'Sign up failed',
        description: message,
        color: 'error'
      })
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function signInWithEmail(
    email: string,
    password: string
  ): Promise<boolean> {
    isLoading.value = true
    try {
      await authClient.signIn.email({ email, password })
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed'
      toast.add({
        title: 'Sign in failed',
        description: message,
        color: 'error'
      })
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function signInWithGoogle(): Promise<void> {
    isLoading.value = true
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/'
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed'
      toast.add({
        title: 'Sign in failed',
        description: message,
        color: 'error'
      })
      isLoading.value = false
    }
  }

  async function signOut() {
    await authClient.signOut()
  }

  return {
    isLoading: readonly(isLoading),
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut
  }
}
