<script setup lang="ts">
definePageMeta({
  auth: false
})

useSeoMeta({
  title: 'Access Denied — Ticketly'
})
</script>

<template>
  <div class="flex min-h-[60vh] items-center justify-center px-6">
    <div class="max-w-md space-y-6 text-center">
      <div
        class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-error/10"
      >
        <UIcon name="i-lucide-shield-x" class="size-8 text-error" />
      </div>
      <div class="space-y-2">
        <h1
          class="font-heading text-2xl font-bold tracking-tight text-highlighted"
        >
          Access Denied
        </h1>
        <p class="text-sm leading-relaxed text-muted">
          You don't have permission to access this page. If you believe this is
          an error, contact the event planner or try switching to the correct
          account.
        </p>
      </div>
      <div class="flex justify-center gap-3">
        <UButton
          label="Back to Dashboard"
          to="/dashboard"
          icon="i-lucide-layout-dashboard"
        />
        <UButton label="Go Home" to="/" color="neutral" variant="outline" />
      </div>
    </div>
  </div>
</template>
