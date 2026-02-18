<script setup lang="ts">
definePageMeta({
  requiredRole: 'planner'
})
</script>

<template>
  <RouteInventoryScreen
    title="Planner Metrics Dashboard"
    route-path="/planner/events/[eventId]/dashboard"
    audience="Planner"
    next-step="Implement sold, revenue, and check-in metrics blocks in Phase F."
  />
</template>
