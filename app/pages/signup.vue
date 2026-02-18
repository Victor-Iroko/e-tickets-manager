<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  auth: false,
  layout: 'auth'
})

useSeoMeta({
  title: 'Sign Up — Ticketly'
})

const { signUpWithEmail, signInWithGoogle, isLoading } = useAuth()
const route = useRoute()

const state = reactive<Partial<SignupSchema>>({
  name: '',
  email: '',
  password: ''
})

async function onSubmit(event: FormSubmitEvent<SignupSchema>) {
  await signUpWithEmail(event.data.email, event.data.password, event.data.name)
}

const redirectQuery = computed(() =>
  route.query.redirect ? `?redirect=${route.query.redirect}` : ''
)
</script>

<template>
  <AuthLayout
    title="Create your account"
    subtitle="Get started with Ticketly — create events, sell tickets, and manage entry."
  >
    <UForm
      :schema="signupSchema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField name="name" label="Full name" class="w-full" required>
        <UInput
          v-model="state.name"
          placeholder="Jane Doe"
          icon="i-lucide-user"
          size="lg"
          class="w-full"
          autofocus
        />
      </UFormField>

      <UFormField name="email" label="Email" class="w-full" required>
        <UInput
          v-model="state.email"
          type="email"
          placeholder="you@example.com"
          icon="i-lucide-mail"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UFormField name="password" label="Password" class="w-full" required>
        <UInput
          v-model="state.password"
          type="password"
          placeholder="Minimum 8 characters"
          icon="i-lucide-lock"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UButton
        type="submit"
        label="Create Account"
        icon="i-lucide-user-plus"
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
      Already have an account?
      <NuxtLink
        :to="`/login${redirectQuery}`"
        class="font-medium text-primary hover:underline"
      >
        Sign in
      </NuxtLink>
    </p>
  </AuthLayout>
</template>
