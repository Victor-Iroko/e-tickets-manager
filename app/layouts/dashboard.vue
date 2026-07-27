<template>
  <div class="min-h-screen flex bg-slate-50 text-slate-900">
    <!-- Sidebar -->
    <aside
      class="w-64 border-r border-slate-200 bg-white p-4 flex flex-col justify-between hidden md:flex"
    >
      <div>
        <NuxtLink to="/dashboard" class="block font-heading text-2xl font-bold text-[#534AB7] mb-8">
          ORGANIZER
        </NuxtLink>
        <nav class="space-y-1">
          <NuxtLink
            to="/dashboard"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100"
          >
            <span>Dashboard</span>
          </NuxtLink>
          <NuxtLink
            to="/dashboard/events"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100"
          >
            <span>My Events</span>
          </NuxtLink>
          <NuxtLink
            to="/dashboard/events/new"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#534AB7] bg-purple-50"
          >
            <span>+ Create Event</span>
          </NuxtLink>
        </nav>
      </div>

      <div class="border-t border-slate-200 pt-4">
        <NuxtLink
          to="/profile"
          class="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <span>Profile & Settings</span>
        </NuxtLink>
        <NuxtLink
          to="/"
          class="flex items-center gap-3 px-3 py-2 text-sm text-slate-500 hover:text-slate-900"
        >
          <span>Exit to Public Site</span>
        </NuxtLink>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <header
        class="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between"
      >
        <h1 class="font-heading text-xl text-slate-800">Organizer Hub</h1>
        <div class="flex items-center gap-3">
          <span class="text-sm font-medium">Jane Organizer</span>
        </div>
      </header>

      <main class="flex-1 p-6 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
