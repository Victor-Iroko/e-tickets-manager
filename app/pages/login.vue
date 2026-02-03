<script setup lang="ts">
definePageMeta({
  middleware: 'guest'
})

const { signInWithEmail, signInWithGoogle } = useAuth()
const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const error = ref<string | null>(null)
const isSubmitting = ref(false)

async function handleEmailLogin() {
  error.value = null
  isSubmitting.value = true

  try {
    const result = await signInWithEmail(form.email, form.password)
    if (result.error) {
      error.value = result.error.message ?? 'Login failed'
    } else {
      await router.push('/')
    }
  } catch (e: unknown) {
    const err = e as Error
    error.value = err.message ?? 'An unexpected error occurred'
  } finally {
    isSubmitting.value = false
  }
}

async function handleGoogleLogin() {
  error.value = null
  try {
    await signInWithGoogle()
  } catch (e: unknown) {
    const err = e as Error
    error.value = err.message ?? 'Google login failed'
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-2xl font-bold">Sign In</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Welcome back! Sign in to your account.
        </p>
      </template>

      <UForm :state="form" class="space-y-4" @submit="handleEmailLogin">
        <UFormField label="Email" name="email">
          <UInput
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
            required
            autocomplete="email"
          />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </UFormField>

        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          :title="error"
          icon="i-lucide-alert-circle"
        />

        <UButton
          type="submit"
          block
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          Sign In
        </UButton>
      </UForm>

      <USeparator label="or" class="my-6" />

      <UButton
        block
        color="neutral"
        variant="outline"
        icon="i-simple-icons-google"
        @click="handleGoogleLogin"
      >
        Continue with Google
      </UButton>

      <template #footer>
        <p class="text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?
          <NuxtLink to="/register" class="font-medium text-primary">
            Sign up
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
