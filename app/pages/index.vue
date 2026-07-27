<template>
  <div>
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-[#534AB7] to-purple-900 text-white py-24 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-5xl mx-auto text-center space-y-6">
        <h1 class="font-heading text-6xl sm:text-7xl font-bold tracking-tight">
          CREATE, SELL & VALIDATE TICKETS SEAMLESSLY
        </h1>
        <p class="text-xl text-purple-100 max-w-2xl mx-auto">
          The centralized platform handling the full ticket lifecycle for event organizers and
          attendees.
        </p>
        <div class="flex justify-center gap-4 pt-4">
          <UButton
            to="/explore"
            size="xl"
            class="bg-[#D85A30] hover:bg-orange-600 text-white font-semibold px-8 py-3"
          >
            Explore Events
          </UButton>
          <UButton
            to="/dashboard/events/new"
            size="xl"
            variant="outline"
            class="text-white border-white hover:bg-white/10 px-8 py-3"
          >
            Host an Event
          </UButton>
        </div>
      </div>
    </section>

    <!-- Featured Events Preview -->
    <section class="max-w-7xl mx-auto px-4 py-16">
      <h2 class="font-heading text-3xl mb-8">Featured Events</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition"
        >
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87"
            alt="Event Banner"
            class="w-full h-48 object-cover"
          />
          <div class="p-5 space-y-3">
            <span class="text-xs font-semibold text-[#534AB7] uppercase tracking-wider"
              >Tech & Innovation</span
            >
            <h3 class="text-lg font-bold">Tech Summit 2026</h3>
            <p class="text-sm text-slate-600">Grand Convention Center &bull; Aug 15, 2026</p>
            <div class="flex items-center justify-between pt-2">
              <span class="font-semibold text-[#D85A30]">From $50.00</span>
              <UButton to="/events/mock-event-1" size="sm" color="primary" class="bg-[#534AB7]"
                >View Event</UButton
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
