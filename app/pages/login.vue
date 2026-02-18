<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  auth: false,
  layout: 'auth'
})

useSeoMeta({
  title: 'Sign In — Ticketly'
})

const { signInWithEmail, signInWithGoogle, isLoading } = useAuth()
const route = useRoute()

const state = reactive<Partial<LoginSchema>>({
  email: '',
  password: ''
})

async function onSubmit(event: FormSubmitEvent<LoginSchema>) {
  await signInWithEmail(event.data.email, event.data.password)
}

const redirectQuery = computed(() =>
  route.query.redirect ? `?redirect=${route.query.redirect}` : ''
)
</script>

<template>
  <AuthLayout
    title="Welcome back"
    subtitle="Sign in to your account to manage events and tickets."
  >
    <UForm
      :schema="loginSchema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField name="email" label="Email" required>
        <UInput
          v-model="state.email"
          type="email"
          placeholder="you@example.com"
          icon="i-lucide-mail"
          size="lg"
          autofocus
        />
      </UFormField>

      <UFormField name="password" label="Password" required>
        <template #hint>
          <NuxtLink
            :to="`/forgot-password${redirectQuery}`"
            class="text-xs text-primary hover:underline"
          >
            Forgot password?
          </NuxtLink>
        </template>
        <UInput
          v-model="state.password"
          type="password"
          placeholder="Enter your password"
          icon="i-lucide-lock"
          size="lg"
        />
      </UFormField>

      <UButton
        type="submit"
        label="Sign In"
        icon="i-lucide-log-in"
        size="lg"
        :loading="isLoading"
        block
      />
    </UForm>

    <div class="relative my-6">
      <USeparator label="or" />
    </div>

    <UButton
      label="Continue with Google"
      icon="i-simple-icons-google"
      color="neutral"
      variant="outline"
      size="lg"
      block
      :loading="isLoading"
      @click="signInWithGoogle()"
    />

    <p class="mt-6 text-center text-sm text-muted">
      Don't have an account?
      <NuxtLink
        :to="`/signup${redirectQuery}`"
        class="font-medium text-primary hover:underline"
      >
        Sign up
      </NuxtLink>
    </p>
  </AuthLayout>
</template>
