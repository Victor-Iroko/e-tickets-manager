<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8 space-y-4">
      <h1 class="font-heading text-4xl font-bold">Explore Events</h1>
      <p class="text-slate-600">Discover upcoming events, concerts, workshops, and tech summits.</p>

      <!-- Search & Filters -->
      <div class="flex flex-col sm:flex-row gap-4">
        <UInput placeholder="Search events by title or keywords..." class="flex-1" />
        <UInput placeholder="Location filter..." class="sm:w-64" />
      </div>
    </div>

    <!-- Events Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="i in 6"
        :key="i"
        class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition"
      >
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87"
          alt="Event Banner"
          class="w-full h-44 object-cover"
        />
        <div class="p-5 space-y-2">
          <h3 class="text-lg font-bold">Tech Summit 2026</h3>
          <p class="text-sm text-slate-600">Grand Convention Center &bull; Aug 15, 2026</p>
          <div class="flex items-center justify-between pt-3 border-t border-slate-100">
            <span class="font-semibold text-[#D85A30]">$50.00</span>
            <UButton to="/events/mock-event-1" size="sm" color="primary" class="bg-[#534AB7]"
              >Buy Ticket</UButton
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
