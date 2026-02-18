<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <!-- Left panel — branding -->
    <div
      class="relative hidden flex-col justify-between overflow-hidden bg-muted p-10 lg:flex"
    >
      <!-- Decorative background pattern -->
      <div class="absolute inset-0 opacity-[0.03]">
        <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="auth-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 40L40 0M-10 10L10 -10M30 50L50 30"
                stroke="currentColor"
                stroke-width="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>
      </div>

      <!-- Top: logo -->
      <div class="relative z-10 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <UIcon name="i-lucide-ticket" class="size-7 text-primary" />
          <span
            class="font-heading text-2xl font-bold tracking-tight text-highlighted"
          >
            Ticketly
          </span>
        </NuxtLink>
        <UColorModeButton />
      </div>

      <!-- Center: value prop -->
      <div class="relative z-10 max-w-md">
        <h1
          class="mb-4 font-heading text-3xl leading-tight font-bold tracking-tight text-highlighted"
        >
          Events made simple.
          <span class="text-primary">Check-in made instant.</span>
        </h1>
        <p class="text-base leading-relaxed text-muted">
          Create events, sell tickets, and validate entry with QR codes — all
          from one platform. Trusted by event planners who want reliability on
          the day that matters.
        </p>
      </div>

      <!-- Bottom: decorative ticket illustration -->
      <div class="relative z-10">
        <div class="flex items-center gap-3 text-dimmed">
          <div class="flex -space-x-2">
            <div
              class="flex size-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary ring-2 ring-muted"
            >
              A
            </div>
            <div
              class="flex size-8 items-center justify-center rounded-full bg-secondary/20 text-xs font-bold text-secondary ring-2 ring-muted"
            >
              B
            </div>
            <div
              class="flex size-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary ring-2 ring-muted"
            >
              C
            </div>
          </div>
          <p class="text-sm">
            Join hundreds of event planners already using Ticketly
          </p>
        </div>
      </div>
    </div>

    <!-- Right panel — form -->
    <div class="flex flex-col">
      <!-- Mobile logo header -->
      <div class="flex items-center justify-between p-6 lg:hidden">
        <NuxtLink to="/" class="flex items-center gap-2">
          <UIcon name="i-lucide-ticket" class="size-5 text-primary" />
          <span
            class="font-heading text-lg font-bold tracking-tight text-highlighted"
          >
            Ticketly
          </span>
        </NuxtLink>
        <UColorModeButton />
      </div>

      <!-- Form container -->
      <div class="flex flex-1 items-center justify-center px-6 pb-10 lg:px-12">
        <div class="w-full max-w-sm space-y-6">
          <div class="space-y-2">
            <h2
              class="font-heading text-2xl font-bold tracking-tight text-highlighted"
            >
              {{ title }}
            </h2>
            <p class="text-sm text-muted">
              {{ subtitle }}
            </p>
          </div>

          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
