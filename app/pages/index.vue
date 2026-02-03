<script setup lang="ts">
const { session, user, isAuthenticated, isLoading, signOut } = useAuth()
const router = useRouter()

async function handleSignOut() {
  await signOut()
  await router.push('/login')
}
</script>

<template>
  <div class="min-h-screen p-8">
    <UCard class="mx-auto max-w-2xl">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold">E-Tickets Manager</h1>
          <div v-if="isLoading">
            <UButton loading disabled>Loading...</UButton>
          </div>
          <div v-else-if="isAuthenticated">
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-500">
                {{ user?.email }}
              </span>
              <UButton color="neutral" variant="ghost" @click="handleSignOut">
                Sign Out
              </UButton>
            </div>
          </div>
          <div v-else class="flex gap-2">
            <UButton to="/login" variant="ghost">Sign In</UButton>
            <UButton to="/register">Sign Up</UButton>
          </div>
        </div>
      </template>

      <div v-if="isAuthenticated" class="space-y-4">
        <UAlert
          color="success"
          variant="soft"
          title="You are signed in!"
          icon="i-lucide-check-circle"
        />

        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <h3 class="mb-2 font-medium">Session Info</h3>
          <pre class="overflow-auto text-xs">{{
            JSON.stringify(session.value.data, null, 2)
          }}</pre>
        </div>
      </div>

      <div v-else class="py-8 text-center">
        <p class="mb-4 text-gray-500 dark:text-gray-400">
          Please sign in to access your e-tickets.
        </p>
        <div class="flex justify-center gap-2">
          <UButton to="/login">Sign In</UButton>
          <UButton to="/register" variant="outline">Create Account</UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
