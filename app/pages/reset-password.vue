<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  auth: false,
  layout: 'auth'
})

useSeoMeta({
  title: 'Reset Password — Ticketly'
})

const { resetPassword, isLoading } = useAuth()
const route = useRoute()
const token = computed(() => (route.query.token as string) || '')
const resetComplete = ref(false)

const state = reactive<Partial<ResetPasswordSchema>>({
  password: '',
  confirmPassword: ''
})

async function onSubmit(event: FormSubmitEvent<ResetPasswordSchema>) {
  const success = await resetPassword(token.value, event.data.password)
  if (success) {
    resetComplete.value = true
  }
}
</script>

<template>
  <AuthLayout
    title="Reset your password"
    subtitle="Choose a new password for your account."
  >
    <!-- Missing token error -->
    <div v-if="!token" class="space-y-4">
      <UAlert
        title="Invalid reset link"
        description="This password reset link is missing or invalid. Please request a new one."
        icon="i-lucide-alert-triangle"
        color="error"
        variant="subtle"
      />
      <UButton label="Request New Link" to="/forgot-password" size="lg" block />
    </div>

    <!-- Success state -->
    <div v-else-if="resetComplete" class="space-y-4">
      <UAlert
        title="Password reset successful"
        description="Your password has been updated. You can now sign in with your new password."
        icon="i-lucide-check-circle"
        color="success"
        variant="subtle"
      />
      <UButton
        label="Sign In"
        to="/login"
        icon="i-lucide-log-in"
        size="lg"
        block
      />
    </div>

    <!-- Form state -->
    <template v-else>
      <UForm
        :schema="resetPasswordSchema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          name="password"
          label="New password"
          class="w-full"
          required
        >
          <UInput
            v-model="state.password"
            type="password"
            placeholder="Minimum 8 characters"
            icon="i-lucide-lock"
            size="lg"
            class="w-full"
            autofocus
          />
        </UFormField>

        <UFormField
          name="confirmPassword"
          label="Confirm password"
          class="w-full"
          required
        >
          <UInput
            v-model="state.confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            icon="i-lucide-lock"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          label="Reset Password"
          icon="i-lucide-key-round"
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
