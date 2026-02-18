<script setup lang="ts">
definePageMeta({
  auth: false
})
</script>

<template>
  <RouteInventoryScreen
    title="Public Event Sales"
    route-path="/events/[slug]"
    audience="Buyer"
    next-step="Render event details, ticket selection, and sales-state banners in Phase C."
  />
</template>
