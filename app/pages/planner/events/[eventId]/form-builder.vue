<script setup lang="ts">
definePageMeta({
  requiredRole: 'planner'
})
</script>

<template>
  <RouteInventoryScreen
    title="Form Builder"
    route-path="/planner/events/[eventId]/form-builder"
    audience="Planner"
    next-step="Add field type management, required toggles, and ordering controls in Phase B."
  />
</template>
