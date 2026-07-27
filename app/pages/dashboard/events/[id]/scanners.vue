<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="font-heading text-3xl font-bold">Scanner Magic Links</h1>
      <UButton color="primary" class="bg-[#534AB7]">+ Generate Scanner Link</UButton>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <table class="w-full text-left text-sm text-slate-600">
        <thead class="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
          <tr>
            <th class="px-6 py-3">Gate Label</th>
            <th class="px-6 py-3">Magic Link</th>
            <th class="px-6 py-3">Expires</th>
            <th class="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr class="hover:bg-slate-50">
            <td class="px-6 py-4 font-semibold text-slate-900">Main Entrance (Gate A)</td>
            <td class="px-6 py-4 font-mono text-xs text-slate-500">
              /scan/mock-event-1?token=xyz123
            </td>
            <td class="px-6 py-4">In 30 days</td>
            <td class="px-6 py-4 text-right">
              <UButton size="xs" color="error" variant="soft">Revoke</UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
