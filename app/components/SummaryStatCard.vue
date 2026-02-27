<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string
    value: string | number
    icon: string
    to?: string
    iconBgClass?: string
    iconHoverClass?: string
    iconClass?: string
    valueClass?: string
    hoverClass?: string
  }>(),
  {
    to: undefined,
    iconBgClass: 'bg-primary/10',
    iconHoverClass: '',
    iconClass: 'text-primary',
    valueClass: 'text-lg font-semibold text-default tabular-nums',
    hoverClass: ''
  }
)

const rootClass = computed(() => [
  'flex items-center gap-3 rounded-lg border border-default/70 bg-elevated/20 p-4',
  props.to ? ['group transition-colors', props.hoverClass] : ''
])

const iconWrapperClass = computed(() => [
  'flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors',
  props.iconBgClass,
  props.iconHoverClass
])
</script>

<template>
  <component :is="to ? 'NuxtLink' : 'div'" :to="to" :class="rootClass">
    <div :class="iconWrapperClass">
      <UIcon :name="icon" class="size-4" :class="iconClass" />
    </div>

    <div class="min-w-0">
      <p class="text-xs font-medium text-muted">{{ title }}</p>
      <p :class="valueClass">{{ value }}</p>
    </div>
  </component>
</template>
