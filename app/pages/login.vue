<script setup lang="ts">
definePageMeta({
  auth: false
})
</script>

<template>
  <RouteInventoryScreen
    title="Login"
    route-path="/login"
    audience="Registered User"
    next-step="Connect email/password and social sign-in form states in Phase A."
  />
</template>
