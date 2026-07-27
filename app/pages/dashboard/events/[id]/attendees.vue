<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="font-heading text-3xl font-bold">Attendee Roster</h1>
      <UInput placeholder="Search attendee name or email..." class="w-64" />
    </div>

    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <table class="w-full text-left text-sm text-slate-600">
        <thead class="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
          <tr>
            <th class="px-6 py-3">Attendee</th>
            <th class="px-6 py-3">Ticket Type</th>
            <th class="px-6 py-3">Ticket ID</th>
            <th class="px-6 py-3">Scan Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr class="hover:bg-slate-50">
            <td class="px-6 py-4">
              <p class="font-bold text-slate-900">Alex Attendee</p>
              <p class="text-xs text-slate-500">attendee@etickets.com</p>
            </td>
            <td class="px-6 py-4">Regular Pass</td>
            <td class="px-6 py-4 font-mono text-xs text-slate-500">tkt-1</td>
            <td class="px-6 py-4">
              <span
                class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700"
              >
                Not Scanned
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
