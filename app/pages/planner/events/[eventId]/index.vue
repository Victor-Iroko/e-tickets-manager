<script setup lang="ts">
definePageMeta({
  requiredRole: 'planner'
})
</script>

<template>
  <RouteInventoryScreen
    title="Planner Event Setup"
    route-path="/planner/events/[eventId]"
    audience="Planner"
    next-step="Compose setup summary and status-driven edit controls in Phase B."
  />
</template>
