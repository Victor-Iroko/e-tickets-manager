<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { api } from '~~/convex/_generated/api'
import type { Id } from '~~/convex/_generated/dataModel'

const route = useRoute()
const { session } = await useSession()

const eventId = computed(() => route.params.eventId as Id<'events'>)

const { data: event, status } = await useConvexQuery(
  api.events.getEvent,
  computed(() => ({ eventId: eventId.value }))
)

const isLoading = computed(() => status.value === 'pending')
const isDraft = computed(() => event.value?.status === 'draft')
const isOnSale = computed(() => event.value?.status === 'on_sale')

providePlannerEvent({
  event,
  eventId,
  isLoading,
  isDraft,
  isOnSale
})

const navItems = computed<NavigationMenuItem[]>(() => {
  const id = eventId.value
  return [
    {
      label: 'Overview',
      icon: 'i-lucide-layout-dashboard',
      to: `/planner/events/${id}`
    },
    {
      label: 'Tickets',
      icon: 'i-lucide-ticket',
      to: `/planner/events/${id}/tickets`
    },
    {
      label: 'Form Builder',
      icon: 'i-lucide-file-text',
      to: `/planner/events/${id}/form-builder`
    },
    {
      label: 'Publish',
      icon: 'i-lucide-rocket',
      to: `/planner/events/${id}/publish`
    },
    {
      label: 'Dashboard',
      icon: 'i-lucide-bar-chart-3',
      to: `/planner/events/${id}/dashboard`
    },
    {
      label: 'Responses',
      icon: 'i-lucide-message-square',
      to: `/planner/events/${id}/responses`
    },
    {
      label: 'Team',
      icon: 'i-lucide-users',
      to: `/planner/events/${id}/team`
    }
  ]
})
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      collapsible
      :ui="{
        footer: 'border-t border-default/50'
      }"
    >
      <template #header="{ collapsed }">
        <div v-if="!collapsed" class="flex w-full items-center justify-between">
          <NuxtLink to="/dashboard" class="flex items-center gap-2">
            <UIcon name="i-lucide-ticket" class="size-5 text-primary" />
            <span class="font-heading text-lg font-medium">Ticketly</span>
          </NuxtLink>

          <UDashboardSidebarCollapse color="neutral" variant="ghost" />
        </div>

        <div v-else>
          <UDashboardSidebarCollapse color="neutral" variant="ghost" />
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :items="navItems"
          orientation="vertical"
          :collapsed="collapsed"
          class="gap-2"
          tooltip
        />
      </template>

      <template #footer="{ collapsed }">
        <div v-if="!collapsed" class="flex w-full items-center justify-between">
          <div class="flex items-center gap-2">
            <UAvatar
              :text="session?.user?.name?.charAt(0) ?? '?'"
              :src="session?.user?.image ?? undefined"
              icon="i-lucide:user-round"
              size="sm"
              :alt="`${session?.user?.name ?? 'User'} profile image`"
            />
            <span class="text-sm font-medium">{{ session?.user.name }}</span>
          </div>
          <UColorModeButton />
        </div>

        <div v-else>
          <UAvatar
            :text="session?.user?.name?.charAt(0) ?? '?'"
            :src="session?.user?.image ?? undefined"
            icon="i-lucide:user-round"
            size="sm"
            :alt="`${session?.user.name ?? 'User'} profile image`"
          />
        </div>
      </template>
    </UDashboardSidebar>

    <div
      class="flex min-h-0 min-w-0 flex-1 overflow-hidden *:min-h-0 *:w-full *:min-w-0 *:flex-1"
    >
      <slot />
    </div>
  </UDashboardGroup>
</template>
