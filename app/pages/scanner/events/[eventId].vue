<script setup lang="ts">
definePageMeta({
  requiredRole: 'scanner'
})
</script>

<template>
  <RouteInventoryScreen
    title="Scanner Validation Screen"
    route-path="/scanner/events/[eventId]"
    audience="Scanner"
    next-step="Add camera scan loop, validation statuses, and check-in counter in Phase E."
  />
</template>
