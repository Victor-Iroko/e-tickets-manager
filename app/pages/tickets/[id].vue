<template>
  <div
    class="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-lg text-center space-y-6"
  >
    <div class="space-y-1">
      <span
        class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800"
      >
        VALID TICKET
      </span>
      <h1 class="font-heading text-3xl font-bold text-slate-900 mt-2">Tech Summit 2026</h1>
      <p class="text-xs text-slate-500">Regular Pass &bull; $50.00</p>
    </div>

    <!-- Mock QR Code Container -->
    <div
      class="bg-slate-100 p-8 rounded-2xl flex flex-col items-center justify-center space-y-3 border border-dashed border-slate-300"
    >
      <div
        class="w-48 h-48 bg-slate-900 rounded-xl flex items-center justify-center text-white font-mono text-xs"
      >
        [QR CODE GENERATOR]
      </div>
      <p class="font-mono text-xs text-slate-500 tracking-widest">QR_TOK_83920192</p>
    </div>

    <div class="text-left text-xs text-slate-600 space-y-1 bg-slate-50 p-4 rounded-xl">
      <p><strong>Attendee:</strong> Alex Attendee</p>
      <p><strong>Venue:</strong> Grand Convention Center</p>
      <p><strong>Date & Time:</strong> Aug 15, 2026 &bull; 09:00 AM</p>
    </div>
  </div>
</template>
