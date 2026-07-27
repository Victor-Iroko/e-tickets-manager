<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="font-heading text-3xl font-bold">Dashboard Summary</h1>
        <p class="text-sm text-slate-500">Overview of your events, sales, and tickets</p>
      </div>
      <UButton to="/dashboard/events/new" color="primary" class="bg-[#534AB7]">
        + Create Event
      </UButton>
    </div>

    <!-- Overview Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-1">
        <span class="text-xs text-slate-500 font-semibold uppercase">Total Events</span>
        <p class="text-3xl font-bold text-slate-900">3</p>
      </div>
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-1">
        <span class="text-xs text-slate-500 font-semibold uppercase">Tickets Sold</span>
        <p class="text-3xl font-bold text-[#534AB7]">142</p>
      </div>
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-1">
        <span class="text-xs text-slate-500 font-semibold uppercase">Total Revenue</span>
        <p class="text-3xl font-bold text-[#D85A30]">$7,100.00</p>
      </div>
    </div>
  </div>
</template>
