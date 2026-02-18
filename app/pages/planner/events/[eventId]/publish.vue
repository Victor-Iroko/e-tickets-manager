<script setup lang="ts">
definePageMeta({
  requiredRole: 'planner'
})
</script>

<template>
  <RouteInventoryScreen
    title="Publish Event"
    route-path="/planner/events/[eventId]/publish"
    audience="Planner"
    next-step="Build readiness checklist and publish action with error feedback in Phase B."
  />
</template>
