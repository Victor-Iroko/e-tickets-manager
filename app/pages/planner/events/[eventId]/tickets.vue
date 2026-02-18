<script setup lang="ts">
definePageMeta({
  requiredRole: 'planner'
})
</script>

<template>
  <RouteInventoryScreen
    title="Ticket Types"
    route-path="/planner/events/[eventId]/tickets"
    audience="Planner"
    next-step="Implement ticket type CRUD and quantity/price guards in Phase B."
  />
</template>
