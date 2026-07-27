<script setup lang="ts">
definePageMeta({
  layout: "scanner",
});

const route = useRoute();
const token = computed(() => route.query.token as string);
</script>

<template>
  <div class="max-w-md w-full text-center space-y-6">
    <div class="space-y-1">
      <h1 class="font-heading text-3xl font-bold tracking-wide">GATE CAMERA SCANNER</h1>
      <p class="text-xs text-slate-400">Position QR code inside the viewfinder</p>
    </div>

    <!-- Camera Viewfinder Mock -->
    <div
      class="relative aspect-square bg-slate-900 rounded-3xl border-2 border-dashed border-emerald-500/50 flex flex-col items-center justify-center p-6 space-y-4 overflow-hidden"
    >
      <div
        class="w-48 h-48 border-2 border-emerald-400 rounded-2xl relative flex items-center justify-center"
      >
        <div class="absolute inset-0 bg-emerald-500/10 animate-pulse rounded-2xl" />
        <span class="text-xs font-mono text-emerald-400 tracking-widest uppercase"
          >SCANNING...</span
        >
      </div>
    </div>

    <!-- Manual QR Code Input Fallback -->
    <div class="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
      <p class="text-xs text-slate-400">Or type ticket QR code token manually:</p>
      <div class="flex gap-2">
        <UInput placeholder="e.g. QR_TOK_83920192" class="flex-1" />
        <UButton color="primary" class="bg-[#534AB7]">Verify</UButton>
      </div>
    </div>

    <p v-if="!token" class="text-xs text-amber-400">
      ⚠️ Missing scanner magic token in URL (?token=xxx)
    </p>
  </div>
</template>
