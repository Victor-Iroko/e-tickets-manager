<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import type { FormError } from '@nuxt/ui'
import { api } from '~~/convex/_generated/api'
import {
  epochToCalendarDateTime,
  calendarDateTimeToEpoch,
  formatEventDate
} from '~/utils/date-helpers'

definePageMeta({
  layout: 'planner-event',
  requiredRole: 'planner'
})

const { event, eventId, isDraft } = usePlannerEvent()
const toast = useToast()

useSeoMeta({
  title: computed(() =>
    event.value ? `${event.value.name} — Ticketly` : 'Event — Ticketly'
  )
})

const { mutate: updateEvent, isPending } = useConvexMutation(
  api.events.updateEvent
)

// Fetch ticket types and form fields counts for summary cards
const { data: ticketTypes } = await useConvexQuery(
  api.ticketTypes.listByEvent,
  computed(() => ({ eventId: eventId.value }))
)

const { data: formFields } = await useConvexQuery(
  api.formFields.listByEvent,
  computed(() => ({ eventId: eventId.value }))
)

const { data: publishChecklist } = await useConvexQuery(
  api.events.getPublishChecklist,
  computed(() => ({ eventId: eventId.value }))
)

const isEditing = ref(false)

const editState = shallowReactive({
  name: '',
  description: '',
  date: undefined as DateValue | undefined,
  salesStartTime: undefined as DateValue | undefined,
  salesEndTime: undefined as DateValue | undefined,
  bankName: '',
  bankAccountNumber: ''
})

const eventMinValue = computed(() => editState.salesEndTime)
const salesStartMaxValue = computed(
  () => editState.salesEndTime ?? editState.date
)
const salesEndMinValue = computed(() => editState.salesStartTime)
const salesEndMaxValue = computed(() => editState.date)

const readinessTotal = 4
const readinessCompleted = computed(() => {
  if (!publishChecklist.value) return 0
  return [
    publishChecklist.value.hasDetails,
    publishChecklist.value.hasTicketTypes,
    publishChecklist.value.hasFormFields,
    publishChecklist.value.hasBankDetails
  ].filter(Boolean).length
})

const eventStatusLabel = computed(() =>
  event.value?.status ? event.value.status.replace('_', ' ') : 'Unknown'
)

const eventDetailsList = computed(() => {
  if (!event.value) return []

  return [
    { label: 'Event Name', value: event.value.name },
    {
      label: 'Description',
      value: event.value.description || 'No description'
    },
    { label: 'Event Date', value: formatEventDate(event.value.date) },
    {
      label: 'Sales Window',
      value: `${formatEventDate(event.value.salesStartTime)} — ${formatEventDate(event.value.salesEndTime)}`
    },
    { label: 'Bank Name', value: event.value.bankName || 'Not set' },
    {
      label: 'Account Number',
      value: event.value.bankAccountNumber || 'Not set'
    }
  ]
})

function startEditing() {
  if (!event.value) return
  editState.name = event.value.name
  editState.description = event.value.description || ''
  editState.date = epochToCalendarDateTime(event.value.date)
  editState.salesStartTime = epochToCalendarDateTime(event.value.salesStartTime)
  editState.salesEndTime = epochToCalendarDateTime(event.value.salesEndTime)
  editState.bankName = event.value.bankName || ''
  editState.bankAccountNumber = event.value.bankAccountNumber || ''
  isEditing.value = true
}

function cancelEditing() {
  isEditing.value = false
}

