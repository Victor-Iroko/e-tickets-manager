<script setup lang="ts">
definePageMeta({
  middleware: 'guest'
})

const { signUpWithEmail, signInWithGoogle } = useAuth()
const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const error = ref<string | null>(null)
const isSubmitting = ref(false)

async function handleRegister() {
  error.value = null

  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  if (form.password.length < 8) {
    error.value = 'Password must be at least 8 characters'
    return
  }

  isSubmitting.value = true

  try {
    const result = await signUpWithEmail(form.email, form.password, form.name)
    if (result.error) {
      error.value = result.error.message ?? 'Registration failed'
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
        <h1 class="text-2xl font-bold">Create Account</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Sign up for a new account.
        </p>
      </template>

      <UForm :state="form" class="space-y-4" @submit="handleRegister">
        <UFormField label="Name" name="name">
          <UInput
            v-model="form.name"
            type="text"
            placeholder="John Doe"
            autocomplete="name"
          />
        </UFormField>

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
            autocomplete="new-password"
          />
        </UFormField>

        <UFormField label="Confirm Password" name="confirmPassword">
          <UInput
            v-model="form.confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            autocomplete="new-password"
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
          Create Account
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
          Already have an account?
          <NuxtLink to="/login" class="font-medium text-primary">
            Sign in
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
