<template>
  <div class="max-w-5xl mx-auto px-4 py-12 space-y-8">
    <h1 class="font-heading text-4xl font-bold">My Purchased Tickets</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="i in 2"
        :key="i"
        class="bg-white rounded-2xl border border-slate-200 p-6 flex justify-between items-center shadow-sm"
      >
        <div class="space-y-2">
          <span
            class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800"
          >
            Valid
          </span>
          <h2 class="text-xl font-bold">Tech Summit 2026</h2>
          <p class="text-xs text-slate-500">Regular Pass &bull; Grand Convention Center</p>
        </div>

        <UButton to="/tickets/tkt-1" size="sm" color="primary" class="bg-[#534AB7]">
          View QR Code
        </UButton>
      </div>
    </div>
  </div>
</template>
