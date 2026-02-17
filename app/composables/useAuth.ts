export function useAuth() {
  const isLoading = useState<boolean>('auth-loading', () => false)
  const toast = useToast()
  const route = useRoute()
  const redirect = (route.query.redirect as string) || '/dashboard'

  async function signUpWithEmail(
    email: string,
    password: string,
    name: string
  ): Promise<boolean> {
    isLoading.value = true
    try {
      await authClient.signUp.email({ email, password, name })
      await navigateTo(redirect)
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
      await navigateTo(redirect)
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
        callbackURL: redirect
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

  async function signOut(): Promise<void> {
    await authClient.signOut()
    await navigateTo('/login')
  }

  async function forgotPassword(
    email: string,
    redirectTo?: string
  ): Promise<boolean> {
    isLoading.value = true
    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: redirectTo || '/reset-password'
      })
      return true
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to send reset email'
      toast.add({
        title: 'Error',
        description: message,
        color: 'error'
      })
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function resetPassword(
    token: string,
    newPassword: string
  ): Promise<boolean> {
    isLoading.value = true
    try {
      await authClient.resetPassword({
        token,
        newPassword
      })
      return true
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to reset password'
      toast.add({
        title: 'Error',
        description: message,
        color: 'error'
      })
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading: readonly(isLoading),
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    forgotPassword,
    resetPassword
  }
}
