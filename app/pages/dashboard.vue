<script setup lang="ts">
import { api } from '~~/convex/_generated/api'

const { data: associations, status } = await useConvexQuery(
  api.eventRoles.listUserEventAssociations,
  {}
)
</script>

<template>
  <UContainer class="space-y-6 py-10">
    <RouteInventoryScreen
      title="Event Dashboard"
      route-path="/dashboard"
      audience="Registered User"
      next-step="Expand this into role-aware event hub cards and quick actions in Phase A."
    />

    <UCard>
      <template #header>
        <h2 class="text-lg font-semibold">Event Associations</h2>
      </template>

      <div v-if="status === 'pending'" class="text-sm text-toned">
        Loading your event access...
      </div>

      <ul v-else-if="associations?.length" class="space-y-2">
        <li
          v-for="association in associations"
          :key="`${association.eventId}:${association.role}`"
          class="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3"
        >
          <div>
            <p class="font-medium">{{ association.eventName }}</p>
            <p class="text-sm text-toned">{{ association.eventId }}</p>
          </div>

          <div class="flex items-center gap-2">
            <UBadge color="primary" variant="soft">{{
              association.role
            }}</UBadge>
            <UBadge color="neutral" variant="subtle">
              {{ association.eventStatus }}
            </UBadge>
          </div>
        </li>
      </ul>

      <p v-else class="text-sm text-toned">
        No event access found yet. You can create your first event from planner
        routes once event setup is implemented.
      </p>
    </UCard>
  </UContainer>
</template>
