<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
    <!-- Banner Image -->
    <div class="h-80 rounded-2xl overflow-hidden shadow-sm">
      <img
        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87"
        alt="Event Banner"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Event Info Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-200"
    >
      <div>
        <span class="text-sm font-semibold text-[#534AB7] uppercase">Upcoming Event</span>
        <h1 class="font-heading text-5xl font-bold mt-1">Tech Summit 2026</h1>
        <p class="text-slate-600 mt-2">
          Grand Convention Center &bull; August 15, 2026 &bull; 09:00 AM
        </p>
      </div>

      <UButton
        to="/checkout/mock-event-1"
        size="xl"
        color="primary"
        class="bg-[#D85A30] hover:bg-orange-600 px-8 py-3 font-semibold"
      >
        Get Tickets
      </UButton>
    </div>

    <!-- Description & Ticket Selection Widget -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">
        <h2 class="font-heading text-2xl font-bold">About This Event</h2>
        <p class="text-slate-700 leading-relaxed">
          Join thousands of developers, organizers, and innovators at Tech Summit 2026. Experience
          keynotes from industry leaders, interactive workshops, and exclusive networking sessions.
        </p>
      </div>

      <div class="bg-white p-6 rounded-xl border border-slate-200 space-y-4 h-fit">
        <h3 class="font-heading text-xl font-bold">Available Ticket Passes</h3>
        <div class="space-y-3">
          <div class="p-3 border rounded-lg flex justify-between items-center">
            <div>
              <p class="font-semibold text-sm">Regular Pass</p>
              <p class="text-xs text-slate-500">$50.00</p>
            </div>
            <UButton to="/checkout/mock-event-1" size="xs" color="primary" class="bg-[#534AB7]"
              >Select</UButton
            >
          </div>
          <div class="p-3 border rounded-lg flex justify-between items-center">
            <div>
              <p class="font-semibold text-sm">VIP Pass</p>
              <p class="text-xs text-slate-500">$150.00</p>
            </div>
            <UButton to="/checkout/mock-event-1" size="xs" color="primary" class="bg-[#534AB7]"
              >Select</UButton
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
