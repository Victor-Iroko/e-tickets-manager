<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
</script>

<!-- eslint-disable link-checker/valid-sitemap-link -->
<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="font-heading text-3xl font-bold">My Events</h1>
      <UButton to="/dashboard/events/new" color="primary" class="bg-[#534AB7]"
        >+ Create Event</UButton
      >
    </div>

    <!-- Events List Table -->
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <table class="w-full text-left text-sm text-slate-600">
        <thead class="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
          <tr>
            <th class="px-6 py-3">Event Title</th>
            <th class="px-6 py-3">Status</th>
            <th class="px-6 py-3">Date</th>
            <th class="px-6 py-3">Tickets Sold</th>
            <th class="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr class="hover:bg-slate-50">
            <td class="px-6 py-4 font-semibold text-slate-900">Tech Summit 2026</td>
            <td class="px-6 py-4">
              <span
                class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800"
              >
                Published
              </span>
            </td>
            <td class="px-6 py-4">Aug 15, 2026</td>
            <td class="px-6 py-4">25 / 600</td>
            <td class="px-6 py-4 text-right space-x-2">
              <NuxtLink
                :to="'/dashboard/events/mock-event-1'"
                class="text-xs text-[#534AB7] font-semibold hover:underline"
                >Manage</NuxtLink
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
