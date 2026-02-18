<script setup lang="ts">
interface Props {
  step: number
  title: string
  description: string
  icon: string
  accent?: 'primary' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
  accent: 'primary'
})

const cardAccentClass = computed(() =>
  props.accent === 'secondary'
    ? 'hover:border-secondary/40'
    : 'hover:border-primary/40'
)

const iconAccentClass = computed(() =>
  props.accent === 'secondary'
    ? 'bg-secondary/10 text-secondary group-hover:bg-secondary'
    : 'bg-primary/10 text-primary group-hover:bg-primary'
)
</script>

<template>
  <div
    class="group relative rounded-2xl border border-default bg-default p-6 transition-all hover:shadow-lg"
    :class="cardAccentClass"
  >
    <div
      class="mb-4 inline-flex size-12 items-center justify-center rounded-xl transition-colors group-hover:text-inverted"
      :class="iconAccentClass"
    >
      <UIcon :name="icon" class="size-6" />
    </div>
    <div
      class="mb-2 inline-flex size-6 items-center justify-center rounded-full bg-muted font-heading text-xs font-bold text-muted"
    >
      {{ step }}
    </div>
    <h3 class="mb-2 font-heading text-lg font-semibold text-highlighted">
      {{ title }}
    </h3>
    <p class="text-sm leading-relaxed text-muted">
      {{ description }}
    </p>
  </div>
</template>
