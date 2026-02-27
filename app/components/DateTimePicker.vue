<script setup lang="ts">
import { CalendarDateTime, type DateValue } from '@internationalized/date'

defineOptions({
  inheritAttrs: false
})

interface DateTimePickerProps {
  minValue?: DateValue
  maxValue?: DateValue
}

const props = defineProps<DateTimePickerProps>()
const attrs = useAttrs()
const model = defineModel<DateValue | undefined>()
const isCalendarOpen = ref(false)

type DateTimeValue = DateValue & {
  hour: number
  minute: number
}

function hasTime(value: DateValue): value is DateTimeValue {
  return 'hour' in value && 'minute' in value
}

const calendarModel = computed<DateValue | undefined>({
  get: () => model.value,
  set: (value) => {
    if (!value) {
      model.value = undefined
      return
    }

    const current = model.value
    const hour = current && hasTime(current) ? current.hour : 0
    const minute = current && hasTime(current) ? current.minute : 0

    model.value = new CalendarDateTime(
      value.year,
      value.month,
      value.day,
      hour,
      minute
    )
    isCalendarOpen.value = false
  }
})
</script>

<template>
  <UInputDate
    v-model="model"
    :min-value="props.minValue"
    :max-value="props.maxValue"
    v-bind="attrs"
  >
    <template #trailing>
      <UPopover v-model:open="isCalendarOpen">
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          icon="i-lucide-calendar-days"
          aria-label="Open calendar"
          class="px-0"
        />

        <template #content>
          <UCalendar
            v-model="calendarModel"
            class="p-2"
            :min-value="props.minValue"
            :max-value="props.maxValue"
          />
        </template>
      </UPopover>
    </template>
  </UInputDate>
</template>
