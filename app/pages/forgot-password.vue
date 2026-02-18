<script setup lang="ts">
definePageMeta({
  auth: false
})
</script>

<template>
  <RouteInventoryScreen
    title="Forgot Password"
    route-path="/forgot-password"
    audience="Registered User"
    next-step="Wire reset-link request form and success/error messaging in Phase A."
  />
</template>
