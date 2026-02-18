<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  auth: false,
  layout: 'auth'
})

useSeoMeta({
  title: 'Forgot Password — Ticketly'
})

const { forgotPassword, isLoading } = useAuth()
const emailSent = ref(false)

const state = reactive<Partial<ForgotPasswordSchema>>({
  email: ''
})

async function onSubmit(event: FormSubmitEvent<ForgotPasswordSchema>) {
  const success = await forgotPassword(event.data.email)
  if (success) {
    emailSent.value = true
  }
}
</script>

<template>
  <AuthLayout
    title="Forgot your password?"
    subtitle="Enter your email and we'll send you a link to reset it."
  >
    <!-- Success state -->
    <div v-if="emailSent" class="space-y-4">
      <UAlert
        title="Check your email"
        description="We've sent a password reset link to your email address. It may take a few minutes to arrive."
        icon="i-lucide-mail-check"
        color="success"
        variant="subtle"
      />
      <UButton
        label="Back to Sign In"
        to="/login"
        color="neutral"
        variant="outline"
        size="lg"
        block
      />
    </div>

    <!-- Form state -->
    <template v-else>
      <UForm
        :schema="forgotPasswordSchema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField name="email" label="Email" class="w-full" required>
          <UInput
            v-model="state.email"
            type="email"
            placeholder="you@example.com"
            icon="i-lucide-mail"
            size="lg"
            class="w-full"
            autofocus
          />
        </UFormField>

        <UButton
          type="submit"
          label="Send Reset Link"
          icon="i-lucide-send"
          size="lg"
          :loading="isLoading"
          block
        />
      </UForm>

      <p class="mt-6 text-center text-sm text-muted">
        Remember your password?
        <NuxtLink to="/login" class="font-medium text-primary hover:underline">
          Sign in
        </NuxtLink>
      </p>
    </template>
  </AuthLayout>
</template>
