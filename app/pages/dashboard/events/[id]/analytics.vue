<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <div class="space-y-8">
    <h1 class="font-heading text-3xl font-bold">Event Analytics</h1>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-1">
        <span class="text-xs text-slate-500 font-semibold uppercase">Tickets Sold</span>
        <p class="text-3xl font-bold text-[#534AB7]">25</p>
      </div>
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-1">
        <span class="text-xs text-slate-500 font-semibold uppercase">Total Revenue</span>
        <p class="text-3xl font-bold text-[#D85A30]">$1,250.00</p>
      </div>
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-1">
        <span class="text-xs text-slate-500 font-semibold uppercase">Tickets Scanned</span>
        <p class="text-3xl font-bold text-emerald-600">18</p>
      </div>
    </div>
  </div>
</template>
