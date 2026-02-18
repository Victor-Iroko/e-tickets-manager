<script setup lang="ts">
definePageMeta({
  requiredRole: 'planner'
})
</script>

<template>
  <RouteInventoryScreen
    title="Team Management"
    route-path="/planner/events/[eventId]/team"
    audience="Planner"
    next-step="Implement planner/scanner invite and role management controls in Phase F."
  />
</template>
