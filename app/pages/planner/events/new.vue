<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import type { FormError } from '@nuxt/ui'
import { api } from '~~/convex/_generated/api'
import { calendarDateTimeToEpoch } from '~/utils/date-helpers'

useSeoMeta({ title: 'Create Event — Ticketly' })

const toast = useToast()

const { mutate: createEvent, isPending } = useConvexMutation(
  api.events.createEvent
)

const state = shallowReactive({
  name: '',
  description: '',
  date: undefined as DateValue | undefined,
  salesStartTime: undefined as DateValue | undefined,
  salesEndTime: undefined as DateValue | undefined,
  bankName: '',
  bankAccountNumber: ''
})

const eventMinValue = computed(() => state.salesEndTime)
const salesStartMaxValue = computed(() => state.salesEndTime ?? state.date)
const salesEndMinValue = computed(() => state.salesStartTime)
const salesEndMaxValue = computed(() => state.date)

function validate(st: typeof state): FormError[] {
  const errors: FormError[] = []

  if (!st.name || st.name.length < 3) {
    errors.push({
      name: 'name',
      message: 'Event name must be at least 3 characters'
    })
  }
  if (st.name && st.name.length > 100) {
    errors.push({
      name: 'name',
      message: 'Event name must be at most 100 characters'
    })
  }
  if (!st.date) {
    errors.push({ name: 'date', message: 'Event date is required' })
  }
  if (!st.salesStartTime) {
    errors.push({
      name: 'salesStartTime',
      message: 'Sales start time is required'
    })
  }
  if (!st.salesEndTime) {
    errors.push({
      name: 'salesEndTime',
      message: 'Sales end time is required'
    })
  }

  if (st.salesStartTime && st.salesEndTime) {
    const start = calendarDateTimeToEpoch(st.salesStartTime)
    const end = calendarDateTimeToEpoch(st.salesEndTime)
    if (start >= end) {
      errors.push({
        name: 'salesEndTime',
        message: 'Sales end must be after sales start'
      })
    }
  }

  if (st.salesEndTime && st.date) {
    const end = calendarDateTimeToEpoch(st.salesEndTime)
    const eventDate = calendarDateTimeToEpoch(st.date)
    if (end >= eventDate) {
      errors.push({
        name: 'date',
        message: 'Event date must be after sales end'
      })
    }
  }

  if (st.bankAccountNumber && st.bankAccountNumber.length !== 10) {
    errors.push({
      name: 'bankAccountNumber',
      message: 'Account number must be exactly 10 digits'
    })
  }

  return errors
}

async function onSubmit() {
  try {
    const eventId = await createEvent({
      name: state.name,
      description: state.description || undefined,
      date: calendarDateTimeToEpoch(state.date!),
      salesStartTime: calendarDateTimeToEpoch(state.salesStartTime!),
      salesEndTime: calendarDateTimeToEpoch(state.salesEndTime!),
      bankName: state.bankName || undefined,
      bankAccountNumber: state.bankAccountNumber || undefined
    })

    toast.add({
      title: 'Event created',
      description:
        'Your event has been created. Now add tickets and form fields.',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })

    await navigateTo(`/planner/events/${eventId}`)
  } catch (error) {
    toast.add({
      title: 'Failed to create event',
      description:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  }
}
</script>

<template>
  <UContainer class="max-w-2xl py-8 sm:py-12">
    <!-- Back link + Page header -->
    <div class="mb-8">
      <NuxtLink
        to="/dashboard"
        class="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-default"
      >
        <UIcon name="i-lucide-arrow-left" class="size-3.5" />
        Back to Dashboard
      </NuxtLink>
      <h1 class="text-xl font-semibold text-default">Create Event</h1>
      <p class="mt-0.5 text-sm text-muted">
        Set up your event details, schedule, and payment information.
      </p>
    </div>

    <UForm
      :state="state"
      :validate="validate"
      class="space-y-6"
      @submit="onSubmit"
    >
      <!-- Event Details -->
      <fieldset class="space-y-4">
        <legend
          class="flex items-center gap-2 text-sm font-semibold text-default"
        >
          <UIcon name="i-lucide-calendar" class="size-4 text-primary" />
          Event Details
        </legend>

        <UFormField name="name" label="Event Name" required>
          <UInput
            v-model="state.name"
            placeholder="e.g. Tech Conference 2026"
            icon="i-lucide-type"
            class="w-full"
            autofocus
          />
        </UFormField>

        <UFormField name="description" label="Description" hint="Optional">
          <UTextarea
            v-model="state.description"
            placeholder="Brief description of your event..."
            :rows="3"
            autoresize
            class="w-full"
          />
        </UFormField>
      </fieldset>

      <USeparator />

      <!-- Schedule -->
      <fieldset class="space-y-4">
        <legend
          class="flex items-center gap-2 text-sm font-semibold text-default"
        >
          <UIcon name="i-lucide-clock" class="size-4 text-primary" />
          Schedule
        </legend>

        <UFormField name="date" label="Event Date & Time" required>
          <DateTimePicker
            v-model="state.date"
            granularity="minute"
            :min-value="eventMinValue"
            class="w-full"
          />
        </UFormField>

        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField name="salesStartTime" label="Sales Start" required>
            <DateTimePicker
              v-model="state.salesStartTime"
              granularity="minute"
              :max-value="salesStartMaxValue"
              class="w-full"
            />
          </UFormField>

          <UFormField name="salesEndTime" label="Sales End" required>
            <DateTimePicker
              v-model="state.salesEndTime"
              granularity="minute"
              :min-value="salesEndMinValue"
              :max-value="salesEndMaxValue"
              class="w-full"
            />
          </UFormField>
        </div>

        <p class="text-xs text-muted">
          Sales start must be before sales end, and sales end must be before the
          event date.
        </p>
      </fieldset>

      <USeparator />

      <!-- Payment -->
      <fieldset class="space-y-4">
        <legend
          class="flex items-center gap-2 text-sm font-semibold text-default"
        >
          <UIcon name="i-lucide-banknote" class="size-4 text-primary" />
          Payment Settings
        </legend>

        <p class="text-xs text-muted">
          Provide your bank details for receiving ticket payments. You can also
          add these later before publishing.
        </p>

        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField name="bankName" label="Bank Name" hint="Optional">
            <UInput
              v-model="state.bankName"
              placeholder="e.g. First Bank"
              icon="i-lucide-building-2"
              class="w-full"
            />
          </UFormField>

          <UFormField
            name="bankAccountNumber"
            label="Account Number"
            hint="Optional"
          >
            <UInput
              v-model="state.bankAccountNumber"
              placeholder="0123456789"
              icon="i-lucide-hash"
              class="w-full"
              maxlength="10"
            />
          </UFormField>
        </div>
      </fieldset>

      <USeparator />

      <!-- Actions -->
      <div class="flex items-center justify-end gap-3">
        <UButton
          label="Cancel"
          color="neutral"
          variant="ghost"
          to="/dashboard"
          size="sm"
        />
        <UButton
          type="submit"
          label="Create Event"
          icon="i-lucide-plus"
          :loading="isPending"
        />
      </div>
    </UForm>
  </UContainer>
</template>
