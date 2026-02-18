<script setup lang="ts">
definePageMeta({
  auth: false
})
</script>

<template>
  <RouteInventoryScreen
    title="Purchase Confirmation"
    route-path="/events/[slug]/confirmation/[purchaseRef]"
    audience="Buyer"
    next-step="Show payment status, issued tickets, and QR display after verification in Phase D."
  />
</template>
