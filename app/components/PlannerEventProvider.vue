<script setup lang="ts">
import { api } from '~~/convex/_generated/api'
import type { Id } from '~~/convex/_generated/dataModel'

const route = useRoute()

const eventId = computed(() => route.params.eventId as Id<'events'>)

const { data: event, status } = await useConvexQuery(
  api.events.getEvent,
  computed(() => ({ eventId: eventId.value }))
)

const isLoading = computed(() => status.value === 'pending')
const isDraft = computed(() => event.value?.status === 'draft')
const isOnSale = computed(() => event.value?.status === 'on_sale')

provide('plannerEvent', {
  event,
  eventId,
  isLoading,
  isDraft,
  isOnSale,
  status
})
</script>

<template>
  <slot />
</template>
