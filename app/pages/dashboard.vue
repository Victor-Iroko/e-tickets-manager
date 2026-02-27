<script setup lang="ts">
import { api } from '~~/convex/_generated/api'

definePageMeta({
  auth: true
})

useSeoMeta({
  title: 'Dashboard — Ticketly'
})

const { data: associations, status } = await useConvexQuery(
  api.eventRoles.listUserEventAssociations,
  {}
)

const statusColor = {
  draft: 'neutral',
  on_sale: 'success',
  paused: 'warning',
  completed: 'primary',
  cancelled: 'error'
} as const

type EventStatus = keyof typeof statusColor
type EventStatusColor = (typeof statusColor)[EventStatus]

function getEventStatusColor(eventStatus: string): EventStatusColor {
  if (eventStatus in statusColor) {
    return statusColor[eventStatus as EventStatus]
  }
  return 'neutral'
}

function eventLink(association: { eventId: string; role: string }): string {
  if (association.role === 'planner') {
    return `/planner/events/${association.eventId}`
  }
  return `/scanner/events/${association.eventId}`
}
</script>

<template>
  <UContainer class="space-y-6 py-10">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-default">Dashboard</h1>
        <p class="mt-1 text-sm text-muted">
          Manage your events and view your roles.
        </p>
      </div>
      <UButton
        to="/planner/events/new"
        label="Create Event"
        icon="i-lucide-plus"
      />
    </div>

    <div v-if="status === 'pending'" class="flex justify-center py-20">
      <UIcon name="i-lucide-loader-2" class="size-6 animate-spin text-muted" />
    </div>

    <UEmpty
      v-else-if="!associations?.length"
      icon="i-lucide-calendar-off"
      title="No events yet"
      description="Create your first event to start selling tickets."
    >
      <template #actions>
        <UButton
          to="/planner/events/new"
          label="Create Event"
          icon="i-lucide-plus"
        />
      </template>
    </UEmpty>

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="association in associations"
        :key="`${association.eventId}:${association.role}`"
        :to="eventLink(association)"
        class="group block"
      >
        <UCard
          class="h-full transition-all hover:shadow-md hover:ring-2 hover:ring-primary/50"
          :ui="{ root: 'flex flex-col', body: 'flex flex-1 flex-col gap-4' }"
        >
          <div class="flex items-start justify-between gap-4">
            <h3
              class="line-clamp-2 text-lg font-semibold text-default transition-colors group-hover:text-primary"
            >
              {{ association.eventName }}
            </h3>
            <UBadge
              :label="association.eventStatus.replace('_', ' ')"
              :color="getEventStatusColor(association.eventStatus)"
              variant="subtle"
              size="md"
              class="shrink-0 capitalize"
            />
          </div>

          <div class="mt-auto flex items-center justify-between pt-2">
            <UBadge
              :label="association.role"
              :color="association.role === 'planner' ? 'primary' : 'secondary'"
              variant="outline"
              size="md"
              class="capitalize"
            />

            <UIcon
              name="i-lucide-arrow-right"
              class="size-5 text-muted opacity-0 transition-all group-hover:translate-x-1 group-hover:text-primary group-hover:opacity-100"
            />
          </div>
        </UCard>
      </NuxtLink>
    </div>
  </UContainer>
</template>