function validate(st: typeof editState): FormError[] {
  const errors: FormError[] = []
  if (!st.name || st.name.length < 3) {
    errors.push({
      name: 'name',
      message: 'Event name must be at least 3 characters'
    })
  }
  if (!st.date) {
    errors.push({ name: 'date', message: 'Event date is required' })
  }
  if (!st.salesStartTime) {
    errors.push({
      name: 'salesStartTime',
      message: 'Sales start is required'
    })
  }
  if (!st.salesEndTime) {
    errors.push({
      name: 'salesEndTime',
      message: 'Sales end is required'
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
    await updateEvent({
      eventId: eventId.value,
      name: editState.name,
      description: editState.description || undefined,
      date: calendarDateTimeToEpoch(editState.date!),
      salesStartTime: calendarDateTimeToEpoch(editState.salesStartTime!),
      salesEndTime: calendarDateTimeToEpoch(editState.salesEndTime!),
      bankName: editState.bankName || undefined,
      bankAccountNumber: editState.bankAccountNumber || undefined
    })

    toast.add({
      title: 'Event updated',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    isEditing.value = false
  } catch (error) {
    toast.add({
      title: 'Failed to update event',
      description:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  }
}

const nextSetupStep = computed(() => {
  if (!ticketTypes.value?.length) {
    return {
      label: 'Add Ticket Types',
      to: `/planner/events/${eventId.value}/tickets`,
      icon: 'i-lucide-ticket'
    }
  }
  if (!formFields.value?.length) {
    return {
      label: 'Build Buyer Form',
      to: `/planner/events/${eventId.value}/form-builder`,
      icon: 'i-lucide-file-text'
    }
  }
  if (!event.value?.bankName || !event.value?.bankAccountNumber) {
    return {
      label: 'Add Bank Details',
      to: undefined,
      icon: 'i-lucide-banknote',
      action: startEditing
    }
  }
  return {
    label: 'Publish Event',
    to: `/planner/events/${eventId.value}/publish`,
    icon: 'i-lucide-rocket'
  }
})
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #left>
          <div class="flex items-center gap-2.5">
            <h1 class="text-base font-semibold text-default">
              {{ event?.name || 'Event Overview' }}
            </h1>
          </div>
        </template>
        <template #right>
          <UButton
            v-if="isDraft && !isEditing"
            label="Edit Event"
            icon="i-lucide-pencil"
            variant="subtle"
            size="xs"
            @click="startEditing"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6 p-4 sm:p-6">
        <!-- Summary Cards -->
        <div class="grid gap-3 sm:grid-cols-3">
          <SummaryStatCard
            :to="`/planner/events/${eventId}/tickets`"
            title="Ticket Types"
            :value="ticketTypes?.length || 0"
            icon="i-lucide-ticket"
            icon-bg-class="bg-primary/10"
            icon-hover-class="group-hover:bg-primary/15"
            icon-class="text-primary"
            hover-class="hover:border-primary/30 hover:bg-elevated/50"
          />

          <SummaryStatCard
            :to="`/planner/events/${eventId}/form-builder`"
            title="Publish Readiness"
            :value="`${readinessCompleted} / ${readinessTotal}`"
            icon="i-lucide-check-check"
            icon-bg-class="bg-secondary/10"
            icon-hover-class="group-hover:bg-secondary/15"
            icon-class="text-secondary"
            hover-class="hover:border-secondary/30 hover:bg-elevated/50"
          />

          <SummaryStatCard
            title="Status"
            :value="eventStatusLabel"
            :icon="
              event?.status === 'draft'
                ? 'i-lucide-pencil-line'
                : event?.status === 'on_sale'
                  ? 'i-lucide-radio-tower'
                  : 'i-lucide-lock'
            "
            :icon-bg-class="
              event?.status === 'draft'
                ? 'bg-neutral/10'
                : event?.status === 'on_sale'
                  ? 'bg-success/10'
                  : 'bg-warning/10'
            "
            :icon-class="
              event?.status === 'draft'
                ? 'text-muted'
                : event?.status === 'on_sale'
                  ? 'text-success'
                  : 'text-warning'
            "
            value-class="text-sm font-medium text-default"
          />
        </div>

        <!-- Next Step CTA (draft only) -->
        <UAlert
          v-if="isDraft && nextSetupStep"
          :icon="nextSetupStep.icon"
          color="primary"
          variant="subtle"
          :title="`Next step: ${nextSetupStep.label}`"
          description="Complete all requirements to publish your event."
        >
          <template #actions>
            <UButton
              v-if="nextSetupStep.to"
              :label="nextSetupStep.label"
              :to="nextSetupStep.to"
              size="xs"
            />
            <UButton
              v-else-if="nextSetupStep.action"
              :label="nextSetupStep.label"
              size="xs"
              @click="nextSetupStep.action"
            />
          </template>
        </UAlert>

        <!-- Event Details (Read-Only View) -->
        <div v-if="!isEditing && event" class="space-y-1">
          <div class="flex items-center justify-between pb-3">
            <h2 class="text-sm font-semibold text-default">Event Details</h2>
            <UButton
              v-if="isDraft"
              label="Edit"
              icon="i-lucide-pencil"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="startEditing"
            />
          </div>

          <div
            class="overflow-hidden rounded-lg border border-default/50 shadow-sm"
          >
            <ul class="divide-y divide-default/40">
              <li
                v-for="item in eventDetailsList"
                :key="item.label"
                class="grid gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-0"
              >
                <p class="text-xs font-medium text-muted">{{ item.label }}</p>
                <p class="text-sm text-default sm:col-span-2">
                  {{ item.value }}
                </p>
              </li>
            </ul>
          </div>
        </div>

        <!-- Event Details (Edit Form) -->
        <div v-if="isEditing" class="space-y-1">
          <div class="flex items-center gap-2 pb-3">
            <h2 class="text-sm font-semibold text-default">Edit Event</h2>
          </div>

          <div class="rounded-lg border border-primary/20 p-4 sm:p-5">
            <UForm
              :state="editState"
              :validate="validate"
              class="space-y-5"
              @submit="onSubmit"
            >
              <div class="space-y-4">
                <UFormField name="name" label="Event Name" required>
                  <UInput
                    v-model="editState.name"
                    placeholder="e.g. Tech Conference 2026"
                    icon="i-lucide-type"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  name="description"
                  label="Description"
                  hint="Optional"
                >
                  <UTextarea
                    v-model="editState.description"
                    placeholder="Brief description..."
                    :rows="3"
                    autoresize
                    class="w-full"
                  />
                </UFormField>
              </div>

              <USeparator />

              <div class="space-y-4">
                <UFormField name="date" label="Event Date & Time" required>
                  <DateTimePicker
                    v-model="editState.date"
                    granularity="minute"
                    :min-value="eventMinValue"
                    class="w-full"
                  />
                </UFormField>

                <div class="grid gap-4 sm:grid-cols-2">
                  <UFormField
                    name="salesStartTime"
                    label="Sales Start"
                    required
                  >
                    <DateTimePicker
                      v-model="editState.salesStartTime"
                      granularity="minute"
                      :max-value="salesStartMaxValue"
                      class="w-full"
                    />
                  </UFormField>

                  <UFormField name="salesEndTime" label="Sales End" required>
                    <DateTimePicker
                      v-model="editState.salesEndTime"
                      granularity="minute"
                      :min-value="salesEndMinValue"
                      :max-value="salesEndMaxValue"
                      class="w-full"
                    />
                  </UFormField>
                </div>
              </div>

              <USeparator />

              <div class="grid gap-4 sm:grid-cols-2">
                <UFormField name="bankName" label="Bank Name" hint="Optional">
                  <UInput
                    v-model="editState.bankName"
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
                    v-model="editState.bankAccountNumber"
                    placeholder="0123456789"
                    icon="i-lucide-hash"
                    class="w-full"
                    maxlength="10"
                  />
                </UFormField>
              </div>

              <div class="flex items-center justify-end gap-2 pt-2">
                <UButton
                  label="Cancel"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  @click="cancelEditing"
                />
                <UButton
                  type="submit"
                  label="Save Changes"
                  icon="i-lucide-check"
                  size="sm"
                  :loading="isPending"
                />
              </div>
            </UForm>
          </div>
        </div>

        <!-- Not-draft notice -->
        <UAlert
          v-if="!isDraft && event"
          icon="i-lucide-info"
          color="info"
          variant="subtle"
          title="Event is live"
          description="This event has been published and can no longer be edited. View the dashboard for real-time metrics."
        >
          <template #actions>
            <UButton
              label="View Dashboard"
              :to="`/planner/events/${eventId}/dashboard`"
              size="xs"
              variant="outline"
            />
          </template>
        </UAlert>
      </div>
    </template>
  </UDashboardPanel>
</template>
