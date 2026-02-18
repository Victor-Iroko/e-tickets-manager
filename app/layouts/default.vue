<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

const { session } = await useSession()
const { signOut } = useAuth()

const navItems = computed<NavigationMenuItem[]>(() => [
  { label: 'Features', to: '/#features', exactHash: true },
  { label: 'How It Works', to: '/#how-it-works', exactHash: true },
  { label: 'Roles', to: '/#roles', exactHash: true }
])

const userMenuItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: 'Dashboard',
      icon: 'i-lucide-layout-dashboard',
      to: '/dashboard'
    },
    { label: 'Account', icon: 'i-lucide-user', to: '/account' }
  ],
  [
    {
      label: 'Sign out',
      icon: 'i-lucide-log-out',
      onSelect: () => signOut()
    }
  ]
])
</script>

<template>
  <div>
    <UHeader>
      <template #title>
        <NuxtLink
          to="/"
          class="flex items-center gap-2 font-heading text-xl font-bold tracking-tight"
        >
          <UIcon name="i-lucide-ticket" class="size-6 text-primary" />
          Ticketly
        </NuxtLink>
      </template>

      <UNavigationMenu :items="navItems" />

      <template #right>
        <template v-if="session">
          <UButton
            label="Dashboard"
            to="/dashboard"
            color="neutral"
            variant="ghost"
            icon="i-lucide-layout-dashboard"
          />
          <UDropdownMenu :items="userMenuItems">
            <UAvatar
              :text="session.user?.name?.charAt(0) ?? '?'"
              :src="session.user?.image ?? undefined"
              icon="i-lucide:user-round"
              size="sm"
            />
          </UDropdownMenu>
        </template>
        <template v-else>
          <UButton label="Log in" to="/login" color="neutral" variant="ghost" />
          <UButton label="Get Started" to="/signup" />
        </template>
      </template>

      <template #body>
        <UNavigationMenu
          :items="navItems"
          orientation="vertical"
          class="-mx-2.5"
        />
        <USeparator class="my-4" />
        <template v-if="session">
          <UButton
            label="Dashboard"
            to="/dashboard"
            color="neutral"
            variant="ghost"
            icon="i-lucide-layout-dashboard"
            block
          />
          <UButton
            label="Account"
            to="/account"
            color="neutral"
            variant="ghost"
            icon="i-lucide-user"
            block
          />
          <UButton
            label="Sign out"
            color="neutral"
            variant="ghost"
            icon="i-lucide-log-out"
            block
            @click="signOut()"
          />
        </template>
        <template v-else>
          <UButton
            label="Log in"
            to="/login"
            color="neutral"
            variant="ghost"
            block
          />
          <UButton label="Get Started" to="/signup" block />
        </template>
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <UFooter>
      <template #left>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-ticket" class="size-4 text-primary" />
          <p class="text-sm text-muted">
            &copy; {{ new Date().getFullYear() }} Ticketly. All rights reserved.
          </p>
        </div>
      </template>
      <template #right>
        <div class="flex items-center gap-1">
          <UButton
            label="Features"
            to="/#features"
            color="neutral"
            variant="link"
            size="sm"
          />
          <UButton
            label="How It Works"
            to="/#how-it-works"
            color="neutral"
            variant="link"
            size="sm"
          />
          <UButton
            label="Privacy"
            color="neutral"
            variant="link"
            size="sm"
            disabled
          />
          <UButton
            label="Terms"
            color="neutral"
            variant="link"
            size="sm"
            disabled
          />
        </div>
      </template>
    </UFooter>
  </div>
</template>
