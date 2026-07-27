<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <h1 class="font-heading text-3xl font-bold">Edit Event Details</h1>

    <form
      class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6"
      @submit.prevent
    >
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
        <UInput value="Tech Summit 2026" class="w-full" />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea rows="4" class="w-full border border-slate-300 rounded-lg p-3 text-sm">
The premier technology conference.</textarea
        >
      </div>

      <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <UButton to="/dashboard/events/mock-event-1" variant="ghost" color="neutral"
          >Cancel</UButton
        >
        <UButton type="submit" color="primary" class="bg-[#534AB7] px-6">Update Changes</UButton>
      </div>
    </form>
  </div>
</template>
