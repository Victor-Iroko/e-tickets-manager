<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

const { session } = await useSession()
const { signOut } = useAuth()
const route = useRoute()

const activeHomeSection = useActiveHomeSection()

const navItems = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Features',
    to: '/#features',
    exactHash: true,
    active: route.path === '/' && activeHomeSection.value === 'features'
  },
  {
    label: 'How It Works',
    to: '/#how-it-works',
    exactHash: true,
    active: route.path === '/' && activeHomeSection.value === 'how-it-works'
  },
  {
    label: 'Roles',
    to: '/#roles',
    exactHash: true,
    active: route.path === '/' && activeHomeSection.value === 'roles'
  }
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
        <span
          class="flex items-center gap-2 font-heading text-xl font-bold tracking-tight"
        >
          <UIcon name="i-lucide-ticket" class="size-6 text-primary" />
          Ticketly
        </span>
      </template>

      <UNavigationMenu :items="navItems" />

      <template #right>
        <UColorModeButton />
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
              :alt="`${session.user.name} profile Image`"
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
          <div class="-mx-2.5 space-y-1">
            <UButton
              label="Dashboard"
              to="/dashboard"
              color="neutral"
              variant="ghost"
              icon="i-lucide-layout-dashboard"
              class="justify-start"
              block
            />
            <UButton
              label="Account"
              to="/account"
              color="neutral"
              variant="ghost"
              icon="i-lucide-user"
              class="justify-start"
              block
            />
            <UButton
              label="Sign out"
              color="neutral"
              variant="ghost"
              icon="i-lucide-log-out"
              class="justify-start"
              block
              @click="signOut()"
            />
          </div>
        </template>
        <template v-else>
          <div class="-mx-2.5 space-y-1">
            <UButton
              label="Log in"
              to="/login"
              color="neutral"
              variant="ghost"
              class="justify-start"
              block
            />
            <UButton
              label="Get Started"
              to="/signup"
              class="justify-start"
              variant="outline"
              block
            />
          </div>
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
