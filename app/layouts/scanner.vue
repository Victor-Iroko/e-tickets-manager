<template>
  <div class="min-h-screen bg-slate-950 text-white flex flex-col">
    <header class="p-4 border-b border-slate-800 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
        <span class="font-heading text-lg tracking-wider">TICKET SCANNER</span>
      </div>
    </header>

    <main class="flex-1 flex flex-col justify-center items-center p-4">
      <slot />
    </main>
  </div>
</template>
