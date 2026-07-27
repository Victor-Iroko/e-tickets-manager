<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <h1 class="font-heading text-3xl font-bold">Add New Ticket Type</h1>

    <form
      class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6"
      @submit.prevent
    >
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Ticket Name *</label>
        <UInput placeholder="e.g. Early Bird Pass" class="w-full" />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Price ($) *</label>
        <UInput type="number" step="0.01" placeholder="50.00" class="w-full" />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1"
          >Total Quantity Available *</label
        >
        <UInput type="number" placeholder="100" class="w-full" />
      </div>

      <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <UButton to="/dashboard/events/mock-event-1/tickets" variant="ghost" color="neutral"
          >Cancel</UButton
        >
        <UButton type="submit" color="primary" class="bg-[#534AB7] px-6">Save Ticket Type</UButton>
      </div>
    </form>
  </div>
</template>
