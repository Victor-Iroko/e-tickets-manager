<script setup lang="ts">
definePageMeta({
  auth: false
})
</script>

<template>
  <RouteInventoryScreen
    title="Reset Password"
    route-path="/reset-password"
    audience="Registered User"
    next-step="Implement token validation and password reset submission in Phase A."
  />
</template>
