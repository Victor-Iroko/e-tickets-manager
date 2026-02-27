<script setup lang="ts">
import { api } from '~~/convex/_generated/api'
import { usePlannerEvent } from '~/composables/usePlannerEvent'

definePageMeta({
  layout: 'planner-event',
  requiredRole: 'planner'
})

const { event, eventId, isOnSale } = usePlannerEvent()
const toast = useToast()
const requestUrl = useRequestURL()

useSeoMeta({
  title: computed(() => `Publish — ${event.value?.name || 'Event'} — Ticketly`)
})

const { data: checklist } = await useConvexQuery(
  api.events.getPublishChecklist,
  computed(() => ({ eventId: eventId.value }))
)

const { mutate: publishEvent, isPending: isPublishing } = useConvexMutation(
  api.events.publishEvent
)

const publishedSlug = ref<string | null>(null)

async function onPublish() {
  try {
    const result = await publishEvent({ eventId: eventId.value })
    publishedSlug.value = result.slug
    toast.add({
      title: 'Event published!',
      description: 'Your event is now live and accepting ticket sales.',
      color: 'success',
      icon: 'i-lucide-rocket'
    })
  } catch (error) {
    toast.add({
      title: 'Failed to publish',
      description:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  }
}

const publicUrl = computed(() => {
  const slug = publishedSlug.value || event.value?.slug
  if (!slug) return ''
  const base = requestUrl.origin.replace(/\/+$/, '')
  return `${base}/events/${slug}`
})

const copied = ref(false)
async function copyLink() {
  try {
    await navigator.clipboard.writeText(publicUrl.value)
    copied.value = true
    toast.add({
      title: 'Link copied!',
      color: 'success',
      icon: 'i-lucide-clipboard-check'
    })
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    toast.add({
      title: 'Failed to copy',
      color: 'error'
    })
  }
}

interface ChecklistItem {
  key: string
  label: string
  description: string
  icon: string
  link: string
}

const checklistItems = computed((): ChecklistItem[] => [
  {
    key: 'hasDetails',
    label: 'Basic Information',
    description: 'Name, description, and event dates are set.',
    icon: 'i-lucide-file-text',
    link: `/planner/events/${eventId.value}`
  },
  {
    key: 'hasTicketTypes',
    label: 'Ticket Types',
    description: 'At least one ticket type has been created.',
    icon: 'i-lucide-ticket',
    link: `/planner/events/${eventId.value}/tickets`
  },
  {
    key: 'hasFormFields',
    label: 'Checkout Form',
    description: 'At least one form field for buyer information.',
    icon: 'i-lucide-file-text',
    link: `/planner/events/${eventId.value}/form-builder`
  },
  {
    key: 'hasBankDetails',
    label: 'Payment Details',
    description: 'Bank name and account number for payouts.',
    icon: 'i-lucide-landmark',
    link: `/planner/events/${eventId.value}`
  }
])

const completedCount = computed(() => {
  if (!checklist.value) return 0
  return checklistItems.value.filter(
    (item) => checklist.value?.[item.key as keyof typeof checklist.value]
  ).length
})
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #left>
          <h1 class="text-base font-semibold text-default">Publish Event</h1>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
        <!-- Already Published -->
        <template v-if="isOnSale || publishedSlug">
          <div class="overflow-hidden rounded-lg border border-default/50">
            <div class="space-y-5 p-5 text-center sm:p-7">
              <div
                class="mx-auto flex size-14 items-center justify-center rounded-xl bg-success/10"
              >
                <UIcon
                  name="i-lucide-party-popper"
                  class="size-7 text-success"
                />
              </div>

              <div>
                <h2 class="text-lg font-semibold text-default">
                  Your event is live!
                </h2>
                <p class="mt-1 text-sm text-muted">
                  Share the link below so people can buy tickets.
                </p>
              </div>

              <div
                class="flex items-center gap-2 rounded-lg border border-default/50 bg-elevated/50 px-3 py-2.5"
              >
                <UIcon
                  name="i-lucide-link"
                  class="size-4 shrink-0 text-muted"
                />
                <span class="flex-1 truncate font-mono text-sm text-default">
                  {{ publicUrl }}
                </span>
                <UButton
                  :icon="
                    copied ? 'i-lucide-clipboard-check' : 'i-lucide-clipboard'
                  "
                  :label="copied ? 'Copied' : 'Copy'"
                  variant="subtle"
                  size="xs"
                  @click="copyLink"
                />
              </div>

              <div class="flex flex-col justify-center gap-2 pt-1 sm:flex-row">
                <UButton
                  :to="`/events/${event?.slug || publishedSlug}`"
                  label="View Public Page"
                  icon="i-lucide-external-link"
                  variant="outline"
                  size="sm"
                  target="_blank"
                />
                <UButton
                  :to="`/planner/events/${eventId}/dashboard`"
                  label="Go to Dashboard"
                  icon="i-lucide-bar-chart-3"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </template>

        <!-- Pre-publish Checklist -->
        <template v-else>
          <div class="overflow-hidden rounded-lg border border-default/50">
            <div
              class="flex items-start justify-between gap-4 border-b border-default/50 px-5 py-4"
            >
              <div>
                <h2 class="text-sm font-semibold text-default">
                  Readiness Checklist
                </h2>
                <p class="mt-0.5 text-sm text-muted">
                  Complete all items before publishing your event.
                </p>
              </div>
              <UBadge color="neutral" variant="subtle" size="sm">
                {{ completedCount }}/{{ checklistItems.length }} complete
              </UBadge>
            </div>

            <div class="space-y-1 p-3">
              <NuxtLink
                v-for="item in checklistItems"
                :key="item.key"
                :to="item.link"
                class="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-elevated/50"
              >
                <div
                  class="flex size-8 shrink-0 items-center justify-center rounded-md"
                  :class="
                    checklist?.[item.key as keyof typeof checklist]
                      ? 'bg-success/10'
                      : 'bg-elevated'
                  "
                >
                  <UIcon
                    :name="
                      checklist?.[item.key as keyof typeof checklist]
                        ? 'i-lucide-check'
                        : 'i-lucide-circle'
                    "
                    class="size-4"
                    :class="
                      checklist?.[item.key as keyof typeof checklist]
                        ? 'text-success'
                        : 'text-muted'
                    "
                  />
                </div>

                <div class="min-w-0 flex-1">
                  <p
                    class="text-sm font-medium"
                    :class="
                      checklist?.[item.key as keyof typeof checklist]
                        ? 'text-default'
                        : 'text-muted'
                    "
                  >
                    {{ item.label }}
                  </p>
                  <p class="text-xs text-muted">
                    {{ item.description }}
                  </p>
                </div>

                <UIcon
                  name="i-lucide-chevron-right"
                  class="size-3.5 shrink-0 text-muted"
                />
              </NuxtLink>
            </div>

            <div
              class="flex flex-col items-center gap-2 border-t border-default/50 px-5 py-4"
            >
              <UButton
                label="Publish Event"
                icon="i-lucide-rocket"
                size="sm"
                class="w-full sm:w-auto"
                :disabled="!checklist?.allPassed"
                :loading="isPublishing"
                @click="onPublish"
              />
              <p
                v-if="!checklist?.allPassed"
                class="text-center text-xs text-muted"
              >
                Complete all checklist items to enable publishing.
              </p>
            </div>
          </div>
        </template>
      </div>
    </template>
  </UDashboardPanel>
</template>
