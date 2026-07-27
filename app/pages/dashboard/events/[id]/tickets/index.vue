<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="font-heading text-3xl font-bold">Ticket Types & Pricing</h1>
      <UButton to="/dashboard/events/mock-event-1/tickets/new" color="primary" class="bg-[#534AB7]">
        + Add Ticket Type
      </UButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-bold text-lg">Regular Pass</h3>
            <p class="text-xs text-slate-500">General admission ticket</p>
          </div>
          <span class="font-bold text-[#D85A30] text-lg">$50.00</span>
        </div>
        <div class="text-xs text-slate-600 space-y-1">
          <p>Quantity Available: <strong>500</strong></p>
          <p>Quantity Sold: <strong>25</strong></p>
        </div>
      </div>
    </div>
  </div>
</template>
