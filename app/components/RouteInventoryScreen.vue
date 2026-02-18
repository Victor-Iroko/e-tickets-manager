<script setup lang="ts">
defineProps<{
  title: string
  routePath: string
  audience: string
  nextStep: string
}>()
</script>

<template>
  <UContainer class="py-10">
    <UCard>
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h1 class="text-2xl font-semibold">{{ title }}</h1>
          <UBadge color="neutral" variant="soft">{{ audience }}</UBadge>
        </div>
      </template>

      <div class="space-y-4">
        <p class="text-sm text-muted">
          Route scaffolded for implementation backbone:
          <code>{{ routePath }}</code>
        </p>

        <p class="text-sm text-toned">{{ nextStep }}</p>
      </div>
    </UCard>
  </UContainer>
</template>
