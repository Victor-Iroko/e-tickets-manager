<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="font-heading text-4xl font-bold">Tech Summit 2026</h1>
          <span
            class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800"
            >Published</span
          >
        </div>
        <p class="text-sm text-slate-500 mt-1">Grand Convention Center &bull; Aug 15, 2026</p>
      </div>

      <div class="flex items-center gap-2">
        <UButton to="/dashboard/events/mock-event-1/edit" variant="outline" size="sm"
          >Edit Details</UButton
        >
        <UButton to="/events/mock-event-1" variant="outline" size="sm">View Public Page</UButton>
      </div>
    </div>

    <!-- Quick Navigation Hub -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <NuxtLink
        to="/dashboard/events/mock-event-1/tickets"
        class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-[#534AB7] transition"
      >
        <h3 class="font-bold text-slate-900">Ticket Types</h3>
        <p class="text-xs text-slate-500 mt-1">Manage pricing & stock</p>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/events/mock-event-1/scanners"
        class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-[#534AB7] transition"
      >
        <h3 class="font-bold text-slate-900">Manage Scanners</h3>
        <p class="text-xs text-slate-500 mt-1">Scanner magic links</p>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/events/mock-event-1/analytics"
        class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-[#534AB7] transition"
      >
        <h3 class="font-bold text-slate-900">Analytics</h3>
        <p class="text-xs text-slate-500 mt-1">Sales & attendance stats</p>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/events/mock-event-1/attendees"
        class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-[#534AB7] transition"
      >
        <h3 class="font-bold text-slate-900">Attendees</h3>
        <p class="text-xs text-slate-500 mt-1">View ticket roster</p>
      </NuxtLink>
    </div>
  </div>
</template>
