<template>
  <div class="min-h-screen flex flex-col bg-[#F5F4F2] text-slate-900">
    <header class="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="font-heading text-3xl font-bold text-[#534AB7]">E-TICKETS</span>
        </NuxtLink>
        <nav class="flex items-center gap-6">
          <NuxtLink to="/explore" class="text-sm font-medium hover:text-[#534AB7]"
            >Explore</NuxtLink
          >
          <NuxtLink to="/tickets" class="text-sm font-medium hover:text-[#534AB7]"
            >My Tickets</NuxtLink
          >
          <NuxtLink to="/dashboard" class="text-sm font-medium hover:text-[#534AB7]"
            >Organizer Dashboard</NuxtLink
          >
        </nav>
        <div class="flex items-center gap-3">
          <UButton to="/login" variant="ghost" color="neutral">Sign In</UButton>
          <UButton to="/register" color="primary" class="bg-[#534AB7]">Get Started</UButton>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-slate-200 bg-white py-8">
      <div class="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
        <p>&copy; 2026 E-Tickets Manager. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>
