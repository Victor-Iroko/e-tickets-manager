<script setup lang="ts">
definePageMeta({
  auth: false
})
</script>

<template>
  <UContainer class="py-10">
    <UCard>
      <template #header>
        <h1 class="text-2xl font-semibold">Access Forbidden</h1>
      </template>

      <p class="text-sm text-toned">
        You do not currently have permission to access this route.
      </p>

      <template #footer>
        <UButton to="/dashboard" color="primary" variant="solid">
          Back to Dashboard
        </UButton>
      </template>
    </UCard>
  </UContainer>
</template>
