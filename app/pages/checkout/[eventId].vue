<template>
  <div class="max-w-3xl mx-auto px-4 py-12 space-y-8">
    <div class="space-y-2">
      <h1 class="font-heading text-4xl font-bold">Checkout</h1>
      <p class="text-slate-600">Tech Summit 2026 &bull; August 15, 2026</p>
    </div>

    <!-- Ticket Quantity Selection -->
    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h2 class="font-semibold text-lg">Select Quantity</h2>

      <div class="flex items-center justify-between p-4 border rounded-xl">
        <div>
          <p class="font-bold">Regular Pass</p>
          <p class="text-xs text-slate-500">$50.00 each</p>
        </div>
        <div class="flex items-center gap-3">
          <UButton size="xs" variant="outline">-</UButton>
          <span class="font-semibold">1</span>
          <UButton size="xs" variant="outline">+</UButton>
        </div>
      </div>
    </div>

    <!-- Order Summary -->
    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h2 class="font-semibold text-lg">Order Summary</h2>
      <div class="flex justify-between text-sm py-2 border-b border-slate-100">
        <span>Regular Pass (x1)</span>
        <span>$50.00</span>
      </div>
      <div class="flex justify-between text-base font-bold pt-2">
        <span>Total Due</span>
        <span class="text-[#D85A30]">$50.00</span>
      </div>

      <UButton
        block
        color="primary"
        class="bg-[#D85A30] hover:bg-orange-600 py-3 font-semibold mt-4"
      >
        Pay via Paystack
      </UButton>
    </div>
  </div>
</template>
