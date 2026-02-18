<script setup lang="ts">
definePageMeta({
  requiredRole: 'planner'
})
</script>

<template>
  <RouteInventoryScreen
    title="Form Responses"
    route-path="/planner/events/[eventId]/responses"
    audience="Planner"
    next-step="Build searchable and sortable response table in Phase F."
  />
</template>
