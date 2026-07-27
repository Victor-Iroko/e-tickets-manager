<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <h1 class="font-heading text-3xl font-bold">Create New Event</h1>

    <form
      class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6"
      @submit.prevent
    >
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Event Title *</label>
        <UInput placeholder="e.g. Summer Music Festival 2026" class="w-full" />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          rows="4"
          class="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-[#534AB7]"
          placeholder="Detail event schedule, rules, line-up..."
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Start Date & Time *</label>
          <UInput type="datetime-local" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">End Date & Time *</label>
          <UInput type="datetime-local" class="w-full" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Location</label>
        <UInput placeholder="Venue name or physical address" class="w-full" />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Event Banner Image</label>
        <input
          type="file"
          class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-[#534AB7] hover:file:bg-purple-100"
        />
      </div>

      <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <UButton to="/dashboard/events" variant="ghost" color="neutral">Cancel</UButton>
        <UButton type="submit" color="primary" class="bg-[#534AB7] px-6">Save Event</UButton>
      </div>
    </form>
  </div>
</template>
